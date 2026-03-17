// src/pages/public/Home.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Star, Clock, Calendar, ArrowRight } from 'lucide-react';
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import api from '../../services/api';
import "./Home.css";

interface Producto { id: number; name: string; brand: string; category: string; price: string | number; stock: number; image_url?: string; }
interface Servicio { id: number; name: string; description: string; price: string | number; duration_minutes: number; image_url?: string; }

const Home = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  const handleOpenLogin = () => navigate('/login');

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        setLoading(true);
        const prodRes = await api.get('/products');
        setProductos(prodRes.data.slice(0, 6)); 

        const servRes = await api.get('/services');
        setServicios(servRes.data.slice(0, 3));
      } catch (error) {
        console.error("Error cargando el catálogo público:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogo();
  }, []);

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };

  return (
    <div className="home-layout">
      <Navbar
        isLoggedIn={false}
        onLogoutClick={() => {}}
        onOpenModal={handleOpenLogin}
      />

      <main className="home-main">

        {/* ── HERO ── */}
        <section className="hero-section">
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-badge">Estudio Premium</span>
            <h1 className="hero-title">Ezequiel Castillo</h1>
            <p className="hero-subtitle">
              Redefiniendo tu estilo personal con atención a cada detalle. 
              Descubre una experiencia moderna y exclusiva.
            </p>
            <div className="hero-actions">
              <button className="btn-primary-glow" onClick={() => navigate('/login')}>
                <Calendar size={18} />
                Agendar una Cita
              </button>
            </div>
          </div>
        </section>

        {/* ── SERVICIOS ── */}
        <section className="catalog-section bg-gray" id="servicios">
          <div className="section-header">
            <span className="section-eyebrow">Experiencias</span>
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">Conoce todo lo que podemos hacer por ti.</p>
          </div>

          <div className="catalog-container">
            {loading ? (
              <p className="loading-text">Cargando servicios...</p>
            ) : servicios.length === 0 ? (
              <p className="loading-text">Próximamente nuevos servicios.</p>
            ) : (
              <div className="catalog-grid">
                {servicios.map(serv => (
                  <div key={serv.id} className="catalog-card">
                    <div className="catalog-card__image">
                      {getImageUrl(serv.image_url) ? (
                        <img src={getImageUrl(serv.image_url)!} alt={serv.name} />
                      ) : (
                        <div className="catalog-card__no-img">
                          <Scissors size={32} />
                        </div>
                      )}
                    </div>
                    <div className="catalog-card__body">
                      <h4 className="catalog-card__name">{serv.name}</h4>
                      <p className="catalog-card__desc">{serv.description}</p>
                      <p className="catalog-card__price">${Number(serv.price).toFixed(2)}</p>
                    </div>
                    <div className="catalog-card__footer">
                      <button className="btn-outline-indigo" onClick={() => navigate('/login')}>
                        Agendar ahora
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── PRODUCTOS (6) ── */}
        <section className="catalog-section" id="productos">
          <div className="section-header">
            <span className="section-eyebrow text-emerald">Tienda Exclusiva</span>
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">Mantén tu estilo impecable todos los días.</p>
          </div>

          <div className="catalog-container">
            {loading ? (
              <p className="loading-text">Cargando productos...</p>
            ) : productos.length === 0 ? (
              <p className="loading-text">Próximamente nuevos productos.</p>
            ) : (
              <div className="catalog-grid catalog-grid--6">
                {productos.map(prod => (
                  <div key={prod.id} className="catalog-card">
                    <div className="catalog-card__image bg-emerald-light">
                      {getImageUrl(prod.image_url) ? (
                        <img src={getImageUrl(prod.image_url)!} alt={prod.name} />
                      ) : (
                        <div className="catalog-card__no-img text-emerald">
                          <Star size={32} />
                        </div>
                      )}
                    </div>
                    <div className="catalog-card__body">
                      <span className="catalog-card__brand badge-emerald">{prod.brand}</span>
                      <h4 className="catalog-card__name">{prod.name}</h4>
                      <p className="catalog-card__price text-emerald">${Number(prod.price).toFixed(2)}</p>
                    </div>
                    <div className="catalog-card__footer">
                      <button className="btn-outline-emerald" onClick={() => navigate('/login')}>
                        Ver y Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── POR QUÉ ELEGIRNOS ── */}
        <section className="features-section bg-gray">
          <div className="section-header">
            <span className="section-eyebrow">El estándar Ezequiel</span>
            <h2 className="section-title">¿Por qué elegirnos?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon icon-indigo"><Scissors size={28} /></div>
              <h3 className="feature-card__title">Cortes a la Medida</h3>
              <p className="feature-card__text">Asesoría de imagen personalizada y cortes diseñados para ti.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon icon-emerald"><Star size={28} /></div>
              <h3 className="feature-card__title">Productos Premium</h3>
              <p className="feature-card__text">Utilizamos y vendemos solo las mejores marcas del mercado.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon icon-amber"><Clock size={28} /></div>
              <h3 className="feature-card__title">Sin Filas de Espera</h3>
              <p className="feature-card__text">Gestiona tu tiempo. Agenda en línea y te atenderemos a tu hora exacta.</p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-modern-section">
          <div className="cta-inner">
            <h2 className="cta-title">¿Listo para tu cambio de look?</h2>
            <p className="cta-subtitle">Únete a nuestra plataforma y gestiona tu estilo desde la palma de tu mano.</p>
            <button className="btn-primary-glow" onClick={() => navigate('/login')}>
              Crear cuenta gratis <ArrowRight size={18} />
            </button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Home;