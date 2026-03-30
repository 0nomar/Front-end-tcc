import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  TrendingUp,
  Star,
  User,
  Upload,
  Bell,
  LogOut,
  ChevronLeft,
  FlaskConical,
  Settings,
  Menu,
} from "lucide-react";
import { currentUser, notifications } from "../data/mockData";

const navItems = [
  { path: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/app/projects", label: "Projetos", icon: FolderOpen },
  { path: "/app/applications", label: "Inscrições", icon: FileText },
  { path: "/app/chat", label: "Mensagens", icon: MessageSquare },
  { path: "/app/progress", label: "Progresso", icon: TrendingUp },
  { path: "/app/feedback", label: "Feedback", icon: Star },
  { path: "/app/notifications", label: "Notificações", icon: Bell },
  { path: "/app/documents", label: "Documentos", icon: Upload },
  { path: "/app/profile", label: "Meu Perfil", icon: User },
];

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
          <FlaskConical size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-gray-900" style={{ fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif" }}>
              IniCiência
            </p>
            <p className="text-gray-400" style={{ fontSize: "0.65rem", fontWeight: 500 }}>
              Iniciação Científica
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
                <item.icon
                  size={18}
                  className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
                />
                {!collapsed && (
                  <span style={{ fontSize: "0.875rem", fontWeight: isActive ? 600 : 400 }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && item.label === "Notificações" && unreadCount > 0 && (
                  <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                    {unreadCount}
                  </span>
                )}
                {!collapsed && item.label === "Mensagens" && (
                  <span className="ml-auto bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                    2
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3 space-y-1">
        <NavLink
          to="/app/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
          onClick={() => setMobileOpen(false)}
        >
          <Settings size={18} className="text-gray-400 flex-shrink-0" />
          {!collapsed && <span style={{ fontSize: "0.875rem" }}>Configurações</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span style={{ fontSize: "0.875rem" }}>Sair</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 mt-1 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                {currentUser.avatar}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 truncate" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                {currentUser.name}
              </p>
              <p className="text-gray-400 truncate" style={{ fontSize: "0.7rem" }}>
                {currentUser.type === "student" ? "Aluno" : "Orientador"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-30 transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
        >
          <ChevronLeft
            size={14}
            className={`text-gray-500 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-50 w-64 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
