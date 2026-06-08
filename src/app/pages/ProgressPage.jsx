import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronDown, FolderKanban, Plus, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { useProjectProgress } from "../hooks/useProjectProgress";
import { userService } from "../services/userService";
import { projectService } from "../services/projectService";
import { getProjectSeatHolders, getProjectSlotsUsage, mapProject } from "../utils/adapters";
import { formatDate, formatProjectStatus, formatUserType } from "../utils/formatters";
import { StatusView } from "../components/StatusView";
import { ProgressDonut } from "../components/progress/ProgressDonut";
import { StepperVertical } from "../components/progress/StepperVertical";
import { UpdateFeed } from "../components/progress/UpdateFeed";
import { UpdateForm } from "../components/progress/UpdateForm";
import "./ProgressPage.css";

function ProgressSkeleton() {
  return (
    <div className="progress-page">
      <div className="progress-page__hero">
        <div className="progress-page__hero-copy">
          <div className="skeleton" style={{ width: 260, height: 22, borderRadius: 12 }} />
          <div className="skeleton" style={{ width: "70%", height: 14, borderRadius: 999 }} />
        </div>
        <div className="skeleton" style={{ width: 240, height: 44, borderRadius: 14 }} />
      </div>

      <div className="progress-page__overview">
        <div className="progress-page__panel progress-page__panel--summary">
          <div className="skeleton" style={{ width: 170, height: 18, marginBottom: 20 }} />
          <div className="skeleton" style={{ width: 180, height: 180, borderRadius: "50%", margin: "0 auto 18px" }} />
          <div className="skeleton" style={{ width: "55%", height: 16, margin: "0 auto 10px" }} />
          <div className="skeleton" style={{ width: "38%", height: 12, margin: "0 auto" }} />
        </div>
        <div className="progress-page__panel progress-page__panel--stats">
          <div className="skeleton" style={{ width: 220, height: 18, marginBottom: 18 }} />
          <div className="progress-page__stats-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="progress-stat">
                <div className="skeleton" style={{ width: 18, height: 18, borderRadius: 999 }} />
                <div className="skeleton" style={{ width: "70%", height: 14 }} />
                <div className="skeleton" style={{ width: "45%", height: 12 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const { data, loading, error, reload } = useAsyncData(
    async () => {
      if (!user?.id) return { projects: [] };

      const projectsResult = await userService.getProjects(user.id).catch(() => []);
      const mappedProjects = Array.isArray(projectsResult) ? projectsResult.map(mapProject) : [];

      const projects = await Promise.all(
        mappedProjects.map(async (project) => {
          const collaborators = await projectService.getCollaborators(project.id).catch(() => null);

          if (!Array.isArray(collaborators)) {
            return project;
          }

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

      return { projects };
    },
    [user?.id],
    { initialData: { projects: [] } },
  );

  const projects = data?.projects ?? [];

  useEffect(() => {
    if (!selectedProjectId && projects[0]?.id) {
      setSelectedProjectId(String(projects[0].id));
    }
  }, [projects, selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((project) => String(project.id) === String(selectedProjectId)) ?? projects[0] ?? null,
    [projects, selectedProjectId],
  );

  const {
    steps,
    updates,
    overallPercent,
    isLoading: progressLoading,
    error: progressError,
    advanceStep,
    createUpdate,
  } = useProjectProgress(selectedProject?.id);

  const selectedProjectSlots = selectedProject
    ? getProjectSlotsUsage(selectedProject)
    : { total: 0, used: 0, remaining: 0 };

  const currentStep = useMemo(
    () => steps.find((step) => step.status === "ACTIVE") ?? steps.find((step) => step.status === "PENDING") ?? null,
    [steps],
  );

  const currentUserRole = user?.tipo ?? user?.type ?? "";
  const acceptedCollaborators = selectedProject?.acceptedCollaborators ?? [];

  const handleAdvanceStep = async (stepId) => {
    try {
      await advanceStep(stepId);
      toast.success("Etapa concluída com sucesso.");
    } catch (err) {
      toast.error(err.message || "Não foi possível concluir a etapa.");
    }
  };

  const handleCreateUpdate = async (payload) => {
    try {
      await createUpdate(payload);
      toast.success("Atualização publicada com sucesso.");
      setShowUpdateForm(false);
    } catch (err) {
      toast.error(err.message || "Não foi possível publicar a atualização.");
      throw err;
    }
  };

  if (loading || progressLoading) {
    return <ProgressSkeleton />;
  }

  if (error) {
    return <StatusView title="Falha ao carregar progresso" description={error.message} />;
  }

  if (progressError) {
    return <StatusView title="Falha ao carregar progresso" description={progressError.message} />;
  }

  if (!selectedProject) {
    return <StatusView title="Sem projetos vinculados" description="Não encontramos projetos associados ao usuário autenticado." />;
  }

  return (
    <div className="progress-page">
      <header className="progress-page__hero">
        <div className="progress-page__hero-copy">
          <span className="progress-page__eyebrow">Acompanhamento estruturado</span>
          <h1 className="progress-page__title">Progresso do projeto</h1>
          <p className="progress-page__lead">
            Etapas com peso calculado automaticamente, atualizações com título e categoria e um feed que conecta cada
            movimento ao avanço real do projeto.
          </p>
        </div>

        <label className="progress-page__project-picker">
          <span>Projeto</span>
          <div className="progress-page__project-picker-control">
            <select
              value={selectedProjectId || selectedProject.id}
              onChange={(event) => setSelectedProjectId(event.target.value)}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
        </label>
      </header>

      <section className="progress-page__overview">
        <div className="progress-page__panel progress-page__panel--summary">
          <ProgressDonut
            percent={overallPercent}
            subtitle={`${updates.length} atualizações registradas`}
          />
        </div>

        <div className="progress-page__panel progress-page__panel--stats">
          <div className="progress-page__panel-title-row">
            <div>
              <h2>{selectedProject.title}</h2>
              <p>Orientador: {selectedProject.advisor?.name ?? "Sem orientador"}</p>
            </div>
            <span className="progress-page__status-chip">{formatProjectStatus(selectedProject.status)}</span>
          </div>

          <div className="progress-page__stats-grid">
            <div className="progress-stat">
              <CalendarDays size={16} />
              <span>Criado em</span>
              <strong>{formatDate(selectedProject.createdAt)}</strong>
            </div>
            <div className="progress-stat">
              <TrendingUp size={16} />
              <span>Etapa atual</span>
              <strong>{currentStep?.title ?? "Todas concluídas"}</strong>
            </div>
            <div className="progress-stat">
              <Users size={16} />
              <span>Colaboradores</span>
              <strong>{acceptedCollaborators.length + 1}</strong>
            </div>
            <div className="progress-stat">
              <FolderKanban size={16} />
              <span>Vagas</span>
              <strong>
                {selectedProjectSlots.used}/{selectedProjectSlots.total}
              </strong>
            </div>
          </div>

          <div className="progress-page__summary-line">
            <span>Responsável atual:</span>
            <strong>{formatUserType(currentUserRole) || "Usuário autenticado"}</strong>
          </div>
        </div>
      </section>

      <section className="progress-page__grid">
        <div className="progress-page__panel">
          <div className="progress-page__panel-header">
            <div>
              <h2>Etapas</h2>
              <p>Conclua a etapa ativa quando o papel do usuário permitir.</p>
            </div>
            <span className="progress-page__hint">+ peso calculado</span>
          </div>
          <StepperVertical steps={steps} currentUserRole={currentUserRole} onAdvanceStep={handleAdvanceStep} />
        </div>

        <div className="progress-page__panel">
          <div className="progress-page__panel-header">
            <div>
              <h2>Nova atualização</h2>
              <p>Adicione título, categoria e vínculo com a etapa quando fizer sentido.</p>
            </div>
            <button
              type="button"
              className="progress-page__toggle-form"
              onClick={() => setShowUpdateForm((current) => !current)}
            >
              <Plus size={15} />
              {showUpdateForm ? "Ocultar" : "Nova atualização"}
            </button>
          </div>

          {showUpdateForm ? (
            <UpdateForm steps={steps} onSubmit={handleCreateUpdate} />
          ) : (
            <div className="progress-page__collapsed-form">
              <p>O formulário está recolhido. Use o botão acima para publicar uma atualização.</p>
            </div>
          )}
        </div>
      </section>

      <section className="progress-page__panel progress-page__panel--feed">
        <div className="progress-page__panel-header">
          <div>
            <h2>Feed de atualizações</h2>
            <p>Cada item mostra a categoria, a etapa relacionada e a contribuição dentro da etapa.</p>
          </div>
        </div>

        <UpdateFeed updates={updates} />
      </section>

      <div className="progress-page__refresh-row">
        <button type="button" className="progress-page__refresh-button" onClick={() => reload().catch(() => {})}>
          Recarregar dados
        </button>
      </div>
    </div>
  );
}
