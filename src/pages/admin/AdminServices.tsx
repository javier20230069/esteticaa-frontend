// src/pages/admin/AdminServices.tsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, Scissors } from 'lucide-react';
import api from '../../services/api';
import ServiceForm from '../../components/admin/ServiceForm';
import type { Servicio } from '../../components/admin/ServiceForm';
import toast from 'react-hot-toast';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import './AdminServices.css'; 

const AdminServices = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Servicio | null>(null);
  
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [serviceToToggle, setServiceToToggle] = useState<Servicio | null>(null);

  const fetchServicios = useCallback(async () => {
    try {
      const res = await api.get('/services');
      setServicios(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServicios(); }, [fetchServicios]);

  const filtered = servicios.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (serv: Servicio) => {
    setServiceToEdit(serv);
    setShowModal(true);
  };

  const confirmToggleStatus = async () => {
    if (!serviceToToggle) return;
    try {
      await api.patch(`/services/${serviceToToggle.id}/toggle`);
      toast.success(`Estado actualizado`);
      fetchServicios();
    } catch (error) { 
      console.error(error);
      toast.error('Error al cambiar el estado'); 
    } finally { 
      setShowToggleModal(false); 
      setServiceToToggle(null); 
    }
  };

  if (loading) return <div className="loading-state"><Loader2 className="spinner" size={32} /></div>;

  return (
    <div className="saas-container">
      <Breadcrumbs />
      
      <div className="saas-header">
        <div>
          <p className="saas-eyebrow">Catálogo de Servicios</p>
          <h1 className="saas-title">Servicios y Tratamientos ({filtered.length})</h1>
        </div>
        <div className="saas-actions">
          <button className="btn-saas-primary bg-amber" onClick={() => { setServiceToEdit(null); setShowModal(true); }}>
            <Plus size={18} /> <span className="hide-mobile">Nuevo Servicio</span>
          </button>
        </div>
      </div>
      
      <div className="saas-controls">
        <div className="saas-search search-amber">
          <Search size={18} />
          <input type="text" placeholder="Buscar servicio o descripción..." onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="saas-table-card">
        <table className="saas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Servicio</th>
              <th>Descripción</th>
              <th>Duración</th>
              <th>Precio</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, index) => (
              <tr key={s.id} className={s.is_active ? '' : 'row-inactive'}>
                <td className="text-muted">{index + 1}</td>
                <td className="font-medium flex-cell"><Scissors size={16} className="text-muted" /> {s.name}</td>
                <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.description || '-'}
                </td>
                <td><span className="badge-gray">⏱ {s.duration_minutes} min</span></td>
                <td className="font-semibold text-emerald">${Number(s.price).toFixed(2)}</td>
                <td>
                  <span className={`badge-status ${s.is_active ? 'badge-success' : 'badge-error'}`}>
                    {s.is_active ? 'Activo' : 'Oculto'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(s)} className="btn-icon text-indigo" title="Editar">
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => { setServiceToToggle(s); setShowToggleModal(true); }} 
                      className={`btn-icon ${s.is_active ? 'text-rose' : 'text-emerald'}`}
                      title={s.is_active ? 'Ocultar servicio' : 'Hacer público'}
                    >
                      {s.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted" style={{ padding: '40px' }}>
                  No se encontraron servicios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && <ServiceForm onClose={() => setShowModal(false)} onSuccess={fetchServicios} serviceToEdit={serviceToEdit || undefined} />}

      {/* MODAL TOGGLE ESTADO */}
      {showToggleModal && serviceToToggle && (
        <div className="saas-modal-overlay">
          <div className="saas-modal-content text-center">
            {serviceToToggle.is_active ? <AlertCircle size={50} className="text-rose mx-auto mb-4" /> : <CheckCircle2 size={50} className="text-emerald mx-auto mb-4" />}
            <h2>{serviceToToggle.is_active ? '¿Ocultar servicio?' : '¿Activar servicio?'}</h2>
            <p className="text-muted mb-6">Se cambiará la visibilidad de <strong>{serviceToToggle.name}</strong>.</p>
            <div className="saas-modal-actions">
              <button onClick={() => setShowToggleModal(false)} className="btn-saas-outline">Cancelar</button>
              <button onClick={confirmToggleStatus} className={`btn-saas-primary ${serviceToToggle.is_active ? 'bg-rose' : 'bg-emerald'}`} style={{justifyContent: 'center'}}>
                Sí, confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;