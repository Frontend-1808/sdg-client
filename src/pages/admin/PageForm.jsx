import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { adminGetPage, createPage, updatePage } from "@/api/adminPages";
import { useAuth } from "@/context/AuthContext";
import { Field, inputClass } from "@/components/admin/FormBits";
import { slugify } from "@/utils/slugify";

const RichTextEditor = lazy(() => import("@/components/admin/RichTextEditor"));

const empty = { title: "", slug: "", content: "", published: true };

export default function PageForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState(empty);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) return;
    adminGetPage(id)
      .then((p) =>
        setForm({
          title: p.title,
          slug: p.slug,
          content: p.content || "",
          published: p.published,
        }),
      )
      .catch((e) => {
        if (e.status === 401) logout();
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [id, isNew, logout]);

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

    if (!form.title.trim()) return setError("Title is required");
    const slug = slugify(form.slug || form.title);
    if (!slug) return setError("Slug is required. Use letters and digits.");

    const payload = {
      title: form.title.trim(),
      slug,
      content: form.content,
      published: form.published,
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await createPage(payload);
        navigate(`/admin/pages/${created._id}`, { replace: true });
        return;
      }
      const updated = await updatePage(id, payload);
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

  const finalSlug = slugify(form.slug || form.title);

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/admin/pages"
            className="flex items-center gap-1 text-sm text-sky-700 hover:underline"
          >
            <ArrowLeft size={14} />
            Back to pages
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {isNew ? "New page" : "Edit page"}
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, published: e.target.checked }))
                }
                className="h-4 w-4"
              />
              Published
            </label>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <Field
              label="Slug"
              hint={`Page address: ${finalSlug === "about" ? "/about" : `/p/${finalSlug || "..."}`}`}
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
            {form.slug === "about" && (
              <p className="mt-3 text-xs text-amber-700">
                The menu links to this page. Keep the slug as "about".
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
