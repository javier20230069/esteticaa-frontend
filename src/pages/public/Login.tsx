// src/pages/public/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import logoImagen from '../../assets/images/LogoImagen.png';
import './Login.css';

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', confirmPassword: ''
  });

  // 🌟 NUEVO: Estado para manejar los errores por campo
  const [errors, setErrors] = useState({
    name: '', phone: '', email: '', password: '', confirmPassword: '', terms: ''
  });

  // Función para limpiar el error en cuanto el usuario empieza a escribir
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked);
    if (errors.terms) setErrors({ ...errors, terms: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reiniciamos los errores
    const newErrors = { name: '', phone: '', email: '', password: '', confirmPassword: '', terms: '' };
    let hasError = false;

    // 🌟 NUEVO: Validación Inline
    if (!isLoginView) {
      if (formData.name.trim().length < 3) {
        newErrors.name = 'Ingresa un nombre válido (mínimo 3 letras).';
        hasError = true;
      }
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'El teléfono debe tener exactamente 10 números.';
        hasError = true;
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        hasError = true;
      }
      if (!acceptTerms) {
        newErrors.terms = 'Debes aceptar los Términos y Privacidad.';
        hasError = true;
      }
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.';
      hasError = true;
    }

    // Si hay errores, los mostramos y detenemos el envío
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (isLoginView) {
        const response = await api.post('/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        toast.success('Acceso concedido. Bienvenido.');
        if (response.data.role === 'admin') navigate('/admin/dashboard'); else navigate('/mi-cuenta');
      } else {
        await api.post('/auth/register', { full_name: formData.name, phone: formData.phone, email: formData.email, password: formData.password });
        toast.success('Cuenta creada exitosamente. Ya puedes iniciar sesión.');
        setIsLoginView(true);
        setFormData({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
        setAcceptTerms(false);
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const serverMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
      
      // Si el backend nos manda error (ej. "Correo ya registrado"), lo mostramos como toast o en el campo email
      if (serverMessage) {
        toast.error(serverMessage);
      } else {
        toast.error('Verifica tus datos o intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-saas-page">
      <div className="login-saas-bg">
        <div className="login-blob login-blob--1" />
        <div className="login-blob login-blob--2" />
      </div>

      <button type="button" className="login-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        <span>Volver al inicio</span>
      </button>

      <div className="login-saas-card">
        
        <div className="login-logo-container">
          <Link to="/" title="Ir al inicio">
            <img src={logoImagen} alt="Ezequiel Castillo" className="login-logo-img" />
          </Link>
        </div>

        <div className="login-header">
          <span className="login-eyebrow">{isLoginView ? 'Acceso Seguro' : 'Únete a nosotros'}</span>
          <h1 className="login-title">{isLoginView ? 'Iniciar Sesión' : 'Crear una Cuenta'}</h1>
          <p className="login-subtitle">
            {isLoginView
              ? 'Ingresa tus credenciales para acceder a tu panel.'
              : 'Completa tus datos para empezar a gestionar tus citas.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>

          {!isLoginView && (
            <div className="login-row login-anim">
              <div className="login-field">
                <label>Nombre Completo</label>
                <div className={`login-input-wrap ${errors.name ? 'has-error' : ''}`}>
                  <User size={18} className="login-icon" />
                  <input type="text" required placeholder="Ej. Juan Pérez"
                    value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                </div>
                {errors.name && <span className="login-error-text"><AlertCircle size={12}/> {errors.name}</span>}
              </div>
              <div className="login-field">
                <label>WhatsApp</label>
                <div className={`login-input-wrap ${errors.phone ? 'has-error' : ''}`}>
                  <Phone size={18} className="login-icon" />
                  <input type="tel" required placeholder="10 dígitos"
                    value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                </div>
                {errors.phone && <span className="login-error-text"><AlertCircle size={12}/> {errors.phone}</span>}
              </div>
            </div>
          )}

          <div className="login-field">
            <label>Correo Electrónico</label>
            <div className={`login-input-wrap ${errors.email ? 'has-error' : ''}`}>
              <Mail size={18} className="login-icon" />
              <input type="email" required placeholder="correo@ejemplo.com"
                value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
            </div>
            {errors.email && <span className="login-error-text"><AlertCircle size={12}/> {errors.email}</span>}
          </div>

          <div className="login-field">
            <label>Contraseña</label>
            <div className={`login-input-wrap ${errors.password ? 'has-error' : ''}`}>
              <Lock size={18} className="login-icon" />
              <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                value={formData.password} onChange={e => handleInputChange('password', e.target.value)} />
              <button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="login-error-text"><AlertCircle size={12}/> {errors.password}</span>}
          </div>

          {!isLoginView && (
            <>
              <div className="login-field login-anim">
                <label>Confirmar Contraseña</label>
                <div className={`login-input-wrap ${errors.confirmPassword ? 'has-error' : ''}`}>
                  <Lock size={18} className="login-icon" />
                  <input type={showConfirmPassword ? 'text' : 'password'} required placeholder="••••••••"
                    value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} />
                  <button type="button" className="login-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="login-error-text"><AlertCircle size={12}/> {errors.confirmPassword}</span>}
              </div>

              <div className="login-anim">
                <label className="login-terms">
                  <input type="checkbox" checked={acceptTerms} onChange={e => handleTermsChange(e.target.checked)} />
                  <span className="login-terms-text">
                    Acepto los <Link to="/terminos" target="_blank">Términos</Link> y <Link to="/privacidad" target="_blank">Aviso de Privacidad</Link>.
                  </span>
                </label>
                {errors.terms && <span className="login-error-text" style={{marginLeft: '26px'}}><AlertCircle size={12}/> {errors.terms}</span>}
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-saas-submit">
            {loading
              ? <span className="login-loading"><LoaderIcon /> Procesando...</span>
              : (isLoginView ? 'Acceder al Panel' : 'Registrar Cuenta')}
          </button>

          <div className="login-toggle">
            <p>
              {isLoginView ? '¿No tienes cuenta? ' : '¿Ya eres miembro? '}
              <button type="button" className="login-toggle-btn"
                onClick={() => { 
                  setIsLoginView(!isLoginView); 
                  setFormData({ name: '', phone: '', email: '', password: '', confirmPassword: '' }); 
                  setAcceptTerms(false);
                  setErrors({ name: '', phone: '', email: '', password: '', confirmPassword: '', terms: '' });
                }}>
                {isLoginView ? 'Regístrate gratis' : 'Inicia sesión'}
              </button>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

const LoaderIcon = () => (
  <svg className="login-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Login;