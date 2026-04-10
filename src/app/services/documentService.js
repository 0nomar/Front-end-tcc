import { api } from "./api";

export const documentService = {
  upload(tipo, arquivo) {
    const formData = new FormData();
    formData.append("tipo", tipo);
    formData.append("arquivo", arquivo);
    
    return api.post("/api/documentos/upload", formData);
  },
  
  remove(id) {
    return api.delete(`/api/documentos/${id}`);
  },
};