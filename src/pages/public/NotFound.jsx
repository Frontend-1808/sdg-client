import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-slate-900">404</h1>
      <p className="mt-3 text-slate-600">This page does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
