// src/components/admin/AdminHeader.tsx
import { Search, Bell, ChevronDown, User } from 'lucide-react';
import './AdminHeader.css';

const AdminHeader = () => {
  const userName = "Ezequiel Castillo";
  const userRole = "Administrador";

  return (
    <header className="saas-admin-header">

      {/* Buscador */}
      <div className="header-search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar clientes, citas o productos..."
          className="header-search-input"
        />
      </div>

      {/* Acciones derecha */}
      <div className="header-actions">

        {/* Notificaciones */}
        <button className="header-icon-btn position-relative">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="header-divider" />

        {/* Perfil */}
        <div className="header-profile-widget">
          <div className="profile-avatar">
            <User size={18} />
          </div>
          <div className="profile-info hide-on-mobile">
            <span className="profile-name">{userName}</span>
            <span className="profile-role">{userRole}</span>
          </div>
          <ChevronDown size={16} className="profile-chevron hide-on-mobile" />
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;