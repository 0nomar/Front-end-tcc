import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import "./DashboardLayout.css";

const pageTitles = {
  "/app": { title: "Dashboard", subtitle: "Bem-vindo de volta, Lucas!" },
  "/app/projects": { title: "Projetos", subtitle: "Explore oportunidades de pesquisa" },
  "/app/applications": { title: "Minhas Inscricoes", subtitle: "Acompanhe o status das suas candidaturas" },
  "/app/chat": { title: "Mensagens", subtitle: "Conversas com orientadores" },
  "/app/progress": { title: "Progresso do Projeto", subtitle: "Acompanhe o andamento da sua pesquisa" },
  "/app/feedback": { title: "Feedback", subtitle: "Avaliacoes e comentarios" },
  "/app/profile": { title: "Meu Perfil", subtitle: "Gerencie suas informacoes pessoais" },
  "/app/documents": { title: "Documentos", subtitle: "Seus arquivos enviados" },
  "/app/notifications": { title: "Notificacoes", subtitle: "Suas atualizacoes recentes" },
  "/app/configuracoes": { title: "Configuracoes", subtitle: "Preferencias da conta" },
};

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageInfo = pageTitles[location.pathname] || { title: "Iniciacao Cientifica" };

  return (
    <div className="pagina-app">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={`pagina-app__principal ${collapsed ? "pagina-app__principal--recolhida" : ""}`}>
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />
        <main className="pagina-app__conteudo">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pagina-app__pagina"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
