import { useState, useEffect } from 'react';
import { X, Upload, Save } from 'lucide-react';
import api from '../../services/api';
// Aquí importamos tus alertas bonitas
import toast from 'react-hot-toast'; 
import './ProductForm.css';

interface Producto {
  id?: number;
  name: string;
  brand: string;
  category?: string;
  price: string | number;
  stock: number;
  min_stock?: number;
  image_url?: string;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Producto | null;
}

const ProductForm = ({ onClose, onSuccess, productToEdit }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    brand: '', 
    category: '', 
    price: '', 
    stock: '', 
    min_stock: '5'
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        brand: productToEdit.brand,
        category: productToEdit.category || '',
        price: productToEdit.price.toString(),
        stock: productToEdit.stock.toString(),
        min_stock: (productToEdit.min_stock || 5).toString()
      });
    }
  }, [productToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ==========================================
    // TUS ALERTAS ROJAS DE SEGURIDAD (MÍNIMO 1)
    // ==========================================
    const precioValue = parseFloat(formData.price);
    const stockValue = parseInt(formData.stock, 10);

    // 1. Validación estricta del precio
    if (isNaN(precioValue) || precioValue < 1) {
      // toast.error sale de color ROJO y bonita como las verdes
      return toast.error('El precio no puede ser menor a $1.00');
    }
    
    // 2. Validación estricta del stock
    if (isNaN(stockValue) || stockValue < 1) {
      return toast.error('El stock no puede ser menor a 1 unidad');
    }

    // 3. Validación de categoría
    if (!formData.category) {
      return toast.error('Debes seleccionar una categoría');
    }
    // ==========================================

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append('image', image);

    try {
      if (productToEdit?.id) {
        await api.put(`/products/${productToEdit.id}`, data);
        // Esta sale VERDE
        toast.success('Producto actualizado con éxito');
      } else {
        await api.post('/products', data);
        // Esta sale VERDE
        toast.success('Producto creado con éxito');
      }
      onSuccess();
      onClose();
    } catch {
      // Esta sale ROJA
      toast.error('Error al guardar en la base de datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            
            <div className="input-field">
              <label>Nombre del Producto</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Pomada Mate" />
            </div>

            <div className="input-field">
              <label>Marca</label>
              <input type="text" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="Ej. Suavecito" />
            </div>

            <div className="input-field" style={{ gridColumn: '1 / -1' }}>
              <label>Categoría</label>
              <select 
                required 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="">-- Selecciona una categoría --</option>
                <option value="Cuidado Capilar">Cuidado Capilar (Shampoos, Acondicionadores)</option>
                <option value="Fijación y Peinado">Fijación y Peinado (Ceras, Pomadas, Geles)</option>
                <option value="Cuidado de Barba">Cuidado de Barba (Aceites, Bálsamos)</option>
                <option value="Herramientas">Herramientas (Peines, Cepillos)</option>
                <option value="Tratamientos Especiales">Tratamientos Especiales (Minoxidil, Tónicos)</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="input-field">
              <label>Precio ($)</label>
              {/* Le agregamos min="1" para ayuda visual */}
              <input type="number" step="0.01" min="1" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="1.00" />
            </div>

            <div className="input-field">
              <label>Stock Disponible</label>
              {/* Le agregamos min="1" para ayuda visual */}
              <input type="number" min="1" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="1" />
            </div>

          </div>

          <div className="input-field full" style={{marginTop: '15px'}}>
            <label>Imagen del Producto</label>
            <div className="file-input" style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px dashed #ccc', padding: '10px', borderRadius: '5px' }}>
              <Upload size={18} />
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} />
            </div>
            {productToEdit?.image_url && !image && <small style={{ color: '#666' }}>Imagen actual guardada</small>}
            {image && <small style={{color: 'green'}}>✓ Nueva imagen seleccionada: {image.name}</small>}
          </div>

          <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn-cancel" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', borderRadius: '5px' }}>Cancelar</button>
            <button type="submit" disabled={loading} className="btn-save" style={{ padding: '8px 16px', background: '#d4af37', color: 'white', border: 'none', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <Save size={18} /> {loading ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;