import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchBrands() {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get("/brands");
      setBrands(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحميل العلامات التجارية");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">جاري تحميل العلامات التجارية...</p>
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
      <h2 className="h4 fw-bold mb-4 text-success">العلامات التجارية (Brands)</h2>
      <div className="row g-4">
        {brands.map((brand) => (
          <div key={brand._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link
              to={`/brands/${brand._id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm border-0 text-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="card-img-top p-3"
                  style={{ height: "180px", objectFit: "contain" }}
                />
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h6 className="card-title fw-bold mb-0">{brand.name}</h6>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}