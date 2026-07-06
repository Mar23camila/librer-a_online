import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { OrderProvider } from "./OrderContext";
import { ToastProvider } from "./ToastContext";
import { UserProvider } from "./UserContext";
import { ErrorProvider } from "./ErrorContext";

/**
 * AppProvider: Consolida todos los Context Providers en un único componente.
 * Evita prop drilling y mantiene la estructura de main.jsx limpia.
 * 
 * Orden de providers (de dentro hacia afuera):
 * 1. ToastProvider - notificaciones (necesario primero para errores)
 * 2. ErrorProvider - manejo centralizado de errores
 * 3. AuthProvider - autenticación (requerido por otros)
 * 4. UserProvider - gestión de usuarios admin
 * 5. CartProvider - carrito (requiere AuthProvider)
 * 6. OrderProvider - órdenes (requiere AuthProvider)
 */
export function AppProvider({ children }) {
  return (
    <ToastProvider>
      <ErrorProvider>
        <AuthProvider>
          <UserProvider>
            <CartProvider>
              <OrderProvider>{children}</OrderProvider>
            </CartProvider>
          </UserProvider>
        </AuthProvider>
      </ErrorProvider>
    </ToastProvider>
  );
}
