import { useState } from "react";
import { formatCOP } from "../../utils/helpers";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../context/ToastContext";

export default function ProductCard({ book }) {
  const { addItem } = useCart();
  const toast = useToast();
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    if (book.stock <= 0) return;
    addItem(book, 1);
    setAdding(true);
    toast.success(`"${book.titulo}" se agregó al carrito.`);
    setTimeout(() => setAdding(false), 600);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-transform hover:-translate-y-1 hover:border-violet-600/60">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-2">
        {!imgError ? (
          <img
            src={book.portada}
            alt={`Portada de ${book.titulo}`}
            className="book-cover h-full w-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="book-cover flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-violet-900 to-ink-2 p-4 text-center">
            <span className="text-3xl">📖</span>
            <span className="font-display text-sm text-lilac-200">{book.titulo}</span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full border border-violet-600/50 bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-lilac-200 backdrop-blur">
          {book.categoria}
        </span>
        {book.stock <= 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/70 text-sm font-semibold text-red-300">
            Sin existencias
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-parchment">{book.titulo}</h3>
        <p className="text-sm text-muted">{book.autor}</p>
        <p className="line-clamp-2 text-sm text-muted/90">{book.descripcion}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-semibold text-lilac-200">{formatCOP(book.precio)}</span>
          <button
            onClick={handleAdd}
            disabled={book.stock <= 0}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
              adding ? "bg-emerald-600 text-white" : "bg-violet-600 text-white hover:bg-violet-500"
            } disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted`}
          >
            {adding ? "Agregado ✓" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
