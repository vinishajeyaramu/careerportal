import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await register(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="portal-shell py-10">
      <section className="auth-layout">
        <div className="auth-panel">
          <p className="section-kicker">Candidate account</p>
          <h1 className="mt-4 text-4xl font-bold">Create your profile and start applying faster.</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--muted)]">
            Once you sign up, you can track every submitted application from the Applied Jobs page and reuse your account across sessions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-card">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-block">
              <span>First name</span>
              <div className="input-shell">
                <FiUser />
                <input
                  className="portal-input border-0 bg-transparent p-0 shadow-none"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </div>
            </label>

            <label className="form-block">
              <span>Last name</span>
              <div className="input-shell">
                <FiUser />
                <input
                  className="portal-input border-0 bg-transparent p-0 shadow-none"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
            </label>

            <label className="form-block">
              <span>Phone</span>
              <div className="input-shell">
                <FiPhone />
                <input
                  className="portal-input border-0 bg-transparent p-0 shadow-none"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>
            </label>

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
          </div>

          <label className="form-block mt-4">
            <span>Password</span>
            <div className="input-shell">
              <FiLock />
              <input
                className="portal-input border-0 bg-transparent p-0 shadow-none"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
              />
            </div>
          </label>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="primary-cta mt-6 w-full justify-center">
            {submitting ? "Creating account..." : "Create account"}
            {!submitting && <FiArrowRight />}
          </button>

          <p className="mt-5 text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-[var(--accent-deep)]">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default SignUp;
