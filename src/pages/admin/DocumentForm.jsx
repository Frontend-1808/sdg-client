import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  adminGetDocument,
  createDocument,
  updateDocument,
} from "@/api/adminDocuments";
import { useAuth } from "@/context/AuthContext";
import ImageField from "@/components/admin/ImageField";
import FileField from "@/components/admin/FileField";
import { Field, inputClass } from "@/components/admin/FormBits";

const empty = {
  title: "",
  image: "",
  fileUrl: "",
  goalNumber: 0,
  order: 0,
  published: true,
};

export default function DocumentForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) return;
    adminGetDocument(id)
      .then((d) =>
        setForm({
          title: d.title,
          image: d.image || "",
          fileUrl: d.fileUrl || "",
          goalNumber: d.goalNumber ?? 0,
          order: d.order ?? 0,
          published: d.published,
        }),
      )
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

    const payload = {
      title: form.title.trim(),
      image: form.image.trim(),
      fileUrl: form.fileUrl.trim(),
      goalNumber: Number(form.goalNumber) || 0,
      order: Number(form.order) || 0,
      published: form.published,
    };

    setSaving(true);
    try {
      if (isNew) {
        const created = await createDocument(payload);
        navigate(`/admin/documents/${created._id}`, { replace: true });
        return;
      }
      await updateDocument(id, payload);
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
            to="/admin/documents"
            className="flex items-center gap-1 text-sm text-sky-700 hover:underline"
          >
            <ArrowLeft size={14} />
            Back to documents
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {isNew ? "New document" : "Edit document"}
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
        <Field label="Title">
          <input
            className={inputClass}
            value={form.title}
            onChange={set("title")}
          />
        </Field>

        <Field label="Image" hint="Picture shown on the Documents page.">
          <ImageField
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          />
        </Field>

        <Field
          label="File"
          hint="PDF or other file. If empty, the picture opens the page of the selected goal."
        >
          <FileField
            value={form.fileUrl}
            onChange={(url) => setForm((f) => ({ ...f, fileUrl: url }))}
          />
        </Field>

        <Field
          label="Goal"
          hint="General documents are shown large at the top of the page."
        >
          <select
            className={inputClass}
            value={form.goalNumber}
            onChange={set("goalNumber")}
          >
            <option value={0}>General (no goal)</option>
            {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                SDG {n}
              </option>
            ))}
          </select>
        </Field>

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
