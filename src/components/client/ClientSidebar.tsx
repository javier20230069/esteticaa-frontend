// src/components/client/ClientSidebar.tsx
import { Calendar, ShoppingBag, User, LogOut, Scissors } from 'lucide-react';
import logoImagen from '../../assets/images/LogoImagen.png';
import './ClientSidebar.css';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const navItems = [
  { tab: 'citas',     icon: <Calendar size={20} />,    label: 'Mis Citas' },
  { tab: 'productos', icon: <ShoppingBag size={20} />, label: 'Tienda' },
  { tab: 'servicios', icon: <Scissors size={20} />,    label: 'Servicios' },
  { tab: 'perfil',    icon: <User size={20} />,        label: 'Mi Perfil' },
];

const ClientSidebar = ({ activeTab, setActiveTab, handleLogout }: Props) => {
  return (
    <aside className="saas-client-sidebar">
      <div className="sidebar-header">
        <img src={logoImagen} alt="Ezequiel Castillo" className="sidebar-logo" />
        <div className="sidebar-brand">
          <span className="brand-name">EZEQUIEL CASTILLO</span>
          <span className="brand-role">Panel de Cliente</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button 
            key={item.tab} 
            className={`sidebar-link ${activeTab === item.tab ? 'active' : ''}`} 
            onClick={() => setActiveTab(item.tab)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;