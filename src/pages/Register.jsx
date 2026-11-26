import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "الاسم لازم يكون 3 حروف على الأقل")
      .max(25, "الاسم طويل جداً")
      .required("الاسم مطلوب"),
    email: Yup.string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .matches(
        /^[A-Z][a-z0-9]{5,}$/,
        "كلمة المرور لازم تبدأ بحرف كابتل وتكون 6 حروف أو أرقام على الأقل"
      )
      .required("كلمة المرور مطلوبة"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "تأكيد كلمة المرور غير مطابق")
      .required("تأكيد كلمة المرور مطلوب"),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "رقم الهاتف لازم يكون رقم مصري صحيح")
      .required("رقم الهاتف مطلوب"),
  });

  async function handleRegister(values) {
    setIsLoading(true);
    setApiError("");
    try {
      const { data } = await axiosInstance.post("/auth/signup", values);
      if (data.message === "success") {
        toast.success("تم إنشاء الحساب بنجاح! سجل دخولك الآن");
        navigate("/login");
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: "450px" }}>
        <div className="card-body p-4">
          <h2 className="h4 fw-bold text-center text-success mb-4">
            إنشاء حساب جديد
          </h2>

          {apiError && (
            <div className="alert alert-danger py-2 small" role="alert">
              {apiError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-medium">
                الاسم
              </label>
              <input
                id="name"
                type="text"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className={`form-control ${
                  formik.touched.name && formik.errors.name ? "is-invalid" : ""
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`form-control ${
                  formik.touched.email && formik.errors.email ? "is-invalid" : ""
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-medium">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`form-control ${
                  formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="rePassword" className="form-label fw-medium">
                تأكيد كلمة المرور
              </label>
              <input
                id="rePassword"
                type="password"
                name="rePassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rePassword}
                className={`form-control ${
                  formik.touched.rePassword && formik.errors.rePassword
                    ? "is-invalid"
                    : ""
                }`}
              />
              {formik.touched.rePassword && formik.errors.rePassword && (
                <div className="invalid-feedback">{formik.errors.rePassword}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label fw-medium">
                رقم الهاتف
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className={`form-control ${
                  formik.touched.phone && formik.errors.phone ? "is-invalid" : ""
                }`}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="invalid-feedback">{formik.errors.phone}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-success w-100 py-2 fw-semibold"
            >
              {isLoading ? "جاري التسجيل..." : "إنشاء حساب"}
            </button>
          </form>

          <p className="text-center text-muted small mt-3 mb-0">
            لديكِ حساب بالفعل؟{" "}
            <Link to="/login" className="text-success fw-semibold text-decoration-none">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}