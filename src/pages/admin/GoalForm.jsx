import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { adminGetGoal, createGoal, updateGoal } from "@/api/adminGoals";
import { useAuth } from "@/context/AuthContext";
import { iconMap } from "@/data/icons";

import ImageField from "@/components/admin/ImageField";

const RichTextEditor = lazy(() => import("@/components/admin/RichTextEditor"));

const empty = {
  number: "",
  slug: "",
  title: "",
  subtitle: "",
  shortText: "",
  introText: "",
  color: "#334155",
  iconName: "Star",
  coverImage: "",
  template: "simple",
  published: true,
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-200";

const slugify = (v) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Boshqa tillardagi mavjud qiymatlarni saqlab, faqat en ni yangilaydi
const withEn = (old, value) => ({ ...(old || {}), en: value });

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function GoalForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState(empty);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) return;
    adminGetGoal(id)
      .then((g) => {
        setOriginal(g);
        setForm({
          number: g.number,
          slug: g.slug,
          title: g.title?.en || "",
          subtitle: g.subtitle?.en || "",
          shortText: g.shortText?.en || "",
          introText: g.introText?.en || "",
          color: g.color || "#334155",
          iconName: g.iconName || "Star",
          coverImage: g.coverImage || "",
          template: g.template || "simple",
          published: g.published,
        });
      })
      .catch((e) => {
        if (e.status === 401) logout();
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [id, isNew, logout]);

  const set = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (!form.title.trim()) return setError("Title is required");
    if (!form.number || Number(form.number) < 1)
      return setError("Number must be 1 or more");

    const payload = {
      number: Number(form.number),
      slug: slugify(form.slug || `sdg-${form.number}`),
      title: withEn(original?.title, form.title.trim()),
      subtitle: withEn(original?.subtitle, form.subtitle.trim()),
      shortText: withEn(original?.shortText, form.shortText.trim()),
      introText: withEn(original?.introText, form.introText),
      color: form.color,
      iconName: form.iconName,
      coverImage: form.coverImage.trim(),
      template: form.template,
      published: form.published,
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await createGoal(payload);
        navigate(`/admin/goals/${created._id}`, { replace: true });
        return;
      }
      const updated = await updateGoal(id, payload);
      setOriginal(updated);
      setSaved(true);
    } catch (err) {
      if (err.status === 401) logout();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  const Icon = iconMap[form.iconName] || Star;

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/admin/goals"
            className="flex items-center gap-1 text-sm text-sky-700 hover:underline"
          >
            <ArrowLeft size={14} />
            Back to goals
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {isNew ? "New goal" : `Edit SDG ${form.number}`}
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
              onChange={set("title")}
            />
          </Field>

          <Field
            label="Subtitle"
            hint="Shown under the title on the goal page."
          >
            <input
              className={inputClass}
              value={form.subtitle}
              onChange={set("subtitle")}
            />
          </Field>

          <Field
            label="Short text"
            hint="One or two sentences shown at the top of the page."
          >
            <textarea
              rows={3}
              className={inputClass}
              value={form.shortText}
              onChange={set("shortText")}
            />
          </Field>

          <Field label="Content">
            <Suspense
              fallback={
                <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
              }
            >
              <RichTextEditor
                value={form.introText}
                onChange={(html) => setForm((f) => ({ ...f, introText: html }))}
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
            <p className="mt-1 text-xs text-slate-500">
              Unchecked goals are hidden from the website.
            </p>
          </div>

          <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
            <Field label="Number">
              <input
                type="number"
                min="1"
                className={inputClass}
                value={form.number}
                onChange={set("number")}
              />
            </Field>

            <Field label="Slug" hint="Used in the page address. Example: sdg-1">
              <input
                className={inputClass}
                value={form.slug}
                placeholder={form.number ? `sdg-${form.number}` : "sdg-19"}
                onChange={set("slug")}
              />
            </Field>

            <Field
              label="Template"
              hint="Simple: one page. Services: page with service cards."
            >
              <select
                className={inputClass}
                value={form.template}
                onChange={set("template")}
              >
                <option value="simple">simple</option>
                <option value="services">services</option>
              </select>
            </Field>

            <Field label="Color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.color}
                  onChange={set("color")}
                  className="h-10 w-14 cursor-pointer rounded border border-slate-300"
                />
                <span className="text-sm text-slate-600">{form.color}</span>
              </div>
            </Field>

            <Field label="Icon">
              <select
                className={inputClass}
                value={form.iconName}
                onChange={set("iconName")}
              >
                {Object.keys(iconMap).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Cover image">
              {" "}
              <ImageField
                value={form.coverImage}
                onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
              />{" "}
            </Field>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-medium text-slate-700">
              Card preview
            </p>
            <div
              className="relative flex aspect-square w-40 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white"
              style={{ backgroundColor: form.color }}
            >
              <span className="text-4xl font-extrabold">
                {form.number || "0"}
              </span>
              <Icon size={44} className="absolute right-3 top-3 opacity-40" />
              <span className="text-xs font-semibold uppercase leading-snug">
                {form.title || "Title"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
