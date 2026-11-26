import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard/ProductCard";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      setError("");
      try {
        const [catRes, prodRes] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/products"),
        ]);
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "تعذر تحميل بيانات الصفحة الرئيسية");
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">جاري تحميل المتجر...</p>
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
      {/* Banner */}
      <div className="p-4 p-md-5 mb-5 rounded-3 bg-success-subtle border border-success-subtle">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <span className="badge bg-success mb-2">FreshCart Store</span>
            <h1 className="display-6 fw-bold text-dark mb-2">
              تسوقي أحدث المنتجات والعروض بكل سهولة
            </h1>
            <p className="text-muted mb-4">
              تصفحي الفئات المتنوعة، أضيفي منتجاتك للمفضلة أو السلة، وأتممي طلبك
              بخطوات سريعة وآمنة.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/products" className="btn btn-success px-4 fw-semibold">
                تصفح جميع المنتجات
              </Link>
              <Link
                to="/categories"
                className="btn btn-outline-success px-4 fw-semibold"
              >
                الفئات
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0 text-success">تسوقي حسب الفئة</h2>
          <Link to="/categories" className="small text-success text-decoration-none fw-semibold">
            عرض الكل ←
          </Link>
        </div>
        <div className="row g-3">
          {categories.slice(0, 6).map((cat) => (
            <div key={cat._id} className="col-6 col-sm-4 col-md-2">
              <Link
                to={`/categories/${cat._id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100 border-0 shadow-sm text-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="card-img-top"
                    style={{ height: "110px", objectFit: "cover" }}
                  />
                  <div className="card-body p-2">
                    <p className="small fw-semibold mb-0 text-truncate">
                      {cat.name}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Products + Search */}
      <section>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h5 fw-bold mb-0 text-success">أحدث المنتجات</h2>
          <input
            type="search"
            className="form-control"
            style={{ maxWidth: "280px" }}
            placeholder="ابحثي عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="alert alert-light border text-center">
            لا توجد منتجات مطابقة لبحثك.
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.slice(0, 12).map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}