import { useMemo, useState } from "react";
import { CheckCircle, Clock, Circle, TrendingUp, Calendar, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { userService } from "../services/userService";
import { projectService } from "../services/projectService";
import { mapProject, mapProgressItem } from "../utils/adapters";
import { StatusView } from "../components/StatusView";
import "./ProgressPage.css";

export default function ProgressPage() {
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [newUpdate, setNewUpdate] = useState("");
  const { data, loading, error, reload } = useAsyncData(async () => {
    if (!user?.id) return { projects: [], progressByProject: {} };
    const projectsResult = await userService.getProjects(user.id).catch(() => []);
    const projects = Array.isArray(projectsResult) ? projectsResult.map(mapProject) : [];
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

  const completionPercent = useMemo(() => {
    if (!selectedProject) return 0;
    if (selectedProject.status === "FINALIZADO") return 100;
    if (selectedProject.status === "EM_ANDAMENTO") return 65;
    return selectedProgress.length > 0 ? 30 : 10;
  }, [selectedProject, selectedProgress]);

  const handleAddUpdate = async () => {
    if (!newUpdate.trim() || !selectedProject?.id) return;

    try {
      await projectService.addProgress(selectedProject.id, { descricao: newUpdate.trim() });
      toast.success("Atualizacao publicada com sucesso.");
      setNewUpdate("");
      setShowAddUpdate(false);
      await reload();
    } catch (err) {
      toast.error(err.message || "Nao foi possivel registrar a atualizacao.");
    }
  };

  if (loading) {
    return <StatusView title="Carregando progresso" description="Buscando progresso real dos projetos." />;
  }

  if (error) {
    return <StatusView title="Falha ao carregar progresso" description={error.message} />;
  }

  if (!selectedProject) {
    return <StatusView title="Sem projetos vinculados" description="Nao encontramos projetos associados ao usuario autenticado." />;
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
                <p className="progresso-donut__label-percentual">concluido</p>
              </div>
            </div>
          </div>
          <p className="progresso-donut__titulo">Progresso geral</p>
          <p className="progresso-donut__subtitulo">{selectedProgress.length} atualizacoes registradas</p>
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
              { label: "Atualizacoes", value: selectedProgress.length, icon: TrendingUp },
              { label: "Vagas", value: `${Math.max(selectedProject.slots - selectedProject.slotsUsed, 0)}/${selectedProject.slots}`, icon: Clock },
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
                <StatusView title="Sem atualizacoes" description="Ainda nao existem registros de progresso para este projeto." />
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
            <h3 className="pagina-progresso__titulo-card" style={{ marginBottom: 0 }}>Atualizacoes</h3>
            <button onClick={() => setShowAddUpdate(!showAddUpdate)} className="pagina-progresso__botao-nova-atualizacao">
              <Plus size={14} />
              Nova atualizacao
            </button>
          </div>

          {showAddUpdate && (
            <div className="formulario-atualizacao">
              <div className="formulario-atualizacao__conteudo">
                <textarea
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                  placeholder="Descreva a atualizacao..."
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
                      <span className="atualizacao-item__etiqueta atualizacao-item__etiqueta--atualizacao">Atualizacao</span>
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
