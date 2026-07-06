export default function Pagination({ page, totalPages, total, start, end, onPageChange }) {
  if (totalPages <= 1) return null;

  function goTo(p) {
    if (p >= 1 && p <= totalPages) onPageChange(p);
  }

  const pages = [];
  const range = 2;
  for (let i = Math.max(1, page - range); i <= Math.min(totalPages, page + range); i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-muted">
        Mostrando {start + 1}–{Math.min(end, total)} de {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-parchment disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        {pages[0] > 1 && (
          <>
            <button
              onClick={() => goTo(1)}
              className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-parchment"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-1 text-muted">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              p === page
                ? "border-violet-500 bg-violet-600 text-white"
                : "border-line text-muted hover:bg-surface-2 hover:text-parchment"
            }`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-muted">…</span>}
            <button
              onClick={() => goTo(totalPages)}
              className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-parchment"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-parchment disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}