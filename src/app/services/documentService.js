import { api } from "./api";

export const documentService = {
  upload(usuarioId, tipo, arquivo) {
    const formData = new FormData();
    formData.append("usuarioId", usuarioId);
    formData.append("tipo", tipo);
    formData.append("arquivo", arquivo);

    return api.post("/api/documentos/upload", formData);
  },

  remove(id) {
    return api.delete(`/api/documentos/${id}`);
  },

  getDocuments(userId) {
    return api.get(`/api/documentos/usuario/${userId}`);
  },
};
