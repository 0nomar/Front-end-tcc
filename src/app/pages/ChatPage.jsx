import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { conversationService } from "../services/conversationService";
import { StatusView } from "../components/StatusView";
import "./ChatPage.css";

function getInitials(name) {
  if (!name) return "IC";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ChatPage() {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const { data, loading, error } = useAsyncData(
    async () => {
      if (!user?.id) return [];
      const result = await conversationService.listByUser(user.id);
      return Array.isArray(result) ? result : [];
    },
    [user?.id],
    { initialData: [] },
  );
  const conversations = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  useEffect(() => {
    if (!selectedConversation?.id) return;
    conversationService
      .listMessages(selectedConversation.id)
      .then((result) => setMessages(Array.isArray(result) ? result : []))
      .catch(() => setMessages([]));
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filtered = useMemo(
    () =>
      conversations.filter((conversation) =>
        (conversation?.participante?.nome ?? conversation?.titulo ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [conversations, search],
  );

  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation?.id) return;

    try {
      await conversationService.sendMessage(selectedConversation.id, input.trim());
      const updated = await conversationService.listMessages(selectedConversation.id);
      setMessages(Array.isArray(updated) ? updated : []);
      setInput("");
    } catch (err) {
      toast.error(err.message || "Nao foi possivel enviar a mensagem.");
    }
  };

  if (loading) {
    return <StatusView title="Carregando conversas" description="Buscando mensagens reais da API." />;
  }

  if (error) {
    return <StatusView title="Falha ao carregar conversas" description={error.message} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="pagina-chat"
    >
      <div className={`pagina-chat__lista-conversas ${showMobileList ? "pagina-chat__lista-conversas--visivel" : ""}`}>
        <div className="pagina-chat__cabecalho-lista">
          <h2 className="pagina-chat__titulo-lista">Mensagens</h2>
          <div className="pagina-chat__busca-conversa">
            <Search size={15} className="pagina-chat__icone-busca" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversa..."
              className="pagina-chat__input-busca"
            />
          </div>
        </div>

        <div className="pagina-chat__rolagem-conversas">
          {filtered.map((conversation, index) => {
            const participantName = conversation?.participante?.nome ?? conversation?.titulo ?? "Conversa";
            return (
              <motion.button
                key={conversation.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 18px rgba(37,99,235,0.1)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setShowMobileList(false);
                }}
                className={`conversa-item ${selectedConversation?.id === conversation.id ? "conversa-item--selecionada" : ""}`}
              >
                <div className="conversa-item__avatar-area">
                  <div className="conversa-item__avatar">
                    <span className="conversa-item__iniciais">{getInitials(participantName)}</span>
                  </div>
                  <div className="conversa-item__indicador-online" />
                </div>

                <div className="conversa-item__info">
                  <div className="conversa-item__linha-nome">
                    <p className="conversa-item__nome conversa-item__nome--lida">{participantName}</p>
                  </div>
                  <div className="conversa-item__linha-preview">
                    <p className="conversa-item__preview">{conversation?.ultimaMensagem ?? "Abrir conversa"}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className={`pagina-chat__area-conversa ${!showMobileList ? "pagina-chat__area-conversa--visivel" : ""}`}>
        {selectedConversation ? (
          <>
            <div className="pagina-chat__topo-conversa">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setShowMobileList(true)} className="pagina-chat__botao-voltar">
                <ArrowLeft size={18} style={{ color: "var(--cor-texto-medio)" }} />
              </motion.button>
              <div className="pagina-chat__avatar-conversa">
                <div className="pagina-chat__foto-conversa">
                  <span className="pagina-chat__iniciais-conversa">
                    {getInitials(selectedConversation?.participante?.nome ?? selectedConversation?.titulo)}
                  </span>
                </div>
                <div className="pagina-chat__ponto-online" />
              </div>
              <div className="pagina-chat__dados-contato">
                <p className="pagina-chat__nome-contato">{selectedConversation?.participante?.nome ?? selectedConversation?.titulo ?? "Conversa"}</p>
                <p className="pagina-chat__status-online">Conversa em tempo real</p>
              </div>
              <div className="pagina-chat__acoes-conversa">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="pagina-chat__botao-acao-conversa">
                  <Phone size={16} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="pagina-chat__botao-acao-conversa">
                  <Video size={16} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="pagina-chat__botao-acao-conversa">
                  <MoreVertical size={16} />
                </motion.button>
              </div>
            </div>

            <div className="pagina-chat__mensagens">
              {messages.map((message, index) => {
                const mine =
                  message?.remetente?.id === user?.id ||
                  message?.autor?.id === user?.id ||
                  message?.usuario?.id === user?.id;

                return (
                  <motion.div key={message.id ?? index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.02 }}>
                    <div className={`mensagem-linha ${mine ? "mensagem-linha--usuario" : "mensagem-linha--contato"}`}>
                      {!mine && (
                        <div className="mensagem-linha__avatar mensagem-linha__avatar--contato">
                          <span className="mensagem-linha__iniciais-avatar">{getInitials(selectedConversation?.participante?.nome ?? selectedConversation?.titulo)}</span>
                        </div>
                      )}
                      <div className="mensagem-linha__area">
                        <div className={`bolha-mensagem ${mine ? "bolha-mensagem--usuario" : "bolha-mensagem--contato"}`}>
                          <p className="bolha-mensagem__texto">{message?.conteudo ?? message?.content ?? ""}</p>
                        </div>
                        <p className={`mensagem-linha__horario ${mine ? "mensagem-linha__horario--direita" : "mensagem-linha__horario--esquerda"}`}>
                          {message?.dataEnvio ? new Date(message.dataEnvio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}
                        </p>
                      </div>
                      {mine && (
                        <div className="mensagem-linha__avatar mensagem-linha__avatar--usuario">
                          <span className="mensagem-linha__iniciais-avatar">{getInitials(user?.nome)}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="pagina-chat__area-input">
              <div className="pagina-chat__linha-input">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="pagina-chat__botao-anexo">
                  <Paperclip size={18} />
                </motion.button>
                <div className="pagina-chat__campo-texto">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="pagina-chat__input-mensagem"
                  />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="pagina-chat__botao-emoji">
                    <Smile size={16} />
                  </motion.button>
                </div>
                <motion.button whileHover={{ scale: input.trim() ? 1.05 : 1 }} whileTap={{ scale: input.trim() ? 0.97 : 1 }} onClick={sendMessage} disabled={!input.trim()} className="pagina-chat__botao-enviar">
                  <Send size={17} />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="pagina-chat__estado-vazio">
            <div className="pagina-chat__estado-vazio-conteudo">
              <div className="pagina-chat__icone-vazio">
                <Send size={24} style={{ color: "var(--cor-texto-mudo)" }} />
              </div>
              <p className="pagina-chat__titulo-vazio">Selecione uma conversa</p>
              <p className="pagina-chat__descricao-vazio">Escolha uma conversa retornada pela API para comecar.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
