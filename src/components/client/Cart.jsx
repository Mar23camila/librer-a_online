import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useOrders } from "../../hooks/useOrders";
import { useToast } from "../../context/ToastContext";
import { formatCOP } from "../../utils/helpers";
import CartItem from "./CartItem";

export default function Cart() {
  const { items, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [placing, setPlacing] = useState(false);

  async function handleCheckout() {
    // Si el usuario no ha iniciado sesión, redirigir al login
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setPlacing(true);
    try {
      const order = await placeOrder(
        items.map(({ productId, titulo, precio, cantidad }) => ({ productId, titulo, precio, cantidad }))
      );
      clearCart();
      toast.success("¡Pedido realizado con éxito!");
      navigate(`/pedidos/${order.id}`);
    } catch (err) {
      toast.error(err.message || "No se pudo procesar el pedido.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-semibold text-parchment">Tu carrito</h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line py-16 text-center">
          <p className="text-muted">Tu carrito está vacío. Explora el catálogo y encuentra tu próxima lectura.</p>
          <button
            onClick={() => navigate("/tienda")}
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Ir a la tienda
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted">Total del pedido</p>
              <p className="font-display text-2xl font-semibold text-lilac-200">{formatCOP(total)}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={placing}
              className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placing ? "Procesando…" : "Confirmar pedido"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
