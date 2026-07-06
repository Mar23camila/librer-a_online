import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { seedBooks } from "../api/seedData";

function SpineWall() {
  const heights = [64, 88, 72, 100, 60, 92, 76, 108, 68, 84];
  const colors = [
    "bg-violet-700", "bg-violet-500", "bg-lilac-300", "bg-violet-600",
    "bg-violet-900", "bg-lilac-200", "bg-violet-500", "bg-violet-700",
    "bg-lilac-300", "bg-violet-600",
  ];
  return (
    <div className="flex items-end gap-1.5" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-3.5 rounded-t-sm sm:w-4 ${colors[i % colors.length]} shadow-[inset_-2px_0_0_rgba(0,0,0,0.25)]`}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const destacados = seedBooks.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="spine-stripes absolute inset-x-0 top-0 h-1 opacity-70" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full border border-violet-600/50 bg-violet-950/60 px-3 py-1 text-xs font-medium tracking-wide text-lilac-200">
              Taller práctico de React — tienda online
            </span>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-parchment sm:text-5xl">
              Cada libro es una puerta.
              <br />
              <span className="text-lilac-200">Nosotros guardamos la llave.</span>
            </h1>
            <p className="max-w-lg text-base text-muted">
              Páginas Violeta es una librería online completa: catálogo, carrito, pedidos con
              seguimiento y un panel de administración para gestionar todo, de principio a fin.
            </p>
            <div className="flex flex-wrap gap-3">
              {!isAuthenticated && (
                <>
                  <Link to="/registro" className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
                    Crear cuenta
                  </Link>
                  <Link to="/login" className="rounded-lg border border-line px-5 py-3 text-sm font-semibold text-parchment transition-colors hover:border-violet-500">
                    Ya tengo cuenta
                  </Link>
                </>
              )}
              {isAuthenticated && !isAdmin && (
                <Link to="/tienda" className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
                  Ir al catálogo
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
                  Ir al panel de administración
                </Link>
              )}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="rounded-2xl border border-line bg-surface p-8">
              <SpineWall />
              <p className="mt-4 text-center text-xs text-muted">Tu próxima lectura, en el estante de al lado.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-parchment">Algunos destacados</h2>
          <Link to="/tienda" className="text-sm font-medium text-lilac-300 hover:underline">
            Ver todo el catálogo →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {destacados.map((b) => (
              <div key={b.id} className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className="aspect-[3/4] w-full bg-surface-2">
                  <img
                    src={b.portada}
                    alt={`Portada de ${b.titulo}`}
                    className="book-cover h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/300x450/1e1b2e/9e8bb5?text=Sin+portada&font=open-sans";
                    }}
                  />
                </div>
              <div className="p-3">
                <p className="truncate font-display text-sm font-medium text-parchment">{b.titulo}</p>
                <p className="truncate text-xs text-muted">{b.autor}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
