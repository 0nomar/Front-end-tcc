import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { conversations } from "../data/mockData";
import "./ChatPage.css";

export default function ChatPage() {
  const [selected, setSelected] = useState(conversations[0]);
  const [messages, setMessages] = useState(conversations[0].messages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectConversation = (conv) => {
    setSelected(conv);
    setMessages(conv.messages);
    setShowMobileList(false);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      sender: "user",
      content: input.trim(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      date: "Hoje",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    toast.success("Mensagem enviada.");

    setTimeout(() => {
      const reply = {
        id: `m${Date.now() + 1}`,
        sender: "advisor",
        content: "Entendido! Obrigado pela mensagem. Vou verificar e te retorno em breve.",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        date: "Hoje",
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const filtered = useMemo(
    () => conversations.filter((c) =>
      c.participant.name.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="pagina-chat"
    >
      {/* Lista de conversas */}
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
          {filtered.map((conv, index) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 18px rgba(37,99,235,0.1)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => selectConversation(conv)}
              className={`conversa-item ${selected?.id === conv.id ? "conversa-item--selecionada" : ""}`}
            >
              <div className="conversa-item__avatar-area">
                <div className="conversa-item__avatar">
                  <span className="conversa-item__iniciais">{conv.participant.avatar}</span>
                </div>
                <div className="conversa-item__indicador-online" />
              </div>

              <div className="conversa-item__info">
                <div className="conversa-item__linha-nome">
                  <p className={`conversa-item__nome ${conv.unread > 0 ? "conversa-item__nome--nao-lida" : "conversa-item__nome--lida"}`}>
                    {conv.participant.name.replace("Prof. Dr. ", "Prof. ").replace("Profa. Dra. ", "Profa. ")}
                  </p>
                  <span className="conversa-item__hora">{conv.lastMessageTime}</span>
                </div>
                <div className="conversa-item__linha-preview">
                  <p className="conversa-item__preview">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="conversa-item__badge-nao-lida">{conv.unread}</span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Área de conversa */}
      <div className={`pagina-chat__area-conversa ${!showMobileList ? "pagina-chat__area-conversa--visivel" : ""}`}>
        {selected ? (
          <>
            <div className="pagina-chat__topo-conversa">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowMobileList(true)}
                className="pagina-chat__botao-voltar"
              >
                <ArrowLeft size={18} style={{ color: "var(--cor-texto-medio)" }} />
              </motion.button>
              <div className="pagina-chat__avatar-conversa">
                <div className="pagina-chat__foto-conversa">
                  <span className="pagina-chat__iniciais-conversa">{selected.participant.avatar}</span>
                </div>
                <div className="pagina-chat__ponto-online" />
              </div>
              <div className="pagina-chat__dados-contato">
                <p className="pagina-chat__nome-contato">{selected.participant.name}</p>
                <p className="pagina-chat__status-online">Online agora</p>
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
              {messages.map((msg, i) => {
                const isUser = msg.sender === "user";
                const showDate = i === 0 || messages[i - 1].date !== msg.date;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                  >
                    {showDate && (
                      <div className="pagina-chat__separador-data">
                        <span className="pagina-chat__etiqueta-data">{msg.date}</span>
                      </div>
                    )}
                    <div className={`mensagem-linha ${isUser ? "mensagem-linha--usuario" : "mensagem-linha--contato"}`}>
                      {!isUser && (
                        <div className="mensagem-linha__avatar mensagem-linha__avatar--contato">
                          <span className="mensagem-linha__iniciais-avatar">{selected.participant.avatar}</span>
                        </div>
                      )}
                      <div className="mensagem-linha__area">
                        <div className={`bolha-mensagem ${isUser ? "bolha-mensagem--usuario" : "bolha-mensagem--contato"}`}>
                          <p className="bolha-mensagem__texto">{msg.content}</p>
                        </div>
                        <p className={`mensagem-linha__horario ${isUser ? "mensagem-linha__horario--direita" : "mensagem-linha__horario--esquerda"}`}>
                          {msg.time}
                        </p>
                      </div>
                      {isUser && (
                        <div className="mensagem-linha__avatar mensagem-linha__avatar--usuario">
                          <span className="mensagem-linha__iniciais-avatar">LM</span>
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
                <motion.button
                  whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: input.trim() ? 0.97 : 1 }}
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="pagina-chat__botao-enviar"
                >
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
              <p className="pagina-chat__descricao-vazio">Escolha um orientador para comecar</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
