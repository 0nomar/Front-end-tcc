import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Search, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { conversationService } from "../services/conversationService";
import { StatusView } from "../components/StatusView";
import "./ChatPage.css";

function getInitials(name) {
  if (!name) return "PR";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ChatPage() {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  function formatarHora(data) {
    if (!data) return "";
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 carregar conversas
  const loadConversations = async () => {
    try {
      setLoading(true);
      const result = await conversationService.listByUser(user.id);
      setConversations(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadConversations();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations]);

  useEffect(() => {
    if (!selectedConversation?.id) return;

    conversationService
      .listMessages(selectedConversation.id)
      .then((res) => setMessages(Array.isArray(res) ? res : []))
      .catch(() => setMessages([]));
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filtered = useMemo(() => {
    return conversations.filter((c) =>
      (c?.titulo ?? "Projeto")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [conversations, search]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation?.id) return;

    try {
      await conversationService.sendMessage(
        selectedConversation.id,
        input.trim()
      );

      const updated = await conversationService.listMessages(
        selectedConversation.id
      );

      setMessages(updated);
      setInput("");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar mensagem");
    }
  };

  if (loading) {
    return <StatusView title="Carregando..." description="Buscando conversas" />;
  }

  if (error) {
    return <StatusView title="Erro" description="Falha ao carregar" />;
  }

  return (
    <div className="pagina-chat">
      {/* LISTA */}
      <div className={`pagina-chat__lista-conversas ${showMobileList ? "pagina-chat__lista-conversas--visivel" : ""}`}>
        
        <div className="pagina-chat__cabecalho-lista">
          <h2 className="pagina-chat__titulo-lista">Projetos</h2>

          <div className="pagina-chat__busca-conversa">
            <Search size={15} className="pagina-chat__icone-busca" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="pagina-chat__input-busca"
            />
          </div>
        </div>

        <div className="pagina-chat__rolagem-conversas">
          {(
            filtered.map((c, index) => (
              <motion.button
                key={c.id}
                onClick={() => {
                  setSelectedConversation(c);
                  setShowMobileList(false);
                }}
                className={`conversa-item ${
                  selectedConversation?.id === c.id
                    ? "conversa-item--selecionada"
                    : ""
                }`}
              >
                <div className="conversa-item__avatar">
                  <span className="conversa-item__iniciais">
                    {getInitials(c?.titulo)}
                  </span>
                </div>

                <div className="conversa-item__info">
                  <p className="conversa-item__nome">
                    {c?.titulo ?? "Projeto"}
                  </p>
                  <p className="conversa-item__preview">
                    {c?.ultimaMensagem ?? "Abrir conversa"}
                  </p>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* CONVERSA */}
      <div className={`pagina-chat__area-conversa ${!showMobileList ? "pagina-chat__area-conversa--visivel" : ""}`}>
        {selectedConversation ? (
          <>
            <div className="pagina-chat__topo-conversa">
              <div>
                <p className="pagina-chat__nome-contato">
                  {selectedConversation?.titulo ?? "Projeto"}
                </p>
              </div>
            </div>

            <div className="pagina-chat__mensagens">
              {messages.map((m, i) => {
                const mine = Number(m?.remetenteId) === Number(user?.id);

                return (
                  <div
                    key={i}
                    className={`mensagem-linha ${
                      mine
                        ? "mensagem-linha--usuario"
                        : "mensagem-linha--contato"
                    }`}
                  >
                    <div className="bolha-mensagem">
                      
                      {/* Nome (só para outros) */}
                      {!mine && (
                        <div className="mensagem-nome">
                          {m?.remetenteNome}
                        </div>
                      )}

                      {/* Texto */}
                      <div className="mensagem-texto">
                        {m?.conteudo}
                      </div>

                      {/* Hora */}
                      <div className="mensagem-hora">
                        {formatarHora(m?.dataEnvio)}
                      </div>

                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="pagina-chat__area-input">
              <div className="pagina-chat__linha-input">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="pagina-chat__input-mensagem"
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage()
                  }
                />

                <button
                  onClick={sendMessage}
                  className="pagina-chat__botao-enviar"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="pagina-chat__estado-vazio">
            <p style={{ color: "#888" }}>
              {conversations.length === 0
                ? "Você ainda não tem nenhuma conversa."
                : "Selecione um projeto"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}