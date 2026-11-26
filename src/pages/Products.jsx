import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get("/products");
      setProducts(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">جاري تحميل المنتجات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="h4 fw-bold mb-4 text-success">جميع المنتجات</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}