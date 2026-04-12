import { useMemo, useState } from "react";
import { Star, Send, CheckCircle, MessageSquare, Award } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { feedbackService } from "../services/feedbackService";
import { userService } from "../services/userService";
import { mapFeedback, mapProject } from "../utils/adapters";
import { StatusView } from "../components/StatusView";
import "./FeedbackPage.css";

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="avaliacao-estrelas">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => !readOnly && onChange?.(score)}
          onMouseEnter={() => !readOnly && setHovered(score)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          disabled={readOnly}
          className="avaliacao-estrelas__botao"
        >
          <Star size={20} className={score <= (hovered || value) ? "avaliacao-estrelas__icone--ativa" : "avaliacao-estrelas__icone--inativa"} />
        </button>
      ))}
    </div>
  );
}

const statConfig = [
  { label: "Feedbacks recebidos", icon: MessageSquare, areaClass: "resumo-feedback__icone-area--azul", iconClass: "resumo-feedback__icone--azul" },
  { label: "Nota media", icon: Star, areaClass: "resumo-feedback__icone-area--amarelo", iconClass: "resumo-feedback__icone--amarelo" },
  { label: "Desempenho geral", icon: Award, areaClass: "resumo-feedback__icone-area--violeta", iconClass: "resumo-feedback__icone--violeta" },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const { data, loading, error } = useAsyncData(async () => {
    if (!user?.id) return { feedbacks: [], projects: [] };
    const [feedbacks, projects] = await Promise.all([
      feedbackService.listByUser(user.id).catch(() => []),
      userService.getProjects(user.id).catch(() => []),
    ]);

    return {
      feedbacks: Array.isArray(feedbacks) ? feedbacks.map(mapFeedback) : [],
      projects: Array.isArray(projects) ? projects.map(mapProject) : [],
    };
  }, [user?.id], { initialData: { feedbacks: [], projects: [] } });

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const averageRating = useMemo(() => {
    const feedbacks = data?.feedbacks ?? [];
    if (!feedbacks.length) return "0.0";
    return (feedbacks.reduce((acc, item) => acc + item.rating, 0) / feedbacks.length).toFixed(1);
  }, [data]);

  const statsValues = [data?.feedbacks?.length ?? 0, averageRating, Number(averageRating) >= 4 ? "Excelente" : "Em evolucao"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      await feedbackService.create({
        projetoId: Number(selectedProject),
        nota: rating,
        comentario: comment,
      });
      toast.success("Feedback enviado com sucesso.");
      setSubmitted(true);
      setShowForm(false);
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.message || "Nao foi possivel enviar o feedback.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) {
    return <StatusView title="Carregando feedbacks" description="Buscando avaliacoes reais da API." />;
  }

  if (error) {
    return <StatusView title="Falha ao carregar feedbacks" description={error.message} />;
  }

  return (
    <div className="pagina-feedback">
      <div className="pagina-feedback__grade-resumos">
        {statConfig.map((item, index) => (
          <div key={item.label} className="resumo-feedback">
            <div className={`resumo-feedback__icone-area ${item.areaClass}`}>
              <item.icon size={18} className={item.iconClass} />
            </div>
            <p className="resumo-feedback__valor">{statsValues[index]}</p>
            <p className="resumo-feedback__label">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="pagina-feedback__grade-principal">
        <div>
          <h3 className="pagina-feedback__secao-titulo">Feedbacks recebidos</h3>
          <div className="pagina-feedback__lista">
            {(data.feedbacks ?? []).map((feedback) => (
              <div key={feedback.id} className="feedback-card">
                <div className="feedback-card__cabecalho">
                  <div className="feedback-card__avatar">
                    <span className="feedback-card__avatar-inicial">
                      {(feedback.from?.nome ?? "IC").split(" ").slice(0, 2).map((part) => part[0]).join("")}
                    </span>
                  </div>
                  <div className="feedback-card__info">
                    <p className="feedback-card__nome">{feedback.from?.nome ?? "Usuario"}</p>
                    <p className="feedback-card__meta">
                      {feedback.date ? new Date(feedback.date).toLocaleDateString("pt-BR") : "-"} · {feedback.project?.title ?? "Projeto"}
                    </p>
                  </div>
                  <div className="feedback-card__estrelas">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Star key={score} size={14} className={score <= feedback.rating ? "feedback-card__estrela--ativa" : "feedback-card__estrela--inativa"} />
                    ))}
                  </div>
                </div>

                <p className="feedback-card__comentario">"{feedback.comment}"</p>
              </div>
            ))}

            {(data.feedbacks ?? []).length === 0 && (
              <div className="feedback-card--vazio">
                <div className="feedback-card__icone-vazio">
                  <Star size={22} className="resumo-feedback__icone--amarelo" />
                </div>
                <p className="feedback-card__titulo-vazio">Nenhum feedback ainda</p>
                <p className="feedback-card__subtitulo-vazio">Os feedbacks reais enviados e recebidos aparecerao aqui.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="pagina-feedback__secao-titulo">Avaliar projeto</h3>

          {submitted ? (
            <div className="avaliacao-orientador avaliacao-orientador--enviada">
              <div className="avaliacao-orientador__icone-sucesso">
                <CheckCircle size={28} style={{ color: "var(--cor-sucesso)" }} />
              </div>
              <h3 className="avaliacao-orientador__titulo-sucesso">Feedback enviado!</h3>
              <p className="avaliacao-orientador__texto-sucesso">Sua avaliacao foi registrada via API.</p>
              <button onClick={() => setSubmitted(false)} className="avaliacao-orientador__botao-outro">
                Dar outro feedback
              </button>
            </div>
          ) : (
            <div className="avaliacao-orientador">
              {!showForm ? (
                <div className="avaliacao-orientador__prompt">
                  <div className="avaliacao-orientador__estrelas-prompt">
                    {[1, 2, 3, 4, 5].map((score) => <Star key={score} size={28} className="avaliacao-orientador__estrela-vazia" />)}
                  </div>
                  <h4 className="avaliacao-orientador__titulo-prompt">Como foi sua experiencia?</h4>
                  <p className="avaliacao-orientador__texto-prompt">Avalie projetos e orientacoes com base nos dados reais do sistema.</p>
                  <button onClick={() => setShowForm(true)} className="avaliacao-orientador__botao-iniciar">
                    Avaliar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="formulario-avaliacao">
                  <div className="formulario-avaliacao__grupo">
                    <label className="formulario-avaliacao__label">Projeto</label>
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="formulario-avaliacao__select" required>
                      <option value="">Selecione um projeto</option>
                      {(data.projects ?? []).map((project) => (
                        <option key={project.id} value={project.id}>{project.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="formulario-avaliacao__grupo">
                    <label className="formulario-avaliacao__label">Avaliacao geral</label>
                    <div className="formulario-avaliacao__linha-estrelas">
                      <StarRating value={rating} onChange={setRating} />
                    </div>
                  </div>

                  <div className="formulario-avaliacao__grupo">
                    <label className="formulario-avaliacao__label">Comentario</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="formulario-avaliacao__textarea" placeholder="Compartilhe sua experiencia..." required />
                  </div>

                  <div className="formulario-avaliacao__acoes">
                    <button type="button" onClick={() => setShowForm(false)} className="formulario-avaliacao__botao-cancelar">
                      Cancelar
                    </button>
                    <button type="submit" disabled={loadingSubmit || rating === 0 || !comment || !selectedProject} className="formulario-avaliacao__botao-enviar">
                      {loadingSubmit ? <div className="formulario-avaliacao__spinner" /> : <><Send size={15} /> Enviar avaliacao</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
