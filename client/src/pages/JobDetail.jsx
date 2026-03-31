import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useAuth } from "../context/AuthContext";

const JobDetail = () => {
  const { id, jobtitle } = useParams();
  const jobUrl = import.meta.env.VITE_JOB_URL;
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate } = useAuth();
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${jobUrl}/${id}`);
        if (!response.data || response.data.job_status !== "Active") {
          navigate("/expired");
          return;
        }
        setJobDetail(response.data);
      } catch (error) {
        console.log(error);
        navigate("/expired");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, jobUrl, navigate]);

  const isClosed = useMemo(() => {
    if (!jobDetail?.job_close_date) {
      return false;
    }
    return Date.now() > new Date(jobDetail.job_close_date).getTime();
  }, [jobDetail]);

  if (loading || !jobDetail) {
    return <LoadingPage />;
  }

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { redirectTo: `/job/${jobDetail.job_id}/${jobtitle}/apply` } });
      return;
    }

    if (!isCandidate) {
      navigate("/signin");
      return;
    }

    navigate(`/job/${jobDetail.job_id}/${jobtitle}/apply`);
  };

  return (
    <main className="portal-shell py-10">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-deep)]"
      >
        <FiArrowLeft />
        Back to all jobs
      </Link>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="glass-panel rounded-[34px] p-5 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-deep)]">
                {jobDetail.job_category || "Open role"}
              </span>
              <span className="rounded-full border border-[var(--line)] bg-white/90 px-4 py-2 text-xs font-semibold text-[var(--muted)]">
                {jobDetail.job_status}
              </span>
            </div>

            <h1 className="mt-5 text-balance text-3xl font-bold md:text-5xl">{jobDetail.job_title}</h1>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <span className="inline-flex items-center gap-2">
                <FiMapPin className="text-[var(--accent)]" />
                {jobDetail.job_location}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiBriefcase className="text-[var(--accent)]" />
                {Array.isArray(jobDetail.job_type) ? jobDetail.job_type.join(", ") : jobDetail.job_type}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiDollarSign className="text-[var(--accent)]" />
                {jobDetail.job_budget || "Discuss on interview"}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiUser className="text-[var(--accent)]" />
                {jobDetail.job_created_by || "Hiring team"}
              </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-[24px] bg-white/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Experience</p>
                <p className="mt-2 text-lg font-bold">{jobDetail.job_experience_level} years</p>
              </div>
              <div className="rounded-[24px] bg-white/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Qualification</p>
                <p className="mt-2 text-lg font-bold break-words">{Array.isArray(jobDetail.job_education_qualification) ? jobDetail.job_education_qualification.join(", ") : jobDetail.job_education_qualification}</p>
              </div>
              <div className="rounded-[24px] bg-white/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Posted</p>
                <p className="mt-2 text-lg font-bold">{jobDetail.job_create_date}</p>
              </div>
              <div className="rounded-[24px] bg-white/85 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Apply by</p>
                <p className="mt-2 text-lg font-bold">{jobDetail.job_close_date || "Open until filled"}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[34px] p-5 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold">About this job</h2>
            <div
              className="prose prose-neutral mt-5 max-w-none text-[var(--muted)] prose-p:leading-8 prose-li:leading-8"
              dangerouslySetInnerHTML={{ __html: jobDetail.job_description }}
            />
          </div>

          <div className="glass-panel rounded-[34px] p-5 sm:p-8">
            <h2 className="text-2xl font-bold">Required skills</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {(jobDetail.job_technical_skills || []).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--muted)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="glass-panel sticky top-24 rounded-[34px] p-5 sm:p-8">
            <h2 className="text-2xl font-bold">Job overview</h2>

            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-sm font-semibold text-[var(--muted)]">Company / team</dt>
                <dd className="mt-1 text-lg font-bold">{jobDetail.job_created_by || "Hiring team"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-[var(--muted)]">Interview rounds</dt>
                <dd className="mt-1 text-lg font-bold">{jobDetail.job_interview_rounds || "Will be shared later"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-[var(--muted)]">Location type</dt>
                <dd className="mt-1 text-lg font-bold">
                  {Array.isArray(jobDetail.job_location_type)
                    ? jobDetail.job_location_type.join(", ")
                    : jobDetail.job_location_type || "Flexible"}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handleApply}
              disabled={isClosed}
              className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-semibold transition ${
                isClosed
                  ? "cursor-not-allowed bg-gray-300 text-gray-600"
                  : "bg-[var(--ink)] text-white hover:bg-[var(--accent-deep)]"
              }`}
            >
              {isClosed ? "Role closed" : "Apply for this job"}
              {!isClosed && <FiArrowRight />}
            </button>

            <div className="mt-6 rounded-[24px] bg-[var(--accent-soft)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
                Before applying
              </p>
              <ul className="mt-3 space-y-3 text-sm leading-7 text-[var(--muted)]">
                <li className="flex gap-2">
                  <FiCheckCircle className="mt-1 text-[var(--accent)]" />
                  Keep your resume ready in PDF format.
                </li>
                <li className="flex gap-2">
                  <FiCheckCircle className="mt-1 text-[var(--accent)]" />
                  Add LinkedIn and portfolio details in the form.
                </li>
                <li className="flex gap-2">
                  <FiCheckCircle className="mt-1 text-[var(--accent)]" />
                  Review the required skills before submitting.
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default JobDetail;
