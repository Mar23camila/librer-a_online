import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

function BookmarkLogo() {
  return (
    <div className="flex items-end gap-[3px]" aria-hidden="true">
      <span className="h-6 w-1.5 rounded-t-sm bg-violet-500" />
      <span className="h-8 w-1.5 rounded-t-sm bg-violet-600" />
      <span className="h-5 w-1.5 rounded-t-sm bg-lilac-300" />
      <span className="h-7 w-1.5 rounded-t-sm bg-violet-700" />
    </div>
  );
}

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive ? "text-parchment bg-surface-2" : "text-muted hover:text-parchment hover:bg-surface-2/60"
  }`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink-2/90 backdrop-blur">
      <div className="spine-stripes h-1 w-full opacity-70" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <BookmarkLogo />
          <span className="font-display text-lg font-semibold tracking-tight text-parchment">
            Páginas Violeta
          </span>
        </NavLink>

        <button
          className="rounded-md border border-line p-2 text-parchment sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full flex-col gap-1 border-b border-line bg-ink-2 p-4 sm:static sm:flex sm:flex-row sm:items-center sm:border-none sm:bg-transparent sm:p-0`}
        >
          {!isAdmin && (
            <NavLink to="/tienda" className={linkClass} onClick={() => setOpen(false)}>
              Tienda
            </NavLink>
          )}
          {!isAdmin && (
            <>
              <NavLink to="/carrito" className={linkClass} onClick={() => setOpen(false)}>
                Carrito
                {count > 0 && (
                  <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-xs font-semibold text-white">
                    {count}
                  </span>
                )}
              </NavLink>
            </>
          )}
          {isAuthenticated && !isAdmin && (
            <>
              <NavLink to="/pedidos" className={linkClass} onClick={() => setOpen(false)}>
                Mis pedidos
              </NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
              Panel administrador
            </NavLink>
          )}

          <div className="my-2 h-px w-full bg-line sm:hidden" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3 sm:ml-3">
              <span className="hidden text-sm text-muted sm:inline">Hola, {user.nombre.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-violet-600 px-3 py-1.5 text-sm font-medium text-lilac-200 transition-colors hover:bg-violet-600 hover:text-white"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:ml-3">
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:text-parchment"
              >
                Iniciar sesión
              </NavLink>
              <NavLink
                to="/registro"
                onClick={() => setOpen(false)}
                className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
              >
                Registrarme
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
