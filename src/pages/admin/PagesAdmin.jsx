import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { adminGetPages, deletePage } from "@/api/adminPages";
import { useAuth } from "@/context/AuthContext";

export default function PagesAdmin() {
  const { user, logout } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetPages()
      .then(setPages)
      .catch((e) => {
        if (e.status === 401) logout();
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [logout]);

  const onDelete = async (p) => {
    if (!window.confirm(`Delete page "${p.title}"?`)) return;
    try {
      await deletePage(p._id);
      setPages((list) => list.filter((x) => x._id !== p._id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Pages</h1>
        <Link
          to="/admin/pages/new"
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <Plus size={16} />
          New page
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      )}
      {loading && <p className="text-slate-500">Loading...</p>}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-slate-500">
                  {p.slug === "about" ? "/about" : `/p/${p.slug}`}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/pages/${p._id}`}
                      className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>
                    {user?.role === "admin" && p.slug !== "about" && (
                      <button
                        onClick={() => onDelete(p)}
                        className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
