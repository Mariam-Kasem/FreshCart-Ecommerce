import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function decodeUserIdFromToken(token) {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.id || parsed._id || parsed.userId || null;
  } catch {
    return null;
  }
}

export default function AllOrders() {
  const { token } = useAuth();
  const { cart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");
      const authToken = token || localStorage.getItem("userToken");
      const userId = decodeUserIdFromToken(authToken) || cart?.cartOwner;

      if (!userId) {
        setLoading(false);
        setError("تعذر تحديد هوية المستخدم لعرض الطلبات");
        return;
      }

      try {
        const { data } = await axiosInstance.get(`/orders/user/${userId}`);
        setOrders(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "تعذر تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [token, cart]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">جاري تحميل الطلبات...</p>
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

  if (!orders || orders.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: "500px" }}>
          <h3 className="h5 fw-bold mb-2">لا توجد طلبات حتى الآن</h3>
          <p className="text-muted small mb-4">
            ابدئي بإضافة منتجات للعربة وأتممي أول طلب لكِ.
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
      <h2 className="h4 fw-bold text-success mb-4">طلباتي (All Orders)</h2>

      <div className="d-flex flex-column gap-3">
        {orders.map((order) => (
          <div key={order._id} className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3 gap-2">
                <div>
                  <span className="text-muted small d-block">
                    رقم الطلب: <strong>#{order.id || order._id}</strong>
                  </span>
                  <span className="small text-muted">
                    طريقة الدفع: <strong>{order.paymentMethodType}</strong>
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <span
                    className={`badge ${
                      order.isPaid ? "bg-success" : "bg-warning text-dark"
                    }`}
                  >
                    {order.isPaid ? "تم الدفع" : "لم يُدفع بعد"}
                  </span>
                  <span
                    className={`badge ${
                      order.isDelivered ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {order.isDelivered ? "تم التوصيل" : "قيد التوصيل"}
                  </span>
                </div>
              </div>

              <div className="row g-3 mb-3">
                {order.cartItems?.map((item) => (
                  <div key={item._id} className="col-12 col-sm-6 col-md-4">
                    <div className="d-flex align-items-center gap-2 border rounded p-2">
                      <img
                        src={item.product?.imageCover}
                        alt={item.product?.title}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                      />
                      <div className="overflow-hidden">
                        <p className="small fw-bold text-truncate mb-0">
                          {item.product?.title}
                        </p>
                        <span className="small text-muted">
                          الكمية: {item.count} × {item.price} EGP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="small text-muted">
                  المدينة: {order.shippingAddress?.city || "—"}
                </span>
                <span className="fw-bold text-success">
                  الإجمالي: {order.totalOrderPrice} EGP
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}