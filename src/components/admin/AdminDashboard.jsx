import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { formatCOP } from "../../utils/helpers";
import Spinner from "../common/Spinner";

function StatCard({ label, value, to, accent }) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-violet-600/60"
    >
      <span className="text-sm text-muted">{label}</span>
      <span className={`font-display text-3xl font-semibold ${accent}`}>{value}</span>
    </Link>
  );
}

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([api.getUsers(token), api.getAllOrders(token), api.getProducts()])
      .then(([users, orders, products]) => {
        if (!active) return;
        const clientes = users.filter((u) => u.role === "cliente");
        const pendientes = orders.filter((o) => o.estado === "Pendiente");
        const ingresos = orders
          .filter((o) => o.estado !== "Rechazado")
          .reduce((sum, o) => sum + o.total, 0);
        setStats({ clientes: clientes.length, pedidos: orders.length, pendientes: pendientes.length, productos: products.length, ingresos });
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  if (loading || !stats) return <Spinner full label="Cargando panel…" />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-parchment">Panel de administración</h1>
        <p className="mt-1 text-sm text-muted">Hola {user.nombre.split(" ")[0]}, aquí tienes un resumen general de la librería.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Clientes registrados" value={stats.clientes} to="/admin/clientes" accent="text-lilac-200" />
        <StatCard label="Pedidos totales" value={stats.pedidos} to="/admin/pedidos" accent="text-lilac-200" />
        <StatCard label="Pedidos pendientes" value={stats.pendientes} to="/admin/pedidos" accent="text-amber-300" />
        <StatCard label="Libros en catálogo" value={stats.productos} to="/admin/productos" accent="text-lilac-200" />
      </div>

      <div className="rounded-xl border border-line bg-surface p-6">
        <p className="text-sm text-muted">Ingresos totales (pedidos no rechazados)</p>
        <p className="mt-1 font-display text-3xl font-semibold text-emerald-300">{formatCOP(stats.ingresos)}</p>
      </div>
    </div>
  );
}
