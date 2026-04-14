import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { projectService } from "../services/projectService";
import { StatusView } from "../components/StatusView";
import "./CreateProjectPage.css";

const AREAS_FALLBACK = [
  { id: 1,  nome: "Ciencia da Computacao" },
  { id: 2,  nome: "Engenharia de Software" },
  { id: 3,  nome: "Sistemas de Informacao" },
  { id: 4,  nome: "Engenharia Eletrica" },
  { id: 5,  nome: "Engenharia Civil" },
  { id: 6,  nome: "Medicina" },
  { id: 7,  nome: "Enfermagem" },
  { id: 8,  nome: "Administracao" },
  { id: 9,  nome: "Direito" },
  { id: 10, nome: "Pedagogia" },
  { id: 11, nome: "Matematica" },
  { id: 12, nome: "Fisica" },
  { id: 13, nome: "Quimica" },
  { id: 14, nome: "Biologia" },
  { id: 15, nome: "Psicologia" },
  { id: 16, nome: "Arquitetura" },
];

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [areas, setAreas] = useState(AREAS_FALLBACK);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    projectService
      .getById(id)
      .then((raw) => {
        setForm({
          titulo: raw.titulo ?? "",
          descricao: raw.descricao ?? "",
          requisitos: raw.requisitos ?? "",
          areaId: String(raw.areaId ?? ""),
          vagas: String(raw.vagas ?? ""),
          dataInicio: raw.dataInicio ?? "",
          dataFim: raw.dataFim ?? "",
          dataLimiteInscricao: raw.dataLimiteInscricao ?? "",
        });
        // Se o projeto tem areaNome, injeta nas opções caso não esteja
        if (raw.areaId && raw.areaNome) {
          setAreas((prev) => {
            const exists = prev.some((a) => a.id === raw.areaId);
            return exists ? prev : [...prev, { id: raw.areaId, nome: raw.areaNome }];
          });
        }
      })
      .catch((err) => setFetchError(err.message ?? "Nao foi possivel carregar o projeto."))
      .finally(() => setFetchLoading(false));
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.titulo.trim()) { setError("O titulo e obrigatorio."); return; }
    if (!form.areaId) { setError("Selecione uma area."); return; }
    if (!form.vagas || Number(form.vagas) < 1) { setError("Informe o numero de vagas."); return; }

    setLoading(true);
    setError(null);

    try {
      await projectService.update(id, {
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim() || undefined,
        requisitos: form.requisitos.trim() || undefined,
        areaId: Number(form.areaId),
        vagas: Number(form.vagas),
        dataInicio: form.dataInicio || undefined,
        dataFim: form.dataFim || undefined,
        dataLimiteInscricao: form.dataLimiteInscricao || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/app/projects/${id}`), 1200);
    } catch (err) {
      setError(err.message ?? "Nao foi possivel salvar as alteracoes.");
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) return <StatusView title="Carregando projeto" description="Buscando dados para edicao." />;
  if (fetchError) return <StatusView title="Erro ao carregar" description={fetchError} />;

  const isDisabled = loading || success;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="pagina-criar-projeto"
    >
      <div className="pagina-criar-projeto__cabecalho">
        <button type="button" onClick={() => navigate(`/app/projects/${id}`)} className="pagina-criar-projeto__botao-voltar">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div>
          <h2 className="pagina-criar-projeto__titulo">Editar projeto</h2>
          <p className="pagina-criar-projeto__subtitulo">Atualize as informacoes do projeto</p>
        </div>
      </div>

      <div className="pagina-criar-projeto__conteudo">
        <form onSubmit={handleSubmit} className="formulario-projeto" noValidate>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="formulario-projeto__alerta formulario-projeto__alerta--erro">
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="formulario-projeto__alerta formulario-projeto__alerta--sucesso">
              Projeto atualizado! Redirecionando...
            </motion.div>
          )}

          <div className="formulario-projeto__campo">
            <label htmlFor="titulo" className="formulario-projeto__rotulo">
              Titulo <span className="formulario-projeto__obrigatorio">*</span>
            </label>
            <input id="titulo" name="titulo" type="text" value={form.titulo} onChange={handleChange}
              className="formulario-projeto__input" maxLength={200} disabled={isDisabled} autoFocus />
          </div>

          <div className="formulario-projeto__campo">
            <label htmlFor="descricao" className="formulario-projeto__rotulo">Descricao</label>
            <textarea id="descricao" name="descricao" value={form.descricao} onChange={handleChange}
              className="formulario-projeto__textarea" rows={4} disabled={isDisabled} />
          </div>

          <div className="formulario-projeto__campo">
            <label htmlFor="requisitos" className="formulario-projeto__rotulo">Requisitos</label>
            <input id="requisitos" name="requisitos" type="text" value={form.requisitos} onChange={handleChange}
              placeholder="Ex: Python, estatistica basica"
              className="formulario-projeto__input" disabled={isDisabled} />
          </div>

          <div className="formulario-projeto__grade-2">
            <div className="formulario-projeto__campo">
              <label htmlFor="areaId" className="formulario-projeto__rotulo">
                Area <span className="formulario-projeto__obrigatorio">*</span>
              </label>
              <select id="areaId" name="areaId" value={form.areaId} onChange={handleChange}
                className="formulario-projeto__select" disabled={isDisabled}>
                <option value="">Selecione uma area</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.nome}</option>
                ))}
              </select>
            </div>

            <div className="formulario-projeto__campo">
              <label htmlFor="vagas" className="formulario-projeto__rotulo">
                Vagas <span className="formulario-projeto__obrigatorio">*</span>
              </label>
              <input id="vagas" name="vagas" type="number" min={1} max={99}
                value={form.vagas} onChange={handleChange}
                className="formulario-projeto__input" disabled={isDisabled} />
            </div>
          </div>

          <div className="formulario-projeto__grade-3">
            <div className="formulario-projeto__campo">
              <label htmlFor="dataInicio" className="formulario-projeto__rotulo">Data de inicio</label>
              <input id="dataInicio" name="dataInicio" type="date" value={form.dataInicio}
                onChange={handleChange} className="formulario-projeto__input" disabled={isDisabled} />
            </div>
            <div className="formulario-projeto__campo">
              <label htmlFor="dataFim" className="formulario-projeto__rotulo">Data de termino</label>
              <input id="dataFim" name="dataFim" type="date" value={form.dataFim}
                onChange={handleChange} className="formulario-projeto__input" disabled={isDisabled} />
            </div>
            <div className="formulario-projeto__campo">
              <label htmlFor="dataLimiteInscricao" className="formulario-projeto__rotulo">Limite de inscricao</label>
              <input id="dataLimiteInscricao" name="dataLimiteInscricao" type="date"
                value={form.dataLimiteInscricao} onChange={handleChange}
                className="formulario-projeto__input" disabled={isDisabled} />
            </div>
          </div>

          <div className="formulario-projeto__acoes">
            <button type="button" onClick={() => navigate(`/app/projects/${id}`)}
              className="formulario-projeto__botao-cancelar" disabled={loading}>
              Cancelar
            </button>
            <motion.button type="submit"
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isDisabled ? 1 : 0.97 }}
              className="formulario-projeto__botao-criar"
              disabled={isDisabled}>
              {loading
                ? <><Loader2 size={16} className="formulario-projeto__spinner" /> Salvando...</>
                : <><Save size={16} /> Salvar alteracoes</>}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
