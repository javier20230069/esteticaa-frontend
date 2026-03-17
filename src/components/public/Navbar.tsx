// src/components/public/Navbar.tsx
import { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImagen from '../../assets/images/LogoImagen.png';
import './Navbar.css';

interface Props {
  onOpenModal: () => void;
  isLoggedIn: boolean;
  onLogoutClick: () => void;
}

const Navbar = ({ onOpenModal, isLoggedIn, onLogoutClick }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={`public-navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">

        {/* LOGO */}
        <a href="#inicio" className="navbar__logo-link">
          <img
            src={logoImagen}
            alt="Ezequiel Castillo"
            className="navbar__logo-img"
          />
          <div className="navbar__brand">
            <span className="navbar__brand-name">EZEQUIEL CASTILLO</span>
            <span className="navbar__brand-role">Plataforma de Citas</span>
          </div>
        </a>

        {/* LINKS (desktop) */}
        <div className={`navbar__menu ${isMenuOpen ? 'navbar__menu--open' : ''}`}>
          {/* Overlay móvil */}
          <div className="navbar__mobile-overlay" onClick={toggleMenu} />

          <div className="navbar__links">
            <a href="#inicio"    className="navbar__link" onClick={toggleMenu}>Inicio</a>
            <a href="#servicios" className="navbar__link" onClick={toggleMenu}>Servicios</a>
            <a href="#productos" className="navbar__link" onClick={toggleMenu}>Tienda</a>

            {isLoggedIn ? (
              <span
                className="navbar__link"
                style={{ cursor: 'pointer' }}
                onClick={() => { onLogoutClick(); toggleMenu(); }}
              >
                Cerrar Sesión
              </span>
            ) : (
              <Link to="/login" className="navbar__link" onClick={toggleMenu}>
                Iniciar Sesión
              </Link>
            )}

            {/* Botón agendar — solo visible en menú móvil */}
            <button
              className="navbar__cta-btn navbar__cta-btn--mobile"
              onClick={() => { onOpenModal(); toggleMenu(); }}
            >
              <Calendar size={16} /> Agendar Cita
            </button>
          </div>
        </div>

        {/* BOTÓN AGENDAR (desktop) */}
        <button className="navbar__cta-btn navbar__cta-btn--desktop" onClick={onOpenModal}>
          <Calendar size={16} /> Agendar Cita
        </button>

        {/* HAMBURGUESA (mobile) */}
        <button className="navbar__hamburger" onClick={toggleMenu} aria-label="Menú">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>
    </nav>
  );
};

export default Navbar;