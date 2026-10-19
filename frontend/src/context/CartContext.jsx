import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!localStorage.getItem("access")) {
      setCount(0);
      return;
    }
    try {
      const { data } = await api.get("/cart/");
      setCount(data.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [isLoggedIn, refreshCart]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      try {
        await api.post("/cart/add/", { product_id: productId, quantity });
        await refreshCart();
        showToast("Added to cart");
        return true;
      } catch (err) {
        showToast(err.response?.data?.detail || "Could not add to cart.");
        return false;
      }
    },
    [refreshCart, showToast]
  );

  return (
    <CartContext.Provider value={{ count, toast, refreshCart, addToCart, showToast }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
