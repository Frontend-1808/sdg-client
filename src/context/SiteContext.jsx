import { createContext, useContext, useEffect, useState } from "react";
import { getSettings } from "@/api/site";
import { site as fallback } from "@/data/site";

const defaults = {
  siteName: fallback.name,
  logo: fallback.logo,
  impactLogo: fallback.impactLogo,
  impactUrl: fallback.impactUrl,
  heroTitle: "17 Sustainable Development Goals aimed at changing the world",
  heroText: "",
  phones: fallback.phones,
  address: fallback.address,
  email: fallback.email,
  footerAbout: fallback.about,
  socials: fallback.socials,
  menu: [
    { label: "Home", path: "/" },
    { label: "Document", path: "/documents" },
    { label: "About us", path: "/about" },
  ],
};

const SiteContext = createContext(defaults);

export function SiteProvider({ children }) {
  const [site, setSite] = useState(defaults);

  useEffect(() => {
    getSettings()
      .then((data) => setSite({ ...defaults, ...data }))
      .catch(() => {});
  }, []);

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
