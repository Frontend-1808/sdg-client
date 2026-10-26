import { useState } from "react";
import MediaPicker from "./MediaPicker";

export default function FileField({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="mb-3 block break-all text-sm text-sky-700 underline"
        >
          {value}
        </a>
      ) : (
        <p className="mb-3 text-sm text-slate-400">No file</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Choose file
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Remove
          </button>
        )}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste a file link"
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-sky-600"
      />

      <MediaPicker
        open={open}
        kind="document"
        onClose={() => setOpen(false)}
        onSelect={(m) => {
          onChange(m.url);
          setOpen(false);
        }}
      />
    </div>
  );
}
