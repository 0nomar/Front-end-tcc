import { api } from "./api";

export const conversationService = {
  listByUser(userId) {
    return api.get(`/api/conversas/${userId}`);
  },

  listMessages(conversationId) {
    return api.get(`/api/conversas/${conversationId}/mensagens`);
  },

  sendMessage(conversationId, conteudo) {
    return api.post(`/api/conversas/${conversationId}/mensagem`, { conteudo });
  },
};