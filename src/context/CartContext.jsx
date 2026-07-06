import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPersisted, setPersisted, createStorageKey } from "../utils/persistenceMiddleware";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  // Cargar el carrito correspondiente cuando cambia el usuario autenticado.
  useEffect(() => {
    const key = createStorageKey("cart", user?.id || "guest");
    const persisted = getPersisted(key, []);
    setItems(persisted);
  }, [user?.id]);

  // Persistir cambios en el carrito
  useEffect(() => {
    const key = createStorageKey("cart", user?.id || "guest");
    setPersisted(key, items);
  }, [items, user?.id]);

  const addItem = useCallback((book, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.productId === book.id);
      if (existing) {
        return prev.map((it) =>
          it.productId === book.id ? { ...it, cantidad: it.cantidad + cantidad } : it
        );
      }
      return [
        ...prev,
        {
          productId: book.id,
          titulo: book.titulo,
          autor: book.autor,
          precio: book.precio,
          portada: book.portada,
          cantidad,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, cantidad) => {
    setItems((prev) => {
      if (cantidad <= 0) return prev.filter((it) => it.productId !== productId);
      return prev.map((it) => (it.productId === productId ? { ...it, cantidad } : it));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { total, count } = useMemo(() => {
    return items.reduce(
      (acc, it) => ({
        total: acc.total + it.precio * it.cantidad,
        count: acc.count + it.cantidad,
      }),
      { total: 0, count: 0 }
    );
  }, [items]);

  const value = { items, addItem, removeItem, updateQuantity, clearCart, total, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
