import { api } from "./api";

export const conversationService = {
  listByUser(userId) {
    return api.get(`/api/conversas/${userId}/todas`);
  },

  openPrivate(outroUsuarioId) {
    return api.post(`/api/conversas/privada/${outroUsuarioId}`);
  },

  listMessages(conversationId) {
    return api.get(`/api/conversas/${conversationId}/mensagens`);
  },

  sendMessage(conversationId, conteudo) {
    return api.post(`/api/conversas/${conversationId}/mensagem`, { conteudo });
  },

  editMessage(mensagemId, conteudo) {
    return api.put(`/api/conversas/mensagem/${mensagemId}`, { conteudo });
  },

  deleteMessage(mensagemId) {
    return api.delete(`/api/conversas/mensagem/${mensagemId}`);
  },
};