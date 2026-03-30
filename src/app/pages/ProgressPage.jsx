import { useState } from "react";
import { CheckCircle, Clock, Circle, TrendingUp, Calendar, AlertCircle, Plus } from "lucide-react";
import { progressData } from "../data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const updateTypeConfig = {
  milestone: { color: "text-green-600", bg: "bg-green-50", border: "border-green-200", label: "Marco" },
  update: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Atualização" },
  issue: { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", label: "Problema" },
};

const milestoneConfig = {
  completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", border: "border-green-200", line: "bg-green-400" },
  "in-progress": { icon: Clock, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200", line: "bg-blue-300" },
  pending: { icon: Circle, color: "text-gray-400", bg: "bg-gray-100", border: "border-gray-200", line: "bg-gray-200" },
};

export default function ProgressPage() {
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ title: "", content: "", type: "update" });
  const [updates, setUpdates] = useState(progressData.updates);

  const handleAddUpdate = () => {
    if (!newUpdate.title || !newUpdate.content) return;
    const upd = {
      id: `upd${Date.now()}`,
      title: newUpdate.title,
      content: newUpdate.content,
      author: "Lucas Mendes",
      date: new Date().toISOString().split("T")[0],
      type: newUpdate.type,
    };
    setUpdates([upd, ...updates]);
    setNewUpdate({ title: "", content: "", type: "update" });
    setShowAddUpdate(false);
  };

  const daysLeft = Math.ceil(
    (new Date(progressData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Progress donut */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { value: progressData.completionPercent },
                    { value: 100 - progressData.completionPercent },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-900" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  {progressData.completionPercent}%
                </p>
                <p className="text-gray-400" style={{ fontSize: "0.65rem" }}>concluído</p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 text-center" style={{ fontWeight: 600, fontSize: "0.85rem" }}>
            Progresso geral
          </p>
          <p className="text-gray-400 text-center mt-1" style={{ fontSize: "0.75rem" }}>
            {progressData.milestones.filter(m => m.status === "completed").length} de {progressData.milestones.length} marcos concluídos
          </p>
        </div>

        {/* Project info */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between mb-4">
            <div>
              <h2 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1rem" }}>
                {progressData.project.title}
              </h2>
              <p className="text-gray-500" style={{ fontSize: "0.8rem" }}>
                Orientador: {progressData.project.advisor.name}
              </p>
            </div>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              Em andamento
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Início", value: new Date(progressData.startDate).toLocaleDateString("pt-BR"), icon: Calendar },
              { label: "Término previsto", value: new Date(progressData.endDate).toLocaleDateString("pt-BR"), icon: Calendar },
              { label: "Dias restantes", value: `${daysLeft} dias`, icon: Clock },
            ].map((s) => (
              <div key={s.label} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <s.icon size={13} className="text-gray-400" />
                  <span className="text-gray-400" style={{ fontSize: "0.68rem" }}>{s.label}</span>
                </div>
                <p className="text-gray-800" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                Fase atual: <span className="text-blue-600">{progressData.currentPhase}</span>
              </span>
              <span className="text-blue-600" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                {progressData.completionPercent}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${progressData.completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <h3 className="text-gray-900 mb-6" style={{ fontWeight: 700, fontSize: "1rem" }}>
            Linha do tempo
          </h3>
          <div className="relative">
            {progressData.milestones.map((milestone, i) => {
              const cfg = milestoneConfig[milestone.status];
              const Icon = cfg.icon;
              const isLast = i === progressData.milestones.length - 1;

              return (
                <div key={milestone.id} className="flex gap-4 pb-6 relative">
                  {/* Line */}
                  {!isLast && (
                    <div className={`absolute left-5 top-10 w-0.5 h-full ${cfg.line}`} />
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0 z-10`}>
                    <Icon size={17} className={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`${milestone.status === "pending" ? "text-gray-400" : "text-gray-900"}`} style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                        {milestone.title}
                      </h4>
                      {milestone.status !== "pending" && (
                        <span className={`px-2 py-0.5 rounded-lg ${cfg.bg} ${cfg.color} flex-shrink-0`} style={{ fontSize: "0.68rem", fontWeight: 600 }}>
                          {milestone.status === "completed" ? "Concluído" : "Em andamento"}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 mb-2" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>
                      {milestone.description}
                    </p>
                    <div className="flex items-center gap-3" style={{ fontSize: "0.72rem" }}>
                      <span className="text-gray-400">
                        Prazo: {new Date(milestone.dueDate).toLocaleDateString("pt-BR")}
                      </span>
                      {milestone.completedDate && (
                        <span className="text-green-600">
                          Concluído: {new Date(milestone.completedDate).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
            <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>
              Atualizações
            </h3>
            <button
              onClick={() => setShowAddUpdate(!showAddUpdate)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              <Plus size={14} />
              Nova atualização
            </button>
          </div>

          {/* Add update form */}
          {showAddUpdate && (
            <div className="px-4 md:px-6 py-4 bg-blue-50 border-b border-blue-100">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {["update", "milestone", "issue"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewUpdate({ ...newUpdate, type: t })}
                      className={`px-3 py-1.5 rounded-xl border transition-all ${
                        newUpdate.type === t
                          ? `${updateTypeConfig[t].bg} ${updateTypeConfig[t].color} ${updateTypeConfig[t].border}`
                          : "bg-white border-gray-200 text-gray-500"
                      }`}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {updateTypeConfig[t].label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                  placeholder="Título da atualização..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={{ fontSize: "0.85rem" }}
                />
                <textarea
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                  placeholder="Descreva a atualização..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  style={{ fontSize: "0.85rem" }}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setShowAddUpdate(false)}
                    className="flex-1 py-2 border border-gray-200 bg-white rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddUpdate}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    style={{ fontSize: "0.8rem", fontWeight: 600 }}
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Updates list */}
          <div className="divide-y divide-gray-50 overflow-y-auto max-h-96">
            {updates.map((update) => {
              const cfg = updateTypeConfig[update.type];
              return (
                <div key={update.id} className="px-4 md:px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {update.type === "milestone" ? (
                        <CheckCircle size={14} className={cfg.color} />
                      ) : update.type === "issue" ? (
                        <AlertCircle size={14} className={cfg.color} />
                      ) : (
                        <TrendingUp size={14} className={cfg.color} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-1">
                        <h4 className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                          {update.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-lg ${cfg.bg} ${cfg.color} flex-shrink-0`} style={{ fontSize: "0.67rem", fontWeight: 600 }}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2" style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>
                        {update.content}
                      </p>
                      <div className="flex items-center gap-3 text-gray-400" style={{ fontSize: "0.7rem" }}>
                        <span>{update.author}</span>
                        <span>·</span>
                        <span>{new Date(update.date).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
