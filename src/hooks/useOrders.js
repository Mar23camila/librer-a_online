import { useContext } from "react";
import { OrderContext } from "../context/OrderContext";

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de <OrderProvider>");
  return ctx;
}
