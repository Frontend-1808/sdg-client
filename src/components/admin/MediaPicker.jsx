import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import MediaBrowser from "./MediaBrowser";

export default function MediaPicker({ open, onClose, onSelect, kind = "" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Choose a file</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <MediaBrowser onSelect={onSelect} fixedKind={kind} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
