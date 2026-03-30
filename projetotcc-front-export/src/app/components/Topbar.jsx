import { Bell, Search, Menu, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { currentUser, notifications } from "../data/mockData";

export function Topbar({ onMenuClick, title, subtitle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-400 hover:border-gray-200 transition-colors" style={{ fontSize: "0.85rem" }}>
          <Search size={15} />
          <span>Buscar...</span>
          <span className="ml-8 text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">⌘K</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/app/notifications")}
          className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Bell size={18} className="text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center" style={{ fontSize: "0.6rem", fontWeight: 700, color: "white" }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <span className="text-white" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                {currentUser.avatar}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-gray-800" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                {currentUser.name.split(" ")[0]}
              </p>
              <p className="text-gray-400" style={{ fontSize: "0.65rem" }}>
                {currentUser.type === "student" ? "Aluno" : "Orientador"}
              </p>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              <button
                onClick={() => { navigate("/app/profile"); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors"
                style={{ fontSize: "0.85rem" }}
              >
                Meu Perfil
              </button>
              <button
                onClick={() => { navigate("/app/settings"); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors"
                style={{ fontSize: "0.85rem" }}
              >
                Configurações
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => { navigate("/"); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500 transition-colors"
                style={{ fontSize: "0.85rem" }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
