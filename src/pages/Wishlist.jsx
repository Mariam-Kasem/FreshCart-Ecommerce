import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { wishlistItems, loadingWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loadingWishlist) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">جاري تحميل المفضلة...</p>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: "500px" }}>
          <h3 className="h5 fw-bold mb-2">قائمة المفضلة فارغة</h3>
          <p className="text-muted small mb-4">
            لم تقومي بإضافة أي منتجات إلى المفضلة بعد.
          </p>
          <Link to="/products" className="btn btn-success px-4">
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="h4 fw-bold text-success mb-4">
        المفضلة (Wishlist) • {wishlistItems.length}
      </h2>

      <div className="row g-4">
        {wishlistItems.map((item) => (
          <div key={item._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm border-0">
              <Link
                to={`/products/${item._id}`}
                className="text-decoration-none text-dark"
              >
                <img
                  src={item.imageCover}
                  alt={item.title}
                  className="card-img-top p-3"
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <div className="card-body pb-2">
                  <span className="text-success small fw-semibold d-block mb-1">
                    {item.category?.name}
                  </span>
                  <h6 className="card-title fw-bold text-truncate" title={item.title}>
                    {item.title}
                  </h6>
                  <span className="fw-bold text-dark">{item.price} EGP</span>
                </div>
              </Link>
              <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-3 d-flex gap-2">
                <button
                  onClick={() => addToCart(item._id)}
                  className="btn btn-success btn-sm flex-grow-1 fw-semibold"
                >
                  + Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="btn btn-outline-danger btn-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}