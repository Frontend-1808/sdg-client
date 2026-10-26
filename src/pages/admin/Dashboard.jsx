import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome, {user?.name}
      </h1>
      <p className="mt-2 text-slate-600">
        Select a section in the sidebar to manage the website.
      </p>
    </div>
  );
}
