import { Route, Routes } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Home from "@/pages/public/Home";
import Documents from "@/pages/public/Documents";
/* import About from "@/pages/public/About"; */
import GoalPage from "@/pages/public/GoalPage";
import NotFound from "@/pages/public/NotFound";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import GoalsAdmin from "@/pages/admin/GoalsAdmin";
import ComingSoon from "@/pages/admin/ComingSoon";
import GoalForm from "@/pages/admin/GoalForm";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import ArticlePage from "@/pages/public/ArticlePage";
import ArticlesAdmin from "@/pages/admin/ArticlesAdmin";
import ArticleForm from "@/pages/admin/ArticleForm";
import ServicesAdmin from "@/pages/admin/ServicesAdmin";
import ServiceForm from "@/pages/admin/ServiceForm";
import PageView from "@/pages/public/PageView";
import DocumentsAdmin from "@/pages/admin/DocumentsAdmin";
import DocumentForm from "@/pages/admin/DocumentForm";
import PagesAdmin from "@/pages/admin/PagesAdmin";
import PageForm from "@/pages/admin/PageForm";
import SettingsAdmin from "@/pages/admin/SettingsAdmin";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/about" element={<PageView slug="about" />} />
        <Route path="/p/:slug" element={<PageView />} />
        <Route path="/goals/:slug" element={<GoalPage />} />
        <Route path="/goals/:slug/:articleSlug" element={<ArticlePage />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="goals" element={<GoalsAdmin />} />
        <Route path="goals/new" element={<GoalForm />} />
        <Route path="goals/:id" element={<GoalForm />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="articles" element={<ArticlesAdmin />} />
        <Route path="articles/new" element={<ArticleForm />} />
        <Route path="articles/:id" element={<ArticleForm />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="services/new" element={<ServiceForm />} />
        <Route path="services/:id" element={<ServiceForm />} />
        <Route path="documents" element={<DocumentsAdmin />} />
        <Route path="documents/new" element={<DocumentForm />} />
        <Route path="documents/:id" element={<DocumentForm />} />
        <Route path="pages" element={<PagesAdmin />} />
        <Route path="pages/new" element={<PageForm />} />
        <Route path="pages/:id" element={<PageForm />} />
        <Route path="settings" element={<SettingsAdmin />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}
