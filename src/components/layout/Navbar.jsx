import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const isExternal = (path) => /^https?:\/\//i.test(path);

const base = "rounded-lg px-4 py-2 text-sm font-medium transition";

export default function Navbar() {
  const site = useSite();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `${base} ${isActive ? "bg-sky-100 text-sky-800" : "text-slate-600 hover:bg-slate-100"}`;

  const renderLink = (item, onClick) =>
    isExternal(item.path) ? (
      <a
        key={item.label}
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} text-slate-600 hover:bg-slate-100`}
        onClick={onClick}
      >
        {item.label}
      </a>
    ) : (
      <NavLink
        key={item.label}
        to={item.path}
        end={item.path === "/"}
        className={linkClass}
        onClick={onClick}
      >
        {item.label}
      </NavLink>
    );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/">
          {site.logo ? (
            <img src={site.logo} alt={site.siteName} className="h-10 w-auto" />
          ) : (
            <span className="text-lg font-bold text-slate-900">
              {site.siteName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {site.menu.map((item) => renderLink(item))}
        </nav>

        <div className="flex items-center gap-3">
          {site.impactLogo && site.impactUrl && (
            <a
              href={site.impactUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:block"
            >
              <img
                src={site.impactLogo}
                alt="Impact Rankings"
                className="h-10 w-auto"
              />
            </a>
          )}
          <button
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {site.menu.map((item) => renderLink(item, () => setOpen(false)))}
          </div>
        </nav>
      )}
    </header>
  );
}
