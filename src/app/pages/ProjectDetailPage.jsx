import { conversationService } from "../services/conversationService";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Users, Clock, BookOpen, Send, Mail, MessageSquare,
  Share2, Bookmark, BarChart2, Eye, CheckCircle, Pencil, Trash2,
  UserPlus, UserMinus, Loader2, AlertTriangle, Star, Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { useAuth } from "../hooks/useAuth";
import { projectService } from "../services/projectService";
import { applicationService } from "../services/applicationService";
import { feedbackService } from "../services/feedbackService";
import { documentService } from "../services/documentService";
import { useUploadDocumento } from "../../hooks/useUploadDocumento";
import { StatusView } from "../components/StatusView";
import {
  getProjectSlotsUsage,
  getUserId,
  getUserName,
  isProjectAdvisor,
  mapFeedback,
  mapProject,
  mapProgressItem,
} from "../utils/adapters";
import { formatProjectStatus } from "../utils/formatters";
import "./ProjectDetailPage.css";

function ProjectDetailSkeleton() {
  const Sk = ({ w = "100%", h = 14, r = "0.5rem" }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: r }} />
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--espaco-5)", padding: "var(--espaco-4)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Sk w={32} h={32} r="var(--raio-medio)" />
        <Sk w={200} h={16} />
        <Sk w={70} h={22} r="var(--raio-completo)" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--espaco-5)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--espaco-4)" }}>
          <div style={{ background: "var(--cor-superficie)", borderRadius: "var(--raio-grande)", border: "1px solid var(--cor-borda-clara)", padding: "var(--espaco-5)" }}>
            <Sk w="70%" h={22} mb={12} />
            <Sk w="100%" h={13} mb={6} />
            <Sk w="95%" h={13} mb={6} />
            <Sk w="80%" h={13} mb={16} />
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[1, 2, 3].map((i) => <Sk key={i} w={70} h={24} r="var(--raio-completo)" />)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--espaco-3)" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Sk w="60%" h={12} />
                  <Sk w="80%" h={16} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--cor-superficie)", borderRadius: "var(--raio-grande)", border: "1px solid var(--cor-borda-clara)", padding: "var(--espaco-5)" }}>
            <Sk w={160} h={16} mb={16} />
            {[1, 2].map((i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--cor-borda-clara)" }}>
                <Sk w={36} h={36} r="50%" />
                <div style={{ flex: 1 }}>
                  <Sk w="55%" h={13} mb={6} />
                  <Sk w="40%" h={11} />
                </div>
                <Sk w={70} h={22} r="var(--raio-completo)" />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--espaco-4)" }}>
          <div style={{ background: "var(--cor-superficie)", borderRadius: "var(--raio-grande)", border: "1px solid var(--cor-borda-clara)", padding: "var(--espaco-5)", display: "flex", flexDirection: "column", gap: 14 }}>
            <Sk w={110} h={15} />
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Sk w={48} h={48} r="50%" />
              <div style={{ flex: 1 }}>
                <Sk w="65%" h={14} mb={6} />
                <Sk w="50%" h={12} />
              </div>
            </div>
            <Sk w="100%" h={40} r="var(--raio-medio)" />
            <Sk w="100%" h={40} r="var(--raio-medio)" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [loadingApply, setLoadingApply] = useState(false);
  const { upload: uploadDocumento, uploading: uploadingDocumento, erro: uploadErro, progresso: uploadProgresso } = useUploadDocumento();

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Colaboradores
  const [collaborators, setCollaborators] = useState([]);
  const [collabLoading, setCollabLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  // Recrutar
  const [inscricoes, setInscricoes] = useState([]);
  const [recrutandoId, setRecrutandoId] = useState(null);

  const { data, loading, error, reload } = useAsyncData(async () => {
    const [project, progress, feedbacks] = await Promise.all([
      projectService.getById(id),
      projectService.getProgress(id).catch(() => []),
      feedbackService.listByProject(id).catch(() => []),
    ]);
    return {
      project: mapProject(project),
      progress: Array.isArray(progress) ? progress.map(mapProgressItem) : [],
      feedbacks: Array.isArray(feedbacks) ? feedbacks.map(mapFeedback) : [],
    };
  }, [id], { initialData: { project: null, progress: [], feedbacks: [] } });

  const project = data?.project;

  const slots = useMemo(
    () => (project ? getProjectSlotsUsage(project, collaborators) : { total: 0, used: 0, remaining: 0 }),
    [project, collaborators],
  );

  const isOwner = useMemo(() => {
    if (!user?.id || !project) return false;
    const uid = Number(user.id);
    return (project.ownerId != null && uid === Number(project.ownerId))
        || (project.advisorId != null && uid === Number(project.advisorId));
  }, [user, project]);

  const loadCollaborators = useCallback(async () => {
    setCollabLoading(true);
    try {
      const raw = await projectService.getCollaborators(id);
      setCollaborators(Array.isArray(raw) ? raw : []);
    } catch {
      setCollaborators([]);
    } finally {
      setCollabLoading(false);
    }
  }, [id]);

  const loadInscricoes = useCallback(async () => {
    try {
      const raw = await applicationService.listByProject(id);
      const list = Array.isArray(raw) ? raw : (raw?.content ?? []);
      setInscricoes(list.filter((i) => i.status === "PENDENTE"));
    } catch {
      setInscricoes([]);
    }
  }, [id]);

  useEffect(() => {
    if (!loading && project) {
      loadCollaborators();
      if (isOwner) loadInscricoes();
    }
  }, [loading, project, isOwner, loadCollaborators, loadInscricoes]);

  const feedbackAverage = useMemo(() => {
    const ratings = data?.feedbacks ?? [];
    if (!ratings.length) return "0.0";
    return (ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length).toFixed(1);
  }, [data]);

  const statusClass = project?.status === "FINALIZADO"
    ? "detalhe-card__badge-status--encerrado"
    : project?.status === "EM_ANDAMENTO"
      ? "detalhe-card__badge-status--andamento"
      : "detalhe-card__badge-status--aberto";

  const openConversation = async (kind) => {
    try {
      const conversa = kind === "group"
        ? await conversationService.abrirOuCriarPorProjeto(project.id)
        : await conversationService.openPrivate(project.advisor?.id);
      navigate("/app/chat", { state: { conversationId: conversa?.id } });
    } catch {
      toast.error(kind === "group" ? "Erro ao abrir conversa do grupo" : "Erro ao abrir conversa com o orientador");
    }
  };

  const handleApply = async () => {
    setLoadingApply(true);
    try {
      await applicationService.create(id, motivation.trim());
      let documentWarning = null;
      if (documentFile) {
        try {
          const result = await uploadDocumento(documentFile, `usuarios/${user?.id}/inscricoes/${id}`);
          if (!result?.publicUrl) {
            throw new Error("Nao foi possivel enviar o documento da inscricao.");
          }
          await documentService.upload(user.id, "CURRICULO", documentFile.name, result.publicUrl);
        } catch (err) {
          documentWarning = err.message || "Nao foi possivel anexar o documento da inscricao.";
        }
      }
      if (documentWarning) {
        toast.warning(`Inscricao enviada, mas o documento nao foi anexado. ${documentWarning}`);
      } else {
        toast.success("Inscricao enviada com sucesso.");
      }
      setShowModal(false);
      setMotivation("");
      setDocumentFile(null);
      await reload();
    } catch (err) {
      toast.error(err.message || "Nao foi possivel enviar a inscricao.");
    } finally {
      setLoadingApply(false);
    }
  };

  const closeApplyModal = () => {
    setShowModal(false);
    setMotivation("");
    setDocumentFile(null);
  };

  const handleProjectFeedback = async () => {
    if (!feedbackRating) {
      toast.error("Selecione uma nota para avaliar o projeto.");
      return;
    }
    setFeedbackLoading(true);
    try {
      await feedbackService.create({
        projetoId: Number(id),
        nota: feedbackRating,
        comentario: feedbackComment.trim() || undefined,
      });
      toast.success("Avaliacao enviada com sucesso.");
      setShowFeedbackModal(false);
      setFeedbackRating(0);
      setFeedbackComment("");
      await reload();
    } catch (err) {
      toast.error(err.message || "Nao foi possivel enviar a avaliacao.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await projectService.remove(id);
      toast.success("Projeto excluido com sucesso.");
      navigate("/app/projects");
    } catch (err) {
      toast.error(err.message || "Nao foi possivel excluir o projeto.");
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRemoveCollaborator = async (usuarioId) => {
    setRemovingId(usuarioId);
    try {
      await projectService.removerColaborador(id, usuarioId);
      toast.success("Colaborador removido.");
      loadCollaborators();
    } catch (err) {
      toast.error(err.message || "Nao foi possivel remover o colaborador.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleRecruter = async (inscricao) => {
    const uid = inscricao?.aluno?.usuario?.id ?? inscricao?.usuario?.id ?? inscricao?.id;
    if (!uid) return;
    setRecrutandoId(inscricao.id);
    try {
      await projectService.recrutar(id, uid);
      toast.success("Colaborador recrutado com sucesso.");
      await Promise.all([loadCollaborators(), loadInscricoes()]);
    } catch (err) {
      toast.error(err.message || "Nao foi possivel recrutar o colaborador.");
    } finally {
      setRecrutandoId(null);
    }
  };

  const getCollaboratorName = (c) =>
    getUserName(c) || `Usuario #${getUserId(c) ?? "?"}`;

  const getCollaboratorId = (c) =>
    getUserId(c);

  const canRemoveCollaborator = (c) => {
    const collaboratorId = getCollaboratorId(c);
    return (
      isOwner &&
      collaboratorId != null &&
      !isProjectAdvisor(project, c) &&
      (project.ownerId == null || Number(collaboratorId) !== Number(project.ownerId))
    );
  };

  const getInscricaoName = (i) =>
    i?.alunoNome ?? i?.aluno?.usuario?.nome ?? i?.usuario?.nome ?? i?.nome ?? `Inscricao #${i?.id}`;

  if (loading) return <ProjectDetailSkeleton />;
  if (error || !project) {
    return <StatusView title="Projeto indisponivel" description={error?.message || "Nao foi possivel localizar este projeto."} />;
  }

  return (
    <div className="pagina-detalhe-projeto">
      {/* Voltar + acoes de dono */}
      <div className="pagina-detalhe-projeto__barra-topo">
        <button onClick={() => navigate(-1)} className="pagina-detalhe-projeto__voltar">
          <ArrowLeft size={16} />
          Voltar para projetos
        </button>
        {isOwner && (
          <div className="pagina-detalhe-projeto__acoes-dono">
            <button
              onClick={() => navigate(`/app/projects/${id}/edit`)}
              className="pagina-detalhe-projeto__botao-editar"
            >
              <Pencil size={15} /> Editar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="pagina-detalhe-projeto__botao-excluir"
            >
              <Trash2 size={15} /> Excluir
            </button>
          </div>
        )}
      </div>

      <div className="pagina-detalhe-projeto__grade">
        {/* ── Conteúdo principal ── */}
        <div className="pagina-detalhe-projeto__conteudo-principal">
          <div className="detalhe-card">
            <div className="detalhe-card__topo">
              <div className="detalhe-card__badges">
                <span className={`detalhe-card__badge-status ${statusClass}`}>
                  {formatProjectStatus(project.status)}
                </span>
                <span className="detalhe-card__badge-area">{project.area}</span>
              </div>
              <div className="detalhe-card__acoes-topo">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`detalhe-card__botao-acao ${saved ? "detalhe-card__botao-acao--salvo" : "detalhe-card__botao-acao--normal"}`}
                >
                  <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                </button>
                <button className="detalhe-card__botao-acao detalhe-card__botao-acao--normal">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <h1 className="detalhe-card__titulo-projeto">{project.title}</h1>

            <div className="detalhe-card__estatisticas">
              <div className="detalhe-card__stat-item"><Eye size={14} />{data.feedbacks.length} feedbacks</div>
              <div className="detalhe-card__stat-item"><BarChart2 size={14} />{data.progress.length} atualizacoes</div>
              <div className="detalhe-card__stat-item">
                <Clock size={14} />
                Publicado em {project.createdAt ? new Date(project.createdAt).toLocaleDateString("pt-BR") : "-"}
              </div>
            </div>
          </div>

          <div className="detalhe-card">
            <h2 className="detalhe-card__titulo-secao">Sobre o projeto</h2>
            <p className="detalhe-card__descricao">{project.description}</p>
          </div>

          <div className="detalhe-card">
            <h2 className="detalhe-card__titulo-secao">Requisitos</h2>
            <div className="detalhe-card__lista-requisitos">
              {project.requirements.length === 0 ? (
                <p className="detalhe-card__descricao">Nenhum requisito cadastrado.</p>
              ) : (
                project.requirements.map((req) => (
                  <div key={req} className="detalhe-card__requisito">
                    <div className="detalhe-card__requisito-icone">
                      <CheckCircle size={12} style={{ color: "var(--cor-primaria)" }} />
                    </div>
                    <span className="detalhe-card__requisito-texto">{req}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="detalhe-card">
            <h2 className="detalhe-card__titulo-secao">Cursos elegiveis</h2>
            <div className="detalhe-card__chips">
              {project.courses.length === 0 ? (
                <span className="detalhe-card__chip-curso">Nao informado</span>
              ) : (
                project.courses.map((course) => (
                  <span key={course} className="detalhe-card__chip-curso">{course}</span>
                ))
              )}
            </div>
          </div>

          <div className="detalhe-card">
            <h2 className="detalhe-card__titulo-secao">Tecnologias e competencias</h2>
            <div className="detalhe-card__chips">
              {project.tags.length === 0 ? (
                <span className="detalhe-card__chip-tag">Nao informado</span>
              ) : (
                project.tags.map((tag) => (
                  <span key={tag} className="detalhe-card__chip-tag">{tag}</span>
                ))
              )}
            </div>
          </div>

          {/* Inscricoes pendentes (apenas dono) */}
          {isOwner && (
            <div className="detalhe-card">
              <div className="detalhe-card__linha-inscricoes">
                <h2 className="detalhe-card__titulo-secao detalhe-card__titulo-secao--inline">Inscricoes pendentes</h2>
                <button
                  type="button"
                  onClick={() => navigate(`/app/projects/${id}/applications`)}
                  className="detalhe-card__link-gerir-inscricoes"
                >
                  <Users size={15} /> Gerenciar inscricoes
                </button>
              </div>
              {inscricoes.length === 0 ? (
                <p className="detalhe-card__descricao">Nenhuma inscricao pendente.</p>
              ) : (
                <div className="detalhe-colaboradores__lista">
                  {inscricoes.map((insc) => (
                    <div key={insc.id} className="detalhe-colaboradores__item">
                      <div className="detalhe-colaboradores__avatar">
                        {getInscricaoName(insc).charAt(0).toUpperCase()}
                      </div>
                      <span className="detalhe-colaboradores__nome">{getInscricaoName(insc)}</span>
                      <button
                        onClick={() => handleRecruter(insc)}
                        disabled={recrutandoId === insc.id}
                        className="detalhe-colaboradores__botao-recrutar"
                      >
                        {recrutandoId === insc.id
                          ? <Loader2 size={14} className="girando" />
                          : <><UserPlus size={14} /> Recrutar</>}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="pagina-detalhe-projeto__sidebar">
          <div className="card-inscricao">
            <div className="card-inscricao__grade-stats">
              {[
                { icon: Users, label: "Vagas disponiveis", value: `${slots.remaining}/${slots.total}` },
                { icon: Clock, label: "Criado em", value: project.createdAt ? new Date(project.createdAt).toLocaleDateString("pt-BR") : "-" },
                { icon: BookOpen, label: "Area", value: project.area },
              ].map((item) => (
                <div key={item.label} className="card-inscricao__stat">
                  <div className="card-inscricao__stat-linha">
                    <item.icon size={13} className="card-inscricao__stat-icone" />
                    <span className="card-inscricao__stat-label">{item.label}</span>
                  </div>
                  <p className="card-inscricao__stat-valor">{item.value}</p>
                </div>
              ))}
            </div>

            {project.status === "ABERTO" && !isOwner && slots.remaining > 0 ? (
              <button onClick={() => setShowModal(true)} className="card-inscricao__botao-inscrever">
                <Send size={16} /> Inscrever-se
              </button>
            ) : (
              !isOwner && (
                <div className="card-inscricao__status-encerrado">
                  {slots.remaining <= 0 ? "Vagas preenchidas" : formatProjectStatus(project.status)}
                </div>
              )
            )}

            <button
              onClick={() => openConversation("private")}
              className="card-inscricao__botao-perguntar"
              disabled={!project.advisor?.id}
            >
              <MessageSquare size={15} /> Perguntar ao orientador
            </button>
          </div>

          {/* Card orientador */}
          <div className="card-orientador">
            <h3 className="card-orientador__titulo">Orientador do projeto</h3>
            <div className="card-orientador__cabecalho">
              <div className="card-orientador__avatar">
                <span className="card-orientador__avatar-inicial">
                  {(project.advisor?.name ?? "IC").split(" ").slice(0, 2).map((p) => p[0]).join("")}
                </span>
              </div>
              <div>
                <p className="card-orientador__nome">{project.advisor?.name ?? "Sem orientador"}</p>
                <p className="card-orientador__departamento">{project.advisor?.specialty || project.area}</p>
              </div>
            </div>
            <div className="card-orientador__info-lista">
              <div className="card-orientador__info-linha">
                <span className="card-orientador__info-label">Email</span>
                <span className="card-orientador__info-valor">{project.advisor?.email ?? "-"}</span>
              </div>
              <div className="card-orientador__info-linha">
                <span className="card-orientador__info-label">Feedback medio</span>
                <span className="card-orientador__info-valor">{feedbackAverage}</span>
              </div>
              <div className="card-orientador__info-linha">
                <span className="card-orientador__info-label">Atualizacoes</span>
                <span className="card-orientador__info-valor">{data.progress.length}</span>
              </div>
            </div>
            <button
              onClick={() => openConversation("private")}
              className="card-orientador__botao-mensagem"
              disabled={!project.advisor?.id}
            >
              <Mail size={14} /> Enviar mensagem
            </button>
            {!isOwner && project.status === "FINALIZADO" && (
              <button
                type="button"
                onClick={() => setShowFeedbackModal(true)}
                className="card-orientador__botao-mensagem card-orientador__botao-avaliar"
              >
                <Star size={14} /> Avaliar projeto
              </button>
            )}
          </div>

          {/* Card colaboradores */}
          <div className="card-colaboradores">
            <h3 className="card-colaboradores__titulo">
              <Users size={15} /> Colaboradores
            </h3>
            {collabLoading ? (
              <p className="card-colaboradores__vazio">Carregando...</p>
            ) : collaborators.length === 0 ? (
              <p className="card-colaboradores__vazio">Nenhum colaborador ainda.</p>
            ) : (
              <ul className="card-colaboradores__lista">
                {collaborators.map((c) => (
                  <li key={getCollaboratorId(c) ?? c} className="card-colaboradores__item">
                    <div className="card-colaboradores__avatar">
                      {getCollaboratorName(c).charAt(0).toUpperCase()}
                    </div>
                    <span className="card-colaboradores__nome">
                      {getCollaboratorName(c)}  
                      {isProjectAdvisor(project, c) && (
                        <span className="card-colaboradores__papel"> (Orientador)</span>
                      )}
                    </span>
                    {canRemoveCollaborator(c) && (
                      <button
                        onClick={() => handleRemoveCollaborator(getCollaboratorId(c))}
                        disabled={removingId === getCollaboratorId(c)}
                        className="card-colaboradores__botao-remover"
                        title="Remover colaborador"
                      >
                        {removingId === getCollaboratorId(c)
                          ? <Loader2 size={12} className="girando" />
                          : <UserMinus size={13} />}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Botão conversa do grupo */}
            <button
              onClick={() => openConversation("group")}
              className="card-colaboradores__botao-grupo"
            >
              <MessageSquare size={14} /> Mensagem do grupo
            </button>
          </div>

        </div>
      </div>

      {/* ── Modal inscrição ── */}
      {showModal && (
        <div
          className="modal-inscricao__sobreposicao"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && !loadingApply && closeApplyModal()}
        >
          <div className="modal-inscricao__painel">
            <div className="modal-inscricao__cabecalho">
              <h3 className="modal-inscricao__titulo">Inscricao no projeto</h3>
              <p className="modal-inscricao__subtitulo">{project.title}</p>
            </div>
            <div className="modal-inscricao__corpo">
              <div>
                <label className="modal-inscricao__label">Carta de motivacao</label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={5}
                  maxLength={1500}
                  className="modal-inscricao__textarea"
                  placeholder="Escreva sua motivacao para o projeto..."
                />
                <p className="modal-inscricao__contador">{motivation.length}/1500 caracteres</p>
              </div>
              <div>
                <label className="modal-inscricao__label">Documento da inscricao</label>
                <label className="modal-inscricao__arquivo">
                  <Upload size={16} />
                  <span>{documentFile ? documentFile.name : "Anexar PDF, JPG ou PNG"}</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
                    disabled={loadingApply || uploadingDocumento}
                  />
                </label>
                {(uploadingDocumento || uploadProgresso > 0) && (
                  <div className="modal-inscricao__progresso">
                    <span style={{ width: `${uploadProgresso}%` }} />
                  </div>
                )}
                {uploadErro && <p className="modal-inscricao__erro-upload">{uploadErro}</p>}
              </div>
            </div>
            <div className="modal-inscricao__rodape">
              <button type="button" onClick={closeApplyModal} className="modal-inscricao__botao-cancelar" disabled={loadingApply}>
                Cancelar
              </button>
              <button type="button" onClick={handleApply} disabled={loadingApply || uploadingDocumento} className="modal-inscricao__botao-enviar">
                {loadingApply || uploadingDocumento ? <div className="modal-inscricao__spinner" /> : <><Send size={15} /> Enviar inscricao</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="modal-inscricao__sobreposicao" role="presentation" onClick={(e) => e.target === e.currentTarget && !feedbackLoading && setShowFeedbackModal(false)}>
          <div className="modal-inscricao__painel">
            <div className="modal-inscricao__cabecalho">
              <h3 className="modal-inscricao__titulo">Avaliar projeto</h3>
              <p className="modal-inscricao__subtitulo">{project.title}</p>
            </div>
            <div className="modal-inscricao__corpo">
              <div className="modal-avaliacao__estrelas">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setFeedbackRating(score)}
                    className={`modal-avaliacao__estrela ${score <= feedbackRating ? "modal-avaliacao__estrela--ativa" : ""}`}
                    aria-label={`Nota ${score}`}
                  >
                    <Star size={22} fill={score <= feedbackRating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <div>
                <label className="modal-inscricao__label">Comentario</label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  className="modal-inscricao__textarea"
                  placeholder="Conte como foi sua experiencia no projeto..."
                />
                <p className="modal-inscricao__contador">{feedbackComment.length}/1000 caracteres</p>
              </div>
            </div>
            <div className="modal-inscricao__rodape">
              <button type="button" onClick={() => setShowFeedbackModal(false)} className="modal-inscricao__botao-cancelar" disabled={feedbackLoading}>
                Cancelar
              </button>
              <button type="button" onClick={handleProjectFeedback} disabled={feedbackLoading || feedbackRating === 0} className="modal-inscricao__botao-enviar">
                {feedbackLoading ? <div className="modal-inscricao__spinner" /> : <><Send size={15} /> Enviar avaliacao</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal confirmação exclusão ── */}
      {showDeleteConfirm && (
        <div className="modal-inscricao__sobreposicao">
          <div className="modal-inscricao__painel modal-confirmacao">
            <div className="modal-confirmacao__icone">
              <AlertTriangle size={32} style={{ color: "var(--cor-erro, #ef4444)" }} />
            </div>
            <h3 className="modal-inscricao__titulo">Excluir projeto</h3>
            <p className="modal-confirmacao__texto">
              Tem certeza que deseja excluir <strong>{project.title}</strong>? Esta acao nao pode ser desfeita.
            </p>
            <div className="modal-inscricao__rodape">
              <button onClick={() => setShowDeleteConfirm(false)} className="modal-inscricao__botao-cancelar" disabled={deleteLoading}>
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={deleteLoading} className="modal-confirmacao__botao-confirmar">
                {deleteLoading ? <Loader2 size={15} className="girando" /> : <><Trash2 size={15} /> Excluir</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
