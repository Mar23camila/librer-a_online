import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as api from "../../api/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import { useToast } from "../../context/ToastContext";
import { formatCOP, formatDate } from "../../utils/helpers";
import StatusBadge from "../common/StatusBadge";
import Spinner from "../common/Spinner";

export default function OrderDetailAdmin() {
  const { id } = useParams();
  const { token } = useAuth();
  const { changeOrderStatus } = useOrders();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getOrder(id, token)
      .then(async (data) => {
        if (!active) return;
        setOrder(data);
        try {
          const user = await api.getUser(data.userId, token);
          if (active) setCliente(user);
        } catch {
          /* el cliente pudo haber sido eliminado */
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, token]);

  async function handleStatus(estado) {
    setUpdating(true);
    try {
      const updated = await changeOrderStatus(order.id, estado);
      setOrder(updated);
      toast.success(`Pedido marcado como "${estado}".`);
    } catch (err) {
      toast.error(err.message || "No se pudo actualizar el pedido.");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <Spinner full label="Cargando pedido…" />;

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-300">{error}</p>
        <Link to="/admin/pedidos" className="mt-4 inline-block text-lilac-300 hover:underline">
          Volver a pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/pedidos" className="inline-flex w-fit items-center gap-1 text-sm text-muted hover:text-lilac-300">
        ← Volver a todos los pedidos
      </Link>

      <div className="rounded-xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-parchment">Pedido #{order.id.split("-")[1]}</h1>
            <p className="text-sm text-muted">{formatDate(order.fecha)}</p>
          </div>
          <StatusBadge estado={order.estado} />
        </div>

        {cliente && (
          <div className="mt-4 grid gap-1 rounded-lg bg-surface-2 p-4 text-sm sm:grid-cols-2">
            <p><span className="text-muted">Cliente: </span><span className="text-parchment">{cliente.nombre}</span></p>
            <p><span className="text-muted">Email: </span><span className="text-parchment">{cliente.email}</span></p>
            <p><span className="text-muted">Teléfono: </span><span className="text-parchment">{cliente.telefono || "—"}</span></p>
            <p><span className="text-muted">Dirección: </span><span className="text-parchment">{cliente.direccion || "—"}</span></p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {order.items.map((it) => (
            <div key={it.productId} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-parchment">{it.titulo}</p>
                <p className="text-muted">Cantidad: {it.cantidad} · {formatCOP(it.precio)} c/u</p>
              </div>
              <span className="font-medium text-lilac-200">{formatCOP(it.precio * it.cantidad)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <span className="text-muted">Total</span>
          <span className="font-display text-xl font-semibold text-lilac-200">{formatCOP(order.total)}</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
          <button
            onClick={() => handleStatus("Aprobado")}
            disabled={updating || order.estado === "Aprobado"}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Aprobar
          </button>
          <button
            onClick={() => handleStatus("Rechazado")}
            disabled={updating || order.estado === "Rechazado"}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Rechazar
          </button>
          <button
            onClick={() => handleStatus("Enviado")}
            disabled={updating || order.estado !== "Aprobado"}
            className="rounded-lg border border-sky-500/60 px-4 py-2 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Marcar enviado
          </button>
          <button
            onClick={() => handleStatus("Entregado")}
            disabled={updating || order.estado !== "Enviado"}
            className="rounded-lg border border-lilac-300/60 px-4 py-2 text-sm font-semibold text-lilac-200 transition-colors hover:bg-lilac-300/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Marcar entregado
          </button>
        </div>
      </div>
    </div>
  );
}
