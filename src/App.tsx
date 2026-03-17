// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts


// Páginas del Administrador
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAppointments from "./pages/admin/AdminAppointments"; // NUEVA PANTALLA DE CITAS
import AdminBackups from './pages/admin/AdminBackups';
import AdminLayout from './components/admin/AdminLayout';

// Páginas Públicas
import Home from './pages/public/Home';
import Login from "./pages/public/Login";
import Terminos from "./pages/public/Terminos";
import Privacidad from "./pages/public/Privacidad";
import Cancelaciones from "./pages/public/Cancelaciones";
import NotFound from "./pages/public/NotFound";

// Páginas del Cliente
import ClientDashboard from "./pages/client/ClientDashboard";

function App() {
  return (
    <>
      {/* El Toaster es para que salgan las alertas verdes y rojas flotantes */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        {/* ================= Lado Público ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cancelaciones" element={<Cancelaciones />} />

        {/* ================= Acceso Cliente ================= */}
        <Route path="/mi-cuenta" element={<ClientDashboard />} />

        {/* ================= Panel Administrativo ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* RUTA INDEX: Carga el Dashboard por defecto al entrar a /admin */}
          <Route index element={<AdminDashboard />} />
          
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="servicios" element={<AdminServices />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="respaldos" element={<AdminBackups />} />
          
          {/* NUEVA RUTA: La agenda del administrador */}
          <Route path="citas" element={<AdminAppointments />} />
        </Route>

        {/* ================= Pantalla de Error (404) ================= */}
        {/* Esta SIEMPRE debe ir al final */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;