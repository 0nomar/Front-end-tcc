import { useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FolderOpen,
  FileText,
  Bell,
  TrendingUp,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { projectService } from "../services/projectService";
import { applicationService } from "../services/applicationService";
import { notificationService } from "../services/notificationService";
import { StatusView } from "../components/StatusView";
import {
  mapApplication,
  mapNotification,
  mapProject,
} from "../utils/adapters";
import { formatApplicationStatus, formatProjectStatus } from "../utils/formatters";
import "./DashboardPage.css";

function buildActivityData(projects, applications) {
  const entries = [...projects, ...applications]
    .map((item) => item.createdAt ?? item.appliedAt ?? item.updatedAt)
    .filter(Boolean)
    .map((date) =>
      new Date(date).toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
    );

  const grouped = entries.reduce((acc, month) => {
    acc[month] = (acc[month] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(grouped).map(([month, atividade]) => ({ month, atividade }));
}

const statusClassMap = {
  APROVADO: "inscricao-item__status--aprovado",
  PENDENTE: "inscricao-item__status--pendente",
  REJEITADO: "inscricao-item__status--rejeitado",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error } = useAsyncData(async () => {
    const [projects, applications, notifications] = await Promise.all([
      projectService.list(),
      applicationService.listMine().catch(() => []),
      notificationService.listMine().catch(() => []),
    ]);

    return {
      projects: Array.isArray(projects) ? projects.map(mapProject) : [],
      applications: Array.isArray(applications) ? applications.map(mapApplication) : [],
      notifications: Array.isArray(notifications) ? notifications.map(mapNotification) : [],
    };
  }, [], { initialData: { projects: [], applications: [], notifications: [] } });

  const derived = useMemo(() => {
    const projects = data?.projects ?? [];
    const applications = data?.applications ?? [];
    const notifications = data?.notifications ?? [];

    const activeProjects = projects.filter((item) => item.status !== "FINALIZADO").length;
    const unreadNotifications = notifications.filter((item) => !item.read).length;
    const recentProjects = projects.slice(0, 3);
    const recentApplications = applications.slice(0, 4);
    const recentNotifications = notifications.slice(0, 4);
    const activityData = buildActivityData(projects, applications);

    return {
      activeProjects,
      recentProjects,
      recentApplications,
      recentNotifications,
      unreadNotifications,
      activityData,
    };
  }, [data]);

  if (loading) {
    return <StatusView title="Carregando dashboard" description="Buscando dados reais da API." />;
  }

  if (error) {
    return <StatusView title="Falha ao carregar" description={error.message} />;
  }

  const statCards = [
    {
      label: "Projetos ativos",
      value: derived.activeProjects,
      icon: FolderOpen,
      areaClass: "cartao-resumo__icone-area--azul",
      iconClass: "cartao-resumo__icone--azul",
      bordaClass: "cartao-resumo--borda-azul",
      href: "/app/projects",
    },
    {
      label: "Inscricoes",
      value: derived.recentApplications.length,
      icon: FileText,
      areaClass: "cartao-resumo__icone-area--violeta",
      iconClass: "cartao-resumo__icone--violeta",
      bordaClass: "cartao-resumo--borda-violeta",
      href: "/app/applications",
    },
    {
      label: "Notificacoes",
      value: derived.unreadNotifications,
      icon: Bell,
      areaClass: "cartao-resumo__icone-area--laranja",
      iconClass: "cartao-resumo__icone--laranja",
      bordaClass: "cartao-resumo--borda-laranja",
      href: "/app/notifications",
    },
    {
      label: "Atualizacoes",
      value: derived.activityData.reduce((acc, item) => acc + item.atividade, 0),
      icon: TrendingUp,
      areaClass: "cartao-resumo__icone-area--verde",
      iconClass: "cartao-resumo__icone--verde",
      bordaClass: "cartao-resumo--borda-verde",
      href: "/app/progress",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="painel"
    >
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
            Ola, {user?.nome?.split(" ")[0] ?? "pesquisador"}!
          </h2>
          <p className="painel__descricao-banner">
            Você tem <strong className="painel__destaque-banner">{derived.unreadNotifications} notificações</strong> pendentes
            e <strong className="painel__destaque-banner"> {derived.recentApplications.length} inscrições</strong> vinculadas ao seu perfil.
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

      <div className="painel__grade-principal">
        <div className="painel__coluna-esquerda">
          <div className="painel__card">
            <div className="painel__card-cabecalho">
              <h3 className="painel__card-titulo">Projetos recentes</h3>
              <button onClick={() => navigate("/app/projects")} className="painel__link-ver-mais">
                Ver detalhes <ArrowRight size={13} />
              </button>
            </div>
            <div className="projeto-andamento__corpo">
              {derived.recentProjects.length === 0 ? (
                <StatusView title="Nenhum projeto encontrado" description="A API ainda nao retornou projetos para exibir aqui." />
              ) : (
                derived.recentProjects.map((project) => (
                  <div key={project.id} className="inscricao-item">
                    <div className="inscricao-item__icone-area">
                      <FolderOpen size={15} style={{ color: "var(--cor-texto-fraco)" }} />
                    </div>
                    <div className="inscricao-item__info">
                      <p className="inscricao-item__titulo">{project.title}</p>
                      <p className="inscricao-item__orientador">{project.advisor?.name ?? "Sem orientador"}</p>
                    </div>
                    <span className="inscricao-item__status inscricao-item__status--pendente">
                      {formatProjectStatus(project.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="painel__card">
            <div className="painel__card-cabecalho">
              <h3 className="painel__card-titulo">Minhas inscricoes</h3>
              <button onClick={() => navigate("/app/applications")} className="painel__link-ver-mais">
                Ver todas <ArrowRight size={13} />
              </button>
            </div>
            <div>
              {derived.recentApplications.length === 0 ? (
                <StatusView title="Sem inscricoes" description="Quando você se candidatar a projetos, elas aparecerão aqui." />
              ) : (
                derived.recentApplications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="inscricao-item"
                  >
                    <div className="inscricao-item__icone-area">
                      <FileText size={15} style={{ color: "var(--cor-texto-fraco)" }} />
                    </div>
                    <div className="inscricao-item__info">
                      <p className="inscricao-item__titulo">{application.project?.title ?? "Projeto"}</p>
                      <p className="inscricao-item__orientador">{application.project?.advisor?.name ?? "Sem orientador"}</p>
                    </div>
                    <span className={`inscricao-item__status ${statusClassMap[application.status] ?? "inscricao-item__status--pendente"}`}>
                      {formatApplicationStatus(application.status)}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="painel__card-grafico">
            <div className="painel__grafico-cabecalho">
              <h3 className="painel__card-titulo">Atividade recente</h3>
              <span className="painel__grafico-periodo">Dados da API</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={derived.activityData}>
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

        <div className="painel__coluna-direita">
          <div className="painel__card painel__card-projetos-sugeridos">
            <div className="painel__card-cabecalho">
              <h3 className="painel__card-titulo">Projetos sugeridos</h3>
              <button onClick={() => navigate("/app/projects")} className="painel__link-ver-mais">
                Ver todos <ArrowRight size={12} />
              </button>
            </div>
            <div className="painel__card-lista">
              {derived.recentProjects.map((project, index) => (
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
                          {Math.max(project.slots - project.slotsUsed, 0)} vagas
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="painel__card">
            <div className="painel__card-cabecalho">
              <h3 className="painel__card-titulo">Notificacoes</h3>
              <button onClick={() => navigate("/app/notifications")} className="painel__link-ver-mais">
                Ver todas <ArrowRight size={12} />
              </button>
            </div>
            <div>
              {derived.recentNotifications.length === 0 ? (
                <StatusView title="Sem notificacoes" description="As notificações do sistema aparecerão aqui." />
              ) : (
                derived.recentNotifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className={`notificacao-resumo ${!notif.read ? "notificacao-resumo--nao-lida" : ""}`}
                  >
                    <div className="notificacao-resumo__icone-area notificacao-resumo__icone-area--info">
                      <Bell size={14} style={{ color: "var(--cor-primaria)" }} />
                    </div>
                    <div className="notificacao-resumo__info">
                      <p className={`notificacao-resumo__titulo ${!notif.read ? "notificacao-resumo__titulo--nao-lida" : ""}`}>
                        {notif.title}
                      </p>
                      <p className="notificacao-resumo__data">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString("pt-BR") : "-"}
                      </p>
                    </div>
                    {!notif.read && <div className="notificacao-resumo__ponto-nao-lido" />}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
