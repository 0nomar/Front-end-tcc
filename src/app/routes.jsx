import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectApplicationsPage from "./pages/ProjectApplicationsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ChatPage from "./pages/ChatPage";
import ProgressPage from "./pages/ProgressPage";
import FeedbackPage from "./pages/FeedbackPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import UserProfilePage from "./pages/UserProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: DashboardPage },
      { path: "projects", Component: ProjectsPage },
      { path: "projects/new", Component: CreateProjectPage },
      { path: "projects/:id/edit", Component: EditProjectPage },
      { path: "projects/:id/applications", Component: ProjectApplicationsPage },
      { path: "projects/:id", Component: ProjectDetailPage },
      { path: "applications", Component: ApplicationsPage },
      { path: "chat", Component: ChatPage },
      { path: "progress", Component: ProgressPage },
      { path: "feedback", Component: FeedbackPage },
      { path: "profile", Component: ProfilePage },
      { path: "documents", Component: ProfilePage },
      { path: "notifications", Component: NotificationsPage },
      { path: "configuracoes", Component: SettingsPage },
      { path: "users/:id", Component: UserProfilePage },
    ],
  },
]);
