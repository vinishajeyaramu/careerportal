import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiBriefcase, FiLogOut, FiMenu, FiUser, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { adminPanelUrl } from "../../lib/api";

const publicLinks = [
  { label: "Home", to: "/" },
  { label: "Explore Jobs", to: "/jobs" },
  { label: "Applied Jobs", to: "/applied-jobs" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, isAdmin, logout } = useAuth();

  const closeMenu = () => setOpen(false);

  const renderNavLinks = () =>
    publicLinks.map((item) => (
      <NavLink
        key={item.label}
        to={item.to}
        onClick={closeMenu}
        className={({ isActive }) =>
          `text-sm font-semibold transition ${isActive ? "text-[var(--brand)]" : "text-slate-600 hover:text-[var(--brand)]"}`
        }
      >
        {item.label}
      </NavLink>
    ));

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="portal-shell flex flex-wrap items-center justify-between gap-3 py-3 text-sm text-slate-600">
          <p>Search jobs by skills, company, location, salary, and experience in real time.</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-slate-700">
              <FiBriefcase className="text-[var(--brand)]" />
              Live career portal
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="portal-shell flex items-center justify-between gap-6 py-5">
          <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
            <div className="brand-mark">J</div>
            <div>
              <p className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">JobNova</p>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                Search-first careers
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">{renderNavLinks()}</nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAdmin && (
              <a href={adminPanelUrl} className="secondary-cta">
                Post Job
              </a>
            )}

            {isAuthenticated ? (
              <>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  <FiUser className="text-[var(--brand)]" />
                  {user?.username || user?.email}
                </div>
                <button type="button" onClick={logout} className="secondary-cta">
                  <FiLogOut />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/signin" className="secondary-cta">
                  Sign In
                </NavLink>
                <NavLink to="/signup" className="primary-cta">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex rounded-full border border-slate-200 p-3 text-slate-800 lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-b border-slate-200 bg-white lg:hidden">
          <div className="portal-shell flex flex-col gap-4 py-4">
            {renderNavLinks()}
            {isAdmin && (
              <a href={adminPanelUrl} className="secondary-cta justify-center">
                Post Job
              </a>
            )}
            {isAuthenticated ? (
              <button type="button" onClick={logout} className="secondary-cta justify-center">
                <FiLogOut />
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/signin" onClick={closeMenu} className="secondary-cta justify-center">
                  Sign In
                </NavLink>
                <NavLink to="/signup" onClick={closeMenu} className="primary-cta justify-center">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
