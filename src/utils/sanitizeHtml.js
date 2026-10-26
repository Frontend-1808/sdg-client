import DOMPurify from "dompurify";

// Video faqat shu manzillardan joylanadi. Boshqa iframe o'chiriladi.
const ALLOWED_IFRAME = [
  "https://www.youtube.com/embed/",
  "https://www.youtube-nocookie.com/embed/",
  "https://player.vimeo.com/video/",
  "https://drive.google.com/file/d/",
];

DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const src = node.getAttribute("src") || "";
    if (!ALLOWED_IFRAME.some((prefix) => src.startsWith(prefix))) {
      node.parentNode?.removeChild(node);
    }
  }
});

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export function cleanHtml(html) {
  return DOMPurify.sanitize(html || "", {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "target"],
  });
}
