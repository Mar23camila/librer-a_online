import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import AdminDashboard from "./components/admin/AdminDashboard";
import ClientList from "./components/admin/ClientList";
import CreateAdmin from "./components/admin/CreateAdmin";
import OrderList from "./components/admin/OrderList";
import OrderDetailAdmin from "./components/admin/OrderDetailAdmin";
import ProductManage from "./components/admin/ProductManage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Catálogo público — no requiere inicio de sesión */}
          <Route path="/tienda" element={<ShopPage />} />
          <Route path="/carrito" element={<CartPage />} />

          {/* Rutas de cliente (protegidas) */}
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute role="cliente">
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos/:id"
            element={
              <ProtectedRoute role="cliente">
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de administrador (protegidas, anidadas) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="clientes" element={<ClientList />} />
            <Route path="pedidos" element={<OrderList />} />
            <Route path="pedidos/:id" element={<OrderDetailAdmin />} />
            <Route path="productos" element={<ProductManage />} />
            <Route path="crear-admin" element={<CreateAdmin />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}