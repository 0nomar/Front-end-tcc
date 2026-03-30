import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FolderOpen,
  FileText,
  MessageSquare,
  Bell,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star,
} from "lucide-react";
import { currentUser, dashboardStats, applications, projects, progressData, notifications } from "../data/mockData";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import "./DashboardPage.css";

const activityData = [
  { month: "Set", atividade: 3 },
  { month: "Out", atividade: 5 },
  { month: "Nov", atividade: 4 },
  { month: "Dez", atividade: 7 },
  { month: "Jan", atividade: 6 },
  { month: "Fev", atividade: 9 },
  { month: "Mar", atividade: 8 },
];

const statCards = [
  {
    label: "Projetos ativos",
    value: dashboardStats.activeProjects,
    icon: FolderOpen,
    areaClass: "cartao-resumo__icone-area--azul",
    iconClass: "cartao-resumo__icone--azul",
    bordaClass: "cartao-resumo--borda-azul",
    href: "/app/projects",
  },
  {
    label: "Inscrições",
    value: dashboardStats.applications,
    icon: FileText,
    areaClass: "cartao-resumo__icone-area--violeta",
    iconClass: "cartao-resumo__icone--violeta",
    bordaClass: "cartao-resumo--borda-violeta",
    href: "/app/applications",
  },
  {
    label: "Mensagens não lidas",
    value: dashboardStats.unreadMessages,
    icon: MessageSquare,
    areaClass: "cartao-resumo__icone-area--verde",
    iconClass: "cartao-resumo__icone--verde",
    bordaClass: "cartao-resumo--borda-verde",
    href: "/app/chat",
  },
  {
    label: "Notificações",
    value: dashboardStats.unreadNotifications,
    icon: Bell,
    areaClass: "cartao-resumo__icone-area--laranja",
    iconClass: "cartao-resumo__icone--laranja",
    bordaClass: "cartao-resumo--borda-laranja",
    href: "/app/notifications",
  },
];

const statusClasses = {
  approved: { status: "inscricao-item__status--aprovado",   label: "Aprovado"  },
  pending:  { status: "inscricao-item__status--pendente",   label: "Pendente"  },
  rejected: { status: "inscricao-item__status--rejeitado",  label: "Rejeitado" },
};

const notifBgClass = {
  success: "notificacao-resumo__icone-area--sucesso",
  info:    "notificacao-resumo__icone-area--info",
  warning: "notificacao-resumo__icone-area--atencao",
  error:   "notificacao-resumo__icone-area--erro",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const recentNotifications = notifications.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="painel"
    >
      {/* Banner de boas-vindas */}
      <div className="painel__banner-boas-vindas">
        <div className="painel__decoracao-banner">
          <div className="painel__decoracao-circulo-topo" />
          <div className="painel__decoracao-circulo-base" />
        </div>
        <div className="painel__conteudo-banner">
          <p className="painel__data-banner">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h2 className="painel__titulo-banner">
            Olá, {currentUser.name.split(" ")[0]}! 👋
          </h2>
          <p className="painel__descricao-banner">
            Você tem{" "}
            <strong className="painel__destaque-banner">{dashboardStats.unreadNotifications} notificações</strong>{" "}
            e{" "}
            <strong className="painel__destaque-banner">{dashboardStats.unreadMessages} mensagens</strong>{" "}
            não lidas.
          </p>
          <div className="painel__botoes-banner">
            <button onClick={() => navigate("/app/projects")} className="painel__botao-banner">
              <FolderOpen size={14} /> Buscar projetos
            </button>
            <button onClick={() => navigate("/app/progress")} className="painel__botao-banner">
              <TrendingUp size={14} /> Ver progresso
            </button>
          </div>
        </div>
      </div>

      {/* Cartões de resumo */}
      <div className="painel__grade-resumos">
        {statCards.map((card) => (
          <motion.button
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03, boxShadow: "0 16px 30px rgba(37,99,235,0.18)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(card.href)}
            className={`cartao-resumo ${card.bordaClass}`}
          >
            <div className="cartao-resumo__cabecalho">
              <div className={`cartao-resumo__icone-area ${card.areaClass}`}>
                <card.icon size={18} className={card.iconClass} />
              </div>
              <ChevronRight size={14} className="cartao-resumo__seta" />
            </div>
            <p className="cartao-resumo__valor">{card.value}</p>
            <p className="cartao-resumo__descricao">{card.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Grade principal */}
      <div className="painel__grade-principal">
        {/* Coluna esquerda */}
        <div className="painel__coluna-esquerda">
          {/* Projeto em andamento */}
          <div className="painel__card">
            <div className="painel__card-cabecalho">
              <h3 className="painel__card-titulo">Projeto em andamento</h3>
              <button onClick={() => navigate("/app/progress")} className="painel__link-ver-mais">
                Ver detalhes <ArrowRight size={13} />
              </button>
            </div>
            <div className="projeto-andamento__corpo">
              <div className="projeto-andamento__linha">
                <div className="projeto-andamento__icone-area">
                  <FolderOpen size={18} style={{ color: "var(--cor-primaria)" }} />
                </div>
                <div className="projeto-andamento__info">
                  <h4 className="projeto-andamento__nome">{progressData.project.title}</h4>
                  <p className="projeto-andamento__orientador">
                    Orientador: {progressData.project.advisor.name}
                  </p>
                  <div className="projeto-andamento__progresso">
                    <div className="projeto-andamento__progresso-cabecalho">
                      <span className="projeto-andamento__fase">
                        Fase atual: {progressData.currentPhase}
                      </span>
                      <span className="projeto-andamento__percentual">
                        {progressData.completionPercent}%
                      </span>
                    </div>
                    <div className="projeto-andamento__trilha">
                      <div
                        className="projeto-andamento__barra"
                        style={{ width: `${progressData.completionPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="projeto-andamento__marcos">
                    {progressData.milestones.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        className={`marco-item ${
                          m.status === "completed"
                            ? "marco-item--concluido"
                            : m.status === "in-progress"
                            ? "marco-item--andamento"
                            : "marco-item--pendente"
                        }`}
                      >
                        <div className="marco-item__icone">
                          {m.status === "completed" ? (
                            <CheckCircle size={14} style={{ color: "var(--cor-sucesso)", margin: "0 auto" }} />
                          ) : m.status === "in-progress" ? (
                            <Clock size={14} style={{ color: "var(--cor-primaria)", margin: "0 auto" }} />
                          ) : (
                            <div style={{ width: "0.875rem", height: "0.875rem", borderRadius: "50%", border: "2px solid var(--cor-borda-media)", margin: "0 auto" }} />
                          )}
                        </div>
                        <p className="marco-item__titulo">
                          {m.title.split(" ").slice(0, 2).join(" ")}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inscrições */}
          <div className="painel__card">
            <div className="painel__card-cabecalho">
              <h3 className="painel__card-titulo">Minhas inscrições</h3>
              <button onClick={() => navigate("/app/applications")} className="painel__link-ver-mais">
                Ver todas <ArrowRight size={13} />
              </button>
            </div>
            <div>
              {applications.map((app, index) => {
                const sc = statusClasses[app.status];
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="inscricao-item"
                  >
                    <div className="inscricao-item__icone-area">
                      <FileText size={15} style={{ color: "var(--cor-texto-fraco)" }} />
                    </div>
                    <div className="inscricao-item__info">
                      <p className="inscricao-item__titulo">{app.project.title}</p>
                      <p className="inscricao-item__orientador">{app.project.advisor.name}</p>
                    </div>
                    <span className={`inscricao-item__status ${sc.status}`}>{sc.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Gráfico de atividade */}
          <div className="painel__card-grafico">
            <div className="painel__grafico-cabecalho">
              <h3 className="painel__card-titulo">Atividade recente</h3>
              <span className="painel__grafico-periodo">Últimos 7 meses</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorAtiv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", fontSize: "0.8rem" }}
                  labelStyle={{ fontWeight: 600, color: "#374151" }}
                />
                <Area type="monotone" dataKey="atividade" stroke="#2563eb" strokeWidth={2} fill="url(#colorAtiv)" dot={{ fill: "#2563eb", strokeWidth: 2, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="painel__coluna-direita">
          {/* Projetos sugeridos */}
          <div className="painel__card painel__card-projetos-sugeridos">
            <div className="painel__card-cabecalho">
              <h3 className="painel__card-titulo">Projetos sugeridos</h3>
              <button onClick={() => navigate("/app/projects")} className="painel__link-ver-mais">
                Ver todos <ArrowRight size={12} />
              </button>
            </div>
            <div className="painel__card-lista">
              {projects.filter((p) => p.status === "open").slice(0, 3).map((project, index) => (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 24px rgba(37,99,235,0.12)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/app/projects/${project.id}`)}
                  className="projeto-sugerido"
                >
                  <div className="projeto-sugerido__linha">
                    <div className="projeto-sugerido__icone-area">
                      <FolderOpen size={14} style={{ color: "var(--cor-primaria)" }} />
                    </div>
                    <div className="projeto-sugerido__info">
                      <p className="projeto-sugerido__titulo">{project.title}</p>
                      <div className="projeto-sugerido__metadados">
                        <span className="projeto-sugerido__indicador-vaga" />
                        <span className="projeto-sugerido__vagas">
                          {project.slots - project.slotsUsed} vaga{project.slots - project.slotsUsed !== 1 ? "s" : ""}
                        </span>
                        <span className="projeto-sugerido__separador">·</span>
                        <span className="projeto-sugerido__bolsa">{project.scholarship}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Notificações */}
          <div className="painel__card">
            <div className="painel__card-cabecalho">
              <h3 className="painel__card-titulo">Notificações</h3>
              <button onClick={() => navigate("/app/notifications")} className="painel__link-ver-mais">
                Ver todas <ArrowRight size={12} />
              </button>
            </div>
            <div>
              {recentNotifications.map((notif, index) => {
                const typeIcon = {
                  success: <CheckCircle size={14} style={{ color: "var(--cor-sucesso)" }} />,
                  info:    <Bell        size={14} style={{ color: "var(--cor-primaria)" }} />,
                  warning: <AlertCircle size={14} style={{ color: "var(--cor-laranja)" }} />,
                  error:   <AlertCircle size={14} style={{ color: "var(--cor-erro)" }} />,
                };
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className={`notificacao-resumo ${!notif.read ? "notificacao-resumo--nao-lida" : ""}`}
                  >
                    <div className={`notificacao-resumo__icone-area ${notifBgClass[notif.type]}`}>
                      {typeIcon[notif.type]}
                    </div>
                    <div className="notificacao-resumo__info">
                      <p className={`notificacao-resumo__titulo ${!notif.read ? "notificacao-resumo__titulo--nao-lida" : ""}`}>
                        {notif.title}
                      </p>
                      <p className="notificacao-resumo__data">
                        {new Date(notif.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    {!notif.read && <div className="notificacao-resumo__ponto-nao-lido" />}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="painel__acoes-rapidas">
            <h3 className="painel__acoes-rapidas-titulo">Ações rápidas</h3>
            <div className="painel__lista-acoes-rapidas">
              {[
                { label: "Explorar projetos abertos", icon: FolderOpen, href: "/app/projects" },
                { label: "Ver meu progresso",         icon: TrendingUp, href: "/app/progress" },
                { label: "Enviar documentos",         icon: FileText,   href: "/app/documents" },
                { label: "Dar feedback",              icon: Star,       href: "/app/feedback" },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 24px rgba(37,99,235,0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(action.href)}
                  className="acao-rapida"
                >
                  <action.icon size={14} className="acao-rapida__icone" />
                  <span className="acao-rapida__rotulo">{action.label}</span>
                  <ChevronRight size={13} className="acao-rapida__seta" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
