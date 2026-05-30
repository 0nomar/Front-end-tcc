import { useMemo, useState } from "react";
import { CheckCircle, Clock, Circle, TrendingUp, Calendar, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { userService } from "../services/userService";
import { projectService } from "../services/projectService";
import {
  getProjectSeatHolders,
  getProjectSlotsUsage,
  mapProject,
  mapProgressItem,
} from "../utils/adapters";
import { StatusView } from "../components/StatusView";
import "./ProgressPage.css";

function ProgressSkeleton() {
  const Sk = ({ w = "100%", h = 14, r = "0.5rem" }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: r }} />
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--espaco-6)", padding: "var(--espaco-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Sk w={200} h={18} />
        <Sk w={180} h={38} r="var(--raio-medio)" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--espaco-5)" }}>
        <div style={{ background: "var(--cor-superficie)", borderRadius: "var(--raio-grande)", border: "1px solid var(--cor-borda-clara)", padding: "var(--espaco-5)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Sk w={130} h={15} />
          <Sk w={140} h={140} r="50%" />
          <Sk w="60%" h={14} />
          <Sk w="45%" h={22} r="var(--raio-completo)" />
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <Sk w="45%" h={12} />
                <Sk w="25%" h={12} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--espaco-4)" }}>
          <div style={{ background: "var(--cor-superficie)", borderRadius: "var(--raio-grande)", border: "1px solid var(--cor-borda-clara)", padding: "var(--espaco-5)" }}>
            <Sk w={150} h={15} mb={12} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Sk w={32} h={32} r="50%" />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <Sk w="60%" h={13} />
                    <Sk w="40%" h={11} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [newUpdate, setNewUpdate] = useState("");
  const { data, loading, error, reload } = useAsyncData(async () => {
    if (!user?.id) return { projects: [], progressByProject: {} };
    const projectsResult = await userService.getProjects(user.id).catch(() => []);
    const mappedProjects = Array.isArray(projectsResult) ? projectsResult.map(mapProject) : [];
    const projects = await Promise.all(
      mappedProjects.map(async (project) => {
        const collaborators = await projectService.getCollaborators(project.id).catch(() => null);
        if (!Array.isArray(collaborators)) return project;
        const slots = getProjectSlotsUsage(project, collaborators);
        return {
          ...project,
          collaborators,
          acceptedCollaborators: getProjectSeatHolders(project, collaborators),
          slotsUsed: slots.used,
          slotsRemaining: slots.remaining,
        };
      }),
    );
    const progressEntries = await Promise.all(
      projects.map(async (project) => ({
        projectId: project.id,
        items: (() => {
          const result = projectService.getProgress(project.id).catch(() => []);
          return result;
        })(),
      })),
    );

    return {
      projects,
      progressByProject: Object.fromEntries(
        (await Promise.all(
          progressEntries.map(async (entryPromise) => {
            const entry = await entryPromise;
            const items = await entry.items;
            return [entry.projectId, Array.isArray(items) ? items.map(mapProgressItem) : []];
          }),
        )),
      ),
    };
  }, [user?.id], { initialData: { projects: [], progressByProject: {} } });

  const projects = data?.projects ?? [];
  const selectedProject = projects.find((project) => String(project.id) === String(selectedProjectId)) ?? projects[0];
  const selectedProgress = selectedProject ? data?.progressByProject?.[selectedProject.id] ?? [] : [];
  const selectedProjectSlots = selectedProject ? getProjectSlotsUsage(selectedProject) : { total: 0, remaining: 0 };

  const completionPercent = useMemo(() => {
    if (!selectedProject) return 0;
    if (selectedProject.status === "FINALIZADO") return 100;
    const updatesProgress = Math.min(selectedProgress.length * 15, 70);
    if (selectedProject.status === "EM_ANDAMENTO") return Math.min(50 + updatesProgress, 95);
    if (selectedProject.status === "ABERTO") return Math.min(15 + updatesProgress, 85);
    return selectedProgress.length > 0 ? Math.min(10 + updatesProgress, 75) : 0;
  }, [selectedProject, selectedProgress]);

  const handleAddUpdate = async () => {
    if (!newUpdate.trim() || !selectedProject?.id) return;

    try {
      await projectService.addProgress(selectedProject.id, { descricao: newUpdate.trim() });
      toast.success("Atualização publicada com sucesso.");
      setNewUpdate("");
      setShowAddUpdate(false);
      await reload();
    } catch (err) {
      toast.error(err.message || "Não foi possível registrar a atualização.");
    }
  };

  if (loading) return <ProgressSkeleton />;

  if (error) {
    return <StatusView title="Falha ao carregar progresso" description={error.message} />;
  }

  if (!selectedProject) {
    return <StatusView title="Sem projetos vinculados" description="Não encontramos projetos associados ao usuário autenticado." />;
  }

  return (
    <div className="pagina-progresso">
      <div className="pagina-progresso__grade-visao-geral">
        <div className="progresso-donut">
          <div className="progresso-donut__grafico">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { value: completionPercent },
                    { value: 100 - completionPercent },
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
                <p className="progresso-donut__percentual">{completionPercent}%</p>
                <p className="progresso-donut__label-percentual">concluído</p>
              </div>
            </div>
          </div>
          <p className="progresso-donut__titulo">Progresso geral</p>
          <p className="progresso-donut__subtitulo">{selectedProgress.length} atualizações registradas</p>
        </div>

        <div className="pagina-progresso__info-projeto">
          <div className="pagina-progresso__cabecalho-projeto">
            <div>
              <h2 className="pagina-progresso__titulo-projeto">{selectedProject.title}</h2>
              <p className="pagina-progresso__orientador-projeto">Orientador: {selectedProject.advisor?.name ?? "Sem orientador"}</p>
            </div>
            <span className="pagina-progresso__badge-status">{selectedProject.status}</span>
          </div>

          <div className="pagina-progresso__grade-datas">
            {[
              { label: "Criado em", value: selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString("pt-BR") : "-", icon: Calendar },
              { label: "Atualizações", value: selectedProgress.length, icon: TrendingUp },
              { label: "Vagas", value: `${selectedProjectSlots.remaining}/${selectedProjectSlots.total}`, icon: Clock },
            ].map((item) => (
              <div key={item.label} className="pagina-progresso__item-data">
                <div className="pagina-progresso__linha-data">
                  <item.icon size={13} className="pagina-progresso__icone-data" />
                  <span className="pagina-progresso__label-data">{item.label}</span>
                </div>
                <p className="pagina-progresso__valor-data">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="pagina-progresso__secao-barra">
            <div className="pagina-progresso__topo-barra">
              <span className="pagina-progresso__fase-atual">
                Projeto selecionado:
                <span className="pagina-progresso__fase-destaque"> {selectedProject.title}</span>
              </span>
              <span className="pagina-progresso__percentual-barra">{completionPercent}%</span>
            </div>
            <div className="pagina-progresso__trilha-barra">
              <div className="pagina-progresso__preenchimento-barra" style={{ width: `${completionPercent}%` }} />
            </div>
          </div>

          <select
            value={selectedProjectId || selectedProject.id}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="formulario-atualizacao__input"
            style={{ marginTop: "1rem" }}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pagina-progresso__grade-inferior">
        <div className="pagina-progresso__card">
          <div className="pagina-progresso__card-padding">
            <h3 className="pagina-progresso__titulo-card">Linha do tempo</h3>
            <div className="linha-do-tempo">
              {selectedProgress.length === 0 ? (
                <StatusView title="Sem atualizações" description="Ainda não existem registros de progresso para este projeto." />
              ) : (
                selectedProgress.map((progress, index) => {
                  const Icon = index === 0 ? CheckCircle : index % 2 === 0 ? Clock : Circle;
                  return (
                    <div key={progress.id} className="marco-linha-do-tempo">
                      <div className="marco-linha-do-tempo__conector marco-linha-do-tempo__conector--andamento" />
                      <div className="marco-linha-do-tempo__icone marco-linha-do-tempo__icone--andamento">
                        <Icon size={17} className="marco-linha-do-tempo__icone-svg--andamento" />
                      </div>
                      <div className="marco-linha-do-tempo__conteudo">
                        <div className="marco-linha-do-tempo__linha-titulo">
                          <h4 className="marco-linha-do-tempo__titulo marco-linha-do-tempo__titulo--andamento">{progress.title}</h4>
                        </div>
                        <p className="marco-linha-do-tempo__descricao">{progress.content}</p>
                        <div className="marco-linha-do-tempo__datas">
                          <span className="marco-linha-do-tempo__prazo">
                            {progress.date ? new Date(progress.date).toLocaleDateString("pt-BR") : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="pagina-progresso__card">
          <div className="pagina-progresso__cabecalho-atualizacoes">
            <h3 className="pagina-progresso__titulo-card" style={{ marginBottom: 0 }}>Atualizações</h3>
            <button onClick={() => setShowAddUpdate(!showAddUpdate)} className="pagina-progresso__botao-nova-atualizacao">
              <Plus size={14} />
              Nova atualização
            </button>
          </div>

          {showAddUpdate && (
            <div className="formulario-atualizacao">
              <div className="formulario-atualizacao__conteudo">
                <textarea
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
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
            {selectedProgress.map((progress) => (
              <div key={progress.id} className="atualizacao-item">
                <div className="atualizacao-item__linha">
                  <div className="atualizacao-item__icone-area atualizacao-item__icone-area--atualizacao">
                    <TrendingUp size={14} className="atualizacao-item__icone-svg--atualizacao" />
                  </div>
                  <div className="atualizacao-item__conteudo">
                    <div className="atualizacao-item__linha-titulo">
                      <h4 className="atualizacao-item__titulo">{progress.title}</h4>
                      <span className="atualizacao-item__etiqueta atualizacao-item__etiqueta--atualizacao">Atualização</span>
                    </div>
                    <p className="atualizacao-item__texto">{progress.content}</p>
                    <div className="atualizacao-item__meta">
                      <span>{progress.author || "Sistema"}</span>
                      <span>·</span>
                      <span>{progress.date ? new Date(progress.date).toLocaleDateString("pt-BR") : "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
