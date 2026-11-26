import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    numOfCartItems,
    loadingCart,
    updateItemCount,
    removeCartItem,
    clearCart,
  } = useCart();

  if (loadingCart) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">جاري تحميل السلة...</p>
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: "500px" }}>
          <h3 className="h5 fw-bold mb-2">سلة التسوق فارغة</h3>
          <p className="text-muted small mb-4">
            لم تقومي بإضافة أي منتجات إلى العربة بعد.
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
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h2 className="h4 fw-bold text-success mb-1">سلة التسوق (Cart)</h2>
          <p className="text-muted small mb-0">
            عدد العناصر: <strong>{numOfCartItems}</strong> | الإجمالي:{" "}
            <strong className="text-success">{cart.totalCartPrice} EGP</strong>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-outline-danger btn-sm"
        >
          تفريغ السلة
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {cart.products.map((item) => (
              <div key={item._id} className="card border-0 shadow-sm">
                <div className="card-body d-flex flex-column flex-sm-row align-items-center gap-3">
                  <img
                    src={item.product?.imageCover}
                    alt={item.product?.title}
                    style={{ width: "85px", height: "85px", objectFit: "contain" }}
                  />
                  <div className="flex-grow-1 text-center text-sm-start">
                    <h6 className="fw-bold mb-1">{item.product?.title}</h6>
                    <p className="text-muted small mb-1">
                      سعر الوحدة: {item.price} EGP
                    </p>
                    <button
                      onClick={() => removeCartItem(item.product?._id)}
                      className="btn btn-link text-danger p-0 small text-decoration-none"
                    >
                      حذف المنتج
                    </button>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      onClick={() =>
                        updateItemCount(item.product?._id, item.count - 1)
                      }
                      className="btn btn-outline-secondary btn-sm px-2"
                    >
                      -
                    </button>
                    <span className="fw-bold px-2">{item.count}</span>
                    <button
                      onClick={() =>
                        updateItemCount(item.product?._id, item.count + 1)
                      }
                      className="btn btn-outline-secondary btn-sm px-2"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">ملخص الطلب</h5>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">إجمالي المنتجات</span>
              <span>{numOfCartItems}</span>
            </div>
            <div className="d-flex justify-content-between border-top pt-3 mb-4">
              <span className="fw-bold">الإجمالي الكلي</span>
              <span className="fw-bold text-success fs-5">
                {cart.totalCartPrice} EGP
              </span>
            </div>
            <Link
              to="/checkout"
              className="btn btn-success w-100 py-2 fw-semibold"
            >
              إتمام الطلب (Checkout)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}