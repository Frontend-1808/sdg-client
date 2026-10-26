import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGoal, getServices } from "@/api/goals";
import { cleanHtml } from "@/utils/sanitizeHtml";
import ServiceCards from "@/components/sections/ServiceCards";

export default function GoalPage() {
  const { slug } = useParams();
  const [goal, setGoal] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    Promise.all([getGoal(slug), getServices(slug).catch(() => [])])
      .then(([g, c]) => {
        setGoal(g);
        setCards(c);
      })
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

  if (notFound || !goal) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-2xl font-bold">Goal not found</h1>
        <Link to="/" className="mt-4 inline-block text-sky-700 underline">
          Back to home
        </Link>
      </div>
    );
  }

  const html = cleanHtml(goal.introText?.en);

  return (
    <div>
      <div className="text-white" style={{ backgroundColor: goal.color }}>
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-semibold uppercase opacity-80">
            SDG {goal.number}
          </p>
          <h1 className="mt-2 text-4xl font-bold">{goal.title.en}</h1>
          {goal.subtitle?.en && (
            <p className="mt-3 max-w-3xl text-lg">{goal.subtitle.en}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {goal.shortText?.en && (
            <p className="mb-8 text-lg leading-relaxed text-slate-700">
              {goal.shortText.en}
            </p>
          )}

          {goal.coverImage && (
            <img
              src={goal.coverImage}
              alt={goal.title.en}
              className="mb-8 w-full rounded-2xl"
            />
          )}

          {html && (
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}

          {!html && !goal.shortText?.en && cards.length === 0 && (
            <p className="text-slate-500">Content will appear here.</p>
          )}
        </div>

        <ServiceCards cards={cards} color={goal.color} />
      </div>
    </div>
  );
}
