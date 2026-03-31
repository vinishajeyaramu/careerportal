import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { adminPanelUrl } from "../lib/api";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [role, setRole] = useState("candidate");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = location.state?.redirectTo || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      const response = await login(formData, role);

      if (response.user?.role === "admin") {
        window.location.href = adminPanelUrl;
        return;
      }

      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="portal-shell py-10">
      <section className="auth-layout">
        <div className="auth-panel">
          <p className="section-kicker">Role-based access</p>
          <h1 className="mt-4 text-4xl font-bold">Sign in to continue your career journey.</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--muted)]">
            Candidates can search and track applications. Admins can sign in here too and jump straight to the posting dashboard.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: <FiUser />, label: "Candidate search" },
              { icon: <FiShield />, label: "Admin controls" },
              { icon: <FiArrowRight />, label: "Applied jobs" },
            ].map((item) => (
              <div key={item.label} className="info-tile">
                <span className="info-icon">{item.icon}</span>
                <p className="mt-3 text-sm font-semibold text-[var(--muted)]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-card">
          <div className="role-switch">
            {["candidate", "admin"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={role === item ? "role-chip active" : "role-chip"}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <label className="form-block">
              <span>Email</span>
              <div className="input-shell">
                <FiMail />
                <input
                  className="portal-input border-0 bg-transparent p-0 shadow-none"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="form-block">
              <span>Password</span>
              <div className="input-shell">
                <FiLock />
                <input
                  className="portal-input border-0 bg-transparent p-0 shadow-none"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
              </div>
            </label>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="primary-cta mt-6 w-full justify-center"
          >
            {submitting ? "Signing in..." : role === "admin" ? "Sign in as admin" : "Sign in"}
          </button>

          {role === "candidate" && (
            <p className="mt-5 text-sm text-[var(--muted)]">
              New here?{" "}
              <Link to="/signup" className="font-semibold text-[var(--accent-deep)]">
                Create an account
              </Link>
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default SignIn;
