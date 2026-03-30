import { useNavigate } from "react-router";
import {
  FolderOpen,
  FileText,
  MessageSquare,
  Bell,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  Star,
} from "lucide-react";
import { currentUser, dashboardStats, applications, projects, progressData, notifications } from "../data/mockData";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const activityData = [
  { month: "Set", atividade: 3 },
  { month: "Out", atividade: 5 },
  { month: "Nov", atividade: 4 },
  { month: "Dez", atividade: 7 },
  { month: "Jan", atividade: 6 },
  { month: "Fev", atividade: 9 },
  { month: "Mar", atividade: 8 },
];

const statCards = [
  {
    label: "Projetos ativos",
    value: dashboardStats.activeProjects,
    icon: FolderOpen,
    color: "blue",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    href: "/app/projects",
  },
  {
    label: "Inscrições",
    value: dashboardStats.applications,
    icon: FileText,
    color: "violet",
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
    href: "/app/applications",
  },
  {
    label: "Mensagens não lidas",
    value: dashboardStats.unreadMessages,
    icon: MessageSquare,
    color: "emerald",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    href: "/app/chat",
  },
  {
    label: "Notificações",
    value: dashboardStats.unreadNotifications,
    icon: Bell,
    color: "orange",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
    href: "/app/notifications",
  },
];

const statusColors = {
  approved: { bg: "bg-green-50", text: "text-green-700", label: "Aprovado" },
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Pendente" },
  rejected: { bg: "bg-red-50", text: "text-red-700", label: "Rejeitado" },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const recentNotifications = notifications.slice(0, 4);

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-10 w-32 h-32 bg-white rounded-full translate-y-1/3" />
        </div>
        <div className="relative z-10">
          <p className="text-blue-100 mb-1" style={{ fontSize: "0.875rem" }}>
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h2 className="text-white mb-1" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
            Olá, {currentUser.name.split(" ")[0]}! 👋
          </h2>
          <p className="text-blue-100" style={{ fontSize: "0.875rem" }}>
            Você tem <strong className="text-white">{dashboardStats.unreadNotifications} notificações</strong> e{" "}
            <strong className="text-white">{dashboardStats.unreadMessages} mensagens</strong> não lidas.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/app/projects")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors backdrop-blur"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              <FolderOpen size={14} /> Buscar projetos
            </button>
            <button
              onClick={() => navigate("/app/progress")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors backdrop-blur"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              <TrendingUp size={14} /> Ver progresso
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.href)}
            className={`bg-white rounded-2xl p-5 border ${card.border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                <card.icon size={18} className={card.text} />
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-gray-900 mb-1" style={{ fontSize: "1.8rem", fontWeight: 700 }}>
              {card.value}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.8rem" }}>
              {card.label}
            </p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active project */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current project */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Projeto em andamento
              </h3>
              <button onClick={() => navigate("/app/progress")} className="flex items-center gap-1 text-blue-600 hover:text-blue-700" style={{ fontSize: "0.8rem" }}>
                Ver detalhes <ArrowRight size={13} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FolderOpen size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 mb-1" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {progressData.project.title}
                  </h4>
                  <p className="text-gray-500 mb-4" style={{ fontSize: "0.8rem" }}>
                    Orientador: {progressData.project.advisor.name}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-gray-600" style={{ fontSize: "0.8rem" }}>
                        Fase atual: {progressData.currentPhase}
                      </span>
                      <span className="text-blue-600" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                        {progressData.completionPercent}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressData.completionPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="grid grid-cols-3 gap-2">
                    {progressData.milestones.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className={`p-2 rounded-xl text-center ${
                          m.status === "completed"
                            ? "bg-green-50"
                            : m.status === "in-progress"
                            ? "bg-blue-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="mb-1">
                          {m.status === "completed" ? (
                            <CheckCircle size={14} className="text-green-600 mx-auto" />
                          ) : m.status === "in-progress" ? (
                            <Clock size={14} className="text-blue-600 mx-auto" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 mx-auto" />
                          )}
                        </div>
                        <p className="text-gray-600 leading-tight" style={{ fontSize: "0.65rem" }}>
                          {m.title.split(" ").slice(0, 2).join(" ")}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Minhas inscrições
              </h3>
              <button onClick={() => navigate("/app/applications")} className="flex items-center gap-1 text-blue-600 hover:text-blue-700" style={{ fontSize: "0.8rem" }}>
                Ver todas <ArrowRight size={13} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {applications.map((app) => {
                const sc = statusColors[app.status];
                return (
                  <div key={app.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={15} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 truncate" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                        {app.project.title}
                      </p>
                      <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                        {app.project.advisor.name}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} flex-shrink-0`} style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                      {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Atividade recente
              </h3>
              <span className="text-gray-400" style={{ fontSize: "0.75rem" }}>Últimos 7 meses</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorAtiv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", fontSize: "0.8rem" }}
                  labelStyle={{ fontWeight: 600, color: "#374151" }}
                />
                <Area type="monotone" dataKey="atividade" stroke="#2563eb" strokeWidth={2} fill="url(#colorAtiv)" dot={{ fill: "#2563eb", strokeWidth: 2, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recommended projects */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Projetos sugeridos
              </h3>
              <button onClick={() => navigate("/app/projects")} className="flex items-center gap-1 text-blue-600" style={{ fontSize: "0.75rem" }}>
                Ver todos <ArrowRight size={12} />
              </button>
            </div>
            <div className="p-3 space-y-2">
              {projects.filter(p => p.status === "open").slice(0, 3).map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/app/projects/${project.id}`)}
                  className="w-full p-3 rounded-xl text-left hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-100"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderOpen size={14} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 line-clamp-2 leading-tight" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                        {project.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-gray-400" style={{ fontSize: "0.7rem" }}>
                          {project.slots - project.slotsUsed} vaga{project.slots - project.slotsUsed !== 1 ? "s" : ""}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-400" style={{ fontSize: "0.7rem" }}>{project.scholarship}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Notificações
              </h3>
              <button onClick={() => navigate("/app/notifications")} className="flex items-center gap-1 text-blue-600" style={{ fontSize: "0.75rem" }}>
                Ver todas <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentNotifications.map((notif) => {
                const typeIcon = {
                  success: <CheckCircle size={14} className="text-green-600" />,
                  info: <Bell size={14} className="text-blue-600" />,
                  warning: <AlertCircle size={14} className="text-orange-600" />,
                  error: <AlertCircle size={14} className="text-red-600" />,
                };
                const typeBg = {
                  success: "bg-green-50",
                  info: "bg-blue-50",
                  warning: "bg-orange-50",
                  error: "bg-red-50",
                };
                return (
                  <div key={notif.id} className={`px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!notif.read ? "bg-blue-50/30" : ""}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${typeBg[notif.type]}`}>
                      {typeIcon[notif.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800" style={{ fontSize: "0.8rem", fontWeight: notif.read ? 400 : 600 }}>
                        {notif.title}
                      </p>
                      <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.72rem" }}>
                        {new Date(notif.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl border border-violet-100 p-5">
            <h3 className="text-gray-900 mb-3" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              Ações rápidas
            </h3>
            <div className="space-y-2">
              {[
                { label: "Explorar projetos abertos", icon: FolderOpen, href: "/app/projects" },
                { label: "Ver meu progresso", icon: TrendingUp, href: "/app/progress" },
                { label: "Enviar documentos", icon: FileText, href: "/app/documents" },
                { label: "Dar feedback", icon: Star, href: "/app/feedback" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.href)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-white rounded-xl hover:shadow-sm transition-all text-left border border-white hover:border-blue-100 group"
                >
                  <action.icon size={14} className="text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 flex-1" style={{ fontSize: "0.8rem" }}>{action.label}</span>
                  <ChevronRight size={13} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
