import { api } from "./api";

export const userService = {
  list() {
    return api.get("/api/usuarios");
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
    return api.get(`/api/usuarios/${id}/documentos`);
  },
};
