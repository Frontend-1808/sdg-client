import { Mail, MapPin, Phone } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function Footer() {
  const site = useSite();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">About us</h4>
          <p className="text-sm leading-relaxed">{site.footerAbout}</p>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            {site.phones.length > 0 && (
              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0" />
                <span>{site.phones.join(", ")}</span>
              </li>
            )}
            {site.address && (
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>{site.address}</span>
              </li>
            )}
            {site.email && (
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0" />
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">
            Social networks
          </h4>
          <div className="flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-600 px-4 py-1.5 text-sm transition hover:border-white hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        {new Date().getFullYear()} {site.siteName}
      </div>
    </footer>
  );
}
