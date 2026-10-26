import { useCallback, useEffect, useState } from "react";
import { Copy, FileText, Film, Trash2, Upload } from "lucide-react";
import { deleteMedia, getMedia, uploadMedia } from "@/api/media";
import { useAuth } from "@/context/AuthContext";
import { formatSize } from "@/utils/format";

const tabs = [
  { label: "All", value: "" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Documents", value: "document" },
];

const ACCEPT = ".jpg,.jpeg,.png,.webp,.gif,.pdf,.mp4,.webm,.docx,.xlsx,.pptx";

export default function MediaBrowser({
  onSelect,
  fixedKind = "",
  allowDelete = false,
}) {
  const { user, logout } = useAuth();
  const [kind, setKind] = useState(fixedKind);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState([]);
  const [copied, setCopied] = useState("");

  const canDelete = allowDelete && user?.role === "admin";

  const load = useCallback(
    async (nextPage, nextKind, replace) => {
      setLoading(true);
      setError("");
      try {
        const data = await getMedia({ page: nextPage, kind: nextKind });
        setItems((prev) => (replace ? data.items : [...prev, ...data.items]));
        setPage(data.page);
        setPages(data.pages);
      } catch (e) {
        if (e.status === 401) logout();
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [logout],
  );

  useEffect(() => {
    load(1, kind, true);
  }, [kind, load]);

  const onUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setError("");
    setNotes([]);
    try {
      const data = await uploadMedia(files);
      setNotes(data.errors || []);
      await load(1, kind, true);
    } catch (err) {
      if (err.status === 401) logout();
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (m) => {
    if (
      !window.confirm(
        `Delete "${m.originalName}"? Pages that use this file will lose it.`,
      )
    )
      return;
    try {
      await deleteMedia(m._id);
      setItems((list) => list.filter((x) => x._id !== m._id));
    } catch (err) {
      setError(err.message);
    }
  };

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(window.location.origin + url);
      setCopied(url);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setError("Could not copy the link");
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {!fixedKind &&
            tabs.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setKind(t.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  kind === t.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                {t.label}
              </button>
            ))}
        </div>

        <label
          className={`flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : "Upload files"}
          <input
            type="file"
            multiple
            accept={ACCEPT}
            onChange={onUpload}
            className="hidden"
          />
        </label>
      </div>

      <p className="mb-4 text-xs text-slate-500">
        Images up to 5 MB. Video, PDF and Office files up to 50 MB.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {notes.length > 0 && (
        <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          {notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {items.map((m) => (
          <div
            key={m._id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <button
              type="button"
              disabled={!onSelect}
              onClick={() => onSelect?.(m)}
              className="block w-full text-left"
            >
              {m.kind === "image" && (
                <img
                  src={m.url}
                  alt={m.originalName}
                  loading="lazy"
                  className="h-32 w-full bg-slate-100 object-cover"
                />
              )}
              {m.kind === "video" && (
                <div className="flex h-32 items-center justify-center bg-slate-900 text-white">
                  <Film size={36} />
                </div>
              )}
              {m.kind === "document" && (
                <div className="flex h-32 flex-col items-center justify-center gap-1 bg-slate-100 text-slate-600">
                  <FileText size={36} />
                  <span className="text-xs font-semibold uppercase">
                    {m.filename.split(".").pop()}
                  </span>
                </div>
              )}
            </button>

            <div className="p-3">
              <p
                className="truncate text-sm font-medium text-slate-800"
                title={m.originalName}
              >
                {m.originalName}
              </p>
              <p className="text-xs text-slate-500">{formatSize(m.size)}</p>

              {!onSelect && (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copy(m.url)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-300 py-1 text-xs hover:bg-slate-50"
                  >
                    <Copy size={12} />
                    {copied === m.url ? "Copied" : "Copy link"}
                  </button>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(m)}
                      className="rounded-lg border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="mt-6 text-center text-slate-500">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="mt-6 text-center text-slate-500">
          No files yet. Upload the first one.
        </p>
      )}

      {!loading && page < pages && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => load(page + 1, kind, false)}
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm hover:bg-slate-50"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
