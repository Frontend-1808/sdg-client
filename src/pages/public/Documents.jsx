import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { getDocuments } from "@/api/site";

function Wrap({ doc, className, children }) {
  if (!doc.href) return <div className={className}>{children}</div>;
  if (doc.external) {
    return (
      <a
        href={doc.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={doc.href} className={className}>
      {children}
    </Link>
  );
}

export default function Documents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDocuments()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const featured = items.filter((d) => !d.goalNumber);
  const tiles = items.filter((d) => d.goalNumber);

  return (
    <div>
      <div className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h1 className="text-4xl font-bold">Documents</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Official documents of the university for each Sustainable
            Development Goal.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-center text-red-700">
            {error}
          </p>
        )}
        {loading && <p className="text-slate-500">Loading...</p>}

        {featured.length > 0 && (
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {featured.map((d) => (
              <Wrap
                key={d._id}
                doc={d}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl"
              >
                {d.image && (
                  <img
                    src={d.image}
                    alt={d.title}
                    className="w-full object-cover"
                  />
                )}
                <div className="flex items-center gap-3 p-5">
                  <FileText className="text-sky-700" size={22} />
                  <span className="font-semibold text-slate-900">
                    {d.title}
                  </span>
                </div>
              </Wrap>
            ))}
          </div>
        )}

        {tiles.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {tiles.map((d) => (
              <Wrap
                key={d._id}
                doc={d}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {d.image ? (
                  <img
                    src={d.image}
                    alt={d.title}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-slate-100 text-2xl font-bold text-slate-500">
                    {d.goalNumber}
                  </div>
                )}
                <p className="p-3 text-xs font-medium leading-snug text-slate-700">
                  {d.title}
                </p>
              </Wrap>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && !error && (
          <p className="text-center text-slate-500">No documents yet.</p>
        )}
      </div>
    </div>
  );
}
