import { useEffect, useMemo, useState } from "react";
import * as api from "../../api/apiClient";
import ProductCard from "./ProductCard";
import Spinner from "../common/Spinner";
import Pagination from "../common/Pagination";
import usePagination from "../../hooks/usePagination";
import { useToast } from "../../context/ToastContext";

const PAGE_SIZE = 8;

export default function ProductList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const toast = useToast();

  useEffect(() => {
    let active = true;
    api
      .getProducts()
      .then((data) => active && setBooks(data))
      .catch(() => toast.error("No se pudo cargar el catálogo."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categorias = useMemo(
    () => ["Todas", ...new Set(books.map((b) => b.categoria))],
    [books]
  );

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchesQuery =
        !query ||
        b.titulo.toLowerCase().includes(query.toLowerCase()) ||
        b.autor.toLowerCase().includes(query.toLowerCase());
      const matchesCategoria = categoria === "Todas" || b.categoria === categoria;
      return matchesQuery && matchesCategoria;
    });
  }, [books, query, categoria]);

  const { page, setPage, totalPages, pageItems, start, end, total } = usePagination(filtered, PAGE_SIZE);

  // Reiniciar página al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [query, categoria, setPage]);

  if (loading) return <Spinner full label="Cargando catálogo…" />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold text-parchment">Catálogo</h1>
        <p className="text-sm text-muted">{total} de {books.length} libros disponibles</p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o autor…"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-parchment placeholder:text-muted/70 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-600/30"
          />
        </div>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-parchment outline-none focus:border-violet-500"
        >
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line py-16 text-center text-muted">
          No encontramos libros que coincidan con tu búsqueda.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pageItems.map((book) => (
              <ProductCard key={book.id} book={book} />
            ))}
          </div>

          <div className="mt-8">
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
