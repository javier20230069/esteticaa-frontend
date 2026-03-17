// src/components/admin/AdminLayout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './AdminLayout.css';

const AdminLayout = () => {
  // El Layout es el único dueño del estado collapsed.
  // Se lo pasa al Sidebar como prop — así no hay doble estado.
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="saas-admin-layout">

      {/* Sidebar recibe el estado y la función de toggle como props */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* La clase 'collapsed' controla el margin-left del área principal */}
      <div className={`saas-admin-main ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <AdminHeader />
        <main className="saas-admin-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;