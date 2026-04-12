import { api } from "./api";

export const userService = {
  list() {
    return api.get("/api/usuarios");
  },
  getCurrentUser() {
    return api.get("/api/usuarios/me");
  },
  getById(id) {
    return api.get(`/api/usuarios/${id}`);
  },
  update(id, payload) {
    return api.put(`/api/usuarios/${id}`, payload);
  },
  getProjects(id) {
    return api.get(`/api/usuarios/${id}/projetos`);
  },
  getApplications(id) {
    return api.get(`/api/usuarios/${id}/inscricoes`);
  },
  getDocuments(id) {
    return api.get(`/api/documentos/usuario/${id}`);
  },
};
