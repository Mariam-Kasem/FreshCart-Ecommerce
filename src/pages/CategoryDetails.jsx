import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard/ProductCard";

export default function CategoryDetails() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      setLoading(true);
      setError("");
      try {
        const [catRes, prodRes] = await Promise.all([
          axiosInstance.get(`/categories/${id}`),
          axiosInstance.get(`/products?category[in]=${id}`),
        ]);
        setCategory(catRes.data.data || null);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "تعذر تحميل بيانات الفئة");
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryAndProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || "الفئة غير موجودة"}</div>
        <Link to="/categories" className="btn btn-outline-success">
          العودة للفئات
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm mb-4">
        <div className="row g-0 align-items-center">
          <div className="col-md-3">
            <img
              src={category.image}
              alt={category.name}
              className="img-fluid rounded-start w-100"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-9 p-4">
            <span className="badge bg-success-subtle text-success mb-2">
              Category Details
            </span>
            <h2 className="h3 fw-bold mb-1">{category.name}</h2>
            <p className="text-muted small mb-0">Slug: {category.slug}</p>
          </div>
        </div>
      </div>

      <h3 className="h5 fw-bold mb-3">منتجات هذه الفئة ({products.length})</h3>
      {products.length === 0 ? (
        <div className="alert alert-info">لا توجد منتجات متاحة في هذه الفئة حالياً.</div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}