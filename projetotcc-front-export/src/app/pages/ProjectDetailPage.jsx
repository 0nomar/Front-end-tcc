import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Users,
  Clock,
  DollarSign,
  BookOpen,
  Star,
  CheckCircle,
  Send,
  Mail,
  MessageSquare,
  Share2,
  Bookmark,
  BarChart2,
  Eye,
} from "lucide-react";
import { projects } from "../data/mockData";

const statusStyles = {
  open: { bg: "bg-green-50", text: "text-green-700", label: "Aberto para inscrições" },
  "in-progress": { bg: "bg-blue-50", text: "text-blue-700", label: "Em andamento" },
  closed: { bg: "bg-gray-100", text: "text-gray-600", label: "Encerrado" },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const project = projects.find((p) => p.id === id) || projects[0];
  const sc = statusStyles[project.status];

  const handleApply = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setApplied(true);
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        style={{ fontSize: "0.875rem" }}
      >
        <ArrowLeft size={16} />
        Voltar para projetos
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 rounded-xl ${sc.bg} ${sc.text} border border-current/20`} style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  {sc.label}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200" style={{ fontSize: "0.8rem" }}>
                  {project.area}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`p-2 rounded-xl transition-colors ${saved ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-400"}`}
                >
                  <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                </button>
                <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <h1 className="text-gray-900 mb-3 leading-snug" style={{ fontWeight: 700, fontSize: "1.3rem" }}>
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-500" style={{ fontSize: "0.8rem" }}>
              <div className="flex items-center gap-1.5">
                <Eye size={14} />
                {project.views} visualizações
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart2 size={14} />
                {project.applications} inscrições
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                Publicado em {new Date(project.createdAt).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-gray-900 mb-4" style={{ fontWeight: 600, fontSize: "1rem" }}>
              Sobre o projeto
            </h2>
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
              {project.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-gray-900 mb-4" style={{ fontWeight: 600, fontSize: "1rem" }}>
              Requisitos
            </h2>
            <div className="space-y-2.5">
              {project.requirements.map((req) => (
                <div key={req} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-blue-600" />
                  </div>
                  <span className="text-gray-700" style={{ fontSize: "0.875rem" }}>
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligible courses */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-gray-900 mb-4" style={{ fontWeight: 600, fontSize: "1rem" }}>
              Cursos elegíveis
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.course.map((c) => (
                <span key={c} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700" style={{ fontSize: "0.8rem" }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-gray-900 mb-4" style={{ fontWeight: 600, fontSize: "1rem" }}>
              Tecnologias e competências
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            {applied ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-2" style={{ fontWeight: 600, fontSize: "1rem" }}>
                  Inscrição enviada!
                </h3>
                <p className="text-gray-500 mb-4" style={{ fontSize: "0.85rem" }}>
                  Aguarde o retorno do orientador. Você receberá uma notificação.
                </p>
                <button
                  onClick={() => navigate("/app/applications")}
                  className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                  style={{ fontSize: "0.875rem" }}
                >
                  Ver minhas inscrições
                </button>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { icon: Users, label: "Vagas disponíveis", value: `${project.slots - project.slotsUsed}/${project.slots}` },
                    { icon: Clock, label: "Duração", value: project.duration },
                    { icon: DollarSign, label: "Bolsa", value: project.scholarship },
                    { icon: BookOpen, label: "Área", value: project.area },
                  ].map((s) => (
                    <div key={s.label} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-1.5 mb-1">
                        <s.icon size={13} className="text-gray-400" />
                        <span className="text-gray-400" style={{ fontSize: "0.68rem" }}>{s.label}</span>
                      </div>
                      <p className="text-gray-800" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                {project.status === "open" ? (
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                    style={{ fontWeight: 600, fontSize: "0.9rem" }}
                  >
                    <Send size={16} />
                    Inscrever-se
                  </button>
                ) : (
                  <div className="w-full py-3.5 bg-gray-100 text-gray-500 rounded-xl text-center" style={{ fontSize: "0.9rem" }}>
                    {project.status === "closed" ? "Vagas encerradas" : "Projeto em andamento"}
                  </div>
                )}

                <button
                  onClick={() => navigate("/app/chat")}
                  className="w-full mt-3 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  style={{ fontSize: "0.875rem" }}
                >
                  <MessageSquare size={15} />
                  Perguntar ao orientador
                </button>
              </>
            )}
          </div>

          {/* Advisor card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              Orientador do projeto
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white" style={{ fontWeight: 700 }}>
                  {project.advisor.avatar}
                </span>
              </div>
              <div>
                <p className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  {project.advisor.name}
                </p>
                <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>
                  {project.advisor.department}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              {[
                { label: "Especialidade", value: project.advisor.specialty },
                { label: "Projetos ativos", value: project.advisor.projects.toString() },
                { label: "Alunos orientados", value: project.advisor.students.toString() },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>{s.label}</span>
                  <span className="text-gray-700" style={{ fontSize: "0.78rem", fontWeight: 500 }}>{s.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-gray-400" style={{ fontSize: "0.78rem" }}>Avaliação</span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-gray-700" style={{ fontSize: "0.78rem", fontWeight: 500 }}>{project.advisor.rating}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/app/chat")}
              className="w-full py-2.5 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              <Mail size={14} />
              Enviar mensagem
            </button>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                Inscrição no projeto
              </h3>
              <p className="text-gray-500 mt-1" style={{ fontSize: "0.85rem" }}>
                {project.title}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  Carta de motivação *
                </label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Descreva sua motivação, experiências relevantes e por que você é o candidato ideal para este projeto..."
                  style={{ fontSize: "0.875rem" }}
                />
                <p className="text-gray-400 mt-1" style={{ fontSize: "0.75rem" }}>
                  {motivation.length}/1000 caracteres
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-blue-700" style={{ fontSize: "0.8rem" }}>
                  <strong>Dica:</strong> Uma boa carta de motivação menciona suas habilidades técnicas relevantes, experiências anteriores e como o projeto se alinha com seus objetivos acadêmicos.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                style={{ fontSize: "0.875rem" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleApply}
                disabled={loading || motivation.length < 50}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ fontWeight: 600, fontSize: "0.875rem" }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} />
                    Enviar inscrição
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
