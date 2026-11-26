import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      setError("");
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data.data);
        setSelectedImage(data.data?.imageCover || "");
      } catch (err) {
        setError(err.response?.data?.message || "تعذر تحميل تفاصيل المنتج");
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetails();
  }, [id]);

  async function handleAddToCart() {
    if (!product?._id) return;
    setAddingToCart(true);
    await addToCart(product._id);
    setAddingToCart(false);
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || "المنتج غير موجود"}</div>
        <Link to="/products" className="btn btn-outline-success">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4 align-items-center">
        <div className="col-md-5 text-center">
          <img
            src={selectedImage || product.imageCover}
            alt={product.title}
            className="img-fluid rounded shadow-sm mb-3"
            style={{ maxHeight: "360px", objectFit: "contain" }}
          />
          {product.images?.length > 0 && (
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`img-thumbnail ${
                    selectedImage === img ? "border-success border-2" : ""
                  }`}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-md-7">
          <span className="badge bg-success-subtle text-success mb-2">
            {product.category?.name} • {product.brand?.name}
          </span>
          <h2 className="h3 fw-bold">{product.title}</h2>
          <p className="text-muted mt-3">{product.description}</p>

          <div className="d-flex align-items-center gap-4 my-4">
            <span className="h4 fw-bold text-success mb-0">
              {product.price} EGP
            </span>
            <span className="text-warning fw-semibold">
              ★ {product.ratingsAverage} ({product.ratingsQuantity} تقييم)
            </span>
          </div>

          <div className="d-flex gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="btn btn-success px-4 py-2 fw-semibold"
            >
              {addingToCart ? "جاري الإضافة..." : "+ إضافة إلى العربة"}
            </button>
            <button
              type="button"
              className="btn btn-outline-danger px-3 py-2"
            >
              ♥ المفضلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}