// src/pages/admin/AdminProducts.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Search, Edit2, Package, Loader2, Filter, Eye, EyeOff, AlertCircle, CheckCircle2, Download, Upload, CheckSquare, X, FileDown, AlertTriangle, PackageCheck } from 'lucide-react';
import api from '../../services/api';
import ProductForm from '../../components/admin/ProductForm';
import toast from 'react-hot-toast';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import './AdminProducts.css';

interface Producto {
  id: number;
  name: string;
  brand: string;
  category?: string;
  price: string | number;
  stock: number;
  is_active: boolean;
}

interface PreviewItem extends Producto {
  _status: 'nuevo' | 'repetido';
  _selected: boolean;
}

const AdminProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Producto | null>(null);
  
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [productToToggle, setProductToToggle] = useState<Producto | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCols, setExportCols] = useState({
    id: true, name: true, brand: true, category: true, price: true, stock: true, is_active: true
  });
  const [successMessage, setSuccessMessage] = useState<{title: string, text: string} | null>(null);

  const fetchProductos = useCallback(async () => {
    try {
      const res = await api.get('/products');
      setProductos(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  const filtered = productos.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (prod: Producto) => {
    setProductToEdit(prod);
    setShowModal(true);
  };

  const handleOpenExportModal = () => {
    if (productos.length === 0) return toast.error('No tienes ningún producto en inventario.');
    if (filtered.length === 0) return toast.error('Ningún producto coincide con la búsqueda.');
    setShowExportModal(true);
  };

  const downloadTemplate = () => {
    const headers = "Nombre,Marca,Categoría,Precio,Stock,Estado\n";
    const exampleRow = "Shampoo de Ejemplo,L'Oréal,Cuidado Capilar,250.50,15,Activo\n";
    const blob = new Blob(["\uFEFF" + headers + exampleRow], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.setAttribute('download', 'plantilla_productos.csv');
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    toast.success('Plantilla descargada');
  };

  const confirmExportCSV = async () => {
    try {
      const cols = [];
      if (exportCols.id) cols.push('ID');
      if (exportCols.name) cols.push('Nombre');
      if (exportCols.brand) cols.push('Marca');
      if (exportCols.category) cols.push('Categoría');
      if (exportCols.price) cols.push('Precio');
      if (exportCols.stock) cols.push('Stock');
      if (exportCols.is_active) cols.push('Estado');
      
      const csvHeaders = cols.join(',') + '\n';
      const escape = (text: string | number | boolean | undefined): string => `"${String(text || '').replace(/"/g, '""')}"`;

      const csvRows = filtered.map(p => {
        const row = [];
        if (exportCols.id) row.push(p.id);
        if (exportCols.name) row.push(escape(p.name));
        if (exportCols.brand) row.push(escape(p.brand));
        if (exportCols.category) row.push(escape(p.category));
        if (exportCols.price) row.push(p.price);
        if (exportCols.stock) row.push(p.stock);
        if (exportCols.is_active) row.push(p.is_active ? 'Activo' : 'Inactivo');
        return row.join(',');
      }).join('\n');
      
      const blob = new Blob(["\uFEFF" + csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
      const defaultFileName = `inventario_${new Date().getTime()}.csv`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.setAttribute('download', defaultFileName);
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      
      setShowExportModal(false);
      setSuccessMessage({ title: 'Exportación Exitosa', text: 'Tu inventario ha sido exportado correctamente.' });
    } catch (error) { 
      console.error(error);
      toast.error('Error al generar el archivo'); 
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'preview'); 

    try {
      toast.loading('Analizando archivo...', { id: 'import' });
      const res = await api.post('/products/import/csv', formData);
      const combined: PreviewItem[] = [
        ...res.data.nuevos.map((p: Producto) => ({ ...p, _status: 'nuevo' as const, _selected: true })),
        ...res.data.repetidos.map((p: Producto) => ({ ...p, _status: 'repetido' as const, _selected: false }))
      ];
      setPreviewItems(combined);
      toast.dismiss('import');
    } catch (error) { 
      console.error(error);
      toast.error('Error al leer el archivo'); 
    }
    e.target.value = ''; 
  };

  const togglePreviewSelection = (index: number) => {
    const updated = [...previewItems];
    updated[index]._selected = !updated[index]._selected;
    setPreviewItems(updated);
  };

  const toggleAllPreview = (select: boolean) => {
    setPreviewItems(previewItems.map(p => ({ ...p, _selected: select })));
  };

  const confirmImport = async (type: 'ignore' | 'update' | 'selection') => {
    let fileToSend = selectedFile;
    let actionType = type;

    if (type === 'selection') {
      const selectedItems = previewItems.filter(p => p._selected);
      if (selectedItems.length === 0) return toast.error('Selecciona al menos un producto para importar');

      const headers = "Nombre,Marca,Categoría,Precio,Stock,Estado\n";
      const rows = selectedItems.map(p => `"${p.name}","${p.brand || ''}","${p.category || ''}",${p.price},${p.stock},"Activo"`).join('\n');
      const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
      fileToSend = new File([blob], 'selected_import.csv', { type: 'text/csv' });
      actionType = 'update'; 
    }

    if (!fileToSend) return;

    try {
      toast.loading('Procesando importación...', { id: 'import' });
      const formData = new FormData();
      formData.append('file', fileToSend);
      formData.append('action', actionType); 
      await api.post('/products/import/csv', formData);
      
      toast.dismiss('import');
      fetchProductos(); 
      setPreviewItems([]); 
      setSelectedFile(null);

      const itemsCount = type === 'selection' ? previewItems.filter(p => p._selected).length : 'los';
      setSuccessMessage({ title: '¡Importación Completada!', text: `Se integraron ${itemsCount} productos a tu inventario.` });
    } catch(error) { 
      console.error(error);
      toast.error('Error al procesar la importación', { id: 'import' }); 
    }
  };

  const confirmToggleStatus = async () => {
    if (!productToToggle) return;
    try {
      await api.patch(`/products/${productToToggle.id}/toggle`);
      toast.success(`Estado actualizado`);
      fetchProductos();
    } catch (error) { 
      console.error(error);
      toast.error('Error al cambiar estado'); 
    } 
    finally { setShowToggleModal(false); setProductToToggle(null); }
  };

  if (loading) return <div className="loading-state"><Loader2 className="spinner" size={32} /></div>;

  return (
    <div className="saas-container">
      <Breadcrumbs />
      
      <div className="saas-header">
        <div>
          <p className="saas-eyebrow">Gestión de Catálogo</p>
          <h1 className="saas-title">Inventario de Productos ({filtered.length})</h1>
        </div>
        <div className="saas-actions">
          <button onClick={downloadTemplate} className="btn-saas-outline">
            <FileDown size={18} /> <span className="hide-mobile">Plantilla</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} className="btn-saas-secondary">
            <Upload size={18} /> <span className="hide-mobile">Importar CSV</span>
          </button>
          <button onClick={handleOpenExportModal} className="btn-saas-secondary">
            <Download size={18} /> <span className="hide-mobile">Exportar CSV</span>
          </button>
          <button className="btn-saas-primary" onClick={() => { setProductToEdit(null); setShowModal(true); }}>
            <Plus size={18} /> <span className="hide-mobile">Nuevo Producto</span>
          </button>
        </div>
      </div>
      
      <div className="saas-controls">
        <div className="saas-search">
          <Search size={18} />
          <input type="text" placeholder="Buscar por nombre o marca..." onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="saas-filter">
          <Filter size={18} />
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">Todas las Categorías</option>
            <option value="Cuidado Capilar">Cuidado Capilar</option>
            <option value="Fijación y Peinado">Fijación y Peinado</option>
            <option value="Cuidado de Barba">Cuidado de Barba</option>
            <option value="Herramientas">Herramientas</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      </div>

      <div className="saas-table-card">
        <table className="saas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Marca</th>
              <th>Categoría</th> 
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, index) => (
              <tr key={p.id} className={p.is_active ? '' : 'row-inactive'}>
                <td className="text-muted">{index + 1}</td>
                <td className="font-medium flex-cell"><Package size={16} className="text-muted" /> {p.name}</td>
                <td>{p.brand}</td>
                <td><span className="badge-gray">{p.category || 'Otros'}</span></td>
                <td className="font-semibold text-emerald">${Number(p.price).toFixed(2)}</td>
                <td><span className="badge-blue">{p.stock} pzas</span></td>
                <td>
                  <span className={`badge-status ${p.is_active ? 'badge-success' : 'badge-error'}`}>
                    {p.is_active ? 'Activo' : 'Oculto'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(p)} className="btn-icon text-indigo" title="Editar"><Edit2 size={18} /></button>
                    <button 
                      onClick={() => { setProductToToggle(p); setShowToggleModal(true); }} 
                      className={`btn-icon ${p.is_active ? 'text-rose' : 'text-emerald'}`}
                      title={p.is_active ? 'Ocultar producto' : 'Activar producto'}
                    >
                      {p.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted" style={{ padding: '30px' }}>No se encontraron productos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && <ProductForm onClose={() => setShowModal(false)} onSuccess={fetchProductos} productToEdit={productToEdit} />}

      {/* MODAL DE EXPORTACIÓN */}
      {showExportModal && (
        <div className="saas-modal-overlay">
          <div className="saas-modal-content">
            <Download size={40} className="text-emerald mb-4" />
            <h2>Exportar Inventario</h2>
            <p>Selecciona las columnas que deseas incluir en tu archivo CSV:</p>
            
            <div className="checkbox-grid">
              {Object.keys(exportCols).map((col) => (
                <label key={col} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={exportCols[col as keyof typeof exportCols]} 
                    onChange={() => setExportCols({...exportCols, [col]: !exportCols[col as keyof typeof exportCols]})}
                  />
                  <span>{col === 'id' ? 'ID Producto' : col === 'name' ? 'Nombre' : col === 'brand' ? 'Marca' : col === 'category' ? 'Categoría' : col === 'price' ? 'Precio' : col === 'stock' ? 'Stock' : 'Estado'}</span>
                </label>
              ))}
            </div>

            <div className="saas-modal-actions">
              <button onClick={() => setShowExportModal(false)} className="btn-saas-outline">Cancelar</button>
              <button onClick={confirmExportCSV} className="btn-saas-primary bg-emerald">Guardar Archivo</button>
            </div>
          </div>
        </div>
      )}

      {/* VISTA PREVIA IMPORTACIÓN */}
      {previewItems.length > 0 && (
        <div className="saas-modal-overlay">
          <div className="saas-modal-content modal-large">
            <div className="modal-header-flex">
              <h2>Vista Previa de Importación</h2>
              <button className="btn-icon" onClick={() => setPreviewItems([])}><X size={24} /></button>
            </div>
            
            <div className="stats-bar">
              <span className="badge-success"><CheckCircle2 size={16} /> Nuevos: {previewItems.filter(p => p._status === 'nuevo').length}</span>
              <span className="badge-warning"><AlertTriangle size={16} /> Repetidos: {previewItems.filter(p => p._status === 'repetido').length}</span>
              <span className="badge-blue"><PackageCheck size={16} /> Seleccionados: {previewItems.filter(p => p._selected).length}</span>
            </div>

            <div className="table-scroll-container">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th className="text-center">
                      <input type="checkbox" onChange={(e) => toggleAllPreview(e.target.checked)} checked={previewItems.length > 0 && previewItems.every(p => p._selected)} />
                    </th>
                    <th>Estado</th>
                    <th>Producto</th>
                    <th>Marca</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {previewItems.map((item, index) => (
                    <tr key={index} className={item._selected ? '' : 'row-inactive'}>
                      <td className="text-center">
                        <input type="checkbox" checked={item._selected} onChange={() => togglePreviewSelection(index)} />
                      </td>
                      <td>{item._status === 'nuevo' ? <span className="badge-status badge-success">Nuevo</span> : <span className="badge-status badge-warning">Repetido</span>}</td>
                      <td className="font-medium">{item.name}</td>
                      <td>{item.brand || '-'}</td>
                      <td className="font-semibold text-emerald">${Number(item.price).toFixed(2)}</td>
                      <td><span className="badge-blue">+{item.stock}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="saas-modal-actions flex-end mt-0 p-4">
              <button onClick={() => setPreviewItems([])} className="btn-saas-outline">Cancelar</button>
              <div className="flex-gap">
                {previewItems.some(p => p._status === 'repetido') && (
                  <>
                    <button onClick={() => confirmImport('ignore')} className="btn-saas-outline text-warning">Ignorar Repetidos</button>
                    <button onClick={() => confirmImport('update')} className="btn-saas-secondary text-indigo">Actualizar Todos</button>
                  </>
                )}
                <button onClick={() => confirmImport('selection')} className="btn-saas-primary" disabled={previewItems.filter(p => p._selected).length === 0}>
                  Importar ({previewItems.filter(p => p._selected).length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ÉXITO */}
      {successMessage && (
        <div className="saas-modal-overlay">
          <div className="saas-modal-content text-center">
            <CheckSquare size={60} className="text-emerald mx-auto mb-4" />
            <h2>{successMessage.title}</h2>
            <p className="text-muted mb-6">{successMessage.text}</p>
            <button onClick={() => setSuccessMessage(null)} className="btn-saas-primary w-100 mx-auto" style={{justifyContent: 'center'}}>Entendido</button>
          </div>
        </div>
      )}

      {/* MODAL OCULTAR PRODUCTO */}
      {showToggleModal && productToToggle && (
        <div className="saas-modal-overlay">
          <div className="saas-modal-content text-center">
            {productToToggle.is_active ? <AlertCircle size={50} className="text-rose mx-auto mb-4" /> : <CheckCircle2 size={50} className="text-emerald mx-auto mb-4" />}
            <h2>{productToToggle.is_active ? '¿Ocultar producto?' : '¿Activar producto?'}</h2>
            <p className="text-muted mb-6">Se cambiará la visibilidad de <strong>{productToToggle.name}</strong>.</p>
            <div className="saas-modal-actions">
              <button onClick={() => setShowToggleModal(false)} className="btn-saas-outline">Cancelar</button>
              <button onClick={confirmToggleStatus} className={`btn-saas-primary ${productToToggle.is_active ? 'bg-rose' : 'bg-emerald'}`}>
                Sí, confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;