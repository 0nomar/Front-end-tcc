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
  const orientadorUsuario = project?.orientador?.usuario ?? null;
  const alunoCriadorUsuario = project?.alunoCriador?.usuario ?? null;
  const vagasTotal =
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
    requirements: project?.requisitos ?? project?.requirements ?? [],
    tags: project?.tags ?? [],
    courses: project?.cursosAceitos ?? project?.course ?? [],
    area: project?.area ?? project?.orientador?.areaAtuacao ?? "Pesquisa",
    status: project?.status ?? "ABERTO",
    createdAt: project?.dataCriacao ?? project?.createdAt ?? null,
    slots: vagasTotal,
    slotsUsed: vagasOcupadas,
    advisor: orientadorUsuario
      ? {
          id: orientadorUsuario.id,
          name: getUserName(orientadorUsuario),
          email: getUserEmail(orientadorUsuario),
          type: getUserType(orientadorUsuario),
          specialty: project?.orientador?.areaAtuacao ?? "",
        }
      : null,
    owner: alunoCriadorUsuario
      ? {
          id: alunoCriadorUsuario.id,
          name: getUserName(alunoCriadorUsuario),
          email: getUserEmail(alunoCriadorUsuario),
          type: getUserType(alunoCriadorUsuario),
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
