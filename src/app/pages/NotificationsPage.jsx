import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Check,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { notifications as initialNotifications } from "../data/mockData";
import "./NotificationsPage.css";

const typeConfig = {
  success: { icon: CheckCircle, iconeAreaClass: "notificacao-item__icone-area--sucesso", iconColor: "var(--cor-sucesso)",  label: "Sucesso"    },
  info:    { icon: Info,         iconeAreaClass: "notificacao-item__icone-area--info",    iconColor: "var(--cor-primaria)", label: "Informação" },
  warning: { icon: AlertCircle, iconeAreaClass: "notificacao-item__icone-area--atencao", iconColor: "var(--cor-laranja)", label: "Atenção"    },
  error:   { icon: XCircle,     iconeAreaClass: "notificacao-item__icone-area--erro",    iconColor: "var(--cor-erro)",    label: "Erro"       },
};

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Agora mesmo";
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} dias atrás`;
  return date.toLocaleDateString("pt-BR");
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  const markAsRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <div className="pagina-notificacoes">
      {/* Ações */}
      <div className="pagina-notificacoes__acoes">
        <div className="pagina-notificacoes__contagem">
          <Bell size={18} className="pagina-notificacoes__icone-contagem" />
          <span className="pagina-notificacoes__texto-contagem">
            {unreadCount > 0 ? `${unreadCount} não lidas` : "Nenhuma nova notificação"}
          </span>
        </div>
        <div className="pagina-notificacoes__botoes-acao">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="pagina-notificacoes__botao-marcar-lidas">
              <CheckCheck size={14} /> Marcar todas como lidas
            </button>
          )}
          <button onClick={clearAll} className="pagina-notificacoes__botao-limpar">
            <Trash2 size={14} /> Limpar tudo
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="pagina-notificacoes__filtros-tipo">
        {["all", "success", "info", "warning", "error"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`pagina-notificacoes__chip-filtro ${filter === t ? "pagina-notificacoes__chip-filtro--ativo" : "pagina-notificacoes__chip-filtro--inativo"}`}
          >
            {t === "all" ? "Todas" : typeConfig[t].label}
            <span className="pagina-notificacoes__chip-contagem">
              {t === "all" ? notifications.length : notifications.filter((n) => n.type === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="pagina-notificacoes__estado-vazio">
          <div className="pagina-notificacoes__icone-vazio">
            <Bell size={24} style={{ color: "var(--cor-texto-mudo)" }} />
          </div>
          <h3 className="pagina-notificacoes__titulo-vazio">Nenhuma notificação</h3>
          <p className="pagina-notificacoes__descricao-vazio">
            Você está em dia! Não há notificações para exibir.
          </p>
        </div>
      ) : (
        <div className="pagina-notificacoes__lista">
          {/* Não lidas */}
          {filtered.some((n) => !n.read) && (
            <div className="pagina-notificacoes__grupo">
              <p className="pagina-notificacoes__rotulo-grupo">Não lidas</p>
              {filtered.filter((n) => !n.read).map((notif) => {
                const cfg = typeConfig[notif.type];
                const Icon = cfg.icon;
                return (
                  <div key={notif.id} className="notificacao-item">
                    <div className="notificacao-item__indicador-nao-lida" />
                    <div className={`notificacao-item__icone-area ${cfg.iconeAreaClass}`}>
                      <Icon size={18} style={{ color: cfg.iconColor }} />
                    </div>
                    <div className="notificacao-item__conteudo">
                      <div className="notificacao-item__linha-topo">
                        <p className="notificacao-item__titulo">{notif.title}</p>
                        <span className="notificacao-item__tempo">{timeAgo(notif.createdAt)}</span>
                      </div>
                      <p className="notificacao-item__mensagem">{notif.message}</p>
                      <div>
                        <button
                          onClick={() => navigate(notif.actionUrl)}
                          className="notificacao-item__botao-detalhes"
                        >
                          Ver detalhes →
                        </button>
                      </div>
                    </div>
                    <div className="notificacao-item__acoes">
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="notificacao-item__botao-acao notificacao-item__botao-acao--confirmar"
                        title="Marcar como lida"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="notificacao-item__botao-acao notificacao-item__botao-acao--excluir"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lidas */}
          {filtered.some((n) => n.read) && (
            <div>
              <p className="pagina-notificacoes__rotulo-grupo pagina-notificacoes__rotulo-grupo--lidas">Lidas</p>
              {filtered.filter((n) => n.read).map((notif) => {
                const cfg = typeConfig[notif.type];
                const Icon = cfg.icon;
                return (
                  <div key={notif.id} className="notificacao-item notificacao-item--lida">
                    <div className={`notificacao-item__icone-area ${cfg.iconeAreaClass}`}>
                      <Icon size={18} style={{ color: cfg.iconColor }} />
                    </div>
                    <div className="notificacao-item__conteudo">
                      <div className="notificacao-item__linha-topo">
                        <p className="notificacao-item__titulo notificacao-item__titulo--lida">{notif.title}</p>
                        <span className="notificacao-item__tempo notificacao-item__tempo--lida">{timeAgo(notif.createdAt)}</span>
                      </div>
                      <p className="notificacao-item__mensagem notificacao-item__mensagem--lida">{notif.message}</p>
                    </div>
                    <div className="notificacao-item__acoes">
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="notificacao-item__botao-acao notificacao-item__botao-acao--excluir"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
