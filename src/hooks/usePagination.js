import { useMemo, useState } from "react";

/**
 * Hook de paginación reutilizable.
 * @param {Array} items        - Lista completa de elementos
 * @param {number} pageSize    - Elementos por página (por defecto 8)
 * @returns {Object}           - { page, setPage, totalPages, pageItems, start, end, total }
 */
export default function usePagination(items, pageSize = 8) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const { start, end, pageItems } = useMemo(() => {
    const s = (safePage - 1) * pageSize;
    const e = s + pageSize;
    return { start: s, end: e, pageItems: items.slice(s, e) };
  }, [items, safePage, pageSize]);

  // Resetear a la primera página si cambian los items
  // (se puede controlar externamente si es necesario)
  const goToPage = (p) => setPage(Math.max(1, Math.min(p, totalPages)));

  return {
    page: safePage,
    setPage: goToPage,
    totalPages,
    pageItems,
    start,
    end,
    total: items.length,
  };
}