/**
 * GUÍA DE USO - Estado Global con Context API
 * 
 * Este archivo documenta cómo usar los nuevos contextos y herramientas
 * de manejo de estado en el proyecto.
 */

// ============================================================================
// 1. CONTEXTOS DISPONIBLES
// ============================================================================

/**
 * AuthContext - Autenticación y datos del usuario actual
 * 
 * Uso:
 */
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, login, register, logout } = useAuth();
  
  if (!isAuthenticated) return <p>No autenticado</p>;
  return <p>Bienvenido, {user?.nombre}!</p>;
}

// ============================================================================

/**
 * CartContext - Carrito de compras
 * 
 * Uso:
 */
import { useCart } from '../hooks/useCart';

function CartExample() {
  const { items, total, count, addItem, removeItem, updateQuantity, clearCart } = useCart();
  
  return (
    <div>
      <p>Items: {count}</p>
      <p>Total: ${total.toFixed(2)}</p>
      {items.map(item => (
        <div key={item.productId}>
          {item.titulo} - ${item.precio}
          <button onClick={() => updateQuantity(item.productId, item.cantidad - 1)}>-</button>
          <button onClick={() => removeItem(item.productId)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}

// ============================================================================

/**
 * OrderContext - Pedidos del usuario y gestión de pedidos
 * 
 * Uso:
 */
import { useOrders } from '../hooks/useOrders';

function OrdersExample() {
  const { orders, placeOrder, fetchMyOrders, loading } = useOrders();
  
  return (
    <div>
      {loading && <p>Cargando...</p>}
      {orders.map(order => (
        <div key={order.id}>{order.id} - ${order.total}</div>
      ))}
    </div>
  );
}

// ============================================================================

/**
 * UserContext - Gestión de usuarios (solo admin)
 * 
 * Uso:
 */
import { useUsers } from '../hooks/useUsers';

function AdminUsersExample() {
  const { users, fetchAllUsers, createAdminUser, updateUser, deleteUser, loading } = useUsers();
  
  // Cargar usuarios al montar
  React.useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);
  
  return (
    <div>
      {loading && <p>Cargando usuarios...</p>}
      {users.map(user => (
        <div key={user.id}>{user.nombre} - {user.email}</div>
      ))}
    </div>
  );
}

// ============================================================================

/**
 * ErrorContext - Manejo centralizado de errores
 * 
 * Uso:
 */
import { useGlobalError } from '../hooks/useGlobalError';

function ErrorHandlingExample() {
  const { addError, clearError, errors, getLastError } = useGlobalError();
  
  const handleAction = async () => {
    try {
      // ... alguna acción
    } catch (err) {
      addError(err, true); // true = mostrar notificación toast
    }
  };
  
  return (
    <div>
      <p>Últimos errores: {errors.length}</p>
      <button onClick={handleAction}>Acción</button>
    </div>
  );
}

// ============================================================================

/**
 * ToastContext - Sistema de notificaciones
 * 
 * Uso:
 */
import { useToast } from '../context/ToastContext';

function ToastExample() {
  const toast = useToast();
  
  return (
    <div>
      <button onClick={() => toast.success('¡Éxito!')}>Success</button>
      <button onClick={() => toast.error('Error ocurrido')}>Error</button>
      <button onClick={() => toast.info('Información')}>Info</button>
    </div>
  );
}

// ============================================================================
// 2. UTILIDADES DE PERSISTENCIA
// ============================================================================

/**
 * persistenceMiddleware - Guardar/cargar estado en localStorage
 * 
 * Funciones disponibles:
 * - getPersisted(key, defaultValue)
 * - setPersisted(key, value)
 * - removePersisted(key)
 * - clearAllPersisted()
 * - createStorageKey(namespace, ...parts)
 */
import { getPersisted, setPersisted, createStorageKey } from '../utils/persistenceMiddleware';

function PersistenceExample() {
  // Guardar
  setPersisted('mykey', { data: 'value' });
  
  // Cargar
  const loaded = getPersisted('mykey', null);
  
  // Crear clave namespaceada
  const key = createStorageKey('cart', userId);
  setPersisted(key, cartItems);
}

// ============================================================================
// 3. DEVTOOLS PARA DEBUGGING
// ============================================================================

/**
 * devTools - Herramientas para debugging en desarrollo
 * 
 * Funciones disponibles:
 * - createContextDevTools(contextName)
 * - createContextSnapshot(contextName, state, actions)
 * - exportContextsState(contexts)
 */
import { createContextDevTools } from '../utils/devTools';

function ComponentWithDevTools() {
  const devTools = createContextDevTools('MyComponent');
  
  const [state, setState] = React.useState({});
  
  const updateState = (newState) => {
    devTools.log('updateState', newState);
    setState(newState);
  };
  
  return <div>{/* ... */}</div>;
}

// ============================================================================
// 4. ESTRUCTURA DE CARPETAS
// ============================================================================

/*
src/
├── context/
│   ├── AppProvider.jsx          ← Provider principal consolidado
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   ├── OrderContext.jsx
│   ├── UserContext.jsx          ← NUEVO
│   ├── ErrorContext.jsx         ← NUEVO
│   └── ToastContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useOrders.js
│   ├── useUsers.js              ← NUEVO
│   └── useGlobalError.js        ← NUEVO
└── utils/
    ├── persistenceMiddleware.js  ← NUEVO
    └── devTools.js              ← NUEVO
*/

// ============================================================================
// 5. EJEMPLO COMPLETO DE COMPONENTE
// ============================================================================

import React from 'react';

function AdminDashboardExample() {
  const { isAdmin } = useAuth();
  const { users, fetchAllUsers, loading } = useUsers();
  const { addError, errors } = useGlobalError();
  
  React.useEffect(() => {
    if (isAdmin) {
      fetchAllUsers().catch(err => addError(err));
    }
  }, [isAdmin, fetchAllUsers, addError]);
  
  if (!isAdmin) return <p>Acceso denegado</p>;
  
  return (
    <div>
      <h1>Panel de Admin</h1>
      <p>Usuarios totales: {users.length}</p>
      {loading && <p>Cargando...</p>}
      {errors.length > 0 && (
        <div>
          <p>Errores recientes: {errors.length}</p>
        </div>
      )}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.nombre} ({user.email}) - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboardExample;
