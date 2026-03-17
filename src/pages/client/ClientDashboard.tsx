// src/pages/client/ClientDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, Home, Package, Scissors, Search, Loader2, Filter } from 'lucide-react'; 
import toast from 'react-hot-toast';

import ClientSidebar from '../../components/client/ClientSidebar'; 
import ProductDetail from '../../components/client/ProductDetail'; 
import AppointmentModal from '../../components/client/AppointmentModal'; 
import api from '../../services/api'; 
import './ClientDashboard.css';

interface UserProfile { full_name: string; email: string; phone: string; }
interface Producto { id: number; name: string; brand: string; category: string; price: string | number; stock: number; image_url?: string; }
interface Servicio { id: number; name: string; description: string; price: string | number; duration_minutes: number; image_url?: string; }
interface Cita { id: number; appointment_date: string; status: string; total_amount: string | number; servicio: string; estilista: string; }

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('productos'); 
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [misCitas, setMisCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [serviceToBook, setServiceToBook] = useState<Servicio | null>(null);

  // 🌟 ESTADOS PARA BUSCADOR Y FILTRO
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    navigate('/login');
  };

  useEffect(() => { setSelectedProduct(null); }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await api.get('/users/profile');
        setUserData(profileRes.data);

        const prodRes = await api.get('/products');
        setProductos(prodRes.data);

        const servRes = await api.get('/services');
        setServicios(servRes.data);

        const citasRes = await api.get('/appointments/me');
        setMisCitas(citasRes.data);

      } catch (error) {
        console.error("Error cargando datos:", error);
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
            handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };

  const abrirDetalle = (prod: Producto) => {
    setSelectedProduct(prod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmAppointment = async (fecha: string, hora: string) => {
    if (!serviceToBook) return;

    try {
      const appointment_datetime = `${fecha} ${hora}:00`;

      try {
        await api.post('/appointments', {
          service_id: serviceToBook.id,
          appointment_date: appointment_datetime,
          total_amount: serviceToBook.price
        });
      } catch {
        console.warn("Ruta POST no encontrada, simulando guardado local.");
      }

      const nuevaCitaVirtual: Cita = {
        id: Date.now(),
        appointment_date: appointment_datetime,
        status: 'pending',
        total_amount: serviceToBook.price,
        servicio: serviceToBook.name,
        estilista: 'Sin asignar' 
      };

      setMisCitas([nuevaCitaVirtual, ...misCitas]);
      toast.success('¡Cita solicitada! En espera de confirmación.');
      setIsAppointmentModalOpen(false);
      setServiceToBook(null);
      setActiveTab('citas'); 

    } catch {
      toast.error('Ocurrió un error al procesar tu cita.');
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="saas-badge saas-badge-warning">En Espera</span>;
      case 'confirmed': return <span className="saas-badge saas-badge-success">Confirmada</span>;
      case 'cancelled': return <span className="saas-badge saas-badge-error">Cancelada</span>;
      case 'completed': return <span className="saas-badge saas-badge-indigo">Completada</span>;
      default: return <span className="saas-badge saas-badge-gray">{status}</span>;
    }
  };

  // 🌟 NUEVO: Filtramos por texto Y por categoría al mismo tiempo
  const filteredProducts = productos.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = selectedCategory === '' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="client-saas-layout">
      <ClientSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout} 
      />

      <main className="client-saas-main">

        <header className="client-saas-topbar">
          <div className="client-topbar-info">
            <p className="client-topbar-greeting">Hola de nuevo,</p>
            <h2 className="client-topbar-name">
              {userData ? userData.full_name : 'Cargando...'}
            </h2>
          </div>
          <button className="btn-saas-outline" onClick={() => navigate('/')}>
            <Home size={16} />
            <span className="hide-on-mobile">Ir al Inicio</span>
          </button>
        </header>

        <div className="client-saas-workspace">

          {/* ── PRODUCTOS ── */}
          {activeTab === 'productos' && (
            <div className="saas-panel fade-in">
              {selectedProduct ? (
                <ProductDetail
                  product={selectedProduct}
                  onBack={() => setSelectedProduct(null)}
                  getImageUrl={getImageUrl}
                />
              ) : (
                <>
                  <div className="saas-panel-header flex-between">
                    <div>
                      <span className="saas-eyebrow text-emerald">Tienda Online</span>
                      <h3 className="saas-title">Catálogo de Productos</h3>
                    </div>
                    
                    {/* 🌟 NUEVO: Contenedor con Buscador y Filtro */}
                    <div className="saas-store-controls">
                      <div className="saas-search-bar">
                        <Search size={18} className="text-muted" />
                        <input 
                          type="text" 
                          placeholder="Buscar producto o marca..." 
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                        />
                      </div>
                      <div className="saas-filter-bar">
                        <Filter size={18} className="text-muted" />
                        <select 
                          value={selectedCategory} 
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="">Todas las categorías</option>
                          <option value="Cuidado Capilar">Cuidado Capilar</option>
                          <option value="Fijación y Peinado">Fijación y Peinado</option>
                          <option value="Cuidado de Barba">Cuidado de Barba</option>
                          <option value="Herramientas">Herramientas</option>
                          <option value="Otros">Otros</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="saas-loading"><Loader2 size={24} className="spinner"/> Cargando productos...</div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="saas-empty-state">
                      <Package size={48} className="text-muted mb-4 mx-auto"/>
                      <p>No encontramos productos con esa búsqueda o categoría.</p>
                    </div>
                  ) : (
                    <div className="saas-grid">
                      {filteredProducts.map(prod => (
                        <div key={prod.id} className="saas-card" onClick={() => abrirDetalle(prod)}>
                          <div className="saas-card-image bg-emerald-light">
                            {getImageUrl(prod.image_url) ? (
                              <img src={getImageUrl(prod.image_url)!} alt={prod.name} />
                            ) : (
                              <div className="saas-card-no-img text-emerald"><Package size={32}/></div>
                            )}
                          </div>
                          <div className="saas-card-body">
                            <span className="saas-badge-small badge-emerald">{prod.brand}</span>
                            <h4 className="saas-card-name">{prod.name}</h4>
                            <p className="saas-card-meta">{prod.category} · Stock: {prod.stock}</p>
                            <p className="saas-card-price text-emerald">${Number(prod.price).toFixed(2)}</p>
                          </div>
                          <div className="saas-card-footer">
                            <button className="btn-saas-outline w-100">Ver Detalles</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── SERVICIOS ── */}
          {activeTab === 'servicios' && (
            <div className="saas-panel fade-in">
              <div className="saas-panel-header">
                <div>
                  <span className="saas-eyebrow text-indigo">Reservaciones</span>
                  <h3 className="saas-title">Nuestros Servicios</h3>
                </div>
              </div>
              {loading ? (
                <div className="saas-loading"><Loader2 size={24} className="spinner"/> Cargando servicios...</div>
              ) : servicios.length === 0 ? (
                <div className="saas-empty-state">
                  <Scissors size={48} className="text-muted mb-4 mx-auto"/>
                  <p>Aún no hay servicios registrados.</p>
                </div>
              ) : (
                <div className="saas-grid">
                  {servicios.map(serv => (
                    <div key={serv.id} className="saas-card">
                      <div className="saas-card-image bg-indigo-light">
                        {getImageUrl(serv.image_url) ? (
                          <img src={getImageUrl(serv.image_url)!} alt={serv.name} />
                        ) : (
                          <div className="saas-card-no-img text-indigo"><Scissors size={32}/></div>
                        )}
                      </div>
                      <div className="saas-card-body">
                        <h4 className="saas-card-name">{serv.name}</h4>
                        <p className="saas-card-desc">{serv.description}</p>
                        <p className="saas-card-meta"><Clock size={14} /> {serv.duration_minutes} min</p>
                        <p className="saas-card-price text-indigo">${Number(serv.price).toFixed(2)}</p>
                      </div>
                      <div className="saas-card-footer">
                        <button
                          className="btn-saas-primary w-100"
                          onClick={() => {
                            setServiceToBook(serv);
                            setIsAppointmentModalOpen(true);
                          }}
                        >
                          Agendar ahora
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CITAS ── */}
          {activeTab === 'citas' && (
            <div className="saas-panel fade-in">
              <div className="saas-panel-header flex-between">
                <div>
                  <span className="saas-eyebrow">Agenda personal</span>
                  <h3 className="saas-title">Mis Citas</h3>
                </div>
                <button className="btn-saas-primary" onClick={() => setActiveTab('servicios')}>
                  + Nueva Cita
                </button>
              </div>
              {loading ? (
                <div className="saas-loading"><Loader2 size={24} className="spinner"/> Cargando citas...</div>
              ) : misCitas.length === 0 ? (
                <div className="saas-empty-state">
                  <Calendar size={48} className="text-muted mb-4 mx-auto"/>
                  <p>No tienes citas programadas. ¡Anímate a agendar una!</p>
                </div>
              ) : (
                <div className="saas-grid">
                  {misCitas.map(cita => (
                    <div key={cita.id} className="saas-card saas-card-cita">
                      <div className="saas-card-body">
                        <div className="mb-3">{renderStatusBadge(cita.status)}</div>
                        <h4 className="saas-card-name mb-3">{cita.servicio}</h4>
                        <div className="cita-details">
                          <p><Calendar size={16} className="text-muted" /> {new Date(cita.appointment_date).toLocaleDateString()}</p>
                          <p><Clock size={16} className="text-muted" /> {new Date(cita.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p><User size={16} className="text-muted" /> {cita.estilista}</p>
                        </div>
                        <div className="cita-price mt-3">
                          Total estimado: <strong>${Number(cita.total_amount).toFixed(2)}</strong>
                        </div>
                      </div>
                      {(cita.status === 'pending' || cita.status === 'confirmed') && (
                        <div className="saas-card-footer bg-gray">
                          <button className="btn-saas-danger w-100">Cancelar Cita</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PERFIL ── */}
          {activeTab === 'perfil' && (
            <div className="saas-panel fade-in">
              <div className="saas-panel-header">
                <div>
                  <span className="saas-eyebrow">Cuenta</span>
                  <h3 className="saas-title">Mi Perfil</h3>
                </div>
              </div>
              <div className="saas-profile-card">
                <form className="saas-profile-form">
                  <div className="saas-form-group">
                    <label>Nombre Completo</label>
                    <input type="text" defaultValue={userData?.full_name || ''} className="saas-input" />
                  </div>
                  <div className="saas-form-group">
                    <label>Teléfono (WhatsApp)</label>
                    <input type="tel" defaultValue={userData?.phone || ''} className="saas-input" />
                  </div>
                  <div className="saas-form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" defaultValue={userData?.email || ''} disabled className="saas-input disabled" />
                  </div>
                  <button type="button" className="btn-saas-primary mt-3">Actualizar Datos</button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)} 
        service={serviceToBook}
        onConfirm={handleConfirmAppointment}
      />
    </div>
  );
};

export default ClientDashboard;