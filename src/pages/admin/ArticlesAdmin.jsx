import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminGetGoals } from "@/api/adminGoals";
import { adminGetArticles, deleteArticle } from "@/api/adminArticles";
import { useAuth } from "@/context/AuthContext";
import { inputClass } from "@/components/admin/FormBits";

export default function ArticlesAdmin() {
  const { user, logout } = useAuth();
  const [goals, setGoals] = useState([]);
  const [goalId, setGoalId] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetGoals()
      .then(setGoals)
      .catch((e) => {
        if (e.status === 401) logout();
        setError(e.message);
      });
  }, [logout]);

  useEffect(() => {
    setLoading(true);
    adminGetArticles(goalId)
      .then(setArticles)
      .catch((e) => {
        if (e.status === 401) logout();
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [goalId, logout]);

  const goalOf = (id) => goals.find((g) => g._id === id);

  const onDelete = async (a) => {
    if (
      !window.confirm(
        `Delete "${a.title}"? Cards that link to it will be deleted too.`,
      )
    )
      return;
    try {
      await deleteArticle(a._id);
      setArticles((list) => list.filter((x) => x._id !== a._id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Articles</h1>
        <div className="flex items-center gap-3">
          <select
            className={`${inputClass} w-64`}
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
          >
            <option value="">All goals</option>
            {goals.map((g) => (
              <option key={g._id} value={g._id}>
                SDG {g.number}: {g.title?.en}
              </option>
            ))}
          </select>
          <Link
            to={`/admin/articles/new${goalId ? `?goal=${goalId}` : ""}`}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <Plus size={16} />
            New article
          </Link>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      )}
      {loading && <p className="text-slate-500">Loading...</p>}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Goal</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => {
              const g = goalOf(a.goal);
              return (
                <tr key={a._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {g && (
                      <span
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-white"
                        style={{ backgroundColor: g.color }}
                      >
                        {g.number}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3 text-slate-500">{a.slug}</td>
                  <td className="px-4 py-3">{a.order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        a.published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/articles/${a._id}`}
                        className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => onDelete(a)}
                          className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!loading && articles.length === 0 && (
        <p className="mt-6 text-center text-slate-500">No articles here yet.</p>
      )}
    </div>
  );
}
