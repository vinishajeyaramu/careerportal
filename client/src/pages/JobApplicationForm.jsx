import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiUploadCloud } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const candidatesUrl = import.meta.env.VITE_CANDIDATES_URL;

function JobApplicationForm() {
  const { id, jobtitle } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isCandidate, loading } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    linkedin: "",
    website: "",
    resume: null,
    cover: null,
    user_id: "",
    job_id: id,
    job_title: jobtitle,
  });
  const [errors, setErrors] = useState({});
  const [fileMessages, setFileMessages] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !isCandidate) {
      return;
    }

    const [firstName = "", ...restNames] = (user.username || "").split(" ");
    setFormData((previous) => ({
      ...previous,
      first_name: previous.first_name || user.first_name || firstName,
      last_name: previous.last_name || user.last_name || restNames.join(" "),
      email: previous.email || user.email || "",
      phone: previous.phone || user.phone || "",
      user_id: user.id || "",
    }));
  }, [isCandidate, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files?.[0];
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setErrors((previous) => ({ ...previous, [name]: "Only PDF files are allowed." }));
      setFileMessages((previous) => ({ ...previous, [name]: "" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({ ...previous, [name]: "File size should be less than 5MB." }));
      setFileMessages((previous) => ({ ...previous, [name]: "" }));
      return;
    }

    setErrors((previous) => ({ ...previous, [name]: "" }));
    setFileMessages((previous) => ({ ...previous, [name]: `${file.name} ready to upload` }));
    setFormData((previous) => ({ ...previous, [name]: file }));
  };

  const validateLinkedIn = (url) => /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i.test(url);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.first_name) nextErrors.first_name = "First name is required.";
    if (!formData.last_name) nextErrors.last_name = "Last name is required.";
    if (!formData.email) nextErrors.email = "Email is required.";
    if (!formData.phone) nextErrors.phone = "Phone number is required.";
    if (!formData.linkedin) {
      nextErrors.linkedin = "LinkedIn profile is required.";
    } else if (!validateLinkedIn(formData.linkedin)) {
      nextErrors.linkedin = "Enter a valid LinkedIn profile URL.";
    }
    if (!formData.website) nextErrors.website = "Portfolio or website is required.";
    if (!formData.resume) nextErrors.resume = "Resume is required.";
    if (!formData.cover) nextErrors.cover = "Cover letter is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });

    try {
      setSubmitting(true);
      await axios.post(candidatesUrl, payload);
      navigate("/success");
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors((previous) => ({ ...previous, form: "You have already applied for this job." }));
      } else {
        setErrors((previous) => ({
          ...previous,
          form: err.response?.data || "Failed to submit application.",
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClassName =
    "w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]";

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }

  if (!isCandidate) {
    return (
      <main className="portal-shell py-12">
        <section className="glass-panel rounded-[34px] p-6 sm:p-10 text-center">
          <h1 className="text-3xl font-bold">Only candidate accounts can apply for jobs.</h1>
          <p className="mt-4 text-[var(--muted)]">
            Admin users can manage openings from the admin panel, while candidate accounts can submit applications here.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="portal-shell py-10">
      <Link
        to={`/job/${id}/${jobtitle}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-deep)]"
      >
        <FiArrowLeft />
        Back to role details
      </Link>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="glass-panel rounded-[34px] p-5 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-deep)]">
            Application
          </p>
          <h1 className="mt-4 text-3xl font-bold text-balance sm:text-4xl">{jobtitle}</h1>
          <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
            Send the details your hiring team needs in one place. Resume and cover letter
            uploads are limited to PDF files up to 5MB each.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Personal information",
              "Resume and cover letter",
              "LinkedIn and portfolio links",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/80 p-4">
                <FiCheckCircle className="text-[var(--accent)]" />
                <span className="text-sm font-semibold text-[var(--muted)]">{item}</span>
              </div>
            ))}
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="glass-panel rounded-[34px] p-5 sm:p-8 lg:p-10">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--muted)]">First name</label>
              <input className={fieldClassName} name="first_name" value={formData.first_name} onChange={handleChange} />
              {errors.first_name && <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--muted)]">Last name</label>
              <input className={fieldClassName} name="last_name" value={formData.last_name} onChange={handleChange} />
              {errors.last_name && <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--muted)]">Email</label>
              <input className={fieldClassName} type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--muted)]">Phone</label>
              <input className={fieldClassName} type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--muted)]">LinkedIn profile</label>
              <input
                className={fieldClassName}
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/your-profile"
              />
              {errors.linkedin && <p className="mt-2 text-sm text-red-600">{errors.linkedin}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--muted)]">Portfolio or website</label>
              <input
                className={fieldClassName}
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
              {errors.website && <p className="mt-2 text-sm text-red-600">{errors.website}</p>}
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              { name: "resume", label: "Resume / CV" },
              { name: "cover", label: "Cover letter" },
            ].map((field) => (
              <div key={field.name} className="rounded-[28px] border border-dashed border-[var(--line)] bg-white/70 p-5">
                <label className="mb-3 block text-sm font-semibold text-[var(--muted)]">{field.label}</label>
                <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <FiUploadCloud className="text-[var(--accent)]" />
                  PDF only, max 5MB
                </div>
                <input className="mt-4 block w-full text-sm" type="file" name={field.name} onChange={handleFileChange} />
                {errors[field.name] && <p className="mt-2 text-sm text-red-600">{errors[field.name]}</p>}
                {fileMessages[field.name] && (
                  <p className="mt-2 text-sm text-green-700">{fileMessages[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {errors.form && <p className="mt-5 text-sm text-red-600">{errors.form}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-4 text-sm font-semibold ${
              submitting
                ? "cursor-not-allowed bg-gray-300 text-gray-700"
                : "bg-[var(--ink)] text-white transition hover:bg-[var(--accent-deep)]"
            }`}
          >
            {submitting ? "Submitting application..." : "Submit application"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default JobApplicationForm;
