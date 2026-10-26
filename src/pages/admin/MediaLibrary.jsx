import MediaBrowser from "@/components/admin/MediaBrowser";

export default function MediaLibrary() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Media Library</h1>
      <p className="mb-6 text-sm text-slate-600">
        All images, videos and documents of the website are stored here.
      </p>
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <MediaBrowser allowDelete />
      </div>
    </div>
  );
}
