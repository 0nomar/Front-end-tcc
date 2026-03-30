import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

const pageTitles = {
  "/app": { title: "Dashboard", subtitle: "Bem-vindo de volta, Lucas!" },
  "/app/projects": { title: "Projetos", subtitle: "Explore oportunidades de pesquisa" },
  "/app/applications": { title: "Minhas Inscrições", subtitle: "Acompanhe o status das suas candidaturas" },
  "/app/chat": { title: "Mensagens", subtitle: "Conversas com orientadores" },
  "/app/progress": { title: "Progresso do Projeto", subtitle: "Acompanhe o andamento da sua pesquisa" },
  "/app/feedback": { title: "Feedback", subtitle: "Avaliações e comentários" },
  "/app/profile": { title: "Meu Perfil", subtitle: "Gerencie suas informações pessoais" },
  "/app/documents": { title: "Documentos", subtitle: "Seus arquivos enviados" },
  "/app/notifications": { title: "Notificações", subtitle: "Suas atualizações recentes" },
  "/app/settings": { title: "Configurações", subtitle: "Preferências da conta" },
};

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageInfo = pageTitles[location.pathname] || { title: "Iniciação Científica" };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-16" : "lg:ml-60"
        }`}
      >
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
