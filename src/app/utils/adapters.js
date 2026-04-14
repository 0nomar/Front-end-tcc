export function getUserName(user) {
  return user?.nome ?? user?.name ?? user?.usuario?.nome ?? "Usuario";
}

export function getUserEmail(user) {
  return user?.email ?? user?.usuario?.email ?? "";
}

export function getUserType(user) {
  return user?.tipo ?? user?.type ?? user?.usuario?.tipo ?? "";
}

export function mapProject(project) {
  // ProjetoResponse retorna campos planos (orientadorId, alunoCriadorId)
  // mas também pode vir com objetos aninhados (legado) — suporta os dois
  const orientadorUsuario = project?.orientador?.usuario ?? null;
  const alunoCriadorUsuario = project?.alunoCriador?.usuario ?? null;

  const orientadorId = project?.orientadorId ?? orientadorUsuario?.id ?? null;
  const orientadorNome = project?.orientadorNome ?? getUserName(orientadorUsuario) ?? null;
  const orientadorEmail = project?.orientadorEmail ?? getUserEmail(orientadorUsuario) ?? null;

  const alunoCriadorId = project?.alunoCriadorId ?? alunoCriadorUsuario?.id ?? null;
  const alunoCriadorNome = project?.alunoCriadorNome ?? getUserName(alunoCriadorUsuario) ?? null;

  const vagasTotal =
    project?.vagas ??
    project?.quantidadeVagas ??
    project?.qtdVagas ??
    project?.slots ??
    0;
  const vagasOcupadas =
    project?.quantidadeVagasPreenchidas ??
    project?.slotsUsed ??
    project?.colaboradores?.length ??
    0;

  return {
    id: project?.id,
    title: project?.titulo ?? project?.title ?? "Projeto sem titulo",
    description: project?.descricao ?? project?.description ?? "",
    requisitos: project?.requisitos ?? "",
    requirements: (() => {
      const r = project?.requisitos ?? project?.requirements;
      if (!r) return [];
      if (Array.isArray(r)) return r;
      return r.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    })(),
    tags: project?.tags ?? [],
    courses: project?.cursosAceitos ?? (project?.cursoNome ? [project.cursoNome] : []),
    area: project?.areaNome ?? project?.area ?? project?.orientador?.areaAtuacao ?? "Pesquisa",
    areaId: project?.areaId ?? null,
    status: project?.status ?? "ABERTO",
    createdAt: project?.dataCriacao ?? project?.createdAt ?? null,
    dataInicio: project?.dataInicio ?? null,
    dataFim: project?.dataFim ?? null,
    dataLimiteInscricao: project?.dataLimiteInscricao ?? null,
    slots: vagasTotal,
    slotsUsed: vagasOcupadas,
    ownerId: alunoCriadorId,
    advisorId: orientadorId,
    advisor: (orientadorId || orientadorNome)
      ? {
          id: orientadorId,
          name: orientadorNome ?? "Orientador",
          email: orientadorEmail ?? "",
          type: "ORIENTADOR",
          specialty: project?.orientador?.areaAtuacao ?? project?.areaNome ?? "",
        }
      : null,
    owner: (alunoCriadorId || alunoCriadorNome)
      ? {
          id: alunoCriadorId,
          name: alunoCriadorNome ?? "Aluno",
          email: "",
          type: "ALUNO",
        }
      : null,
  };
}

export function mapApplication(application) {
  return {
    id: application?.id,
    status: application?.status ?? "PENDENTE",
    appliedAt: application?.dataInscricao ?? application?.appliedAt ?? null,
    updatedAt: application?.dataAtualizacao ?? application?.updatedAt ?? null,
    project: application?.projeto ? mapProject(application.projeto) : null,
    user: application?.aluno?.usuario ?? application?.usuario ?? null,
  };
}

export function mapNotification(notification) {
  return {
    id: notification?.id,
    title: notification?.titulo ?? notification?.tipo ?? "Notificacao",
    message: notification?.mensagem ?? notification?.message ?? "",
    type: notification?.tipo ?? "INFO",
    read: notification?.lida ?? notification?.read ?? false,
    createdAt: notification?.dataCriacao ?? notification?.createdAt ?? null,
    actionUrl: notification?.link ?? "/app/notifications",
    user: notification?.usuario ?? null,
  };
}

export function mapFeedback(feedback) {
  return {
    id: feedback?.id,
    rating: feedback?.nota ?? feedback?.rating ?? 0,
    comment: feedback?.comentario ?? feedback?.comment ?? "",
    date: feedback?.dataCriacao ?? feedback?.date ?? null,
    project: feedback?.projeto ? mapProject(feedback.projeto) : null,
    from: feedback?.aluno?.usuario ?? feedback?.usuario ?? null,
  };
}

export function mapProgressItem(progress) {
  return {
    id: progress?.id,
    title: progress?.descricao ?? progress?.titulo ?? "Atualizacao",
    content: progress?.descricao ?? progress?.content ?? "",
    date: progress?.dataRegistro ?? progress?.date ?? null,
    author: getUserName(progress?.usuario ?? progress?.autor ?? {}),
    type: "update",
  };
}

export function mapDocument(document) {
  return {
    id: document?.id,
    name: document?.nomeArquivo ?? document?.name ?? "Documento",
    type: document?.tipo ?? "CURRICULO",
    uploadedAt: document?.dataUpload ?? document?.uploadedAt ?? null,
    status: "verified",
  };
}
