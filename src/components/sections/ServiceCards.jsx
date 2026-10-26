import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";

const btn =
  "mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700";

function CardLink({ card, className, style, children }) {
  if (card.external) {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={card.href} className={className} style={style}>
      {children}
    </Link>
  );
}

export default function ServiceCards({ cards, color }) {
  if (!cards.length) return null;

  const withImage = cards.filter((c) => c.image);
  const plain = cards.filter((c) => !c.image);

  return (
    <section className="mt-14 space-y-14">
      {withImage.length > 0 && (
        <div>
          <h2 className="mb-8 text-3xl font-bold text-slate-900">
            Our Services
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {withImage.map((c) => (
              <article
                key={c._id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="h-44 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold leading-snug text-slate-900">
                    {c.title}
                  </h3>
                  <div className="mt-auto">
                    <CardLink card={c} className={btn}>
                      Read More
                      <ArrowRight size={16} />
                    </CardLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {plain.length > 0 && (
        <div>
          <h2 className="mb-8 text-3xl font-bold text-slate-900">
            {withImage.length > 0 ? "More materials" : "Our Services"}
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {plain.map((c) => (
              <li key={c._id}>
                <CardLink
                  card={c}
                  style={{ borderLeftColor: color }}
                  className="flex items-center justify-between gap-4 rounded-xl border-l-4 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <span className="text-sm font-medium leading-snug text-slate-800">
                    {c.title}
                  </span>
                  {c.external ? (
                    <ExternalLink
                      size={16}
                      className="shrink-0 text-slate-400"
                    />
                  ) : (
                    <ArrowRight size={16} className="shrink-0 text-slate-400" />
                  )}
                </CardLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
