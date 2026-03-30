import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  MessageSquare,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { applications } from "../data/mockData";
import "./ApplicationsPage.css";

const statusConfig = {
  approved: {
    label:          "Aprovado",
    icon:           CheckCircle,
    iconeClass:     "inscricao-card__icone-status--aprovado",
    iconeColor:     "var(--cor-sucesso)",
    etiquetaClass:  "inscricao-card__etiqueta-status--aprovado",
    expandidaClass: "inscricao-card__conteudo-expandido--aprovado",
    motivacaoClass: "inscricao-card__texto-motivacao--aprovado",
  },
  pending: {
    label:          "Pendente",
    icon:           Clock,
    iconeClass:     "inscricao-card__icone-status--pendente",
    iconeColor:     "var(--cor-atencao)",
    etiquetaClass:  "inscricao-card__etiqueta-status--pendente",
    expandidaClass: "inscricao-card__conteudo-expandido--pendente",
    motivacaoClass: "inscricao-card__texto-motivacao--pendente",
  },
  rejected: {
    label:          "Não aprovado",
    icon:           XCircle,
    iconeClass:     "inscricao-card__icone-status--rejeitado",
    iconeColor:     "var(--cor-erro)",
    etiquetaClass:  "inscricao-card__etiqueta-status--rejeitado",
    expandidaClass: "inscricao-card__conteudo-expandido--rejeitado",
    motivacaoClass: "inscricao-card__texto-motivacao--rejeitado",
  },
};

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered =
    filter === "all" ? applications : applications.filter((a) => a.status === filter);

  const counts = {
    all:      applications.length,
    approved: applications.filter((a) => a.status === "approved").length,
    pending:  applications.filter((a) => a.status === "pending").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="pagina-inscricoes">
      {/* Cartões de resumo */}
      <div className="pagina-inscricoes__grade-resumos">
        {["all", "approved", "pending", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`resumo-inscricao ${filter === s ? "resumo-inscricao--ativo" : "resumo-inscricao--inativo"}`}
          >
            <p className={`resumo-inscricao__valor ${filter === s ? "resumo-inscricao__valor--ativo" : "resumo-inscricao__valor--inativo"}`}>
              {counts[s]}
            </p>
            <p className={`resumo-inscricao__rotulo ${filter === s ? "resumo-inscricao__rotulo--ativo" : "resumo-inscricao__rotulo--inativo"}`}>
              {s === "all" ? "Total de inscrições" : s === "approved" ? "Aprovadas" : s === "pending" ? "Aguardando" : "Não aprovadas"}
            </p>
          </button>
        ))}
      </div>

      {/* Abas de filtro */}
      <div className="pagina-inscricoes__abas">
        {["all", "approved", "pending", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`pagina-inscricoes__aba ${filter === s ? "pagina-inscricoes__aba--ativa" : "pagina-inscricoes__aba--inativa"}`}
          >
            {s === "all" ? "Todas" : statusConfig[s].label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="pagina-inscricoes__estado-vazio">
          <div className="pagina-inscricoes__icone-vazio">
            <FileText size={24} style={{ color: "var(--cor-texto-mudo)" }} />
          </div>
          <h3 className="pagina-inscricoes__titulo-vazio">Nenhuma inscrição encontrada</h3>
          <p className="pagina-inscricoes__descricao-vazio">
            {filter === "all"
              ? "Você ainda não se inscreveu em nenhum projeto."
              : `Você não tem inscrições com status "${statusConfig[filter].label}".`}
          </p>
          <button
            onClick={() => navigate("/app/projects")}
            className="pagina-inscricoes__botao-explorar"
          >
            Explorar projetos
          </button>
        </div>
      ) : (
        <div className="pagina-inscricoes__lista">
          {filtered.map((app) => {
            const cfg = statusConfig[app.status];
            const isExpanded = expandedId === app.id;

            return (
              <div key={app.id} className="inscricao-card">
                <div
                  className="inscricao-card__cabecalho"
                  onClick={() => setExpandedId(isExpanded ? null : app.id)}
                >
                  <div className="inscricao-card__linha-principal">
                    <div className={`inscricao-card__icone-status ${cfg.iconeClass}`}>
                      <cfg.icon size={20} style={{ color: cfg.iconeColor }} />
                    </div>
                    <div className="inscricao-card__info">
                      <div className="inscricao-card__linha-titulo">
                        <h3 className="inscricao-card__titulo-projeto">{app.project.title}</h3>
                        <span className={`inscricao-card__etiqueta-status ${cfg.etiquetaClass}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="inscricao-card__orientador">
                        Orientador: {app.project.advisor.name}
                      </p>
                      <div className="inscricao-card__metadados">
                        <span className="inscricao-card__metadado">
                          <Calendar size={12} />
                          Inscrito em {new Date(app.appliedAt).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="inscricao-card__metadado">
                          <Clock size={12} />
                          Atualizado em {new Date(app.updatedAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`inscricao-card__icone-expansao ${isExpanded ? "inscricao-card__icone-expansao--expandido" : ""}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className={`inscricao-card__conteudo-expandido ${cfg.expandidaClass}`}>
                    <div className="inscricao-card__secao-expandida">
                      <div>
                        <h4 className="inscricao-card__rotulo-secao">Sua carta de motivação</h4>
                        <p className={`inscricao-card__texto-motivacao ${cfg.motivacaoClass}`}>
                          {app.motivation}
                        </p>
                      </div>

                      {app.feedback && (
                        <div>
                          <h4 className="inscricao-card__rotulo-secao">Resposta do orientador</h4>
                          <p className="inscricao-card__feedback">{app.feedback}</p>
                        </div>
                      )}

                      <div className="inscricao-card__botoes-acao">
                        <button
                          onClick={() => navigate(`/app/projects/${app.project.id}`)}
                          className="inscricao-card__botao inscricao-card__botao--neutro"
                        >
                          <ExternalLink size={13} /> Ver projeto
                        </button>
                        <button
                          onClick={() => navigate("/app/chat")}
                          className="inscricao-card__botao inscricao-card__botao--mensagem"
                        >
                          <MessageSquare size={13} /> Enviar mensagem
                        </button>
                        {app.status === "approved" && (
                          <button
                            onClick={() => navigate("/app/progress")}
                            className="inscricao-card__botao inscricao-card__botao--progresso"
                          >
                            <CheckCircle size={13} /> Ver progresso
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
