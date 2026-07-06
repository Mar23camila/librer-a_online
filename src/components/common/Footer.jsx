export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-ink-2">
      <div className="spine-stripes h-1 w-full opacity-70" />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-display text-lg font-semibold text-parchment">Páginas Violeta</p>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Librería online creada como taller práctico de React: autenticación, carrito,
              pedidos y panel de administración con datos simulados.
            </p>
          </div>
          <div className="text-sm text-muted">
            <p>Taller práctico de React — Desarrollo Web con React</p>
            <p className="mt-1">SENA · {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
