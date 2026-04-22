import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, FolderPlus, Loader2 } from "lucide-react";
import { AREAS_ESTUDO_OPTIONS } from "../utils/constants";
import { projectService } from "../services/projectService";
import "./CreateProjectPage.css";

const INITIAL_FORM = {
  titulo: "",
  descricao: "",
  requisitos: "",
  areaId: "",
  vagas: "",
  dataInicio: "",
  dataFim: "",
  dataLimiteInscricao: "",
};

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [areas, setAreas] = useState([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setAreas(AREAS_ESTUDO_OPTIONS);
    setAreasLoading(false);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.titulo.trim()) { setError("O titulo e obrigatorio."); return; }
    if (!form.areaId) { setError("Selecione uma area de pesquisa."); return; }
    if (!form.vagas || Number(form.vagas) < 1) { setError("Informe o numero de vagas (minimo 1)."); return; }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim() || undefined,
        requisitos: form.requisitos.trim() || undefined,
        areaId: Number(form.areaId),
        vagas: Number(form.vagas),
        dataInicio: form.dataInicio || undefined,
        dataFim: form.dataFim || undefined,
        dataLimiteInscricao: form.dataLimiteInscricao || undefined,
      };

      const created = await projectService.create(payload);
      setSuccess(true);

      const id = created?.id;
      setTimeout(() => {
        navigate(id ? `/app/projects/${id}` : "/app/projects");
      }, 1200);
    } catch (err) {
      setError(err.message ?? "Nao foi possivel criar o projeto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const isDisabled = loading || success;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="pagina-criar-projeto"
    >
      <div className="pagina-criar-projeto__cabecalho">
        <button type="button" onClick={() => navigate("/app/projects")} className="pagina-criar-projeto__botao-voltar">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div>
          <h2 className="pagina-criar-projeto__titulo">Novo projeto</h2>
          <p className="pagina-criar-projeto__subtitulo">
            Preencha as informacoes para publicar seu projeto de pesquisa
          </p>
        </div>
      </div>

      <div className="pagina-criar-projeto__conteudo">
        <form onSubmit={handleSubmit} className="formulario-projeto" noValidate>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="formulario-projeto__alerta formulario-projeto__alerta--erro"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="formulario-projeto__alerta formulario-projeto__alerta--sucesso"
            >
              Projeto criado com sucesso! Redirecionando...
            </motion.div>
          )}

          {/* Titulo */}
          <div className="formulario-projeto__campo">
            <label htmlFor="titulo" className="formulario-projeto__rotulo">
              Titulo <span className="formulario-projeto__obrigatorio">*</span>
            </label>
            <input
              id="titulo" name="titulo" type="text"
              value={form.titulo} onChange={handleChange}
              placeholder="Ex: Sistema de deteccao de anomalias com IA"
              className="formulario-projeto__input"
              maxLength={200} disabled={isDisabled} autoFocus
            />
          </div>

          {/* Descricao */}
          <div className="formulario-projeto__campo">
            <label htmlFor="descricao" className="formulario-projeto__rotulo">Descricao</label>
            <textarea
              id="descricao" name="descricao"
              value={form.descricao} onChange={handleChange}
              placeholder="Descreva os objetivos, metodologia e resultados esperados..."
              className="formulario-projeto__textarea"
              rows={4} disabled={isDisabled}
            />
          </div>

          {/* Requisitos */}
          <div className="formulario-projeto__campo">
            <label htmlFor="requisitos" className="formulario-projeto__rotulo">Requisitos</label>
            <input
              id="requisitos" name="requisitos" type="text"
              value={form.requisitos} onChange={handleChange}
              placeholder="Ex: Conhecimento em Python, estatistica basica"
              className="formulario-projeto__input"
              disabled={isDisabled}
            />
          </div>

          {/* Area + Vagas */}
          <div className="formulario-projeto__grade-2">
            <div className="formulario-projeto__campo">
              <label htmlFor="areaId" className="formulario-projeto__rotulo">
                Area de pesquisa <span className="formulario-projeto__obrigatorio">*</span>
              </label>
              <select
                id="areaId" name="areaId"
                value={form.areaId} onChange={handleChange}
                className="formulario-projeto__select"
                disabled={isDisabled || areasLoading}
              >
                <option value="">
                  {areasLoading ? "Carregando..." : "Selecione uma area"}
                </option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.nome}</option>
                ))}
              </select>
            </div>

            <div className="formulario-projeto__campo">
              <label htmlFor="vagas" className="formulario-projeto__rotulo">
                Vagas <span className="formulario-projeto__obrigatorio">*</span>
              </label>
              <input
                id="vagas" name="vagas" type="number" min={1} max={99}
                value={form.vagas} onChange={handleChange}
                placeholder="Ex: 3"
                className="formulario-projeto__input"
                disabled={isDisabled}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="formulario-projeto__grade-3">
            <div className="formulario-projeto__campo">
              <label htmlFor="dataInicio" className="formulario-projeto__rotulo">Data de inicio</label>
              <input
                id="dataInicio" name="dataInicio" type="date"
                value={form.dataInicio} onChange={handleChange}
                className="formulario-projeto__input" disabled={isDisabled}
              />
            </div>
            <div className="formulario-projeto__campo">
              <label htmlFor="dataFim" className="formulario-projeto__rotulo">Data de termino</label>
              <input
                id="dataFim" name="dataFim" type="date"
                value={form.dataFim} onChange={handleChange}
                className="formulario-projeto__input" disabled={isDisabled}
              />
            </div>
            <div className="formulario-projeto__campo">
              <label htmlFor="dataLimiteInscricao" className="formulario-projeto__rotulo">Limite de inscricao</label>
              <input
                id="dataLimiteInscricao" name="dataLimiteInscricao" type="date"
                value={form.dataLimiteInscricao} onChange={handleChange}
                className="formulario-projeto__input" disabled={isDisabled}
              />
            </div>
          </div>

          {/* Acoes */}
          <div className="formulario-projeto__acoes">
            <button
              type="button" onClick={() => navigate("/app/projects")}
              className="formulario-projeto__botao-cancelar"
              disabled={loading}
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isDisabled ? 1 : 0.97 }}
              className="formulario-projeto__botao-criar"
              disabled={isDisabled}
            >
              {loading ? (
                <><Loader2 size={16} className="formulario-projeto__spinner" /> Criando...</>
              ) : (
                <><FolderPlus size={16} /> Criar projeto</>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
