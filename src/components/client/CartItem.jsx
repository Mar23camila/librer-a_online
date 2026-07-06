import { formatCOP } from "../../utils/helpers";
import { useCart } from "../../hooks/useCart";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3">
      <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-surface-2">
        <img
          src={item.portada}
          alt={`Portada de ${item.titulo}`}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-medium text-parchment">{item.titulo}</p>
        <p className="text-sm text-muted">{item.autor}</p>
        <p className="mt-1 text-sm font-medium text-lilac-200">{formatCOP(item.precio)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.productId, item.cantidad - 1)}
          aria-label="Disminuir cantidad"
          className="h-8 w-8 rounded-md border border-line text-parchment transition-colors hover:border-violet-500 hover:text-lilac-200"
        >
          −
        </button>
        <span className="w-6 text-center text-sm text-parchment">{item.cantidad}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.cantidad + 1)}
          aria-label="Aumentar cantidad"
          className="h-8 w-8 rounded-md border border-line text-parchment transition-colors hover:border-violet-500 hover:text-lilac-200"
        >
          +
        </button>
      </div>

      <div className="w-24 text-right font-display font-semibold text-parchment">
        {formatCOP(item.precio * item.cantidad)}
      </div>

      <button
        onClick={() => removeItem(item.productId)}
        aria-label={`Eliminar ${item.titulo} del carrito`}
        className="ml-1 text-muted transition-colors hover:text-red-400"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
