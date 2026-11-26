import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const getHeaders = useCallback(() => {
    const authToken = token || localStorage.getItem("userToken");
    return authToken ? { token: authToken } : null;
  }, [token]);

  const fetchWishlist = useCallback(async () => {
    const headers = getHeaders();
    if (!headers) {
      setWishlistItems([]);
      setWishlistIds([]);
      return;
    }

    setLoadingWishlist(true);
    try {
      const { data } = await axiosInstance.get("/wishlist", { headers });
      if (data.status === "success") {
        const items = data.data || [];
        setWishlistItems(items);
        setWishlistIds(items.map((item) => item._id));
      }
    } catch {
      setWishlistItems([]);
      setWishlistIds([]);
    } finally {
      setLoadingWishlist(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  async function addToWishlist(productId) {
    const headers = getHeaders();
    if (!headers) {
      toast.error("سجلي دخولك أولاً لإضافة منتجات للمفضلة");
      return;
    }

    try {
      const { data } = await axiosInstance.post(
        "/wishlist",
        { productId },
        { headers }
      );
      if (data.status === "success") {
        setWishlistIds(data.data || []);
        toast.success(data.message || "تمت الإضافة إلى المفضلة");
        fetchWishlist();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "تعذر الإضافة إلى المفضلة");
    }
  }

  async function removeFromWishlist(productId) {
    const headers = getHeaders();
    if (!headers) return;

    try {
      const { data } = await axiosInstance.delete(`/wishlist/${productId}`, {
        headers,
      });
      if (data.status === "success") {
        setWishlistIds(data.data || []);
        setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
        toast.success(data.message || "تم الحذف من المفضلة");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "تعذر الحذف من المفضلة");
    }
  }

  function isInWishlist(productId) {
    return wishlistIds.includes(productId);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistIds,
        loadingWishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}