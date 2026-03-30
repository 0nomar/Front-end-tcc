import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Check,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { notifications as initialNotifications } from "../data/mockData";

const typeConfig = {
  success: { icon: CheckCircle, bg: "bg-green-50", iconColor: "text-green-600", border: "border-green-100", label: "Sucesso" },
  info: { icon: Info, bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100", label: "Informação" },
  warning: { icon: AlertCircle, bg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-100", label: "Atenção" },
  error: { icon: XCircle, bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100", label: "Erro" },
};

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Agora mesmo";
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} dias atrás`;
  return date.toLocaleDateString("pt-BR");
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-5 max-w-3xl" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-gray-600" />
          <span className="text-gray-700" style={{ fontWeight: 600 }}>
            {unreadCount > 0 ? `${unreadCount} não lidas` : "Nenhuma nova notificação"}
          </span>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              style={{ fontSize: "0.8rem" }}
            >
              <CheckCheck size={14} />
              Marcar todas como lidas
            </button>
          )}
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
            style={{ fontSize: "0.8rem" }}
          >
            <Trash2 size={14} />
            Limpar tudo
          </button>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "success", "info", "warning", "error"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all ${
              filter === t
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
            style={{ fontSize: "0.8rem", fontWeight: filter === t ? 600 : 400 }}
          >
            {t === "all" ? "Todas" : typeConfig[t].label}
            <span className="ml-1.5 opacity-60">
              {t === "all" ? notifications.length : notifications.filter((n) => n.type === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-gray-400" />
          </div>
          <h3 className="text-gray-700 mb-2" style={{ fontWeight: 600, fontSize: "1rem" }}>
            Nenhuma notificação
          </h3>
          <p className="text-gray-400" style={{ fontSize: "0.875rem" }}>
            Você está em dia! Não há notificações para exibir.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Group: Unread */}
          {filtered.some((n) => !n.read) && (
            <div className="mb-1">
              <p className="text-gray-500 mb-2 px-1" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Não lidas
              </p>
              {filtered
                .filter((n) => !n.read)
                .map((notif) => {
                  const cfg = typeConfig[notif.type];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={notif.id}
                      className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-blue-100 hover:shadow-sm transition-all group relative overflow-hidden"
                    >
                      {/* Unread indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r" />

                      <div className={`w-10 h-10 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className={cfg.iconColor} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-gray-900" style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                            {notif.title}
                          </p>
                          <span className="text-gray-400 flex-shrink-0" style={{ fontSize: "0.72rem" }}>
                            {timeAgo(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-0.5" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => navigate(notif.actionUrl)}
                            className="text-blue-600 hover:text-blue-700"
                            style={{ fontSize: "0.78rem", fontWeight: 500 }}
                          >
                            Ver detalhes →
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                          title="Marcar como lida"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Group: Read */}
          {filtered.some((n) => n.read) && (
            <div>
              <p className="text-gray-400 mb-2 mt-4 px-1" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Lidas
              </p>
              {filtered
                .filter((n) => n.read)
                .map((notif) => {
                  const cfg = typeConfig[notif.type];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={notif.id}
                      className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group opacity-75 hover:opacity-100"
                    >
                      <div className={`w-10 h-10 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className={cfg.iconColor} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-gray-700" style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                            {notif.title}
                          </p>
                          <span className="text-gray-300 flex-shrink-0" style={{ fontSize: "0.72rem" }}>
                            {timeAgo(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-500 mt-0.5" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                          {notif.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
