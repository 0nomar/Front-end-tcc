import { useState, useRef, useEffect } from "react";
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, ArrowLeft } from "lucide-react";
import { conversations } from "../data/mockData";

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

    // Simulate reply
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

  const filtered = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Conversations list */}
      <div
        className={`${
          showMobileList ? "flex" : "hidden"
        } lg:flex flex-col w-full lg:w-80 border-r border-gray-100 flex-shrink-0`}
      >
        {/* List header */}
        <div className="p-4 border-b border-gray-50">
          <h2 className="text-gray-900 mb-3" style={{ fontWeight: 700, fontSize: "1rem" }}>
            Mensagens
          </h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversa..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              style={{ fontSize: "0.82rem" }}
            />
          </div>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left ${
                selected?.id === conv.id ? "bg-blue-50" : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    {conv.participant.avatar}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p
                    className={`truncate ${conv.unread > 0 ? "text-gray-900" : "text-gray-700"}`}
                    style={{ fontSize: "0.85rem", fontWeight: conv.unread > 0 ? 600 : 400 }}
                  >
                    {conv.participant.name.replace("Prof. Dr. ", "Prof. ").replace("Profa. Dra. ", "Profa. ")}
                  </p>
                  <span className="text-gray-400 flex-shrink-0 ml-2" style={{ fontSize: "0.68rem" }}>
                    {conv.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 truncate" style={{ fontSize: "0.75rem" }}>
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span className="ml-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0" style={{ fontSize: "0.65rem", fontWeight: 700 }}>
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-1 flex-col`}>
        {selected ? (
          <>
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <button
                onClick={() => setShowMobileList(true)}
                className="lg:hidden p-1.5 rounded-xl hover:bg-gray-100 transition-colors mr-1"
              >
                <ArrowLeft size={18} className="text-gray-600" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                    {selected.participant.avatar}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {selected.participant.name}
                </p>
                <p className="text-green-500" style={{ fontSize: "0.72rem" }}>Online agora</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                  <Phone size={16} />
                </button>
                <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                  <Video size={16} />
                </button>
                <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50/50">
              {messages.map((msg, i) => {
                const isUser = msg.sender === "user";
                const showDate = i === 0 || messages[i - 1].date !== msg.date;

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full" style={{ fontSize: "0.72rem" }}>
                          {msg.date}
                        </span>
                      </div>
                    )}
                    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0 mb-1">
                          <span className="text-white" style={{ fontSize: "0.55rem", fontWeight: 700 }}>
                            {selected.participant.avatar}
                          </span>
                        </div>
                      )}
                      <div className="max-w-xs sm:max-w-md">
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            isUser
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
                          }`}
                        >
                          <p style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{msg.content}</p>
                        </div>
                        <p
                          className={`mt-1 ${isUser ? "text-right" : "text-left"} text-gray-400`}
                          style={{ fontSize: "0.65rem" }}
                        >
                          {msg.time}
                        </p>
                      </div>
                      {isUser && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center flex-shrink-0 mb-1">
                          <span className="text-white" style={{ fontSize: "0.55rem", fontWeight: 700 }}>LM</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors flex-shrink-0">
                  <Paperclip size={18} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                    style={{ fontSize: "0.875rem" }}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Smile size={16} />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-blue-200"
                >
                  <Send size={17} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-600" style={{ fontWeight: 500 }}>
                Selecione uma conversa
              </p>
              <p className="text-gray-400 mt-1" style={{ fontSize: "0.875rem" }}>
                Escolha um orientador para começar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
