import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: newPassword
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  async function handleSendEmail(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axiosInstance.post("/auth/forgotPasswords", {
        email,
      });
      if (data.statusMsg === "success") {
        toast.success(data.message || "تم إرسال كود التحقق إلى بريدك الإلكتروني");
        setStep(2);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "تعذر إرسال الكود، تأكد من البريد");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axiosInstance.post("/auth/verifyResetCode", {
        resetCode: resetCode.trim(),
      });
      if (data.status === "Success") {
        toast.success("تم التحقق من الكود بنجاح");
        setStep(3);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "الكود غير صحيح أو منتهي الصلاحية");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axiosInstance.put("/auth/resetPassword", {
        email,
        newPassword,
      });
      if (data.token) {
        toast.success("تم تغيير كلمة المرور بنجاح! سجل دخولك الآن");
        navigate("/login");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "تعذر تحديث كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: "420px" }}>
        <div className="card-body p-4">
          <h2 className="h4 fw-bold text-center text-success mb-3">
            استرجاع كلمة المرور
          </h2>
          <p className="text-muted small text-center mb-4">
            {step === 1 && "أدخل بريدك الإلكتروني لاستلام كود التحقق"}
            {step === 2 && "أدخل الكود الذي تم إرساله إلى بريدك الإلكتروني"}
            {step === 3 && "أدخل كلمة المرور الجديدة"}
          </p>

          {errorMsg && (
            <div className="alert alert-danger py-2 small" role="alert">
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendEmail}>
              <div className="mb-3">
                <label className="form-label fw-medium">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="example@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success w-100 py-2 fw-semibold"
              >
                {isLoading ? "جاري الإرسال..." : "إرسال الكود"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <div className="mb-3">
                <label className="form-label fw-medium">كود التحقق (Reset Code)</label>
                <input
                  type="text"
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="form-control"
                  placeholder="أدخل الكود"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success w-100 py-2 fw-semibold"
              >
                {isLoading ? "جاري التحقق..." : "تأكيد الكود"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="form-label fw-medium">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  placeholder="مثال: Ali12345"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success w-100 py-2 fw-semibold"
              >
                {isLoading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
              </button>
            </form>
          )}

          <div className="text-center mt-3">
            <Link
              to="/login"
              className="small text-success text-decoration-none fw-semibold"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}