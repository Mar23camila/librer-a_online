import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { useGlobalError } from '../hooks/useGlobalError';
import { useToast } from '../context/ToastContext';

/**
 * AdminUsersPanel - Ejemplo completo de uso de contextos
 * 
 * Demuestra:
 * - Verificación de permisos con useAuth
 * - Gestión de usuarios con useUsers
 * - Manejo de errores con useGlobalError
 * - Notificaciones con useToast
 */
function AdminUsersPanel() {
  const { isAdmin, user } = useAuth();
  const { users, fetchAllUsers, createAdminUser, updateUser, deleteUser, loading, error } = useUsers();
  const { addError } = useGlobalError();
  const toast = useToast();

  // Estados locales del componente
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({ nombre: '', email: '', password: '', telefono: '' });

  // Cargar usuarios cuando el componente monta o cuando se gana permisos de admin
  React.useEffect(() => {
    if (isAdmin) {
      fetchAllUsers()
        .catch(err => {
          addError(err);
        });
    }
  }, [isAdmin, fetchAllUsers, addError]);

  // Si no es admin, mostrar mensaje de acceso denegado
  if (!isAdmin) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Acceso denegado: Solo administradores pueden acceder a esta página.</p>
      </div>
    );
  }

  // Manejador para crear nuevo admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const newAdmin = await createAdminUser(formData);
      toast.success(`Admin creado: ${newAdmin.nombre}`);
      setFormData({ nombre: '', email: '', password: '', telefono: '' });
      setShowForm(false);
    } catch (err) {
      addError(err);
    }
  };

  // Manejador para actualizar usuario
  const handleUpdateUser = async (userId, updates) => {
    try {
      await updateUser(userId, updates);
      toast.success('Usuario actualizado');
    } catch (err) {
      addError(err);
    }
  };

  // Manejador para eliminar usuario
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await deleteUser(userId);
      toast.success('Usuario eliminado');
    } catch (err) {
      addError(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración de Usuarios</h1>
      
      {/* Info del usuario actual */}
      <div className="bg-blue-50 p-4 rounded mb-6 border border-blue-200">
        <p className="text-sm text-gray-600">Sesión iniciada como:</p>
        <p className="font-semibold">{user?.nombre} ({user?.email})</p>
      </div>

      {/* Botón para crear nuevo admin */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? 'Cancelar' : 'Crear Nuevo Admin'}
      </button>

      {/* Formulario para crear admin */}
      {showForm && (
        <form onSubmit={handleCreateAdmin} className="bg-gray-50 p-4 rounded mb-6 border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre:</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono:</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Admin'}
            </button>
          </div>
        </form>
      )}

      {/* Error general */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Lista de usuarios */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Usuarios Registrados ({users.length})
        </h2>
        
        {loading ? (
          <p className="text-gray-500">Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No hay usuarios registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Nombre</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Teléfono</th>
                  <th className="border p-2 text-left">Rol</th>
                  <th className="border p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="border p-2">{u.nombre}</td>
                    <td className="border p-2">{u.email}</td>
                    <td className="border p-2">{u.telefono || '-'}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="border p-2 text-center space-x-2">
                      <button
                        onClick={() => handleUpdateUser(u.id, { telefono: prompt('Nuevo teléfono:', u.telefono) })}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPanel;
