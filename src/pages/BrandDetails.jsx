import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard/ProductCard";

export default function BrandDetails() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBrandAndProducts() {
      setLoading(true);
      setError("");
      try {
        const [brandRes, prodRes] = await Promise.all([
          axiosInstance.get(`/brands/${id}`),
          axiosInstance.get(`/products?brand=${id}`),
        ]);
        setBrand(brandRes.data.data || null);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "تعذر تحميل بيانات البراند");
      } finally {
        setLoading(false);
      }
    }
    fetchBrandAndProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || "العلامة التجارية غير موجودة"}</div>
        <Link to="/brands" className="btn btn-outline-success">
          العودة للبراندات
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm mb-4">
        <div className="row g-0 align-items-center">
          <div className="col-md-3 text-center p-3">
            <img
              src={brand.image}
              alt={brand.name}
              className="img-fluid"
              style={{ maxHeight: "150px", objectFit: "contain" }}
            />
          </div>
          <div className="col-md-9 p-4">
            <span className="badge bg-success-subtle text-success mb-2">
              Brand Details
            </span>
            <h2 className="h3 fw-bold mb-1">{brand.name}</h2>
            <p className="text-muted small mb-0">Slug: {brand.slug}</p>
          </div>
        </div>
      </div>

      <h3 className="h5 fw-bold mb-3">منتجات هذه العلامة ({products.length})</h3>
      {products.length === 0 ? (
        <div className="alert alert-info">لا توجد منتجات متاحة لهذه العلامة حالياً.</div>
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