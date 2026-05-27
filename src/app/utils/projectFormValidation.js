export function validateProjectDates({ dataInicio, dataFim, dataLimiteInscricao }) {
  if (dataInicio && dataFim && dataFim < dataInicio) {
    return "A data de termino deve ser igual ou posterior a data de inicio.";
  }

  if (dataLimiteInscricao && dataFim && dataLimiteInscricao > dataFim) {
    return "O limite de inscricao deve ser igual ou anterior a data de termino.";
  }

  return null;
}
