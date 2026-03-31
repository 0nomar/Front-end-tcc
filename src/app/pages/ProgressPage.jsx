import { useState } from "react";
import { CheckCircle, Clock, Circle, TrendingUp, Calendar, AlertCircle, Plus } from "lucide-react";
import { progressData } from "../data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./ProgressPage.css";

const updateTypeConfig = {
  milestone: { iconeAreaClass: "atualizacao-item__icone-area--marco", iconeClass: "atualizacao-item__icone-svg--marco", etiquetaClass: "atualizacao-item__etiqueta--marco", tipoAtivoClass: "formulario-atualizacao__tipo--marco-ativo", label: "Marco" },
  update:    { iconeAreaClass: "atualizacao-item__icone-area--atualizacao", iconeClass: "atualizacao-item__icone-svg--atualizacao", etiquetaClass: "atualizacao-item__etiqueta--atualizacao", tipoAtivoClass: "formulario-atualizacao__tipo--atualizacao-ativo", label: "Atualização" },
  issue:     { iconeAreaClass: "atualizacao-item__icone-area--problema", iconeClass: "atualizacao-item__icone-svg--problema", etiquetaClass: "atualizacao-item__etiqueta--problema", tipoAtivoClass: "formulario-atualizacao__tipo--problema-ativo", label: "Problema" },
};

const milestoneConfig = {
  completed:   { icon: CheckCircle, iconClass: "marco-linha-do-tempo__icone-svg--concluido", iconeClass: "marco-linha-do-tempo__icone--concluido", conectorClass: "marco-linha-do-tempo__conector--concluido", tituloClass: "marco-linha-do-tempo__titulo--concluido", etiquetaClass: "marco-linha-do-tempo__etiqueta--concluido", etiquetaLabel: "Concluído" },
  "in-progress": { icon: Clock, iconClass: "marco-linha-do-tempo__icone-svg--andamento", iconeClass: "marco-linha-do-tempo__icone--andamento", conectorClass: "marco-linha-do-tempo__conector--andamento", tituloClass: "marco-linha-do-tempo__titulo--andamento", etiquetaClass: "marco-linha-do-tempo__etiqueta--andamento", etiquetaLabel: "Em andamento" },
  pending:     { icon: Circle, iconClass: "marco-linha-do-tempo__icone-svg--pendente", iconeClass: "marco-linha-do-tempo__icone--pendente", conectorClass: "marco-linha-do-tempo__conector--pendente", tituloClass: "marco-linha-do-tempo__titulo--pendente", etiquetaClass: null, etiquetaLabel: null },
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
    <div className="pagina-progresso">
      {/* Visão geral */}
      <div className="pagina-progresso__grade-visao-geral">
        {/* Donut */}
        <div className="progresso-donut">
          <div className="progresso-donut__grafico">
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
            <div className="progresso-donut__centro">
              <div className="progresso-donut__centro-conteudo">
                <p className="progresso-donut__percentual">{progressData.completionPercent}%</p>
                <p className="progresso-donut__label-percentual">concluído</p>
              </div>
            </div>
          </div>
          <p className="progresso-donut__titulo">Progresso geral</p>
          <p className="progresso-donut__subtitulo">
            {progressData.milestones.filter(m => m.status === "completed").length} de {progressData.milestones.length} marcos concluídos
          </p>
        </div>

        {/* Info do projeto */}
        <div className="pagina-progresso__info-projeto">
          <div className="pagina-progresso__cabecalho-projeto">
            <div>
              <h2 className="pagina-progresso__titulo-projeto">{progressData.project.title}</h2>
              <p className="pagina-progresso__orientador-projeto">
                Orientador: {progressData.project.advisor.name}
              </p>
            </div>
            <span className="pagina-progresso__badge-status">Em andamento</span>
          </div>

          <div className="pagina-progresso__grade-datas">
            {[
              { label: "Início", value: new Date(progressData.startDate).toLocaleDateString("pt-BR"), icon: Calendar },
              { label: "Término previsto", value: new Date(progressData.endDate).toLocaleDateString("pt-BR"), icon: Calendar },
              { label: "Dias restantes", value: `${daysLeft} dias`, icon: Clock },
            ].map((s) => (
              <div key={s.label} className="pagina-progresso__item-data">
                <div className="pagina-progresso__linha-data">
                  <s.icon size={13} className="pagina-progresso__icone-data" />
                  <span className="pagina-progresso__label-data">{s.label}</span>
                </div>
                <p className="pagina-progresso__valor-data">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="pagina-progresso__secao-barra">
            <div className="pagina-progresso__topo-barra">
              <span className="pagina-progresso__fase-atual">
                Fase atual: <span className="pagina-progresso__fase-destaque">{progressData.currentPhase}</span>
              </span>
              <span className="pagina-progresso__percentual-barra">{progressData.completionPercent}%</span>
            </div>
            <div className="pagina-progresso__trilha-barra">
              <div
                className="pagina-progresso__preenchimento-barra"
                style={{ width: `${progressData.completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pagina-progresso__grade-inferior">
        {/* Linha do tempo */}
        <div className="pagina-progresso__card">
          <div className="pagina-progresso__card-padding">
            <h3 className="pagina-progresso__titulo-card">Linha do tempo</h3>
            <div className="linha-do-tempo">
              {progressData.milestones.map((milestone, i) => {
                const cfg = milestoneConfig[milestone.status];
                const Icon = cfg.icon;
                const isLast = i === progressData.milestones.length - 1;

                return (
                  <div key={milestone.id} className="marco-linha-do-tempo">
                    {!isLast && (
                      <div className={`marco-linha-do-tempo__conector ${cfg.conectorClass}`} />
                    )}
                    <div className={`marco-linha-do-tempo__icone ${cfg.iconeClass}`}>
                      <Icon size={17} className={cfg.iconClass} />
                    </div>
                    <div className="marco-linha-do-tempo__conteudo">
                      <div className="marco-linha-do-tempo__linha-titulo">
                        <h4 className={`marco-linha-do-tempo__titulo ${cfg.tituloClass}`}>
                          {milestone.title}
                        </h4>
                        {cfg.etiquetaLabel && (
                          <span className={`marco-linha-do-tempo__etiqueta ${cfg.etiquetaClass}`}>
                            {cfg.etiquetaLabel}
                          </span>
                        )}
                      </div>
                      <p className="marco-linha-do-tempo__descricao">{milestone.description}</p>
                      <div className="marco-linha-do-tempo__datas">
                        <span className="marco-linha-do-tempo__prazo">
                          Prazo: {new Date(milestone.dueDate).toLocaleDateString("pt-BR")}
                        </span>
                        {milestone.completedDate && (
                          <span className="marco-linha-do-tempo__conclusao">
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
        </div>

        {/* Atualizações */}
        <div className="pagina-progresso__card">
          <div className="pagina-progresso__cabecalho-atualizacoes">
            <h3 className="pagina-progresso__titulo-card" style={{ marginBottom: 0 }}>Atualizações</h3>
            <button
              onClick={() => setShowAddUpdate(!showAddUpdate)}
              className="pagina-progresso__botao-nova-atualizacao"
            >
              <Plus size={14} />
              Nova atualização
            </button>
          </div>

          {showAddUpdate && (
            <div className="formulario-atualizacao">
              <div className="formulario-atualizacao__conteudo">
                <div className="formulario-atualizacao__tipos">
                  {["update", "milestone", "issue"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewUpdate({ ...newUpdate, type: t })}
                      className={`formulario-atualizacao__tipo ${
                        newUpdate.type === t
                          ? updateTypeConfig[t].tipoAtivoClass
                          : "formulario-atualizacao__tipo--inativo"
                      }`}
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
                  className="formulario-atualizacao__input"
                />
                <textarea
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                  placeholder="Descreva a atualização..."
                  rows={3}
                  className="formulario-atualizacao__textarea"
                />
                <div className="formulario-atualizacao__acoes">
                  <button onClick={() => setShowAddUpdate(false)} className="formulario-atualizacao__botao-cancelar">
                    Cancelar
                  </button>
                  <button onClick={handleAddUpdate} className="formulario-atualizacao__botao-publicar">
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pagina-progresso__lista-atualizacoes">
            {updates.map((update) => {
              const cfg = updateTypeConfig[update.type];
              return (
                <div key={update.id} className="atualizacao-item">
                  <div className="atualizacao-item__linha">
                    <div className={`atualizacao-item__icone-area ${cfg.iconeAreaClass}`}>
                      {update.type === "milestone" ? (
                        <CheckCircle size={14} className={cfg.iconeClass} />
                      ) : update.type === "issue" ? (
                        <AlertCircle size={14} className={cfg.iconeClass} />
                      ) : (
                        <TrendingUp size={14} className={cfg.iconeClass} />
                      )}
                    </div>
                    <div className="atualizacao-item__conteudo">
                      <div className="atualizacao-item__linha-titulo">
                        <h4 className="atualizacao-item__titulo">{update.title}</h4>
                        <span className={`atualizacao-item__etiqueta ${cfg.etiquetaClass}`}>{cfg.label}</span>
                      </div>
                      <p className="atualizacao-item__texto">{update.content}</p>
                      <div className="atualizacao-item__meta">
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
