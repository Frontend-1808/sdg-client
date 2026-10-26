import { Link } from "react-router-dom";
import { iconMap } from "@/data/icons";
import { Star } from "lucide-react";

export default function GoalsGrid({ goals, loading, error }) {
  return (
    <section id="goals" className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Our Goals</h2>
        <p className="mt-2 text-slate-600">
          Select a goal to see what NSUMT does for it.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-center text-red-700">
          Could not load goals: {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {loading &&
          Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-2xl bg-slate-200"
            />
          ))}

        {goals.map((goal) => {
          const Icon = iconMap[goal.iconName] || Star;
          return (
            <Link
              key={goal._id}
              to={`/goals/${goal.slug}`}
              className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: goal.color }}
            >
              <span className="text-4xl font-extrabold">{goal.number}</span>
              <Icon
                size={44}
                className="absolute right-3 top-3 opacity-30 transition group-hover:scale-110 group-hover:opacity-60"
              />
              <span className="text-sm font-semibold uppercase leading-snug">
                {goal.title.en}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
