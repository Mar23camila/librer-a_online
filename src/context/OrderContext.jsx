import { createContext, useCallback, useState } from "react";
import * as api from "../api/apiClient";
import { useAuth } from "../hooks/useAuth";

export const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const placeOrder = useCallback(
    async (items) => {
      const order = await api.createOrder(items, token);
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [token]
  );

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getUserOrders(token);
      setOrders(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAllOrders(token);
      setAllOrders(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const changeOrderStatus = useCallback(
    async (id, estado) => {
      const updated = await api.updateOrderStatus(id, estado, token);
      setAllOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      return updated;
    },
    [token]
  );

  const value = {
    orders,
    allOrders,
    loading,
    placeOrder,
    fetchMyOrders,
    fetchAllOrders,
    changeOrderStatus,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
