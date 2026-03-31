import { Link } from "react-router-dom";

const JobExpiryPage = () => {
  return (
    <main className="portal-shell flex min-h-[calc(100vh-88px)] items-center justify-center py-12">
      <section className="glass-panel max-w-3xl rounded-[36px] p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-deep)]">
          Role unavailable
        </p>
        <h1 className="mt-4 text-5xl font-bold">This opening is no longer active.</h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          The job may have expired, been paused, or already been filled. The portal will
          always redirect candidates away from inactive postings.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
        >
          Browse active roles
        </Link>
      </section>
    </main>
  );
};

export default JobExpiryPage;
