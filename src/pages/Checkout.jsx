import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cartId, cart, fetchCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash"); // "cash" | "online"
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    details: Yup.string()
      .min(5, "تفاصيل العنوان مطلوبة")
      .required("تفاصيل العنوان مطلوبة"),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "رقم الهاتف لازم يكون رقم مصري صحيح")
      .required("رقم الهاتف مطلوب"),
    city: Yup.string().min(2, "المدينة مطلوبة").required("المدينة مطلوبة"),
  });

  async function handleCheckout(values) {
    const authToken = token || localStorage.getItem("userToken");
    if (!authToken) {
      toast.error("سجلي دخولك أولاً");
      navigate("/login");
      return;
    }

    if (!cartId) {
      toast.error("سلة التسوق فارغة");
      navigate("/cart");
      return;
    }

    setIsSubmitting(true);
    try {
      const headers = { token: authToken };
      const payload = { shippingAddress: values };

      if (paymentMethod === "cash") {
        const { data } = await axiosInstance.post(
          `/orders/${cartId}`,
          payload,
          { headers }
        );
        if (data.status === "success") {
          toast.success("تم إنشاء الطلب بنجاح (الدفع عند الاستلام)!");
          await fetchCart();
          navigate("/allorders");
        }
      } else {
        const currentOrigin = window.location.origin;
        const { data } = await axiosInstance.post(
          `/orders/checkout-session/${cartId}?url=${encodeURIComponent(
            currentOrigin
          )}`,
          payload,
          { headers }
        );
        if (data.status === "success" && data.session?.url) {
          window.location.href = data.session.url;
        } else {
          toast.error("تعذر بدء جلسة الدفع الإلكتروني");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إتمام الطلب");
    } finally {
      setIsSubmitting(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      details: "",
      phone: "",
      city: "",
    },
    validationSchema,
    onSubmit: handleCheckout,
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="h4 fw-bold text-success mb-3">إتمام الطلب (Checkout)</h2>

            {cart && (
              <div className="alert alert-light border d-flex justify-content-between align-items-center mb-4">
                <span className="small text-muted">الإجمالي المطلوب:</span>
                <strong className="text-success fs-6">
                  {cart.totalCartPrice} EGP
                </strong>
              </div>
            )}

            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">المدينة (City)</label>
                <input
                  type="text"
                  name="city"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                  className={`form-control ${
                    formik.touched.city && formik.errors.city ? "is-invalid" : ""
                  }`}
                  placeholder="مثال: Cairo"
                />
                {formik.touched.city && formik.errors.city && (
                  <div className="invalid-feedback">{formik.errors.city}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">رقم الهاتف (Phone)</label>
                <input
                  type="tel"
                  name="phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className={`form-control ${
                    formik.touched.phone && formik.errors.phone ? "is-invalid" : ""
                  }`}
                  placeholder="01012345678"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="invalid-feedback">{formik.errors.phone}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">
                  تفاصيل العنوان (Address Details)
                </label>
                <textarea
                  rows="3"
                  name="details"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.details}
                  className={`form-control ${
                    formik.touched.details && formik.errors.details
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="الشارع، رقم العمارة، الدور..."
                />
                {formik.touched.details && formik.errors.details && (
                  <div className="invalid-feedback">{formik.errors.details}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium d-block">طريقة الدفع</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="payCash"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                    />
                    <label className="form-check-label" htmlFor="payCash">
                      الدفع عند الاستلام (Cash)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="payOnline"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                    />
                    <label className="form-check-label" htmlFor="payOnline">
                      دفع إلكتروني (Online)
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-success w-100 py-2 fw-semibold"
              >
                {isSubmitting
                  ? "جاري التنفيذ..."
                  : paymentMethod === "cash"
                  ? "تأكيد الطلب (Cash)"
                  : "الانتقال للدفع الإلكتروني"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}