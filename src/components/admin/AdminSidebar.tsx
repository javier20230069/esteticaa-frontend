// src/components/admin/AdminSidebar.tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Scissors,
  LogOut,
  User,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminSidebar.css';
import logoImg from '../../assets/images/LogoImagen.png';

/* ─── Tipos de las props ─── */
interface AdminSidebarProps {
  isCollapsed:   boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/admin/productos',  icon: <Package size={20} />,         label: 'Inventario' },
  { to: '/admin/servicios',  icon: <Scissors size={20} />,        label: 'Servicios' },
  { to: '/admin/respaldos',  icon: <Database size={20} />,        label: 'Respaldos' },
];

const AdminSidebar = ({ isCollapsed, toggleSidebar }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <aside className={`asb ${isCollapsed ? 'asb--collapsed' : ''}`}>

      {/* ── LOGO ── */}
      <div className="asb__header">
        <Link to="/" className="asb__logo-link" title="Ir al inicio">
          <img src={logoImg} alt="Ezequiel Castillo" className="asb__logo-img" />
        </Link>
        <div className="asb__brand">
          <span className="asb__brand-name">EZEQUIEL CASTILLO</span>
          <span className="asb__brand-role">Panel Administrativo</span>
        </div>
      </div>

      <div className="asb__sep" />

      {/* ── LABEL ── */}
      {!isCollapsed && <p className="asb__section-label">Menú principal</p>}

      {/* ── NAVEGACIÓN ── */}
      <nav className="asb__nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            title={isCollapsed ? item.label : undefined}
            className={`asb__link ${isActive(item.to) ? 'asb__link--active' : ''}`}
          >
            <span className="asb__link-icon">{item.icon}</span>
            <span className="asb__link-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* ── FOOTER ── */}
      <div className="asb__footer">
        <div className="asb__sep" />

        {/* Usuario */}
        <div className="asb__user">
          <div className="asb__user-avatar">
            <User size={17} />
          </div>
          <div className="asb__user-info">
            <span className="asb__user-name">Administrador</span>
            <span className="asb__user-status">
              <span className="asb__status-dot" />
              En línea
            </span>
          </div>
        </div>

        {/* Controles */}
        <div className="asb__controls">
          {/* Colapsar — llama a toggleSidebar del Layout padre */}
          <button
            className="asb__ctrl-btn"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {isCollapsed
              ? <PanelLeftOpen size={17} />
              : <><PanelLeftClose size={17} /><span className="asb__ctrl-label">Ocultar</span></>
            }
          </button>

          {/* Cerrar sesión */}
          <button
            onClick={handleLogout}
            className="asb__ctrl-btn asb__ctrl-btn--logout"
            title="Salir del sistema"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;