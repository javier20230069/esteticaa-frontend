import { useState, useEffect } from 'react';
import { X, Save, Clock, DollarSign, Upload } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './ServiceForm.css';

// 1. Exportamos la interfaz para que AdminServices la pueda usar
export interface Servicio {
  id?: number;
  name: string;
  description?: string; // Aseguramos que sea opcional en ambos lados
  duration_minutes: number;
  price: string | number;
  is_active?: boolean; // Agregado para que no choque con AdminServices
  image_url?: string;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  serviceToEdit?: Servicio | null; 
}

const ServiceForm = ({ onClose, onSuccess, serviceToEdit }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', 
    description: '', 
    duration_minutes: '30', 
    price: ''
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        name: serviceToEdit.name,
        description: serviceToEdit.description || '',
        duration_minutes: serviceToEdit.duration_minutes.toString(),
        price: serviceToEdit.price.toString()
      });
    }
  }, [serviceToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(formData.price) <= 0) return toast.error('El precio debe ser mayor a 0');
    
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append('image', image);

    try {
      if (serviceToEdit?.id) {
        await api.put(`/services/${serviceToEdit.id}`, data);
        toast.success('Servicio actualizado');
      } else {
        await api.post('/services', data);
        toast.success('Servicio creado');
      }
      onSuccess();
      onClose();
    } catch {
      toast.error('Error al procesar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{serviceToEdit ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="service-form">
          <div className="input-field full">
            <label>Nombre del Servicio</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="input-field full">
            <label>Descripción</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="form-grid">
            <div className="input-field">
              <label><Clock size={14} /> Duración (min)</label>
              <input type="number" required value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: e.target.value})} />
            </div>
            <div className="input-field">
              <label><DollarSign size={14} /> Precio ($)</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>

          <div className="input-field full">
            <label>Foto del Servicio</label>
            <div className="file-input">
              <Upload size={18} />
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} />
            </div>
            {serviceToEdit?.image_url && !image && <small>Imagen actual guardada</small>}
            {image && <small style={{color: 'green'}}>Nueva imagen: {image.name}</small>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-save">
              <Save size={18} /> {loading ? 'Procesando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;