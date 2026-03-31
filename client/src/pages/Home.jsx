import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiMapPin,
  FiSearch,
  FiUsers,
} from "react-icons/fi";
import JobSearchBoard from "../Components/JobSearchBoard";

const Home = () => {
  return (
    <main className="pb-16">
      <section className="hero-shell">
        <div className="portal-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="section-kicker">Modern job platform</p>
            <h1 className="mt-5 max-w-3xl text-balance text-5xl font-bold leading-[1.05] text-slate-950 md:text-7xl">
              Find the right jobs by skill, location, salary, role, and company in real time.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Inspired by the Jobes reference layout, this client is now built like a real careers site instead of a dashboard. Search instantly, browse featured openings, and jump into details in one click.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/jobs" className="primary-cta">
                Explore all jobs
                <FiArrowRight />
              </Link>
              <a href="#featured-jobs" className="secondary-cta">
                Start searching
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: <FiUsers />, value: "21k+", label: "Candidate visits" },
                { icon: <FiBriefcase />, value: "100+", label: "Live opportunities" },
                { icon: <FiBarChart2 />, value: "Real-time", label: "Search updates" },
              ].map((item) => (
                <div key={item.label} className="hero-stat">
                  <span className="info-icon">{item.icon}</span>
                  <p className="mt-4 text-3xl font-bold text-slate-900">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-search-box">
              <div className="search-pill">
                <FiSearch className="text-[var(--brand)]" />
                <span>Search jobs by title, skills, company, and salary</span>
              </div>
              <div className="mt-6 grid gap-4">
                {[
                  { icon: <FiBriefcase />, label: "Frontend Developer", meta: "Nova Hiring" },
                  { icon: <FiMapPin />, label: "Remote Node.js Engineer", meta: "Talent Grid" },
                  { icon: <FiBarChart2 />, label: "Product Designer", meta: "Bright Careers" },
                ].map((item) => (
                  <div key={item.label} className="hero-mini-card">
                    <span className="info-icon">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-shell py-10">
        <div className="company-strip">
          {["Nova Hiring", "Talent Grid", "Bright Careers", "FutureWorks", "Vertex Labs"].map((company) => (
            <div key={company} className="company-pill">
              {company}
            </div>
          ))}
        </div>
      </section>

      <section className="portal-shell py-6">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            { title: "Engineering", subtitle: "Frontend, backend, QA, DevOps" },
            { title: "Design", subtitle: "UI, UX, product, visual roles" },
            { title: "Marketing", subtitle: "Brand, growth, performance, content" },
            { title: "Operations", subtitle: "Support, recruiting, customer success" },
          ].map((category) => (
            <article key={category.title} className="category-card">
              <p className="section-kicker">{category.title}</p>
              <h3 className="mt-4 text-2xl font-bold text-slate-900">{category.title} jobs</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{category.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      <div id="featured-jobs">
        <JobSearchBoard
          heading="Latest featured jobs"
          subheading="A curated look at the first available active jobs, with live filters just like the reference-style portal."
          compactHeader
          limitResults={6}
        />
      </div>
    </main>
  );
};

export default Home;
