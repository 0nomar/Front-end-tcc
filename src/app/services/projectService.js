import { api } from "./api";

export const projectService = {
  list() {
    return api.get("/api/projetos");
  },
  getById(id) {
    return api.get(`/api/projetos/${id}`);
  },
  addProgress(id, payload) {
    return api.post(`/api/projetos/${id}/progresso`, payload);
  },
  getProgress(id) {
    return api.get(`/api/projetos/${id}/progresso`);
  },
  getCollaborators(id) {
    return api.get(`/api/projetos/${id}/colaboradores`);
  },
};
