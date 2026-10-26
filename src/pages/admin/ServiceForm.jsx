import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { adminGetGoals } from "@/api/adminGoals";
import { adminGetArticles } from "@/api/adminArticles";
import {
  adminGetService,
  createService,
  updateService,
} from "@/api/adminServices";
import { useAuth } from "@/context/AuthContext";
import ImageField from "@/components/admin/ImageField";
import { Field, inputClass } from "@/components/admin/FormBits";

const empty = {
  goal: "",
  title: "",
  image: "",
  linkType: "article",
  article: "",
  externalUrl: "",
  order: 0,
  published: true,
};

export default function ServiceForm() {
  const { id } = useParams();
  const isNew = !id;
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [goals, setGoals] = useState([]);
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({
    ...empty,
    goal: params.get("goal") || "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fail = (e) => {
      if (e.status === 401) logout();
      setError(e.message);
    };

    const tasks = [adminGetGoals().then(setGoals)];
    if (!isNew) {
      tasks.push(
        adminGetService(id).then((c) =>
          setForm({
            goal: c.goal,
            title: c.title,
            image: c.image || "",
            linkType: c.linkType,
            article: c.article || "",
            externalUrl: c.externalUrl || "",
            order: c.order ?? 0,
            published: c.published,
          }),
        ),
      );
    }
    Promise.all(tasks)
      .catch(fail)
      .finally(() => setLoading(false));
  }, [id, isNew, logout]);

  // Tanlangan SDG ning maqolalari
  useEffect(() => {
    if (!form.goal) {
      setArticles([]);
      return;
    }
    adminGetArticles(form.goal)
      .then(setArticles)
      .catch(() => setArticles([]));
  }, [form.goal]);

  const set = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (!form.goal) return setError("Choose a goal");
    if (!form.title.trim()) return setError("Title is required");

    const payload = {
      goal: form.goal,
      title: form.title.trim(),
      image: form.image.trim(),
      linkType: form.linkType,
      article: form.linkType === "article" ? form.article : null,
      externalUrl: form.linkType === "external" ? form.externalUrl.trim() : "",
      order: Number(form.order) || 0,
      published: form.published,
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await createService(payload);
        navigate(`/admin/services/${created._id}`, { replace: true });
        return;
      }
      await updateService(id, payload);
      setSaved(true);
    } catch (err) {
      if (err.status === 401) logout();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/admin/services"
            className="flex items-center gap-1 text-sm text-sky-700 hover:underline"
          >
            <ArrowLeft size={14} />
            Back to cards
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {isNew ? "New service card" : "Edit service card"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-sky-600 px-6 py-2.5 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Saved
        </p>
      )}

      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <Field label="Goal">
          <select
            className={inputClass}
            value={form.goal}
            onChange={(e) =>
              setForm((f) => ({ ...f, goal: e.target.value, article: "" }))
            }
          >
            <option value="">Choose a goal</option>
            {goals.map((g) => (
              <option key={g._id} value={g._id}>
                SDG {g.number}: {g.title?.en}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Title">
          <input
            className={inputClass}
            value={form.title}
            onChange={set("title")}
          />
        </Field>

        <Field label="Image">
          <ImageField
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          />
        </Field>

        <Field label="Read More button opens">
          <select
            className={inputClass}
            value={form.linkType}
            onChange={set("linkType")}
          >
            <option value="article">An article of this goal</option>
            <option value="external">
              An external link (for example a PDF)
            </option>
          </select>
        </Field>

        {form.linkType === "article" ? (
          <Field
            label="Article"
            hint="Only articles of the chosen goal are listed."
          >
            <select
              className={inputClass}
              value={form.article}
              onChange={set("article")}
            >
              <option value="">Choose an article</option>
              {articles.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <Field label="External link">
            <input
              className={inputClass}
              value={form.externalUrl}
              onChange={set("externalUrl")}
              placeholder="https://..."
            />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-5">
          <Field label="Order" hint="Smaller number comes first.">
            <input
              type="number"
              className={inputClass}
              value={form.order}
              onChange={set("order")}
            />
          </Field>
          <label className="flex items-center gap-3 self-end pb-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={set("published")}
              className="h-4 w-4"
            />
            Published
          </label>
        </div>
      </div>
    </form>
  );
}
