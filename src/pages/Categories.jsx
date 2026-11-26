import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCategories() {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get("/categories");
      setCategories(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحميل الفئات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">جاري تحميل الفئات...</p>
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
      <h2 className="h4 fw-bold mb-4 text-success">الفئات (Categories)</h2>
      <div className="row g-4">
        {categories.map((category) => (
          <div key={category._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link
              to={`/categories/${category._id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm border-0 text-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h6 className="card-title fw-bold mb-0">{category.name}</h6>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}