import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);

  const getHeaders = useCallback(() => {
    const authToken = token || localStorage.getItem("userToken");
    return authToken ? { token: authToken } : null;
  }, [token]);

  const fetchCart = useCallback(async () => {
    const headers = getHeaders();
    if (!headers) {
      setCart(null);
      setNumOfCartItems(0);
      setCartId(null);
      return;
    }

    setLoadingCart(true);
    try {
      const { data } = await axiosInstance.get("/cart", { headers });
      if (data.status === "success") {
        setCart(data.data);
        setNumOfCartItems(data.numOfCartItems || 0);
        setCartId(data.data?._id || null);
      }
    } catch {
      // في حالة عدم وجود عربة بعد أو انتهاء الصلاحية
      setCart(null);
      setNumOfCartItems(0);
    } finally {
      setLoadingCart(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function addToCart(productId) {
    const headers = getHeaders();
    if (!headers) {
      toast.error("سجلي دخولك أولاً لإضافة منتجات للعربة");
      return false;
    }

    try {
      const { data } = await axiosInstance.post(
        "/cart",
        { productId },
        { headers }
      );
      if (data.status === "success") {
        setCart(data.data);
        setNumOfCartItems(data.numOfCartItems || 0);
        setCartId(data.data?._id || null);
        toast.success(data.message || "تمت إضافة المنتج إلى العربة");
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "تعذر إضافة المنتج للعربة");
      return false;
    }
  }

  async function updateItemCount(productId, count) {
    const headers = getHeaders();
    if (!headers) return;

    if (count < 1) {
      return removeCartItem(productId);
    }

    try {
      const { data } = await axiosInstance.put(
        `/cart/${productId}`,
        { count },
        { headers }
      );
      if (data.status === "success") {
        setCart(data.data);
        setNumOfCartItems(data.numOfCartItems || 0);
        toast.success("تم تحديث الكمية");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "تعذر تحديث الكمية");
    }
  }

  async function removeCartItem(productId) {
    const headers = getHeaders();
    if (!headers) return;

    try {
      const { data } = await axiosInstance.delete(`/cart/${productId}`, {
        headers,
      });
      if (data.status === "success") {
        setCart(data.data);
        setNumOfCartItems(data.numOfCartItems || 0);
        toast.success("تم حذف المنتج من العربة");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "تعذر حذف المنتج");
    }
  }

  async function clearCart() {
    const headers = getHeaders();
    if (!headers) return;

    try {
      const { data } = await axiosInstance.delete("/cart", { headers });
      if (data.message === "success") {
        setCart(null);
        setNumOfCartItems(0);
        setCartId(null);
        toast.success("تم تفريغ العربة");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "تعذر تفريغ العربة");
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        numOfCartItems,
        loadingCart,
        fetchCart,
        addToCart,
        updateItemCount,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}