import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  MessageSquare,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { applications } from "../data/mockData";

const statusConfig = {
  approved: {
    label: "Aprovado",
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    iconColor: "text-green-600",
    badgeBg: "bg-green-100",
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    iconColor: "text-yellow-600",
    badgeBg: "bg-yellow-100",
  },
  rejected: {
    label: "Não aprovado",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    iconColor: "text-red-600",
    badgeBg: "bg-red-100",
  },
};

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered =
    filter === "all" ? applications : applications.filter((a) => a.status === filter);

  const counts = {
    all: applications.length,
    approved: applications.filter((a) => a.status === "approved").length,
    pending: applications.filter((a) => a.status === "pending").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["all", "approved", "pending", "rejected"].map((s) => {
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                filter === s
                  ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                  : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
              }`}
            >
              <p className={`text-2xl mb-1 ${filter === s ? "text-blue-700" : "text-gray-900"}`} style={{ fontWeight: 700 }}>
                {counts[s]}
              </p>
              <p className={`${filter === s ? "text-blue-600" : "text-gray-500"}`} style={{ fontSize: "0.78rem" }}>
                {s === "all"
                  ? "Total de inscrições"
                  : s === "approved"
                  ? "Aprovadas"
                  : s === "pending"
                  ? "Aguardando"
                  : "Não aprovadas"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit">
        {["all", "approved", "pending", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === s ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontSize: "0.8rem", fontWeight: filter === s ? 600 : 400 }}
          >
            {s === "all" ? "Todas" : statusConfig[s].label}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-gray-400" />
          </div>
          <h3 className="text-gray-700 mb-2" style={{ fontWeight: 600, fontSize: "1rem" }}>
            Nenhuma inscrição encontrada
          </h3>
          <p className="text-gray-400 mb-6" style={{ fontSize: "0.875rem" }}>
            {filter === "all" ? "Você ainda não se inscreveu em nenhum projeto." : `Você não tem inscrições com status "${statusConfig[filter].label}".`}
          </p>
          <button
            onClick={() => navigate("/app/projects")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            Explorar projetos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const cfg = statusConfig[app.status];
            const isExpanded = expandedId === app.id;

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : app.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <cfg.icon size={20} className={cfg.iconColor} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="text-gray-900 line-clamp-1" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                          {app.project.title}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.text} flex-shrink-0`}
                          style={{ fontSize: "0.72rem", fontWeight: 600 }}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      <p className="text-gray-500 mb-2" style={{ fontSize: "0.8rem" }}>
                        Orientador: {app.project.advisor.name}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-gray-400" style={{ fontSize: "0.75rem" }}>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          Inscrito em {new Date(app.appliedAt).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          Atualizado em {new Date(app.updatedAt).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      size={16}
                      className={`text-gray-300 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className={`border-t ${cfg.border} px-5 pb-5 pt-4`}>
                    <div className="space-y-4">
                      {/* Motivation */}
                      <div>
                        <h4 className="text-gray-700 mb-2" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                          Sua carta de motivação
                        </h4>
                        <p className={`text-gray-600 ${cfg.bg} p-4 rounded-xl`} style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                          {app.motivation}
                        </p>
                      </div>

                      {/* Feedback (if any) */}
                      {app.feedback && (
                        <div>
                          <h4 className="text-gray-700 mb-2" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                            Resposta do orientador
                          </h4>
                          <p className="text-gray-600 bg-gray-50 p-4 rounded-xl" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                            {app.feedback}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate(`/app/projects/${app.project.id}`)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <ExternalLink size={13} />
                          Ver projeto
                        </button>
                        <button
                          onClick={() => navigate("/app/chat")}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-100 transition-colors"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <MessageSquare size={13} />
                          Enviar mensagem
                        </button>
                        {app.status === "approved" && (
                          <button
                            onClick={() => navigate("/app/progress")}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-600 hover:bg-green-100 transition-colors"
                            style={{ fontSize: "0.8rem" }}
                          >
                            <CheckCircle size={13} />
                            Ver progresso
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
