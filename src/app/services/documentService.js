import { api } from "./api";

export const documentService = {
  // 1. Adicionamos o usuarioId como primeiro parâmetro
  upload(usuarioId, tipo, arquivo) { 
    const formData = new FormData();
    
    // 2. Anexamos o ID no formulário para o Java receber
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