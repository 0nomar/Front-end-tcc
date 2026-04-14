import { api } from "./api";

function buildQs(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export const projectService = {
  // findAll
  list(filters = {}) {
    return api.get(`/api/projetos${buildQs(filters)}`);
  },

  // findById
  getById(id) {
    return api.get(`/api/projetos/${id}`);
  },

  // findByStatus
  findByStatus(status) {
    return api.get(`/api/projetos${buildQs({ status })}`);
  },

  // findByArea (por id)
  findByArea(areaId) {
    return api.get(`/api/projetos${buildQs({ areaId })}`);
  },

  // findByAreaNome
  findByAreaNome(area) {
    return api.get(`/api/projetos${buildQs({ area })}`);
  },

  // findByCursoNome
  findByCursoNome(curso) {
    return api.get(`/api/projetos${buildQs({ curso })}`);
  },

  // findByBusca
  findByBusca(busca) {
    return api.get(`/api/projetos${buildQs({ busca })}`);
  },

  // create
  create(dto) {
    return api.post("/api/projetos", dto);
  },

  // update
  update(id, dto) {
    return api.put(`/api/projetos/${id}`, dto);
  },

  // delete
  remove(id) {
    return api.delete(`/api/projetos/${id}`);
  },

  // recrutar
  recrutar(projetoId, usuarioId) {
    return api.post(`/api/projetos/${projetoId}/recrutar`, { usuarioId });
  },

  // listarColaboradores
  getCollaborators(id) {
    return api.get(`/api/projetos/${id}/colaboradores`);
  },

  // removerColaborador
  removerColaborador(projetoId, usuarioId) {
    return api.delete(`/api/projetos/${projetoId}/colaboradores/${usuarioId}`);
  },

  // progresso
  addProgress(id, payload) {
    return api.post(`/api/projetos/${id}/progresso`, payload);
  },
  getProgress(id) {
    return api.get(`/api/projetos/${id}/progresso`);
  },
};
