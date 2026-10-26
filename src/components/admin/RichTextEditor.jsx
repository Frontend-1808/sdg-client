import { useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import MediaPicker from "./MediaPicker";

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function mediaToHtml(m) {
  if (m.kind === "image") {
    return `<img src="${m.url}" alt="${esc(m.originalName)}" style="max-width:100%">`;
  }
  if (m.kind === "video") {
    return `<video controls preload="metadata" style="max-width:100%"><source src="${m.url}" type="${m.mimeType}"></video>`;
  }
  return `<a href="${m.url}" target="_blank">${esc(m.originalName)}</a>`;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
}) {
  const editorRef = useRef(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 520,
      placeholder,
      toolbarAdaptive: true,
      toolbarSticky: false,
      askBeforePasteHTML: false,
      defaultActionOnPaste: "insert_clear_html",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "paragraph",
        "brush",
        "|",
        "align",
        "outdent",
        "indent",
        "|",
        "link",
        "image",
        "video",
        "file",
        "table",
        "hr",
        "|",
        "undo",
        "redo",
        "|",
        "eraser",
        "copyformat",
        "|",
        "fullsize",
        "source",
      ],
      extraButtons: [
        {
          name: "media",
          icon: "folder",
          tooltip: "Media library",
          exec: (editor) => {
            editorRef.current = editor;
            setPickerOpen(true);
          },
        },
      ],
      uploader: {
        url: "/api/admin/media/jodit",
        method: "POST",
        format: "json",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        filesVariableName: () => "file",
        isSuccess: (resp) => resp.success === true,
        getMessage: (resp) => (resp.data?.messages || []).join(" "),
        process: (resp) => resp.data,
      },
    }),
    [placeholder],
  );

  const handleSelect = (media) => {
    const editor = editorRef.current;
    setPickerOpen(false);
    if (!editor) return;
    editor.selection.focus();
    editor.selection.insertHTML(mediaToHtml(media));
    onChange(editor.value);
  };

  return (
    <>
      <JoditEditor
        value={value}
        config={config}
        onBlur={(html) => onChange(html)}
      />
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
