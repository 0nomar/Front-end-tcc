import { api } from "./api";

export const applicationService = {
  listMine() {
    return api.get("/api/usuarios/minhas-inscricoes");
  },
  create(projectId) {
    return api.post("/api/inscricoes", { projetoId: Number(projectId) });
  },
  listByProject(projectId) {
    return api.get(`/api/inscricoes/projeto/${projectId}`);
  },
};
