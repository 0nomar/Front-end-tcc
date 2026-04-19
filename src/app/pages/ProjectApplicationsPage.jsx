import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Loader2,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { useAuth } from "../hooks/useAuth";
import { applicationService } from "../services/applicationService";
import { projectService } from "../services/projectService";
import { StatusView } from "../components/StatusView";
import { mapApplication, mapProject } from "../utils/adapters";
import { formatApplicationStatus } from "../utils/formatters";
import "./ApplicationsPage.css";
import "./ProjectDetailPage.css";
import "./ProjectApplicationsPage.css";

const statusConfig = {
  APROVADO: {
    icon: CheckCircle,
    iconeClass: "inscricao-card__icone-status--aprovado",
    iconeColor: "var(--cor-sucesso)",
    etiquetaClass: "inscricao-card__etiqueta-status--aprovado",
  },
  PENDENTE: {
    icon: Clock,
    iconeClass: "inscricao-card__icone-status--pendente",
    iconeColor: "var(--cor-atencao)",
    etiquetaClass: "inscricao-card__etiqueta-status--pendente",
  },
  REJEITADO: {
    icon: XCircle,
    iconeClass: "inscricao-card__icone-status--rejeitado",
    iconeColor: "var(--cor-erro)",
    etiquetaClass: "inscricao-card__etiqueta-status--rejeitado",
  },
};

function mapProjectApplication(raw) {
  const base = mapApplication(raw);
  return {
    ...base,
    motivation: raw.motivacao ?? "",
    advisorFeedback: raw.parecerOrientador ?? "",
    studentName: raw.alunoNome ?? base.user?.nome ?? "Aluno",
  };
}

export default function ProjectApplicationsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [expandedMotivationIds, setExpandedMotivationIds] = useState(() => new Set());
  const [actionModal, setActionModal] = useState(null);
  const [parecerDraft, setParecerDraft] = useState("");
  const [cardActionLoadingId, setCardActionLoadingId] = useState(null);

  const { data, loading, error, setData } = useAsyncData(
    async () => {
      const [projectRaw, appsRaw] = await Promise.all([
        projectService.getById(id),
        applicationService.listByProject(id),
      ]);
      const list = Array.isArray(appsRaw) ? appsRaw : appsRaw?.content ?? [];
      return {
        project: mapProject(projectRaw),
        applications: list.map(mapProjectApplication),
      };
    },
    [id],
    { initialData: { project: null, applications: [] } },
  );

  const project = data?.project;
  const applications = data?.applications ?? [];

  const isAdvisorOwner = useMemo(() => {
    if (!user?.id || !project?.advisorId) return false;
    return user.tipo === "ORIENTADOR" && Number(user.id) === Number(project.advisorId);
  }, [user, project]);

  const toggleMotivation = useCallback((appId) => {
    setExpandedMotivationIds((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) next.delete(appId);
      else next.add(appId);
      return next;
    });
  }, []);

  const mergeApplication = useCallback((raw) => {
    const mapped = mapProjectApplication(raw);
    setData((prev) => {
      const base = prev ?? { project: null, applications: [] };
      return {
        ...base,
        applications: (base.applications ?? []).map((a) => (a.id === mapped.id ? { ...a, ...mapped } : a)),
      };
    });
  }, [setData]);

  const counts = useMemo(
    () => ({
      total: applications.length,
      PENDENTE: applications.filter((a) => a.status === "PENDENTE").length,
      APROVADO: applications.filter((a) => a.status === "APROVADO").length,
      REJEITADO: applications.filter((a) => a.status === "REJEITADO").length,
    }),
    [applications],
  );

  const openActionModal = (type, applicationId) => {
    setActionModal({ type, applicationId });
    setParecerDraft("");
  };

  const closeActionModal = () => {
    setActionModal(null);
    setParecerDraft("");
  };

  const submitActionModal = async () => {
    if (!actionModal) return;
    const { type, applicationId } = actionModal;
    const parecer = parecerDraft.trim();
    setCardActionLoadingId(applicationId);
    try {
      if (type === "approve") {
        const raw = await applicationService.approve(applicationId, parecer);
        mergeApplication(raw);
        toast.success("Inscricao aprovada.");
      } else {
        const raw = await applicationService.reject(applicationId, parecer);
        mergeApplication(raw);
        toast.success("Inscricao rejeitada.");
      }
      closeActionModal();
    } catch (err) {
      toast.error(err.message || "Nao foi possivel concluir a acao.");
    } finally {
      setCardActionLoadingId(null);
    }
  };

  if (loading) {
    return <StatusView title="Carregando inscricoes" description="Buscando dados do projeto e candidatos." />;
  }

  if (error || !project) {
    return (
      <StatusView
        title="Nao foi possivel carregar"
        description={error?.message ?? "Projeto nao encontrado."}
        action={
          <button type="button" className="pagina-inscricoes-projeto__botao-voltar" onClick={() => navigate("/app/projects")}>
            Voltar aos projetos
          </button>
        }
      />
    );
  }

  if (!isAdvisorOwner) {
    return (
      <StatusView
        title="Acesso negado"
        description="Apenas o orientador responsavel por este projeto pode gerenciar as inscricoes."
        action={
          <Link to={`/app/projects/${id}`} className="pagina-inscricoes-projeto__botao-voltar pagina-inscricoes-projeto__botao-voltar--link">
            Voltar ao projeto
          </Link>
        }
      />
    );
  }

  return (
    <div className="pagina-inscricoes-projeto">
      <div className="pagina-inscricoes-projeto__cabecalho">
        <div>
          <h1 className="pagina-inscricoes-projeto__titulo">Inscricoes no projeto</h1>
          <p className="pagina-inscricoes-projeto__subtitulo">{project.title}</p>
        </div>
        <Link to={`/app/projects/${id}`} className="pagina-inscricoes-projeto__botao-voltar pagina-inscricoes-projeto__botao-voltar--link">
          <ArrowLeft size={16} />
          Voltar ao projeto
        </Link>
      </div>

      <div className="pagina-inscricoes-projeto__grade-resumos">
        {[
          ["total", "Total"],
          ["PENDENTE", "Pendentes"],
          ["APROVADO", "Aprovadas"],
          ["REJEITADO", "Rejeitadas"],
        ].map(([key, label]) => (
          <div key={key} className="pagina-inscricoes-projeto__resumo">
            <p className="pagina-inscricoes-projeto__resumo-valor">{counts[key] ?? 0}</p>
            <p className="pagina-inscricoes-projeto__resumo-rotulo">{label}</p>
          </div>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="pagina-inscricoes-projeto__vazio">
          <div className="pagina-inscricoes-projeto__vazio-icone">
            <Users size={28} style={{ color: "var(--cor-texto-mudo)" }} />
          </div>
          <h3 className="pagina-inscricoes-projeto__vazio-titulo">Nenhuma inscricao ainda</h3>
          <p className="pagina-inscricoes-projeto__vazio-texto">Quando alunos se inscreverem, eles aparecerao nesta lista.</p>
          <button type="button" className="pagina-inscricoes-projeto__botao-voltar" onClick={() => navigate(`/app/projects/${id}`)}>
            Voltar ao projeto
          </button>
        </div>
      ) : (
        <div className="pagina-inscricoes__lista">
          {applications.map((application) => {
            const cfg = statusConfig[application.status] ?? statusConfig.PENDENTE;
            const motivationOpen = expandedMotivationIds.has(application.id);
            const hasMotivation = Boolean(application.motivation?.trim());

            return (
              <div key={application.id} className="inscricao-card pagina-inscricoes-projeto__card">
                <div className="inscricao-card__cabecalho pagina-inscricoes-projeto__card-cabecalho">
                  <div className="inscricao-card__linha-principal">
                    <div className={`inscricao-card__icone-status ${cfg.iconeClass}`}>
                      <cfg.icon size={20} style={{ color: cfg.iconeColor }} />
                    </div>
                    <div className="inscricao-card__info">
                      <div className="inscricao-card__linha-titulo">
                        <h3 className="inscricao-card__titulo-projeto pagina-inscricoes-projeto__nome-aluno">{application.studentName}</h3>
                        <span className={`inscricao-card__etiqueta-status ${cfg.etiquetaClass}`}>
                          {formatApplicationStatus(application.status)}
                        </span>
                      </div>
                      <div className="inscricao-card__metadados">
                        <span className="inscricao-card__metadado">
                          <Calendar size={12} />
                          Inscrito em{" "}
                          {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString("pt-BR") : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pagina-inscricoes-projeto__corpo-card">
                  {hasMotivation && (
                    <div className="pagina-inscricoes-projeto__motivacao">
                      <button
                        type="button"
                        className="pagina-inscricoes-projeto__motivacao-toggle"
                        onClick={() => toggleMotivation(application.id)}
                      >
                        {motivationOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        Carta de motivacao
                      </button>
                      {motivationOpen && (
                        <p className="pagina-inscricoes-projeto__motivacao-texto">{application.motivation}</p>
                      )}
                    </div>
                  )}

                  {application.status === "PENDENTE" && (
                    <div className="pagina-inscricoes-projeto__acoes">
                      <button
                        type="button"
                        className="inscricao-card__botao inscricao-card__botao--aprovar"
                        disabled={cardActionLoadingId === application.id}
                        onClick={() => openActionModal("approve", application.id)}
                      >
                        {cardActionLoadingId === application.id ? (
                          <Loader2 size={14} className="girando" />
                        ) : (
                          <>
                            <CheckCircle size={14} /> Aprovar
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="inscricao-card__botao inscricao-card__botao--rejeitar"
                        disabled={cardActionLoadingId === application.id}
                        onClick={() => openActionModal("reject", application.id)}
                      >
                        {cardActionLoadingId === application.id ? (
                          <Loader2 size={14} className="girando" />
                        ) : (
                          <>
                            <XCircle size={14} /> Rejeitar
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {(application.status === "APROVADO" || application.status === "REJEITADO") && application.advisorFeedback?.trim() && (
                    <div className="pagina-inscricoes-projeto__parecer">
                      <h4 className="inscricao-card__rotulo-secao">Parecer do orientador</h4>
                      <p className="inscricao-card__feedback">{application.advisorFeedback}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {actionModal && (
        <div className="modal-inscricao__sobreposicao" role="presentation" onClick={(e) => e.target === e.currentTarget && closeActionModal()}>
          <div className="modal-inscricao__painel pagina-inscricoes-projeto__modal">
            <h3 className="modal-inscricao__titulo">
              {actionModal.type === "approve" ? "Aprovar inscricao" : "Rejeitar inscricao"}
            </h3>
            <p className="modal-inscricao__subtitulo">Parecer para o aluno (opcional, ate 500 caracteres)</p>
            <textarea
              className="modal-inscricao__textarea"
              rows={4}
              maxLength={500}
              value={parecerDraft}
              onChange={(e) => setParecerDraft(e.target.value)}
              placeholder="Escreva um parecer opcional..."
            />
            <p className="modal-inscricao__contador">{parecerDraft.length}/500</p>
            <div className="modal-inscricao__rodape">
              <button type="button" className="modal-inscricao__botao-cancelar" onClick={closeActionModal} disabled={cardActionLoadingId != null}>
                Cancelar
              </button>
              <button
                type="button"
                className={`modal-inscricao__botao-enviar ${actionModal.type === "reject" ? "pagina-inscricoes-projeto__modal-confirmar--rejeitar" : ""}`}
                onClick={submitActionModal}
                disabled={cardActionLoadingId != null}
              >
                {cardActionLoadingId != null ? <div className="modal-inscricao__spinner" /> : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
