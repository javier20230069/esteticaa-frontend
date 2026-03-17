// src/components/client/ClientNavbar.tsx
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Home } from 'lucide-react';
import logoImagen from '../../assets/images/LogoImagen.png';
import './ClientNavbar.css';

const ClientNavbar = () => {
  const navigate = useNavigate();

  // En el futuro, este nombre lo sacaremos del Token o de tu Base de Datos
  const clientName = "Javier Flores"; 

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="saas-client-navbar">
      <div className="navbar-container">
        {/* LOGO Y TÍTULO DEL PANEL */}
        <Link to="/mi-cuenta" className="navbar-logo-link">
          <img src={logoImagen} alt="Ezequiel Castillo" />
          <span>Mi Panel</span>
        </Link>

        {/* ACCIONES DEL CLIENTE */}
        <div className="navbar-actions">
          <Link to="/" className="nav-btn-home">
            <Home size={18} /> <span className="hide-mobile">Ir a la tienda</span>
          </Link>

          <div className="navbar-profile">
            <div className="avatar-circle">
              <User size={18} />
            </div>
            <span className="profile-name hide-mobile">Hola, {clientName}</span>
          </div>

          <button onClick={handleLogout} className="btn-logout-icon" title="Cerrar Sesión">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;