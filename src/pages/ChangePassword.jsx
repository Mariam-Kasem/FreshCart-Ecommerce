import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("كلمة المرور الحالية مطلوبة"),
    password: Yup.string()
      .matches(
        /^[A-Z][a-z0-9]{5,}$/,
        "كلمة المرور الجديدة لازم تبدأ بحرف كابتل وتكون 6 أحرف أو أرقام على الأقل"
      )
      .required("كلمة المرور الجديدة مطلوبة"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "تأكيد كلمة المرور غير مطابق")
      .required("تأكيد كلمة المرور مطلوب"),
  });

  async function handleChangePassword(values) {
    const authToken = token || localStorage.getItem("userToken");
    if (!authToken) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axiosInstance.put("/users/changeMyPassword", values, {
        headers: { token: authToken },
      });
      if (data.message === "success") {
        toast.success("تم تغيير كلمة المرور بنجاح! يرجى تسجيل الدخول مجدداً");
        logout();
        navigate("/login");
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: handleChangePassword,
  });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: "420px" }}>
        <div className="card-body p-4">
          <h2 className="h4 fw-bold text-center text-success mb-4">
            تغيير كلمة المرور
          </h2>

          {errorMsg && (
            <div className="alert alert-danger py-2 small" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium">كلمة المرور الحالية</label>
              <input
                type="password"
                name="currentPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.currentPassword}
                className={`form-control ${
                  formik.touched.currentPassword && formik.errors.currentPassword
                    ? "is-invalid"
                    : ""
                }`}
              />
              {formik.touched.currentPassword && formik.errors.currentPassword && (
                <div className="invalid-feedback">
                  {formik.errors.currentPassword}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">كلمة المرور الجديدة</label>
              <input
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
              <label className="form-label fw-medium">تأكيد كلمة المرور الجديدة</label>
              <input
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

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-success w-100 py-2 fw-semibold"
            >
              {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}