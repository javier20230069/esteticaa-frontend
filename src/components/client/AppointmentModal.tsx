// src/components/client/AppointmentModal.tsx
import { useState } from 'react';
import { X, Calendar, Clock, Scissors } from 'lucide-react';
import './AppointmentModal.css';

interface Servicio {
  id: number;
  name: string;
  duration_minutes: number;
  price: string | number;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Servicio | null;
  onConfirm: (fecha: string, hora: string) => void;
}

const AppointmentModal = ({ isOpen, onClose, service, onConfirm }: AppointmentModalProps) => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  // Horas simuladas (Después el backend te dirá cuáles están libres)
  const horasDisponibles = [
    '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'
  ];

  if (!isOpen || !service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha || !hora) {
      alert("Por favor selecciona una fecha y una hora.");
      return;
    }
    onConfirm(fecha, hora);
    setFecha('');
    setHora('');
  };

  // MAGIA 1: Obtenemos la fecha de HOY para bloquear el pasado
  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="saas-modal-overlay">
      <div className="saas-modal-card">
        
        <button className="saas-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="saas-modal-header">
          <h2>Agendar Cita</h2>
          <p>Estás a un paso de reservar tu espacio.</p>
        </div>

        <div className="saas-service-summary">
          <div className="summary-icon"><Scissors size={20} /></div>
          <div className="summary-info">
            <h4>{service.name}</h4>
            <p>Duración aprox: {service.duration_minutes} min | ${Number(service.price).toFixed(2)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="saas-modal-form">
          <div className="saas-form-group">
            <label><Calendar size={16} /> Selecciona la Fecha</label>
            <input 
              type="date" 
              min={hoy} /* Bloquea los días que ya pasaron */
              required 
              value={fecha} 
              onChange={(e) => setFecha(e.target.value)}
              /* MAGIA 2: Obligamos al navegador a mostrar el calendario al darle clic */
              onClick={(e) => {
                if ('showPicker' in HTMLInputElement.prototype) {
                  e.currentTarget.showPicker();
                }
              }}
              className="saas-input-date"
            />
          </div>

          <div className="saas-form-group">
            <label><Clock size={16} /> Horarios Disponibles</label>
            <div className="saas-time-grid">
              {horasDisponibles.map((h) => (
                <button
                  key={h}
                  type="button"
                  className={`saas-time-btn ${hora === h ? 'selected' : ''}`}
                  onClick={() => setHora(h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="saas-modal-actions">
            <button type="button" className="btn-saas-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-saas-primary" disabled={!fecha || !hora}>
              Solicitar Cita
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AppointmentModal;