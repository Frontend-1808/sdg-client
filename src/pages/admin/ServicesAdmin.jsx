import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminGetGoals } from "@/api/adminGoals";
import { adminGetServices, deleteService } from "@/api/adminServices";
import { useAuth } from "@/context/AuthContext";
import { inputClass } from "@/components/admin/FormBits";

export default function ServicesAdmin() {
  const { user, logout } = useAuth();
  const [goals, setGoals] = useState([]);
  const [goalId, setGoalId] = useState("");
  const [cards, setCards] = useState([]);
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
    adminGetServices(goalId)
      .then(setCards)
      .catch((e) => {
        if (e.status === 401) logout();
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [goalId, logout]);

  const goalOf = (id) => goals.find((g) => g._id === id);

  const onDelete = async (c) => {
    if (!window.confirm(`Delete card "${c.title}"?`)) return;
    try {
      await deleteService(c._id);
      setCards((list) => list.filter((x) => x._id !== c._id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Service Cards</h1>
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
            to={`/admin/services/new${goalId ? `?goal=${goalId}` : ""}`}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <Plus size={16} />
            New card
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
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Opens</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => {
              const g = goalOf(c.goal);
              return (
                <tr key={c._id} className="border-t border-slate-100">
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
                  <td className="px-4 py-3">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt=""
                        className="h-12 w-20 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-20 rounded bg-slate-100" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500">
                    {c.linkType === "article"
                      ? `Article: ${c.article?.title || "missing"}`
                      : c.externalUrl}
                  </td>
                  <td className="px-4 py-3">{c.order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        c.published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {c.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/services/${c._id}`}
                        className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => onDelete(c)}
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

      {!loading && cards.length === 0 && (
        <p className="mt-6 text-center text-slate-500">No cards here yet.</p>
      )}
    </div>
  );
}
