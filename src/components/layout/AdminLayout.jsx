import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  House,
  Target,
  LayoutGrid,
  Newspaper,
  FolderOpen,
  FileText,
  Image,
  ListOrdered,
  Settings,
  Languages,
  UserCog,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const items = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Home Page", to: "/admin/home-page", icon: House },
  { label: "Goals", to: "/admin/goals", icon: Target },
  { label: "Service Cards", to: "/admin/services", icon: LayoutGrid },
  { label: "Articles", to: "/admin/articles", icon: Newspaper },
  { label: "Documents", to: "/admin/documents", icon: FolderOpen },
  { label: "Pages", to: "/admin/pages", icon: FileText },
  { label: "Media Library", to: "/admin/media", icon: Image },
  { label: "Navigation", to: "/admin/navigation", icon: ListOrdered },
  { label: "Site Settings", to: "/admin/settings", icon: Settings },
  { label: "Languages", to: "/admin/languages", icon: Languages },
  { label: "Users and Roles", to: "/admin/users", icon: UserCog },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-sky-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-slate-800 px-5 text-lg font-bold text-white">
          SDG NSUMT Admin
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <button
            className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs uppercase text-slate-500">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
