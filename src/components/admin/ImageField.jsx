import { useState } from "react";
import MediaPicker from "./MediaPicker";

export default function ImageField({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {value ? (
        <img
          src={value}
          alt=""
          className="mb-3 h-36 w-full rounded-lg object-cover"
        />
      ) : (
        <div className="mb-3 flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400">
          No image
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Choose image
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
        placeholder="or paste an image link"
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-sky-600"
      />

      <MediaPicker
        open={open}
        kind="image"
        onClose={() => setOpen(false)}
        onSelect={(m) => {
          onChange(m.url);
          setOpen(false);
        }}
      />
    </div>
  );
}
