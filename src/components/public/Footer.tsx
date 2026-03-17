// src/components/public/Footer.tsx
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImagen from '../../assets/images/LogoImagen.png'; 
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-saas-section">
      <div className="footer-saas-container">
        
        {/* COLUMNA 1: MARCA Y REDES */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img src={logoImagen} alt="Ezequiel Castillo" className="footer-logo-img" />
            <span>Ezequiel Castillo</span>
          </div>
          <p className="footer-desc">
            Redefiniendo tu estilo personal con atención a cada detalle. Descubre una experiencia de gestión y servicio verdaderamente moderna.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/ezequielcastillohairdesigner/" target="_blank" rel="noreferrer">
              <Instagram size={22} />
            </a>
            <a href="https://www.facebook.com/EzequielCastilloAngeles" target="_blank" rel="noreferrer">
              <Facebook size={22} />
            </a>
          </div>
        </div>

        {/* COLUMNA 2: CONTACTO */}
        <div className="footer-col contact-col">
          <h3>Contacto</h3>
          <ul className="contact-info">
            <li>
              <div className="contact-icon-wrapper"><MapPin size={18} /></div>
              <span>Velázquez Ibarra 22, Centro, Huejutla, Hgo. C.P. 43011</span>
            </li>
            <li>
              <div className="contact-icon-wrapper"><Phone size={18} /></div>
              <span>771 202 8110 / 771 342 5696</span>
            </li>
            <li>
              <div className="contact-icon-wrapper"><Clock size={18} /></div>
              <span>Lun - Vie: 11:00 AM - 7:00 PM<br/>Sáb: 11:00 AM - 3:00 PM</span>
            </li>
          </ul>
        </div>

        {/* COLUMNA 3: ENLACES LEGALES */}
        <div className="footer-col legal-col">
          <h3>Información Legal</h3>
          <ul className="footer-links">
            <li><Link to="/terminos">Términos y Condiciones</Link></li>
            <li><Link to="/privacidad">Política de Privacidad</Link></li>
            <li><Link to="/cancelaciones">Política de Cancelación</Link></li>
          </ul>
        </div>

      </div>
      
      {/* BARRA INFERIOR */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Ezequiel Castillo Hair Designer. Plataforma desarrollada con altos estándares de calidad.</p>
      </div>
    </footer>
  );
};

export default Footer;