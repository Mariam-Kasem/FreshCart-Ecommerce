import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string().required("كلمة المرور مطلوبة"),
  });

  async function handleLogin(values) {
    setIsLoading(true);
    setApiError("");
    try {
      const { data } = await axiosInstance.post("/auth/signin", values);
      if (data.message === "success" && data.token) {
        saveToken(data.token);
        toast.success("تم تسجيل الدخول بنجاح!");
        navigate("/");
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: "420px" }}>
        <div className="card-body p-4">
          <h2 className="h4 fw-bold text-center text-success mb-4">
            تسجيل الدخول
          </h2>

          {apiError && (
            <div className="alert alert-danger py-2 small" role="alert">
              {apiError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label fw-medium">
                البريد الإلكتروني
              </label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="form-label fw-medium">
                كلمة المرور
              </label>
              <input
                id="login-password"
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

            <div className="d-flex justify-content-end mb-3">
              <Link
                to="/forgot-password"
                className="small text-success text-decoration-none"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-success w-100 py-2 fw-semibold"
            >
              {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <p className="text-center text-muted small mt-3 mb-0">
            ليس لديكِ حساب؟{" "}
            <Link
              to="/register"
              className="text-success fw-semibold text-decoration-none"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}