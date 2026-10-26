import { useEffect, useState } from "react";
import { adminGetSettings, updateSettings } from "@/api/adminSettings";
import { useAuth } from "@/context/AuthContext";
import ImageField from "@/components/admin/ImageField";
import { Field, inputClass } from "@/components/admin/FormBits";

const removeBtn =
  "rounded-lg border border-red-200 px-3 text-sm text-red-700 hover:bg-red-50";
const addBtn = "text-sm font-medium text-sky-700 hover:underline";

function StringList({ items, onChange, placeholder }) {
  const update = (i, v) => onChange(items.map((x, idx) => (idx === i ? v : x)));
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputClass}
            value={v}
            placeholder={placeholder}
            onChange={(e) => update(i, e.target.value)}
          />
          <button
            type="button"
            className={removeBtn}
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className={addBtn}
        onClick={() => onChange([...items, ""])}
      >
        Add
      </button>
    </div>
  );
}

function PairList({ items, onChange, keys, placeholders }) {
  const [a, b] = keys;
  const update = (i, key, v) =>
    onChange(items.map((x, idx) => (idx === i ? { ...x, [key]: v } : x)));
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={`${inputClass} max-w-[12rem]`}
            value={item[a] || ""}
            placeholder={placeholders[0]}
            onChange={(e) => update(i, a, e.target.value)}
          />
          <input
            className={inputClass}
            value={item[b] || ""}
            placeholder={placeholders[1]}
            onChange={(e) => update(i, b, e.target.value)}
          />
          <button
            type="button"
            className={removeBtn}
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className={addBtn}
        onClick={() => onChange([...items, { [a]: "", [b]: "" }])}
      >
        Add
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

export default function SettingsAdmin() {
  const { logout } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminGetSettings()
      .then((s) =>
        setForm({
          siteName: s.siteName || "",
          logo: s.logo || "",
          impactLogo: s.impactLogo || "",
          impactUrl: s.impactUrl || "",
          heroTitle: s.heroTitle || "",
          heroText: s.heroText || "",
          phones: s.phones || [],
          address: s.address || "",
          email: s.email || "",
          footerAbout: s.footerAbout || "",
          socials: (s.socials || []).map(({ label, url }) => ({ label, url })),
          menu: (s.menu || []).map(({ label, path }) => ({ label, path })),
        }),
      )
      .catch((e) => {
        if (e.status === 401) logout();
        setError(e.message);
      });
  }, [logout]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setValue = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      await updateSettings(form);
      setSaved(true);
    } catch (err) {
      if (err.status === 401) logout();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return error ? (
      <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
    ) : (
      <p className="text-slate-500">Loading...</p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-sky-600 px-6 py-2.5 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      {saved && (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Saved. Refresh the public website to see the changes.
        </p>
      )}

      <Section title="General">
        <Field label="Site name">
          <input
            className={inputClass}
            value={form.siteName}
            onChange={set("siteName")}
          />
        </Field>
        <Field label="Logo">
          <ImageField value={form.logo} onChange={setValue("logo")} />
        </Field>
        <Field label="Impact Rankings logo">
          <ImageField
            value={form.impactLogo}
            onChange={setValue("impactLogo")}
          />
        </Field>
        <Field label="Impact Rankings link">
          <input
            className={inputClass}
            value={form.impactUrl}
            onChange={set("impactUrl")}
          />
        </Field>
      </Section>

      <Section title="Home page">
        <Field label="Main title">
          <input
            className={inputClass}
            value={form.heroTitle}
            onChange={set("heroTitle")}
          />
        </Field>
        <Field label="Text under the title">
          <textarea
            rows={3}
            className={inputClass}
            value={form.heroText}
            onChange={set("heroText")}
          />
        </Field>
      </Section>

      <Section title="Menu">
        <PairList
          items={form.menu}
          onChange={setValue("menu")}
          keys={["label", "path"]}
          placeholders={["Name", "/about or https://..."]}
        />
      </Section>

      <Section title="Contacts">
        <Field label="Phones">
          <StringList
            items={form.phones}
            onChange={setValue("phones")}
            placeholder="+998..."
          />
        </Field>
        <Field label="Address">
          <input
            className={inputClass}
            value={form.address}
            onChange={set("address")}
          />
        </Field>
        <Field label="Email">
          <input
            className={inputClass}
            value={form.email}
            onChange={set("email")}
          />
        </Field>
      </Section>

      <Section title="Social networks">
        <PairList
          items={form.socials}
          onChange={setValue("socials")}
          keys={["label", "url"]}
          placeholders={["Name", "https://..."]}
        />
      </Section>

      <Section title="Footer">
        <Field label="About us text">
          <textarea
            rows={5}
            className={inputClass}
            value={form.footerAbout}
            onChange={set("footerAbout")}
          />
        </Field>
      </Section>
    </form>
  );
}
