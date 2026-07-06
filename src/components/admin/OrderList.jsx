import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import { useToast } from "../../context/ToastContext";
import { formatCOP, formatDate, ESTADOS } from "../../utils/helpers";
import StatusBadge from "../common/StatusBadge";
import Pagination from "../common/Pagination";
import usePagination from "../../hooks/usePagination";
import Spinner from "../common/Spinner";

const PAGE_SIZE = 10;

export default function OrderList() {
  const { allOrders, loading, fetchAllOrders } = useOrders();
  const toast = useToast();
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    fetchAllOrders().catch(() => toast.error("No se pudieron cargar los pedidos."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrados = useMemo(
    () => (filtro === "Todos" ? allOrders : allOrders.filter((o) => o.estado === filtro)),
    [allOrders, filtro]
  );

  const { page, setPage, totalPages, pageItems, start, end, total } = usePagination(filtrados, PAGE_SIZE);

  // Reiniciar página al cambiar filtro
  useEffect(() => {
    setPage(1);
  }, [filtro, setPage]);

  if (loading) return <Spinner full label="Cargando pedidos…" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-parchment">Todos los pedidos</h1>
          <p className="mt-1 text-sm text-muted">{total} de {allOrders.length} pedidos</p>
        </div>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-parchment outline-none focus:border-violet-500"
        >
          <option>Todos</option>
          {ESTADOS.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>

      {filtrados.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line py-16 text-center text-muted">
          No hay pedidos con este filtro.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Pedido</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((o) => (
                  <tr key={o.id} className="border-b border-line/60 last:border-0">
                    <td className="px-4 py-3 font-medium text-parchment">#{o.id.split("-")[1]}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(o.fecha)}</td>
                    <td className="px-4 py-3 text-lilac-200">{formatCOP(o.total)}</td>
                    <td className="px-4 py-3"><StatusBadge estado={o.estado} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/pedidos/${o.id}`} className="font-medium text-lilac-300 hover:underline">
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            start={start}
            end={end}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
