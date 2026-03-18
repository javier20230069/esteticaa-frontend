// src/pages/admin/AdminBackups.tsx
import { useState, useEffect, useCallback } from 'react';
import { Database, Download, Trash2, Loader2, Calendar, FileType, AlertTriangle, Tag } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import './AdminBackups.css';

// 🌟 Actualizamos la interfaz para coincidir con Cloudinary
interface Backup {
  fileName: string;
  public_id: string; // Importante para borrar
  url: string;       // Importante para descargar
  size: string;
  createdAt: string;
  type: string;      // Manual o Automático
}

const AdminBackups = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<{ id: string, name: string } | null>(null);

  const fetchBackups = useCallback(async () => {
    try {
      const res = await api.get('/backups');
      setBackups(res.data);
    } catch (error) {
      console.error(error);
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
    const toastId = toast.loading('Extrayendo base de datos y subiendo a la nube...');
    try {
      await api.post('/backups');
      toast.success('Respaldo en la nube generado correctamente ☁️', { id: toastId });
      fetchBackups();
    } catch (error) {
      console.error(error);
      toast.error('Error al generar el respaldo', { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  // 🌟 Descarga súper rápida usando el link directo de Cloudinary
  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const promptDelete = (public_id: string, fileName: string) => {
    setBackupToDelete({ id: public_id, name: fileName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!backupToDelete) return;
    
    try {
      // 🌟 Ahora le mandamos el public_id por query params como lo pide nuestro backend
      await api.delete(`/backups?public_id=${backupToDelete.id}`);
      toast.success('Respaldo eliminado de la nube');
      fetchBackups();
    } catch (error) {
      console.error(error);
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
          <p className="saas-eyebrow">Seguridad en la Nube</p>
          <h1 className="saas-title">Respaldos del Sistema</h1>
        </div>
        <div className="saas-actions">
          <button
            className="btn-saas-primary"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? <Loader2 size={18} className="spinner" /> : <Database size={18} />}
            <span className="hide-mobile">{creating ? 'Comprimiendo...' : 'Nuevo Respaldo'}</span>
          </button>
        </div>
      </div>

      <div className="saas-table-card">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Nombre del Archivo</th>
              <th>Tipo</th>
              <th>Fecha de Creación</th>
              <th>Tamaño</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {backups.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted" style={{ padding: '40px' }}>
                  No hay respaldos guardados en la nube en este momento.
                </td>
              </tr>
            ) : (
              backups.map((b) => (
                <tr key={b.public_id}>
                  <td className="font-medium flex-cell text-indigo">
                    <FileType size={18} />
                    {b.fileName}
                  </td>
                  <td>
                     {/* 🌟 Mostramos si es Manual o Automático */}
                     <span className={`badge-gray flex-cell`} style={{ width: 'fit-content' }}>
                        <Tag size={14} /> {b.type}
                     </span>
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
                        onClick={() => handleDownload(b.url)}
                        className="btn-icon text-emerald"
                        title="Descargar archivo"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => promptDelete(b.public_id, b.fileName)}
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

      {showDeleteModal && (
        <div className="saas-modal-overlay">
          <div className="saas-modal-content text-center">
            <AlertTriangle size={50} className="text-rose mx-auto mb-4" />
            <h2>¿Eliminar Respaldo?</h2>
            <p className="text-muted mb-6">
              Estás a punto de eliminar permanentemente de la nube el archivo <br/>
              <strong style={{ color: '#0f172a', wordBreak: 'break-all' }}>{backupToDelete?.name}</strong>.<br/>
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