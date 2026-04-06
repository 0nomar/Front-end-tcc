export function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatUserType(value) {
  return value === "ALUNO" ? "Aluno" : value === "ORIENTADOR" ? "Orientador" : value ?? "-";
}

export function formatProjectStatus(value) {
  const map = {
    ABERTO: "Aberto",
    EM_ANDAMENTO: "Em andamento",
    FINALIZADO: "Finalizado",
  };

  return map[value] ?? value ?? "-";
}

export function formatApplicationStatus(value) {
  const map = {
    PENDENTE: "Pendente",
    APROVADO: "Aprovado",
    REJEITADO: "Rejeitado",
  };

  return map[value] ?? value ?? "-";
}

export function formatNotificationType(value) {
  const map = {
    INSCRICAO_RECEBIDA: "Inscricao recebida",
    INSCRICAO_APROVADA: "Inscricao aprovada",
    INSCRICAO_REJEITADA: "Inscricao rejeitada",
    MENSAGEM_RECEBIDA: "Mensagem recebida",
    PROGRESSO_REGISTRADO: "Progresso registrado",
  };

  return map[value] ?? value ?? "-";
}
