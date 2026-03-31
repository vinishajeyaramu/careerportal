import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { FiArrowRight, FiBriefcase, FiCalendar, FiExternalLink, FiMapPin } from "react-icons/fi";
import LoadingPage from "./LoadingPage";
import { useAuth } from "../context/AuthContext";
import { getAuthHeaders, serverBaseUrl } from "../lib/api";

const AppliedJobs = () => {
  const location = useLocation();
  const { isAuthenticated, isCandidate, loading, token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!token || !isCandidate) {
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);
        const response = await axios.get(`${serverBaseUrl}/auth/client/applied-jobs`, {
          headers: getAuthHeaders(token),
        });
        setApplications(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load applied jobs.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [isCandidate, token]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }

  if (!isCandidate) {
    return (
      <main className="portal-shell py-12">
        <section className="glass-panel rounded-[36px] p-10 text-center">
          <h1 className="text-3xl font-bold">Applied jobs are available for candidate accounts.</h1>
          <p className="mt-4 text-[var(--muted)]">
            Admin users can manage job posts from the admin panel instead.
          </p>
        </section>
      </main>
    );
  }

  if (pageLoading) {
    return <LoadingPage />;
  }

  return (
    <main className="portal-shell py-10">
      <section className="mb-8 rounded-[36px] bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] lg:p-10">
        <p className="section-kicker !border-white/20 !bg-white/10 !text-white">Application history</p>
        <h1 className="mt-4 text-4xl font-bold">Track every role you have applied for.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
          This page reads directly from your saved applications, so each submission you make while signed in appears here automatically.
        </p>
      </section>

      {error ? (
        <div className="glass-panel rounded-[30px] p-8 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-panel rounded-[30px] p-10 text-center">
          <h2 className="text-2xl font-bold">No applications yet</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Explore open roles, apply to the ones you like, and they will appear here.
          </p>
          <Link to="/jobs" className="primary-cta mx-auto mt-6 w-fit">
            Explore all jobs
            <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {applications.map((application) => (
            <article key={application.application_id} className="job-card">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="job-badge">{application.job_category || "Open role"}</span>
                    <span className="job-badge job-badge-muted">{application.job_status || "Applied"}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">{application.job_title}</h2>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                    <span className="inline-flex items-center gap-2">
                      <FiBriefcase className="text-[var(--accent)]" />
                      {application.job_created_by || "Hiring team"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FiMapPin className="text-[var(--accent)]" />
                      {application.job_location || "Flexible"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FiCalendar className="text-[var(--accent)]" />
                      Applied on {new Date(application.applied_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to={`/job/${application.job_id}/${application.job_title}`} className="secondary-cta">
                    View job
                    <FiExternalLink />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default AppliedJobs;
