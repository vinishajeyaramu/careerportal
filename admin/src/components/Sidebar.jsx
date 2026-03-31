import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Briefcase, LayoutDashboard, LogOut, MapPin, Menu, Users, X, Layers3, UserCheck } from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const navItems = useMemo(() => {
    const items = [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/jobpost", label: "Job Posts", icon: Briefcase },
      { to: "/candidates", label: "Candidates", icon: UserCheck },
      { to: "/location", label: "Locations", icon: MapPin },
      { to: "/category", label: "Categories", icon: Layers3 },
    ];

    if (email === "dineshmoorthi757@gmail.com") {
      items.push({ to: "/users", label: "Users", icon: Users });
    }

    return items;
  }, [email]);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--admin-line)] bg-[rgba(255,252,247,0.82)] px-4 py-4 backdrop-blur-xl lg:hidden">
        <div>
          <p className="font-['Sora'] text-lg font-bold">Admin Studio</p>
          <p className="text-sm text-[var(--admin-muted)]">Career operations</p>
        </div>
        <button
          type="button"
          className="admin-icon-btn"
          onClick={() => setIsSidebarOpen((value) => !value)}
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-80 transform border-r border-[var(--admin-line)] bg-[rgba(255,252,247,0.95)] px-5 py-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="rounded-[28px] bg-[linear-gradient(135deg,#17324d,#245a87)] p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Sora'] text-2xl font-bold">Admin Studio</p>
                <p className="mt-1 text-sm text-blue-100">Career portal control center</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/20 p-2 text-white lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm">
              <p className="font-semibold">{username || "Admin"}</p>
              <p className="mt-1 break-all text-blue-100">{email}</p>
            </div>
          </div>

          <nav className="mt-6 flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--admin-accent-soft)] text-[var(--admin-accent-deep)]"
                      : "text-[var(--admin-muted)] hover:bg-white hover:text-[var(--admin-ink)]"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button type="button" onClick={handleLogout} className="admin-btn admin-btn-danger mt-4 w-full">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
