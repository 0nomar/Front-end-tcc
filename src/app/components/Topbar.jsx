import { Bell, Search, Menu, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { currentUser, notifications } from "../data/mockData";
import "./Topbar.css";

export function Topbar({ onMenuClick, title, subtitle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="barra-topo">
      <div className="barra-topo__secao-esquerda">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onMenuClick}
          className="barra-topo__botao-menu"
        >
          <Menu size={20} className="barra-topo__botao-menu-icone" />
        </motion.button>
        <div className="barra-topo__area-titulo">
          <h1 className="barra-topo__titulo">{title}</h1>
          {subtitle && <p className="barra-topo__subtitulo">{subtitle}</p>}
        </div>
      </div>

      <div className="barra-topo__secao-direita">
        <button className="barra-topo__busca">
          <Search size={15} />
          <span>Buscar...</span>
          <span className="barra-topo__atalho-busca">CTRL+K</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/app/notifications")}
          className="barra-topo__botao-notificacoes"
        >
          <Bell size={18} className="barra-topo__icone-notificacoes" />
          {unreadCount > 0 && (
            <span className="barra-topo__contador-notificacoes">{unreadCount}</span>
          )}
        </motion.button>

        <div className="barra-topo__area-perfil" ref={profileMenuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="barra-topo__botao-perfil"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            aria-label="Abrir menu de perfil"
          >
            <div className="barra-topo__avatar">
              <span className="barra-topo__iniciais-avatar">{currentUser.avatar}</span>
            </div>
            <div className="barra-topo__info-perfil">
              <p className="barra-topo__nome-perfil">{currentUser.name.split(" ")[0]}</p>
              <p className="barra-topo__tipo-perfil">
                {currentUser.type === "student" ? "Aluno" : "Orientador"}
              </p>
            </div>
            <ChevronDown size={14} className="barra-topo__icone-dropdown" />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.2 }}
                className="barra-topo__menu-dropdown"
              >
                <button
                  onClick={() => { navigate("/app/profile"); setDropdownOpen(false); }}
                  className="barra-topo__item-menu"
                >
                  Meu Perfil
                </button>
                <button
                  onClick={() => { navigate("/configuracoes"); setDropdownOpen(false); }}
                  className="barra-topo__item-menu"
                >
                  Configuracoes
                </button>
                <hr className="barra-topo__divisor-menu" />
                <button
                  onClick={() => { navigate("/"); setDropdownOpen(false); }}
                  className="barra-topo__item-menu barra-topo__item-menu--sair"
                >
                  Sair
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
