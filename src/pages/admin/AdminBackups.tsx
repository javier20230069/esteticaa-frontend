// src/pages/admin/AdminBackups.tsx
import { useState, useEffect, useCallback } from 'react';
import { Database, Download, Trash2, Loader2, Calendar, FileType, AlertTriangle} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import './AdminBackups.css';


interface Backup {
  fileName: string;
  size: string;
  createdAt: string;
}

const AdminBackups = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<string | null>(null);

  const fetchBackups = useCallback(async () => {
    try {
      const res = await api.get('/backups');
      setBackups(res.data);
    } catch (error) {
      console.error(error); // Evitamos el error del linter
      toast.error('Error al cargar la lista de respaldos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCreate = async () => {
    setCreating(true);
    const toastId = toast.loading('Generando respaldo en el servidor...');
    try {
      await api.post('/backups');
      toast.success('Respaldo generado correctamente', { id: toastId });
      fetchBackups();
    } catch (error) {
      console.error(error); // Evitamos el error del linter
      toast.error('Error al generar el respaldo', { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    const toastId = toast.loading('Descargando archivo...');
    try {
      const response = await api.get(`/backups/download/${fileName}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Descarga completada', { id: toastId });
    } catch (error) {
      console.error(error); // Evitamos el error del linter
      toast.error('Error al descargar el archivo', { id: toastId });
    }
  };

  const promptDelete = (fileName: string) => {
    setBackupToDelete(fileName);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!backupToDelete) return;
    
    try {
      await api.delete(`/backups/${backupToDelete}`);
      toast.success('Respaldo eliminado del servidor');
      fetchBackups();
    } catch (error) {
      console.error(error); // Evitamos el error del linter
      toast.error('Error al eliminar el respaldo');
    } finally {
      setShowDeleteModal(false);
      setBackupToDelete(null);
    }
  };

  if (loading) return <div className="loading-state"><Loader2 className="spinner" size={32} /></div>;

  return (
    <div className="saas-container">
      <Breadcrumbs />
      
      <div className="saas-header">
        <div>
          <p className="saas-eyebrow">Seguridad</p>
          <h1 className="saas-title">Respaldos del Sistema</h1>
        </div>
        <div className="saas-actions">
          <button
            className="btn-saas-primary"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? <Loader2 size={18} className="spinner" /> : <Database size={18} />}
            <span className="hide-mobile">{creating ? 'Generando...' : 'Nuevo Respaldo'}</span>
          </button>
        </div>
      </div>

      <div className="saas-table-card">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Nombre del Archivo</th>
              <th>Fecha de Creación</th>
              <th>Tamaño</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {backups.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted" style={{ padding: '40px' }}>
                  No hay respaldos guardados en el servidor en este momento.
                </td>
              </tr>
            ) : (
              backups.map((b) => (
                <tr key={b.fileName}>
                  <td className="font-medium flex-cell text-indigo">
                    <FileType size={18} />
                    {b.fileName}
                  </td>
                  <td className="text-muted flex-cell">
                    <Calendar size={16} />
                    {new Date(b.createdAt).toLocaleString('es-MX', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <span className="badge-gray">{b.size}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleDownload(b.fileName)}
                        className="btn-icon text-emerald"
                        title="Descargar a tu PC"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => promptDelete(b.fileName)}
                        className="btn-icon text-rose"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🌟 EL MODAL FIJO DE ELIMINAR RESPALDO 🌟 */}
      {showDeleteModal && (
        <div className="saas-modal-overlay">
          <div className="saas-modal-content text-center">
            <AlertTriangle size={50} className="text-rose mx-auto mb-4" />
            <h2>¿Eliminar Respaldo?</h2>
            <p className="text-muted mb-6">
              Estás a punto de eliminar permanentemente el archivo <br/>
              <strong style={{ color: '#0f172a', wordBreak: 'break-all' }}>{backupToDelete}</strong>.<br/>
              Esta acción no se puede deshacer.
            </p>
            <div className="saas-modal-actions">
              <button 
                onClick={() => { setShowDeleteModal(false); setBackupToDelete(null); }} 
                className="btn-saas-outline"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                className="btn-saas-primary bg-rose flex-center"
              >
                <Trash2 size={18} /> Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AdminBackups;