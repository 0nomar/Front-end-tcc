import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Users, Clock, DollarSign, BookOpen, Star,
  CheckCircle, Send, Mail, MessageSquare, Share2, Bookmark,
  BarChart2, Eye,
} from "lucide-react";
import { projects } from "../data/mockData";
import "./ProjectDetailPage.css";

const statusStyles = {
  open:         { badgeClass: "detalhe-card__badge-status--aberto",   label: "Aberto para inscrições" },
  "in-progress":{ badgeClass: "detalhe-card__badge-status--andamento", label: "Em andamento" },
  closed:       { badgeClass: "detalhe-card__badge-status--encerrado", label: "Encerrado" },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const project = projects.find((p) => p.id === id) || projects[0];
  const sc = statusStyles[project.status];

  const handleApply = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setApplied(true);
    setShowModal(false);
  };

  return (
    <div className="pagina-detalhe-projeto">
      <button onClick={() => navigate(-1)} className="pagina-detalhe-projeto__voltar">
        <ArrowLeft size={16} />
        Voltar para projetos
      </button>

      <div className="pagina-detalhe-projeto__grade">
        {/* Conteúdo principal */}
        <div className="pagina-detalhe-projeto__conteudo-principal">
          {/* Cabeçalho */}
          <div className="detalhe-card">
            <div className="detalhe-card__topo">
              <div className="detalhe-card__badges">
                <span className={`detalhe-card__badge-status ${sc.badgeClass}`}>{sc.label}</span>
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
                {project.views} visualizações
              </div>
              <div className="detalhe-card__stat-item">
                <BarChart2 size={14} />
                {project.applications} inscrições
              </div>
              <div className="detalhe-card__stat-item">
                <Clock size={14} />
                Publicado em {new Date(project.createdAt).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="detalhe-card">
            <h2 className="detalhe-card__titulo-secao">Sobre o projeto</h2>
            <p className="detalhe-card__descricao">{project.description}</p>
          </div>

          {/* Requisitos */}
          <div className="detalhe-card">
            <h2 className="detalhe-card__titulo-secao">Requisitos</h2>
            <div className="detalhe-card__lista-requisitos">
              {project.requirements.map((req) => (
                <div key={req} className="detalhe-card__requisito">
                  <div className="detalhe-card__requisito-icone">
                    <CheckCircle size={12} style={{ color: "var(--cor-primaria)" }} />
                  </div>
                  <span className="detalhe-card__requisito-texto">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cursos elegíveis */}
          <div className="detalhe-card">
            <h2 className="detalhe-card__titulo-secao">Cursos elegíveis</h2>
            <div className="detalhe-card__chips">
              {project.course.map((c) => (
                <span key={c} className="detalhe-card__chip-curso">{c}</span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="detalhe-card">
            <h2 className="detalhe-card__titulo-secao">Tecnologias e competências</h2>
            <div className="detalhe-card__chips">
              {project.tags.map((tag) => (
                <span key={tag} className="detalhe-card__chip-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="pagina-detalhe-projeto__sidebar">
          {/* Card de inscrição */}
          <div className="card-inscricao">
            {applied ? (
              <div className="card-inscricao__enviada">
                <div className="card-inscricao__icone-sucesso">
                  <CheckCircle size={28} style={{ color: "var(--cor-sucesso)" }} />
                </div>
                <h3 className="card-inscricao__titulo-enviada">Inscrição enviada!</h3>
                <p className="card-inscricao__texto-enviada">
                  Aguarde o retorno do orientador. Você receberá uma notificação.
                </p>
                <button onClick={() => navigate("/app/applications")} className="card-inscricao__botao-ver">
                  Ver minhas inscrições
                </button>
              </div>
            ) : (
              <>
                <div className="card-inscricao__grade-stats">
                  {[
                    { icon: Users,      label: "Vagas disponíveis", value: `${project.slots - project.slotsUsed}/${project.slots}` },
                    { icon: Clock,      label: "Duração",           value: project.duration },
                    { icon: DollarSign, label: "Bolsa",             value: project.scholarship },
                    { icon: BookOpen,   label: "Área",              value: project.area },
                  ].map((s) => (
                    <div key={s.label} className="card-inscricao__stat">
                      <div className="card-inscricao__stat-linha">
                        <s.icon size={13} className="card-inscricao__stat-icone" />
                        <span className="card-inscricao__stat-label">{s.label}</span>
                      </div>
                      <p className="card-inscricao__stat-valor">{s.value}</p>
                    </div>
                  ))}
                </div>

                {project.status === "open" ? (
                  <button onClick={() => setShowModal(true)} className="card-inscricao__botao-inscrever">
                    <Send size={16} />
                    Inscrever-se
                  </button>
                ) : (
                  <div className="card-inscricao__status-encerrado">
                    {project.status === "closed" ? "Vagas encerradas" : "Projeto em andamento"}
                  </div>
                )}

                <button onClick={() => navigate("/app/chat")} className="card-inscricao__botao-perguntar">
                  <MessageSquare size={15} />
                  Perguntar ao orientador
                </button>
              </>
            )}
          </div>

          {/* Card do orientador */}
          <div className="card-orientador">
            <h3 className="card-orientador__titulo">Orientador do projeto</h3>
            <div className="card-orientador__cabecalho">
              <div className="card-orientador__avatar">
                <span className="card-orientador__avatar-inicial">{project.advisor.avatar}</span>
              </div>
              <div>
                <p className="card-orientador__nome">{project.advisor.name}</p>
                <p className="card-orientador__departamento">{project.advisor.department}</p>
              </div>
            </div>

            <div className="card-orientador__info-lista">
              {[
                { label: "Especialidade", value: project.advisor.specialty },
                { label: "Projetos ativos", value: project.advisor.projects.toString() },
                { label: "Alunos orientados", value: project.advisor.students.toString() },
              ].map((s) => (
                <div key={s.label} className="card-orientador__info-linha">
                  <span className="card-orientador__info-label">{s.label}</span>
                  <span className="card-orientador__info-valor">{s.value}</span>
                </div>
              ))}
              <div className="card-orientador__info-linha">
                <span className="card-orientador__info-label">Avaliação</span>
                <div className="card-orientador__avaliacao">
                  <Star size={12} className="card-orientador__estrela" />
                  <span className="card-orientador__info-valor">{project.advisor.rating}</span>
                </div>
              </div>
            </div>

            <button onClick={() => navigate("/app/chat")} className="card-orientador__botao-mensagem">
              <Mail size={14} />
              Enviar mensagem
            </button>
          </div>
        </div>
      </div>

      {/* Modal de inscrição */}
      {showModal && (
        <div className="modal-inscricao__sobreposicao">
          <div className="modal-inscricao__painel">
            <div className="modal-inscricao__cabecalho">
              <h3 className="modal-inscricao__titulo">Inscrição no projeto</h3>
              <p className="modal-inscricao__subtitulo">{project.title}</p>
            </div>

            <div className="modal-inscricao__corpo">
              <div>
                <label className="modal-inscricao__label">Carta de motivação *</label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={5}
                  className="modal-inscricao__textarea"
                  placeholder="Descreva sua motivação, experiências relevantes e por que você é o candidato ideal para este projeto..."
                />
                <p className="modal-inscricao__contador">{motivation.length}/1000 caracteres</p>
              </div>

              <div className="modal-inscricao__dica">
                <strong>Dica:</strong> Uma boa carta de motivação menciona suas habilidades técnicas relevantes, experiências anteriores e como o projeto se alinha com seus objetivos acadêmicos.
              </div>
            </div>

            <div className="modal-inscricao__rodape">
              <button onClick={() => setShowModal(false)} className="modal-inscricao__botao-cancelar">
                Cancelar
              </button>
              <button
                onClick={handleApply}
                disabled={loading || motivation.length < 50}
                className="modal-inscricao__botao-enviar"
              >
                {loading ? (
                  <div className="modal-inscricao__spinner" />
                ) : (
                  <>
                    <Send size={15} />
                    Enviar inscrição
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
