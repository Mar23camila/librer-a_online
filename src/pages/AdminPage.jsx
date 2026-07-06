import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/clientes", label: "Clientes" },
  { to: "/admin/pedidos", label: "Pedidos" },
  { to: "/admin/productos", label: "Libros" },
  { to: "/admin/crear-admin", label: "Crear admin" },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-8 flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1.5">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-violet-600 text-white" : "text-muted hover:bg-surface-2 hover:text-parchment"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
