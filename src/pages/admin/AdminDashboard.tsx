// src/pages/admin/AdminDashboard.tsx
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Scissors, Calendar, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import './AdminDashboard.css';

const quickCards = [
  {
    to:          '/admin/usuarios',
    icon:        <Users size={28} strokeWidth={1.5} />,
    colorClass:  'icon-indigo',
    label:       'Usuarios Totales',
    description: 'Gestión de clientes y roles',
    number:      '124',
  },
  {
    to:          '/admin/productos',
    icon:        <ShoppingBag size={28} strokeWidth={1.5} />,
    colorClass:  'icon-emerald',
    label:       'Inventario',
    description: 'Productos en stock',
    number:      '89',
  },
  {
    to:          '/admin/servicios',
    icon:        <Scissors size={28} strokeWidth={1.5} />,
    colorClass:  'icon-amber',
    label:       'Servicios',
    description: 'Catálogo activo',
    number:      '15',
  },
  {
    to:          '/admin/citas',
    icon:        <Calendar size={28} strokeWidth={1.5} />,
    colorClass:  'icon-violet',
    label:       'Agenda',
    description: 'Citas pendientes hoy',
    number:      '08',
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-saas-wrapper">
      <Breadcrumbs />

      {/* HEADER */}
      <div className="dash-header">
        <div className="dash-header-text">
          <p className="dash-eyebrow">Panel de Administración</p>
          <h1 className="dash-title">
            ¡Hola, <span className="dash-title-accent">Administrador</span>! 👋
          </h1>
          <p className="dash-subtitle">
            Aquí tienes un resumen de lo que está sucediendo en Ezequiel Castillo.
          </p>
        </div>

        <div className="dash-status-badge">
          <span className="dash-status-dot" />
          Sistema en Línea
        </div>
      </div>

      {/* TARJETAS ESTILO SAAS */}
      <div className="dash-grid">
        {quickCards.map((card) => (
          <div
            key={card.to}
            className="dash-stat-card"
            onClick={() => navigate(card.to)}
            role="button"
            tabIndex={0}
          >
            <div className="dash-card-header">
              <div className={`dash-icon-wrapper ${card.colorClass}`}>
                {card.icon}
              </div>
            </div>

            <div className="dash-card-body">
              <h3 className="dash-number">{card.number}</h3>
              <p className="dash-label">{card.label}</p>
              <span className="dash-desc">{card.description}</span>
            </div>

            <div className="dash-card-footer">
              <span>Gestionar módulo</span>
              <ArrowRight size={16} className="dash-arrow" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;