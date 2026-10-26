import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getArticle } from "@/api/goals";
import { cleanHtml } from "@/utils/sanitizeHtml";

export default function ArticlePage() {
  const { slug, articleSlug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getArticle(slug, articleSlug)
      .then(setArticle)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, articleSlug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-slate-500">
        Loading...
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link
          to={`/goals/${slug}`}
          className="mt-4 inline-block text-sky-700 underline"
        >
          Back to the goal
        </Link>
      </div>
    );
  }

  const { goal } = article;
  const html = cleanHtml(article.content);

  return (
    <div>
      <div className="text-white" style={{ backgroundColor: goal.color }}>
        <div className="mx-auto max-w-4xl px-4 py-14">
          <Link
            to={`/goals/${goal.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase opacity-90 hover:opacity-100"
          >
            <ArrowLeft size={16} />
            SDG {goal.number}: {goal.title.en}
          </Link>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            {article.title}
          </h1>
          {article.summary && (
            <p className="mt-3 text-lg opacity-90">{article.summary}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <Link
          to={`/goals/${goal.slug}`}
          className="mt-12 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
          Back to SDG {goal.number}
        </Link>
      </div>
    </div>
  );
}
