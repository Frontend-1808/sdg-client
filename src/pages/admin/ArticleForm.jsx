import { lazy, Suspense, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { adminGetGoals } from "@/api/adminGoals";
import {
  adminGetArticle,
  createArticle,
  updateArticle,
} from "@/api/adminArticles";
import { useAuth } from "@/context/AuthContext";
import ImageField from "@/components/admin/ImageField";
import { Field, inputClass } from "@/components/admin/FormBits";
import { slugify } from "@/utils/slugify";

const RichTextEditor = lazy(() => import("@/components/admin/RichTextEditor"));

const empty = {
  goal: "",
  title: "",
  slug: "",
  summary: "",
  content: "",
  coverImage: "",
  published: true,
  order: 0,
};

export default function ArticleForm() {
  const { id } = useParams();
  const isNew = !id;
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    ...empty,
    goal: params.get("goal") || "",
  });
  const [slugTouched, setSlugTouched] = useState(!isNew);
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
        adminGetArticle(id).then((a) =>
          setForm({
            goal: a.goal,
            title: a.title,
            slug: a.slug,
            summary: a.summary || "",
            content: a.content || "",
            coverImage: a.coverImage || "",
            published: a.published,
            order: a.order ?? 0,
          }),
        ),
      );
    }
    Promise.all(tasks)
      .catch(fail)
      .finally(() => setLoading(false));
  }, [id, isNew, logout]);

  const set = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onTitle = (e) => {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug: slugTouched ? f.slug : slugify(title),
    }));
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
      slug: slugify(form.slug || form.title),
      summary: form.summary.trim(),
      content: form.content,
      coverImage: form.coverImage.trim(),
      published: form.published,
      order: Number(form.order) || 0,
    };

    if (!payload.slug)
      return setError("Slug is required. Use letters and digits.");

    setSaving(true);
    try {
      if (isNew) {
        const created = await createArticle(payload);
        navigate(`/admin/articles/${created._id}`, { replace: true });
        return;
      }
      const updated = await updateArticle(id, payload);
      setForm((f) => ({ ...f, slug: updated.slug, content: updated.content }));
      setSaved(true);
    } catch (err) {
      if (err.status === 401) logout();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  const goal = goals.find((g) => g._id === form.goal);

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/admin/articles"
            className="flex items-center gap-1 text-sm text-sky-700 hover:underline"
          >
            <ArrowLeft size={14} />
            Back to articles
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {isNew ? "New article" : "Edit article"}
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={onTitle}
            />
          </Field>

          <Field label="Summary" hint="Short description. Optional.">
            <textarea
              rows={3}
              className={inputClass}
              value={form.summary}
              onChange={set("summary")}
            />
          </Field>

          <Field label="Content">
            <Suspense
              fallback={
                <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
              }
            >
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              />
            </Suspense>
          </Field>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.published}
                onChange={set("published")}
                className="h-4 w-4"
              />
              Published
            </label>
          </div>

          <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
            <Field label="Goal">
              <select
                className={inputClass}
                value={form.goal}
                onChange={set("goal")}
              >
                <option value="">Choose a goal</option>
                {goals.map((g) => (
                  <option key={g._id} value={g._id}>
                    SDG {g.number}: {g.title?.en}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Slug"
              hint={
                goal
                  ? `Page address: /goals/${goal.slug}/${slugify(form.slug || form.title) || "..."}`
                  : "Used in the page address."
              }
            >
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((f) => ({ ...f, slug: e.target.value }));
                }}
              />
            </Field>

            <Field label="Order" hint="Smaller number comes first.">
              <input
                type="number"
                className={inputClass}
                value={form.order}
                onChange={set("order")}
              />
            </Field>

            <Field label="Cover image">
              <ImageField
                value={form.coverImage}
                onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
              />
            </Field>
          </div>
        </div>
      </div>
    </form>
  );
}
