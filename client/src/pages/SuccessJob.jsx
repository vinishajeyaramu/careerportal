import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SuccessJob = () => {
  return (
    <main className="portal-shell flex min-h-[calc(100vh-88px)] items-center justify-center py-12">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel max-w-2xl rounded-[36px] p-10 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-soft)] text-3xl text-[var(--accent-deep)]">
          ✓
        </div>
        <h1 className="mt-6 text-4xl font-bold">Application submitted</h1>
        <p className="mt-4 text-base leading-8 text-[var(--muted)]">
          Thanks for applying. Your details have been sent to the hiring team, and because you submitted while signed in, this role is now visible in your Applied Jobs page.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white">
            Explore more roles
          </Link>
          <Link
            to="/applied-jobs"
            className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            View applied jobs
          </Link>
        </div>
      </motion.section>
    </main>
  );
};

export default SuccessJob;
