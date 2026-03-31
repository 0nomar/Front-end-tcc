import { useState } from "react";
import { Star, Send, CheckCircle, MessageSquare, Award } from "lucide-react";
import { feedbacks, projects } from "../data/mockData";
import "./FeedbackPage.css";

const categories = [
  { key: "technical", label: "Técnico" },
  { key: "communication", label: "Comunicação" },
  { key: "punctuality", label: "Pontualidade" },
  { key: "initiative", label: "Iniciativa" },
];

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="avaliacao-estrelas">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => !readOnly && onChange?.(s)}
          onMouseEnter={() => !readOnly && setHovered(s)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          disabled={readOnly}
          className="avaliacao-estrelas__botao"
        >
          <Star
            size={20}
            className={s <= (hovered || value) ? "avaliacao-estrelas__icone--ativa" : "avaliacao-estrelas__icone--inativa"}
          />
        </button>
      ))}
    </div>
  );
}

const statConfig = [
  { label: "Feedbacks recebidos", key: "count", icon: MessageSquare, areaClass: "resumo-feedback__icone-area--azul", iconClass: "resumo-feedback__icone--azul" },
  { label: "Nota média", key: "avg", icon: Star, areaClass: "resumo-feedback__icone-area--amarelo", iconClass: "resumo-feedback__icone--amarelo" },
  { label: "Desempenho geral", key: "perf", icon: Award, areaClass: "resumo-feedback__icone-area--violeta", iconClass: "resumo-feedback__icone--violeta" },
];

export default function FeedbackPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState({
    technical: 0,
    communication: 0,
    punctuality: 0,
    initiative: 0,
  });
  const [comment, setComment] = useState("");
  const [selectedProject, setSelectedProject] = useState(projects[0].id);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    setShowForm(false);
  };

  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
      : 0;

  const statsValues = [feedbacks.length, averageRating.toFixed(1), "Excelente"];

  return (
    <div className="pagina-feedback">
      {/* Resumos */}
      <div className="pagina-feedback__grade-resumos">
        {statConfig.map((s, i) => (
          <div key={s.label} className="resumo-feedback">
            <div className={`resumo-feedback__icone-area ${s.areaClass}`}>
              <s.icon size={18} className={s.iconClass} />
            </div>
            <p className="resumo-feedback__valor">{statsValues[i]}</p>
            <p className="resumo-feedback__label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="pagina-feedback__grade-principal">
        {/* Feedbacks recebidos */}
        <div>
          <h3 className="pagina-feedback__secao-titulo">Feedbacks recebidos</h3>
          <div className="pagina-feedback__lista">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="feedback-card">
                <div className="feedback-card__cabecalho">
                  <div className="feedback-card__avatar">
                    <span className="feedback-card__avatar-inicial">{fb.from.avatar}</span>
                  </div>
                  <div className="feedback-card__info">
                    <p className="feedback-card__nome">{fb.from.name}</p>
                    <p className="feedback-card__meta">
                      {new Date(fb.date).toLocaleDateString("pt-BR")} · {fb.project.title.slice(0, 30)}...
                    </p>
                  </div>
                  <div className="feedback-card__estrelas">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= fb.rating ? "feedback-card__estrela--ativa" : "feedback-card__estrela--inativa"}
                      />
                    ))}
                  </div>
                </div>

                <p className="feedback-card__comentario">"{fb.comment}"</p>

                <div className="feedback-card__grade-categorias">
                  {categories.map((cat) => {
                    const val = fb.categories[cat.key];
                    return (
                      <div key={cat.key}>
                        <div className="feedback-card__categoria-linha">
                          <span className="feedback-card__categoria-label">{cat.label}</span>
                          <span className="feedback-card__categoria-valor">{val}/5</span>
                        </div>
                        <div className="feedback-card__trilha-categoria">
                          <div className="feedback-card__barra-categoria" style={{ width: `${(val / 5) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {feedbacks.length === 0 && (
              <div className="feedback-card--vazio">
                <div className="feedback-card__icone-vazio">
                  <Star size={22} className="resumo-feedback__icone--amarelo" />
                </div>
                <p className="feedback-card__titulo-vazio">Nenhum feedback ainda</p>
                <p className="feedback-card__subtitulo-vazio">Feedbacks aparecerão aqui quando recebidos.</p>
              </div>
            )}
          </div>
        </div>

        {/* Avaliar orientador */}
        <div>
          <h3 className="pagina-feedback__secao-titulo">Avaliar orientador</h3>

          {submitted ? (
            <div className="avaliacao-orientador avaliacao-orientador--enviada">
              <div className="avaliacao-orientador__icone-sucesso">
                <CheckCircle size={28} style={{ color: "var(--cor-sucesso)" }} />
              </div>
              <h3 className="avaliacao-orientador__titulo-sucesso">Feedback enviado!</h3>
              <p className="avaliacao-orientador__texto-sucesso">
                Obrigado pela sua avaliação. Isso ajuda a melhorar a experiência de pesquisa.
              </p>
              <button
                onClick={() => { setSubmitted(false); setShowForm(false); setRating(0); setComment(""); }}
                className="avaliacao-orientador__botao-outro"
              >
                Dar outro feedback
              </button>
            </div>
          ) : (
            <div className="avaliacao-orientador">
              {!showForm ? (
                <div className="avaliacao-orientador__prompt">
                  <div className="avaliacao-orientador__estrelas-prompt">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={28} className="avaliacao-orientador__estrela-vazia" />
                    ))}
                  </div>
                  <h4 className="avaliacao-orientador__titulo-prompt">Como foi sua experiência?</h4>
                  <p className="avaliacao-orientador__texto-prompt">
                    Avalie seu orientador e contribua para a comunidade acadêmica.
                  </p>
                  <button onClick={() => setShowForm(true)} className="avaliacao-orientador__botao-iniciar">
                    Avaliar orientador
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="formulario-avaliacao">
                  {/* Projeto */}
                  <div className="formulario-avaliacao__grupo">
                    <label className="formulario-avaliacao__label">Projeto</label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="formulario-avaliacao__select"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.title.slice(0, 50)}...</option>
                      ))}
                    </select>
                  </div>

                  {/* Avaliação geral */}
                  <div className="formulario-avaliacao__grupo">
                    <label className="formulario-avaliacao__label">Avaliação geral</label>
                    <div className="formulario-avaliacao__linha-estrelas">
                      <StarRating value={rating} onChange={setRating} />
                      {rating > 0 && (
                        <span className="formulario-avaliacao__nivel">
                          {["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"][rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Categorias */}
                  <div className="formulario-avaliacao__grupo">
                    <label className="formulario-avaliacao__label">Avaliação por categoria</label>
                    <div className="formulario-avaliacao__lista-categorias">
                      {categories.map((cat) => (
                        <div key={cat.key} className="formulario-avaliacao__categoria-linha">
                          <span className="formulario-avaliacao__categoria-nome">{cat.label}</span>
                          <StarRating
                            value={categoryRatings[cat.key]}
                            onChange={(v) => setCategoryRatings({ ...categoryRatings, [cat.key]: v })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comentário */}
                  <div className="formulario-avaliacao__grupo">
                    <label className="formulario-avaliacao__label">Comentário</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="formulario-avaliacao__textarea"
                      placeholder="Compartilhe sua experiência com este orientador..."
                      required
                    />
                  </div>

                  <div className="formulario-avaliacao__acoes">
                    <button type="button" onClick={() => setShowForm(false)} className="formulario-avaliacao__botao-cancelar">
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || rating === 0 || !comment}
                      className="formulario-avaliacao__botao-enviar"
                    >
                      {loading ? (
                        <div className="formulario-avaliacao__spinner" />
                      ) : (
                        <>
                          <Send size={15} /> Enviar avaliação
                        </>
                      )}
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
