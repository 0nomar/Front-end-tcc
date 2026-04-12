import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Users,
  Clock,
  BookOpen,
  Send,
  Mail,
  MessageSquare,
  Share2,
  Bookmark,
  BarChart2,
  Eye,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { projectService } from "../services/projectService";
import { applicationService } from "../services/applicationService";
import { feedbackService } from "../services/feedbackService";
import { StatusView } from "../components/StatusView";
import { mapFeedback, mapProject, mapProgressItem } from "../utils/adapters";
import { formatProjectStatus } from "../utils/formatters";
import "./ProjectDetailPage.css";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [loadingApply, setLoadingApply] = useState(false);
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
  const feedbackAverage = useMemo(() => {
    const ratings = data?.feedbacks ?? [];
    if (!ratings.length) return "0.0";
    return (ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length).toFixed(1);
  }, [data]);

  const handleApply = async () => {
    setLoadingApply(true);

    try {
      await applicationService.create(id);
      toast.success("Inscricao enviada com sucesso.");
      setShowModal(false);
      setMotivation("");
      await reload();
    } catch (err) {
      toast.error(err.message || "Nao foi possivel enviar a inscricao.");
    } finally {
      setLoadingApply(false);
    }
  };

  if (loading) {
    return <StatusView title="Carregando projeto" description="Buscando detalhes do projeto na API." />;
  }

  if (error || !project) {
    return <StatusView title="Projeto indisponivel" description={error?.message || "Nao foi possivel localizar este projeto."} />;
  }

  return (
    <div className="pagina-detalhe-projeto">
      <button onClick={() => navigate(-1)} className="pagina-detalhe-projeto__voltar">
        <ArrowLeft size={16} />
        Voltar para projetos
      </button>

      <div className="pagina-detalhe-projeto__grade">
        <div className="pagina-detalhe-projeto__conteudo-principal">
          <div className="detalhe-card">
            <div className="detalhe-card__topo">
              <div className="detalhe-card__badges">
                <span className="detalhe-card__badge-status detalhe-card__badge-status--aberto">
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
              <div className="detalhe-card__stat-item">
                <Eye size={14} />
                {data.feedbacks.length} feedbacks
              </div>
              <div className="detalhe-card__stat-item">
                <BarChart2 size={14} />
                {data.progress.length} atualizacoes
              </div>
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
                <p className="detalhe-card__descricao">A API nao retornou requisitos cadastrados para este projeto.</p>
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
        </div>

        <div className="pagina-detalhe-projeto__sidebar">
          <div className="card-inscricao">
            <div className="card-inscricao__grade-stats">
              {[
                { icon: Users, label: "Vagas disponiveis", value: `${Math.max(project.slots - project.slotsUsed, 0)}/${project.slots}` },
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

            {project.status === "ABERTO" ? (
              <button onClick={() => setShowModal(true)} className="card-inscricao__botao-inscrever">
                <Send size={16} />
                Inscrever-se
              </button>
            ) : (
              <div className="card-inscricao__status-encerrado">{formatProjectStatus(project.status)}</div>
            )}

            <button onClick={() => navigate("/app/chat")} className="card-inscricao__botao-perguntar">
              <MessageSquare size={15} />
              Perguntar ao orientador
            </button>
          </div>

          <div className="card-orientador">
            <h3 className="card-orientador__titulo">Orientador do projeto</h3>
            <div className="card-orientador__cabecalho">
              <div className="card-orientador__avatar">
                <span className="card-orientador__avatar-inicial">
                  {(project.advisor?.name ?? "IC").split(" ").slice(0, 2).map((part) => part[0]).join("")}
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

            <button onClick={() => navigate("/app/chat")} className="card-orientador__botao-mensagem">
              <Mail size={14} />
              Enviar mensagem
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-inscricao__sobreposicao">
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
                  className="modal-inscricao__textarea"
                  placeholder="Escreva sua motivacao para o projeto..."
                />
                <p className="modal-inscricao__contador">{motivation.length}/1000 caracteres</p>
              </div>

              <div className="modal-inscricao__dica">
                <strong>Observacao:</strong> a API atual recebe apenas o identificador do projeto. O texto fica no frontend ate o backend expor esse campo.
              </div>
            </div>

            <div className="modal-inscricao__rodape">
              <button onClick={() => setShowModal(false)} className="modal-inscricao__botao-cancelar">
                Cancelar
              </button>
              <button
                onClick={handleApply}
                disabled={loadingApply}
                className="modal-inscricao__botao-enviar"
              >
                {loadingApply ? <div className="modal-inscricao__spinner" /> : <><Send size={15} /> Enviar inscricao</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
