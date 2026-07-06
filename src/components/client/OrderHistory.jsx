import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import { useToast } from "../../context/ToastContext";
import { formatCOP, formatDate } from "../../utils/helpers";
import StatusBadge from "../common/StatusBadge";
import Pagination from "../common/Pagination";
import usePagination from "../../hooks/usePagination";
import Spinner from "../common/Spinner";

const PAGE_SIZE = 5;

export default function OrderHistory() {
  const { orders, loading, fetchMyOrders } = useOrders();
  const toast = useToast();

  useEffect(() => {
    fetchMyOrders().catch(() => toast.error("No se pudieron cargar tus pedidos."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { page, setPage, totalPages, pageItems, start, end, total } = usePagination(orders, PAGE_SIZE);

  if (loading) return <Spinner full label="Cargando tus pedidos…" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-semibold text-parchment">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line py-16 text-center">
          <p className="text-muted">Todavía no has realizado ningún pedido.</p>
          <Link to="/tienda" className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {pageItems.map((order) => (
              <Link
                key={order.id}
                to={`/pedidos/${order.id}`}
                className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-violet-600/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display font-medium text-parchment">Pedido #{order.id.split("-")[1]}</p>
                  <p className="text-sm text-muted">{formatDate(order.fecha)} · {order.items.length} título(s)</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display font-semibold text-lilac-200">{formatCOP(order.total)}</span>
                  <StatusBadge estado={order.estado} />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              start={start}
              end={end}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
