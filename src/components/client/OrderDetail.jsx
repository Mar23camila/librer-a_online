import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as api from "../../api/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { formatCOP, formatDate } from "../../utils/helpers";
import StatusBadge from "../common/StatusBadge";
import Spinner from "../common/Spinner";

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getOrder(id, token)
      .then((data) => active && setOrder(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, token]);

  if (loading) return <Spinner full label="Cargando pedido…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-0">
        <p className="text-red-300">{error}</p>
        <Link to="/pedidos" className="mt-4 inline-block text-lilac-300 hover:underline">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/pedidos" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-lilac-300">
        ← Volver a mis pedidos
      </Link>

      <div className="rounded-xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-parchment">
              Pedido #{order.id.split("-")[1]}
            </h1>
            <p className="text-sm text-muted">{formatDate(order.fecha)}</p>
          </div>
          <StatusBadge estado={order.estado} />
        </div>

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
      </div>
    </div>
  );
}
