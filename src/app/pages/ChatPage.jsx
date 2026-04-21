import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Search, Loader2, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { conversationService } from "../services/conversationService";
import { StatusView } from "../components/StatusView";
import "./ChatPage.css";

function getInitials(name) {
  if (!name) return "PR";
  return name.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function formatarHora(data) {
  if (!data) return "";
  return new Date(data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatarDia(data) {
  const hoje = new Date();
  const d = new Date(data);

  const isHoje = d.toDateString() === hoje.toDateString();

  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  const isOntem = d.toDateString() === ontem.toDateString();

  if (isHoje) return "Hoje";
  if (isOntem) return "Ontem";

  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ChatPage() {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const enviandoRef = useRef(false);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [abrindoPrivada, setAbrindoPrivada] = useState(null);

  // Modal de edição
  const [modalEdicao, setModalEdicao] = useState(null); // { id, conteudo }
  const [editandoTexto, setEditandoTexto] = useState("");

  // Modal de confirmação de exclusão
  const [modalExclusao, setModalExclusao] = useState(null); // { id }

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

  useEffect(() => { if (user?.id) loadConversations(); }, [user?.id]);

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0)
      setSelectedConversation(conversations[0]);
  }, [conversations]);

  useEffect(() => {
    if (!selectedConversation?.id) return;
    setMessages([]);
    setLoadingMessages(true);
    conversationService
      .listMessages(selectedConversation.id)
      .then((res) => setMessages(Array.isArray(res) ? res : []))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [selectedConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filtered = useMemo(() =>
    conversations.filter((c) =>
      (c?.titulo ?? "").toLowerCase().includes(search.toLowerCase())
    ), [conversations, search]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation?.id) return;
    if (enviandoRef.current) return;

    const conteudo = input.trim();
    enviandoRef.current = true;

    const temp = {
      id: `temp-${Date.now()}`,
      conteudo,
      remetenteId: user?.id,
      remetenteNome: user?.nome,
      dataEnvio: new Date().toISOString(),
      editada: false,
      _temporaria: true,
    };

    setMessages((prev) => [...prev, temp]);
    setInput("");

    try {
      await conversationService.sendMessage(selectedConversation.id, conteudo);
      const [updated, conversasAtualizadas] = await Promise.all([
        conversationService.listMessages(selectedConversation.id),
        conversationService.listByUser(user.id),
      ]);
      setMessages(Array.isArray(updated) ? updated : []);
      setConversations(Array.isArray(conversasAtualizadas) ? conversasAtualizadas : []);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
      setInput(conteudo);
      toast.error("Erro ao enviar mensagem");
    } finally {
      enviandoRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Edição via modal
  const abrirModalEdicao = (m) => {
    setModalEdicao(m);
    setEditandoTexto(m.conteudo);
  };

  const fecharModalEdicao = () => {
    setModalEdicao(null);
    setEditandoTexto("");
  };

  const confirmarEdicao = async () => {
    if (!editandoTexto.trim() || !modalEdicao) return;
    try {
      const atualizada = await conversationService.editMessage(modalEdicao.id, editandoTexto.trim());
      setMessages((prev) => prev.map((m) => (m.id === modalEdicao.id ? atualizada : m)));
      fecharModalEdicao();
    } catch {
      toast.error("Erro ao editar mensagem");
    }
  };

  // Exclusão via modal de confirmação
  const abrirModalExclusao = (m) => {
    setModalExclusao(m);
  };

  const fecharModalExclusao = () => {
    setModalExclusao(null);
  };

  const confirmarExclusao = async () => {
    if (!modalExclusao) return;
    try {
      await conversationService.deleteMessage(modalExclusao.id);
      setMessages((prev) => prev.filter((m) => m.id !== modalExclusao.id));
      fecharModalExclusao();
    } catch {
      toast.error("Erro ao excluir mensagem");
    }
  };

  const abrirConversaPrivada = async (remetenteId, remetenteNome) => {
    if (remetenteId === user?.id || abrindoPrivada === remetenteId) return;
    try {
      setAbrindoPrivada(remetenteId);
      const conversa = await conversationService.openPrivate(remetenteId);
      setConversations((prev) => prev.some((c) => c.id === conversa.id) ? prev : [conversa, ...prev]);
      setSelectedConversation(conversa);
      setShowMobileList(false);
    } catch {
      toast.error(`Erro ao abrir conversa com ${remetenteNome}`);
    } finally {
      setAbrindoPrivada(null);
    }
  };

  if (loading) return <StatusView title="Carregando..." description="Buscando conversas" />;
  if (error) return <StatusView title="Erro" description="Falha ao carregar" />;

  return (
    <div className="pagina-chat">

      {/* LISTA */}
      <div className={`pagina-chat__lista-conversas ${showMobileList ? "pagina-chat__lista-conversas--visivel" : ""}`}>
        <div className="pagina-chat__cabecalho-lista">
          <h2 className="pagina-chat__titulo-lista">Mensagens</h2>
          <div className="pagina-chat__busca-conversa">
            <Search size={15} className="pagina-chat__icone-busca" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversa"
              className="pagina-chat__input-busca"
            />
          </div>
        </div>

        <div className="pagina-chat__rolagem-conversas">
          {filtered.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => { setSelectedConversation(c); setShowMobileList(false); }}
              className={`conversa-item ${selectedConversation?.id === c.id ? "conversa-item--selecionada" : ""}`}
            >
              <div className="conversa-item__avatar">
                <span className="conversa-item__iniciais">{getInitials(c?.titulo)}</span>
              </div>
              <div className="conversa-item__info">
                <div className="conversa-item__header">
                  <p className="conversa-item__nome">{c?.titulo ?? "Conversa"}</p>
                  <span className={`conversa-item__badge ${c.tipo === "PRIVADA" ? "conversa-item__badge--privada" : "conversa-item__badge--grupo"}`}>
                    {c.tipo === "PRIVADA" ? "Direto" : "Grupo"}
                  </span>
                </div>
                <div className="conversa-item__rodape">
                  <p className="conversa-item__preview">{c?.ultimaMensagem ?? "Nenhuma mensagem ainda"}</p>
                  {c?.ultimaMensagemHorario && (
                    <span className="conversa-item__horario">{formatarHora(c.ultimaMensagemHorario)}</span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* CONVERSA */}
      <div className={`pagina-chat__area-conversa ${!showMobileList ? "pagina-chat__area-conversa--visivel" : ""}`}>
        {selectedConversation ? (
          <>
            <div className="pagina-chat__topo-conversa">
              <div>
                <p className="pagina-chat__nome-contato">{selectedConversation?.titulo ?? "Conversa"}</p>
              </div>
            </div>

            <div className="pagina-chat__mensagens">
              {loadingMessages ? (
                <div className="pagina-chat__loading-mensagens">
                  <Loader2 size={24} className="pagina-chat__spinner" />
                  <span>Carregando mensagens...</span>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => {
                    const mine = Number(m?.remetenteId) === Number(user?.id);
                    const carregando = abrindoPrivada === m?.remetenteId;

                    const dataAtual = new Date(m.dataEnvio).toDateString();
                    const dataAnterior =
                      i > 0
                        ? new Date(messages[i - 1].dataEnvio).toDateString()
                        : null;

                    const mostrarData = dataAtual !== dataAnterior;

                    return (
                      <div key={m.id ?? i}>

                        {mostrarData && (
                          <div className="chat-data-divider">
                            <span>{formatarDia(m.dataEnvio)}</span>
                          </div>
                        )}

                        <div
                          className={`mensagem-linha ${
                            mine ? "mensagem-linha--usuario" : "mensagem-linha--contato"
                          } ${m._temporaria ? "mensagem-linha--temporaria" : ""}`}
                        >
                          {mine && !m._temporaria && (
                            <div className="mensagem-acoes">
                              <button
                                className="mensagem-acao-btn"
                                onClick={() => abrirModalEdicao(m)}
                                title="Editar mensagem"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                className="mensagem-acao-btn mensagem-acao-btn--excluir"
                                onClick={() => abrirModalExclusao(m)}
                                title="Excluir mensagem"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}

                          <div className="bolha-mensagem">
                            {!mine && (
                              <button
                                className={`mensagem-nome mensagem-nome--clicavel ${
                                  carregando ? "mensagem-nome--carregando" : ""
                                }`}
                                onClick={() =>
                                  abrirConversaPrivada(m?.remetenteId, m?.remetenteNome)
                                }
                                title={`Enviar mensagem para ${m?.remetenteNome}`}
                                disabled={carregando}
                              >
                                {m?.remetenteNome}
                              </button>
                            )}
                            <div className="mensagem-texto">{m?.conteudo}</div>
                            <div className="mensagem-rodape">
                              {m?.editada && (
                                <span className="mensagem-editada">editada</span>
                              )}
                              <div className="mensagem-hora">
                                {formatarHora(m?.dataEnvio)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="pagina-chat__area-input">
              <div className="pagina-chat__linha-input">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite uma mensagem"
                  className="pagina-chat__input-mensagem"
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button onClick={sendMessage} className="pagina-chat__botao-enviar">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="pagina-chat__estado-vazio">
            <p style={{ color: "#888" }}>
              {conversations.length === 0 ? "Você ainda não tem nenhuma conversa." : "Selecione uma conversa"}
            </p>
          </div>
        )}
      </div>

      {/* MODAL EDIÇÃO */}
      {modalEdicao && (
        <div className="modal-overlay" onClick={fecharModalEdicao}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__cabecalho">
              <h3 className="modal__titulo">Editar mensagem</h3>
            </div>
            <div className="modal__corpo">
              <input
                type="text"
                className="modal__textarea"
                value={editandoTexto}
                onChange={(e) => setEditandoTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); confirmarEdicao(); }
                  if (e.key === "Escape") fecharModalEdicao();
                }}
                autoFocus
                rows={4}
              />
            </div>
            <div className="modal__rodape">
              <button className="modal__btn modal__btn--cancelar" onClick={fecharModalEdicao}>
                Cancelar
              </button>
              <button className="modal__btn modal__btn--confirmar" onClick={confirmarEdicao}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO EXCLUSÃO */}
      {modalExclusao && (
        <div className="modal-overlay" onClick={fecharModalExclusao}>
          <div className="modal modal--pequeno" onClick={(e) => e.stopPropagation()}>
            <div className="modal__cabecalho">
              <h3 className="modal__titulo">Excluir mensagem</h3>
            </div>
            <div className="modal__corpo">
              <p className="modal__texto">Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.</p>
            </div>
            <div className="modal__rodape">
              <button className="modal__btn modal__btn--cancelar" onClick={fecharModalExclusao}>
                Cancelar
              </button>
              <button className="modal__btn modal__btn--excluir" onClick={confirmarExclusao}>
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}