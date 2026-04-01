import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Search, FolderOpen, Users, Clock, DollarSign, ChevronRight, Bookmark, SlidersHorizontal, X } from "lucide-react";
import { projects } from "../data/mockData";
import "./ProjectsPage.css";

const areas = ["Todas", "Inteligência Artificial", "Bioinformática", "Física Computacional", "Robótica", "Saúde Digital", "Ciência de Dados"];
const statuses = ["Todos", "open", "in-progress", "closed"];
const statusLabel = { open: "Aberto", "in-progress": "Em andamento", closed: "Encerrado" };
const statusCardClass = {
  open:         "projeto-card__status--aberto",
  "in-progress":"projeto-card__status--andamento",
  closed:       "projeto-card__status--encerrado",
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [savedProjects, setSavedProjects] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchArea = selectedArea === "Todas" || p.area === selectedArea;
        const matchStatus = selectedStatus === "Todos" || p.status === selectedStatus;
        return matchSearch && matchArea && matchStatus;
      }),
    [search, selectedArea, selectedStatus]
  );

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSavedProjects((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="pagina-projetos"
    >
      {/* Cabeçalho */}
      <div className="pagina-projetos__cabecalho">
        <div>
          <h2 className="pagina-projetos__titulo">{filtered.length} projetos encontrados</h2>
          <p className="pagina-projetos__subtitulo">Encontre a oportunidade certa para sua carreira acadêmica</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`pagina-projetos__botao-filtros ${showFilters ? "pagina-projetos__botao-filtros--ativo" : "pagina-projetos__botao-filtros--inativo"}`}
        >
          <SlidersHorizontal size={16} />
          Filtros
          {(selectedArea !== "Todas" || selectedStatus !== "Todos") && (
            <span className="pagina-projetos__contador-filtros">
              {(selectedArea !== "Todas" ? 1 : 0) + (selectedStatus !== "Todos" ? 1 : 0)}
            </span>
          )}
        </motion.button>
      </div>

      {/* Busca */}
      <div className="pagina-projetos__busca">
        <Search size={18} className="pagina-projetos__icone-busca" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pagina-projetos__input-busca"
          placeholder="Buscar projetos por título, área ou tecnologia..."
        />
        {search && (
          <button onClick={() => setSearch("")} className="pagina-projetos__botao-limpar-busca">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Painel de filtros avançados */}
      {showFilters && (
        <div className="pagina-projetos__painel-filtros">
          <div className="pagina-projetos__grade-filtros">
            <div>
              <label className="pagina-projetos__rotulo-filtro">Área de pesquisa</label>
              <div className="pagina-projetos__chips-filtro">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`pagina-projetos__chip ${selectedArea === area ? "pagina-projetos__chip--ativo" : "pagina-projetos__chip--inativo"}`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="pagina-projetos__rotulo-filtro">Status</label>
              <div className="pagina-projetos__chips-filtro">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`pagina-projetos__chip ${selectedStatus === status ? "pagina-projetos__chip--ativo" : "pagina-projetos__chip--inativo"}`}
                  >
                    {status === "Todos" ? "Todos" : statusLabel[status]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {(selectedArea !== "Todas" || selectedStatus !== "Todos") && (
            <button
              onClick={() => { setSelectedArea("Todas"); setSelectedStatus("Todos"); }}
              className="pagina-projetos__botao-limpar-filtros"
            >
              <X size={14} /> Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Filtros rápidos por área */}
      {!showFilters && (
        <div className="pagina-projetos__filtros-rapidos">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`pagina-projetos__filtro-area ${selectedArea === area ? "pagina-projetos__filtro-area--ativo" : "pagina-projetos__filtro-area--inativo"}`}
            >
              {area}
            </button>
          ))}
        </div>
      )}

      {/* Grade de projetos */}
      {filtered.length === 0 ? (
        <div className="pagina-projetos__estado-vazio">
          <div className="pagina-projetos__icone-vazio">
            <Search size={24} style={{ color: "var(--cor-texto-mudo)" }} />
          </div>
          <h3 className="pagina-projetos__titulo-vazio">Nenhum projeto encontrado</h3>
          <p className="pagina-projetos__descricao-vazio">Tente ajustar os filtros ou o termo de busca.</p>
        </div>
      ) : (
        <div className="pagina-projetos__grade">
          {filtered.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ scale: 1.03, boxShadow: "0 18px 30px rgba(37,99,235,0.14)" }}
              onClick={() => navigate(`/app/projects/${project.id}`)}
              className="projeto-card"
            >
              <div className="projeto-card__barra-topo" />
              <div className="projeto-card__corpo">
                <div className="projeto-card__cabecalho">
                  <span className={`projeto-card__status ${statusCardClass[project.status]}`}>
                    {statusLabel[project.status]}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => toggleSave(project.id, e)}
                    className={`projeto-card__botao-salvar ${savedProjects.includes(project.id) ? "projeto-card__botao-salvar--ativo" : "projeto-card__botao-salvar--inativo"}`}
                  >
                    <Bookmark size={15} fill={savedProjects.includes(project.id) ? "currentColor" : "none"} />
                  </motion.button>
                </div>

                <h3 className="projeto-card__titulo">{project.title}</h3>
                <p className="projeto-card__descricao">{project.description}</p>

                <div className="projeto-card__tags">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="projeto-card__etiqueta">{tag}</span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="projeto-card__etiqueta projeto-card__etiqueta--mais">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="projeto-card__informacoes">
                  <div className="projeto-card__info-item">
                    <div className="projeto-card__info-icone"><Users size={12} /></div>
                    <p className="projeto-card__info-valor">{project.slots - project.slotsUsed}/{project.slots}</p>
                    <p className="projeto-card__info-rotulo">vagas</p>
                  </div>
                  <div className="projeto-card__info-item">
                    <div className="projeto-card__info-icone"><Clock size={12} /></div>
                    <p className="projeto-card__info-valor">{project.duration}</p>
                    <p className="projeto-card__info-rotulo">duração</p>
                  </div>
                  <div className="projeto-card__info-item">
                    <div className="projeto-card__info-icone"><DollarSign size={12} /></div>
                    <p className="projeto-card__info-valor">{project.scholarship.split("/")[0]}</p>
                    <p className="projeto-card__info-rotulo">/mês</p>
                  </div>
                </div>

                <div className="projeto-card__orientador">
                  <div className="projeto-card__orientador-dados">
                    <div className="projeto-card__avatar-orientador">
                      <span className="projeto-card__iniciais-orientador">{project.advisor.avatar}</span>
                    </div>
                    <span className="projeto-card__nome-orientador">
                      {project.advisor.name.replace("Prof. Dr. ", "").replace("Profa. Dra. ", "")}
                    </span>
                  </div>
                  <ChevronRight size={14} className="projeto-card__seta-acesso" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
