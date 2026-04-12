import { NavLink } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  TrendingUp,
  Star,
  User,
  Upload,
  Bell,
  LogOut,
  ChevronLeft,
  FlaskConical,
  Settings,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { notificationService } from "../services/notificationService";
import { formatUserType } from "../utils/formatters";
import "./Sidebar.css";

const navItems = [
  { path: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/app/projects", label: "Projetos", icon: FolderOpen },
  { path: "/app/applications", label: "Inscricoes", icon: FileText },
  { path: "/app/chat", label: "Mensagens", icon: MessageSquare },
  { path: "/app/progress", label: "Progresso", icon: TrendingUp },
  { path: "/app/feedback", label: "Feedback", icon: Star },
  { path: "/app/notifications", label: "Notificacoes", icon: Bell },
  { path: "/app/documents", label: "Documentos", icon: Upload },
  { path: "/app/profile", label: "Meu Perfil", icon: User },
];

function getInitials(name) {
  if (!name) return "IC";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const { data } = useAsyncData(() => notificationService.listMine(), [], { initialData: [] });
  const notifications = Array.isArray(data) ? data : [];
  const unreadCount = notifications.filter((item) => !item.lida).length;

  const handleLogout = async () => {
    await logout();
  };

  const SidebarContent = () => (
    <div className="barra-lateral__conteudo-interno">
      <div className={`barra-lateral__cabecalho ${collapsed ? "barra-lateral__cabecalho--centralizado" : ""}`}>
        <div className="barra-lateral__logo">
          <FlaskConical size={18} className="barra-lateral__logo-icone" />
        </div>
        {!collapsed && (
          <div>
            <p className="barra-lateral__nome-app">CollabResearch</p>
            <p className="barra-lateral__subtitulo-app">Iniciacao Cientifica</p>
          </div>
        )}
      </div>

      <nav className="barra-lateral__navegacao">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              [
                "barra-lateral__item-nav",
                isActive ? "barra-lateral__item-nav--ativo" : "",
                collapsed ? "barra-lateral__item-nav--centralizado" : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="barra-lateral__indicador-ativo" />}
                <item.icon
                  size={18}
                  className={
                    isActive
                      ? "barra-lateral__icone-nav barra-lateral__icone-nav--ativo"
                      : "barra-lateral__icone-nav"
                  }
                />
                {!collapsed && (
                  <span
                    className={
                      isActive
                        ? "barra-lateral__rotulo-nav barra-lateral__rotulo-nav--ativo"
                        : "barra-lateral__rotulo-nav"
                    }
                  >
                    {item.label}
                  </span>
                )}
                {!collapsed && item.label === "Notificacoes" && unreadCount > 0 && (
                  <span className="barra-lateral__contador">{unreadCount}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="barra-lateral__rodape">
        <NavLink
          to="/app/configuracoes"
          className="barra-lateral__item-configuracoes"
          onClick={() => setMobileOpen(false)}
        >
          <Settings size={18} className="barra-lateral__icone-nav" />
          {!collapsed && <span className="barra-lateral__rotulo-nav">Configuracoes</span>}
        </NavLink>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className={`barra-lateral__botao-sair ${collapsed ? "barra-lateral__botao-sair--centralizado" : ""}`}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span className="barra-lateral__rotulo-nav">Sair</span>}
        </motion.button>

        {!collapsed && (
          <div className="barra-lateral__perfil-usuario">
            <div className="barra-lateral__avatar-usuario">
              <span className="barra-lateral__iniciais-usuario">{getInitials(user?.nome)}</span>
            </div>
            <div className="barra-lateral__info-usuario">
              <p className="barra-lateral__nome-usuario">{user?.nome ?? "Usuario"}</p>
              <p className="barra-lateral__tipo-usuario">{formatUserType(user?.tipo)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className={`barra-lateral ${collapsed ? "barra-lateral--recolhida" : ""}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCollapsed(!collapsed)}
          className="barra-lateral__botao-recolher"
        >
          <ChevronLeft
            size={14}
            className={`barra-lateral__icone-recolher ${collapsed ? "barra-lateral__icone-recolher--invertido" : ""}`}
          />
        </motion.button>
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sobreposicao-mobile"
            style={{ display: "block" }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="barra-lateral-mobile"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
