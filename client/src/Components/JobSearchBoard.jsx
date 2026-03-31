import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiSearch,
  FiShield,
  FiStar,
  FiUser,
} from "react-icons/fi";
import LoadingPage from "../pages/LoadingPage";

const jobUrl = import.meta.env.VITE_JOB_URL;
const locationUrl = import.meta.env.VITE_LOCATION_URL;
const categoryUrl = import.meta.env.VITE_CATEGORY_URL;

const JobSearchBoard = ({
  heading = "Featured jobs",
  subheading = "Discover live openings and refine results instantly.",
  compactHeader = false,
  limitResults,
}) => {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    skill: "",
    location: "",
    experience: "",
    salary: "",
    role: "",
    company: "",
    category: "",
  });

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        setLoading(true);
        const [jobsResponse, locationsResponse, categoriesResponse] = await Promise.all([
          axios.get(jobUrl),
          axios.get(locationUrl),
          axios.get(categoryUrl),
        ]);

        setJobs(jobsResponse.data || []);
        setLocations(locationsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        setError(err.message || "Unable to load jobs right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();
  }, []);

  const activeJobs = useMemo(() => {
    const today = new Date();
    return jobs.filter((job) => {
      const closeDate = job.job_close_date ? new Date(job.job_close_date) : null;
      return job.job_status === "Active" && (!closeDate || closeDate >= today);
    });
  }, [jobs]);

  const companyOptions = useMemo(
    () => [...new Set(activeJobs.map((job) => job.job_created_by).filter(Boolean))],
    [activeJobs]
  );

  const featuredSkills = useMemo(() => {
    const counts = new Map();

    activeJobs.forEach((job) => {
      (job.job_technical_skills || []).forEach((skill) => {
        counts.set(skill, (counts.get(skill) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill]) => skill);
  }, [activeJobs]);

  const parseBudgetValue = (budget) => {
    if (!budget) return null;
    const digits = String(budget).replace(/[^0-9]/g, "");
    return digits ? Number(digits) : null;
  };

  const filteredJobs = useMemo(() => {
    const results = activeJobs.filter((job) => {
      const skills = (job.job_technical_skills || []).join(" ").toLowerCase();
      const location = (job.job_location || "").toLowerCase();
      const role = (job.job_title || "").toLowerCase();
      const company = (job.job_created_by || "").toLowerCase();
      const category = (job.job_category || "").toLowerCase();
      const employmentType = Array.isArray(job.job_type)
        ? job.job_type.join(" ").toLowerCase()
        : String(job.job_type || "").toLowerCase();
      const budget = String(job.job_budget || "").toLowerCase();
      const experienceValue = Number(job.job_experience_level || 0);
      const budgetValue = parseBudgetValue(job.job_budget);
      const salaryFilterValue = Number(filters.salary);
      const experienceFilterValue = Number(filters.experience);

      const matchesSkill =
        !filters.skill || skills.includes(filters.skill.toLowerCase()) || role.includes(filters.skill.toLowerCase());
      const matchesLocation = !filters.location || location.includes(filters.location.toLowerCase());
      const matchesRole =
        !filters.role ||
        role.includes(filters.role.toLowerCase()) ||
        category.includes(filters.role.toLowerCase()) ||
        employmentType.includes(filters.role.toLowerCase());
      const matchesCompany = !filters.company || company.includes(filters.company.toLowerCase());
      const matchesCategory = !filters.category || category === filters.category.toLowerCase();
      const matchesExperience =
        !filters.experience || Number.isNaN(experienceFilterValue) || experienceValue <= experienceFilterValue;
      const matchesSalary =
        !filters.salary ||
        Number.isNaN(salaryFilterValue) ||
        (budgetValue ? budgetValue >= salaryFilterValue : budget.includes(filters.salary.toLowerCase()));

      return (
        matchesSkill &&
        matchesLocation &&
        matchesRole &&
        matchesCompany &&
        matchesCategory &&
        matchesExperience &&
        matchesSalary
      );
    });

    return limitResults ? results.slice(0, limitResults) : results;
  }, [activeJobs, filters, limitResults]);

  const updateFilter = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      skill: "",
      location: "",
      experience: "",
      salary: "",
      role: "",
      company: "",
      category: "",
    });
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <section className="portal-shell py-8">
        <div className="glass-panel rounded-[28px] p-8 text-center">
          <h3 className="text-2xl font-bold">Unable to load jobs</h3>
          <p className="mt-3 text-sm text-[var(--muted)]">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="portal-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="search-sidebar">
          {!compactHeader && (
            <>
              <p className="section-kicker">Advanced search</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{heading}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{subheading}</p>
            </>
          )}

          <div className={compactHeader ? "space-y-3" : "mt-6 space-y-3"}>
            <input
              className="portal-input"
              placeholder="Job title, skills, or keyword"
              value={filters.skill}
              onChange={(event) => updateFilter("skill", event.target.value)}
            />
            <input
              className="portal-input"
              placeholder="Location"
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
            />
            <input
              className="portal-input"
              placeholder="Experience in years"
              value={filters.experience}
              onChange={(event) => updateFilter("experience", event.target.value)}
            />
            <input
              className="portal-input"
              placeholder="Minimum salary"
              value={filters.salary}
              onChange={(event) => updateFilter("salary", event.target.value)}
            />
            <input
              className="portal-input"
              placeholder="Work role"
              value={filters.role}
              onChange={(event) => updateFilter("role", event.target.value)}
            />
            <input
              className="portal-input"
              list="company-options"
              placeholder="Company or hiring team"
              value={filters.company}
              onChange={(event) => updateFilter("company", event.target.value)}
            />
            <datalist id="company-options">
              {companyOptions.map((company) => (
                <option key={company} value={company} />
              ))}
            </datalist>
            <select
              className="portal-input"
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.category_id || category.category_title} value={category.category_title}>
                  {category.category_title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button type="button" onClick={resetFilters} className="secondary-cta">
              Reset filters
            </button>
            <span className="text-sm font-semibold text-slate-500">{filteredJobs.length} jobs</span>
          </div>

          <div className="mt-6 grid gap-3">
            {[
              { label: "Active jobs", value: activeJobs.length, icon: <FiSearch /> },
              { label: "Locations", value: locations.length, icon: <FiMapPin /> },
              { label: "Categories", value: categories.length, icon: <FiShield /> },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-4">
                <span className="info-icon">{item.icon}</span>
                <p className="mt-3 text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </aside>

        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-kicker">Live opportunities</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">{heading}</h2>
              <p className="mt-3 text-sm text-slate-600">{subheading}</p>
            </div>
            <p className="text-sm font-semibold text-slate-500">
              Showing {filteredJobs.length} of {activeJobs.length} active jobs
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {featuredSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => updateFilter("skill", skill)}
                className="tag-chip"
              >
                {skill}
              </button>
            ))}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="glass-panel mt-6 rounded-[30px] p-8 text-center">
              <h3 className="text-2xl font-bold">No roles match those filters yet</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Try broader keywords or reset the search to view all available openings.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5">
              {filteredJobs.map((job) => (
                <article key={job.job_id} className="job-card">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-2">
                        <span className="job-badge">{job.job_category || "Open role"}</span>
                        <span className="job-badge job-badge-muted">
                          {Array.isArray(job.job_type) ? job.job_type.join(", ") : job.job_type}
                        </span>
                      </div>

                      <h3 className="mt-5 text-3xl font-bold text-slate-900">{job.job_title}</h3>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <FiUser className="text-[var(--brand)]" />
                          {job.job_created_by || "Hiring team"}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <FiMapPin className="text-[var(--brand)]" />
                          {job.job_location}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <FiClock className="text-[var(--brand)]" />
                          {job.job_experience_level}+ years
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <FiDollarSign className="text-[var(--brand)]" />
                          {job.job_budget || "Discuss on interview"}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {(job.job_technical_skills || []).slice(0, 6).map((skill) => (
                          <span key={`${job.job_id}-${skill}`} className="tag-chip">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="job-card-side">
                      <p className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-soft)] px-4 py-2 text-sm font-semibold text-[var(--brand-dark)]">
                        <FiStar />
                        Featured match
                      </p>
                      <Link to={`/job/${job.job_id}/${job.job_title}`} className="primary-cta mt-5">
                        View Details
                        <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobSearchBoard;
