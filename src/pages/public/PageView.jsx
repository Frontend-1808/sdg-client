import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPage } from "@/api/site";
import { cleanHtml } from "@/utils/sanitizeHtml";

export default function PageView({ slug: fixedSlug }) {
  const params = useParams();
  const slug = fixedSlug || params.slug;

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getPage(slug)
      .then(setPage)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-slate-500">
        Loading...
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <Link to="/" className="mt-4 inline-block text-sky-700 underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-4xl font-bold">{page.title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: cleanHtml(page.content) }}
        />
      </div>
    </div>
  );
}
