```
ARQUITECTURA DE ESTADO GLOBAL - Librería Online
==============================================

📦 AppProvider (main.jsx)
  └─ ToastProvider          → Notificaciones/Toast
     └─ ErrorProvider       → Manejo centralizado de errores
        └─ AuthProvider     → Autenticación & usuario actual
           └─ UserProvider  → Gestión de usuarios (admin)
              └─ CartProvider      → Carrito de compras
                 └─ OrderProvider  → Pedidos del usuario
                    └─ App


CONTEXTOS Y HOOKS DISPONIBLES
=============================

┌─ AuthContext ────────────────────────────────┐
│ Hook: useAuth()                              │
│ ┌─ state                                     │
│ │  • user: Usuario actual o null            │
│ │  • token: JWT/Token de sesión             │
│ │  • isAuthenticated: boolean                │
│ │  • isAdmin: boolean                        │
│ │  • loading: boolean                        │
│ │  • error: string | null                    │
│ └─ actions                                   │
│    • login(email, password)                  │
│    • register(data)                          │
│    • logout()                                │
└──────────────────────────────────────────────┘

┌─ CartContext ─────────────────────────────────┐
│ Hook: useCart()                              │
│ ┌─ state                                     │
│ │  • items: CartItem[]                       │
│ │  • total: number                           │
│ │  • count: number (cantidad total)          │
│ └─ actions                                   │
│    • addItem(book, cantidad)                 │
│    • removeItem(productId)                   │
│    • updateQuantity(productId, cantidad)    │
│    • clearCart()                             │
└──────────────────────────────────────────────┘

┌─ OrderContext ────────────────────────────────┐
│ Hook: useOrders()                            │
│ ┌─ state                                     │
│ │  • orders: Order[]                         │
│ │  • allOrders: Order[] (admin)              │
│ │  • loading: boolean                        │
│ └─ actions                                   │
│    • placeOrder(items)                       │
│    • fetchMyOrders()                         │
│    • fetchAllOrders() (admin)                │
│    • changeOrderStatus(id, status) (admin)  │
└──────────────────────────────────────────────┘

┌─ UserContext ─────────────────────────────────┐
│ Hook: useUsers()                             │
│ ┌─ state                                     │
│ │  • users: User[]                           │
│ │  • loading: boolean                        │
│ │  • error: string | null                    │
│ └─ actions                                   │
│    • fetchAllUsers() (admin)                 │
│    • createAdminUser(userData) (admin)      │
│    • updateUser(id, updates) (admin)        │
│    • deleteUser(id) (admin)                 │
└──────────────────────────────────────────────┘

┌─ ErrorContext ────────────────────────────────┐
│ Hook: useGlobalError()                       │
│ ┌─ state                                     │
│ │  • errors: Error[]                         │
│ └─ actions                                   │
│    • addError(error, showNotification)      │
│    • clearError(id)                          │
│    • clearAllErrors()                        │
│    • getLastError()                          │
└──────────────────────────────────────────────┘

┌─ ToastContext ────────────────────────────────┐
│ Hook: useToast()                             │
│ ┌─ actions                                   │
│    • toast.success(message)                  │
│    • toast.error(message)                    │
│    • toast.info(message)                     │
└──────────────────────────────────────────────┘


PERSISTENCIA
============
Middleware: persistenceMiddleware.js
├─ getPersisted(key, defaultValue)
├─ setPersisted(key, value)
├─ removePersisted(key)
├─ clearAllPersisted()
└─ createStorageKey(namespace, ...parts)

Prefijo de almacenamiento: "pv_"
Ejemplos:
  • pv_token (token de autenticación)
  • pv_cart_u-123456 (carrito por usuario)


HERRAMIENTAS DE DESARROLLO
==========================
Módulo: devTools.js (solo disponible en DEV)
├─ createContextDevTools(contextName)
├─ createContextSnapshot(contextName, state, actions)
└─ exportContextsState(contexts)


FLUJOS DE DATOS COMUNES
=======================

1. INICIO DE SESIÓN:
   Login Component
   → useAuth().login(email, password)
   → AuthContext actualiza token y user
   → CartContext carga carrito del usuario
   → OrderContext carga órdenes del usuario

2. AGREGAR AL CARRITO:
   ProductCard Component
   → useCart().addItem(product)
   → CartContext actualiza items
   → setPersisted() guarda en localStorage

3. COMPRAR (Admin):
   AdminPanel Component
   → useUsers().fetchAllUsers()
   → useOrders().fetchAllOrders()
   → useOrders().changeOrderStatus(id, status)

4. MANEJO DE ERRORES:
   Cualquier componente
   → try/catch
   → useGlobalError().addError(err)
   → ErrorProvider muestra toast + log


RECOMENDACIONES
===============
✅ Usar hooks específicos en lugar de useContext directamente
✅ Manejar errores con useGlobalError() para consistencia
✅ Usar persistenceMiddleware para localStorage
✅ Los DevTools están disponibles solo en desarrollo
✅ Los contextos están ordenados por dependencia en AppProvider

❌ No importar contextos directamente si hay un hook disponible
❌ No guardar contraseñas en localStorage (ya está protegido)
❌ No llamar fetchAllUsers sin verificar isAdmin
```
