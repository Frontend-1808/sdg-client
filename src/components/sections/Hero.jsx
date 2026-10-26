import { useSite } from "@/context/SiteContext";

export default function Hero({ goals = [] }) {
  const site = useSite();

  const scrollToGoals = () =>
    document.getElementById("goals")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      className="text-white"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0369a1 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <p className="mb-5 inline-block rounded-full border border-white/30 px-4 py-1 text-sm">
          Navoi State University of Mining and Technologies
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          {site.heroTitle}
        </h1>
        {site.heroText && (
          <p className="mt-6 max-w-2xl text-lg text-slate-200">
            {site.heroText}
          </p>
        )}
        <button
          onClick={scrollToGoals}
          className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-sky-100"
        >
          Explore the goals
        </button>

        <div className="mt-12 flex flex-wrap gap-2">
          {goals.map((g) => (
            <span
              key={g.number}
              className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold"
              style={{ backgroundColor: g.color }}
            >
              {g.number}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
