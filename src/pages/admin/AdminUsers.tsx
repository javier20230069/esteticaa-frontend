// src/pages/admin/AdminUsers.tsx
import { useState, useEffect } from 'react';
import { Edit, Shield, User as UserIcon, Loader2 } from 'lucide-react';
import api from '../../services/api';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import './AdminUsers.css';

interface UserData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  fecha_registro: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':    return <span className="badge-role badge-indigo"><Shield size={12} /> Admin</span>;
      case 'employee': return <span className="badge-role badge-emerald">Empleado</span>;
      default:         return <span className="badge-role badge-gray">Cliente</span>;
    }
  };

  if (loading) return <div className="loading-state"><Loader2 className="spinner" size={32} /></div>;

  return (
    <div className="saas-container">
      <Breadcrumbs />

      <div className="saas-header">
        <div>
          <p className="saas-eyebrow">Directorio</p>
          <h1 className="saas-title">Gestión de Usuarios</h1>
          <p className="text-muted mt-1">Administra los roles y accesos al sistema.</p>
        </div>
      </div>

      <div className="saas-table-card">
        <table className="saas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Contacto</th>
              <th>Fecha Registro</th>
              <th>Rol</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted" style={{ padding: '40px' }}>
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className={user.is_active ? '' : 'row-inactive'}>
                  <td className="text-muted">#{user.id}</td>
                  <td className="font-medium flex-cell text-indigo">
                    <UserIcon size={16} /> {user.full_name}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 500, color: '#334155' }}>{user.email}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{user.phone}</span>
                    </div>
                  </td>
                  <td className="text-muted">{new Date(user.fecha_registro).toLocaleDateString()}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <span className={`badge-status ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon text-indigo"
                        title="Cambiar Rol / Editar"
                        onClick={() => alert(`Próximamente: Editar a ${user.full_name}`)}
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;