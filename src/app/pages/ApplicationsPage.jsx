import { useMemo, useState } from "react";
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
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { applicationService } from "../services/applicationService";
import { mapApplication } from "../utils/adapters";
import { formatApplicationStatus } from "../utils/formatters";
import { StatusView } from "../components/StatusView";
import "./ApplicationsPage.css";

const statusConfig = {
  APROVADO: {
    icon: CheckCircle,
    iconeClass: "inscricao-card__icone-status--aprovado",
    iconeColor: "var(--cor-sucesso)",
    etiquetaClass: "inscricao-card__etiqueta-status--aprovado",
    expandidaClass: "inscricao-card__conteudo-expandido--aprovado",
  },
  PENDENTE: {
    icon: Clock,
    iconeClass: "inscricao-card__icone-status--pendente",
    iconeColor: "var(--cor-atencao)",
    etiquetaClass: "inscricao-card__etiqueta-status--pendente",
    expandidaClass: "inscricao-card__conteudo-expandido--pendente",
  },
  REJEITADO: {
    icon: XCircle,
    iconeClass: "inscricao-card__icone-status--rejeitado",
    iconeColor: "var(--cor-erro)",
    etiquetaClass: "inscricao-card__etiqueta-status--rejeitado",
    expandidaClass: "inscricao-card__conteudo-expandido--rejeitado",
  },
};

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const { data, loading, error } = useAsyncData(
    async () => {
      const result = await applicationService.listMine();
      return Array.isArray(result) ? result.map(mapApplication) : [];
    },
    [],
    { initialData: [] },
  );
  const applications = Array.isArray(data) ? data : [];
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(
    () => (filter === "all" ? applications : applications.filter((item) => item.status === filter)),
    [applications, filter],
  );

  const counts = useMemo(
    () => ({
      all: applications.length,
      APROVADO: applications.filter((item) => item.status === "APROVADO").length,
      PENDENTE: applications.filter((item) => item.status === "PENDENTE").length,
      REJEITADO: applications.filter((item) => item.status === "REJEITADO").length,
    }),
    [applications],
  );

  if (loading) {
    return <StatusView title="Carregando inscricoes" description="Buscando suas inscricoes na API." />;
  }

  if (error) {
    return <StatusView title="Falha ao carregar inscricoes" description={error.message} />;
  }

  return (
    <div className="pagina-inscricoes">
      <div className="pagina-inscricoes__grade-resumos">
        {[
          ["all", "Total de inscricoes"],
          ["APROVADO", "Aprovadas"],
          ["PENDENTE", "Aguardando"],
          ["REJEITADO", "Nao aprovadas"],
        ].map(([status, label]) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`resumo-inscricao ${filter === status ? "resumo-inscricao--ativo" : "resumo-inscricao--inativo"}`}
          >
            <p className={`resumo-inscricao__valor ${filter === status ? "resumo-inscricao__valor--ativo" : "resumo-inscricao__valor--inativo"}`}>
              {counts[status]}
            </p>
            <p className={`resumo-inscricao__rotulo ${filter === status ? "resumo-inscricao__rotulo--ativo" : "resumo-inscricao__rotulo--inativo"}`}>
              {label}
            </p>
          </button>
        ))}
      </div>

      <div className="pagina-inscricoes__abas">
        {["all", "APROVADO", "PENDENTE", "REJEITADO"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`pagina-inscricoes__aba ${filter === status ? "pagina-inscricoes__aba--ativa" : "pagina-inscricoes__aba--inativa"}`}
          >
            {status === "all" ? "Todas" : formatApplicationStatus(status)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="pagina-inscricoes__estado-vazio">
          <div className="pagina-inscricoes__icone-vazio">
            <FileText size={24} style={{ color: "var(--cor-texto-mudo)" }} />
          </div>
          <h3 className="pagina-inscricoes__titulo-vazio">Nenhuma inscricao encontrada</h3>
          <p className="pagina-inscricoes__descricao-vazio">Quando existir historico real de inscricoes, ele aparecera aqui.</p>
          <button onClick={() => navigate("/app/projects")} className="pagina-inscricoes__botao-explorar">
            Explorar projetos
          </button>
        </div>
      ) : (
        <div className="pagina-inscricoes__lista">
          {filtered.map((application) => {
            const cfg = statusConfig[application.status] ?? statusConfig.PENDENTE;
            const isExpanded = expandedId === application.id;

            return (
              <div key={application.id} className="inscricao-card">
                <div className="inscricao-card__cabecalho" onClick={() => setExpandedId(isExpanded ? null : application.id)}>
                  <div className="inscricao-card__linha-principal">
                    <div className={`inscricao-card__icone-status ${cfg.iconeClass}`}>
                      <cfg.icon size={20} style={{ color: cfg.iconeColor }} />
                    </div>
                    <div className="inscricao-card__info">
                      <div className="inscricao-card__linha-titulo">
                        <h3 className="inscricao-card__titulo-projeto">{application.project?.title ?? "Projeto"}</h3>
                        <span className={`inscricao-card__etiqueta-status ${cfg.etiquetaClass}`}>
                          {formatApplicationStatus(application.status)}
                        </span>
                      </div>
                      <p className="inscricao-card__orientador">
                        Orientador: {application.project?.advisor?.name ?? "Sem orientador"}
                      </p>
                      <div className="inscricao-card__metadados">
                        <span className="inscricao-card__metadado">
                          <Calendar size={12} />
                          Inscrito em {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString("pt-BR") : "-"}
                        </span>
                        <span className="inscricao-card__metadado">
                          <Clock size={12} />
                          Atualizado em {application.updatedAt ? new Date(application.updatedAt).toLocaleDateString("pt-BR") : "-"}
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
                        <h4 className="inscricao-card__rotulo-secao">Detalhes</h4>
                        <p className="inscricao-card__feedback">
                          Esta inscricao foi carregada da API real. O backend atual ainda nao expõe carta de motivacao nem resposta textual do orientador.
                        </p>
                      </div>

                      <div className="inscricao-card__botoes-acao">
                        <button
                          onClick={() => navigate(`/app/projects/${application.project?.id}`)}
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
