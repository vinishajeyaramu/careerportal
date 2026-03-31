import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const loginUrl = import.meta.env.VITE_LOGIN_URL;
const forgotPasswordUrl = import.meta.env.VITE_FORGOT_PASSWORD_URL;

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleChanges = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(loginUrl, values);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("username", response.data.user.username);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your username and password and try again.");
    }
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(forgotPasswordUrl, { email: forgotPasswordEmail });
      if (response.status === 200) {
        alert("Password reset email sent. Please check your inbox.");
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-[var(--admin-line)] bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-[linear-gradient(145deg,#17324d,#245a87)] p-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">Admin login</p>
          <h1 className="mt-4 text-4xl font-bold">Career portal control center.</h1>
          <p className="mt-5 max-w-md text-sm leading-8 text-blue-100">
            Manage roles, candidates, categories, locations, and hiring operations from one
            cleaner admin workspace.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Role and candidate management",
              "Express + PostgreSQL powered flow",
              "Improved visibility across admin actions",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-[var(--admin-ink)]">Sign in</h2>
          <p className="mt-2 text-sm text-[var(--admin-muted)]">
            Use your admin credentials to access the panel.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--admin-muted)]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your admin email"
                  onChange={handleChanges}
                  className="admin-input pl-11"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[var(--admin-muted)]">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChanges}
                  className="admin-input pl-11 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-btn admin-btn-primary w-full">
              Continue to dashboard
            </button>

            <button
              type="button"
              className="text-sm font-semibold text-[var(--admin-accent)]"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot password?
            </button>
          </form>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-bold">Reset password</h2>
            <p className="mt-2 text-sm text-[var(--admin-muted)]">
              Enter your email to receive a reset link.
            </p>
            <form onSubmit={handleForgotPasswordSubmit} className="mt-6 space-y-4">
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(event) => setForgotPasswordEmail(event.target.value)}
                className="admin-input"
                placeholder="Enter your email"
              />
              <button type="submit" className="admin-btn admin-btn-primary w-full">
                Send reset link
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary w-full"
                onClick={() => setShowForgotPassword(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
