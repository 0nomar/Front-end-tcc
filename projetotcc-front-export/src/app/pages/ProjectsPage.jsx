import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, FolderOpen, Users, Clock, DollarSign, ChevronRight, Bookmark, SlidersHorizontal, X } from "lucide-react";
import { projects } from "../data/mockData";

const areas = ["Todas", "Inteligência Artificial", "Bioinformática", "Física Computacional", "Robótica", "Saúde Digital", "Ciência de Dados"];
const statuses = ["Todos", "open", "in-progress", "closed"];
const statusLabel = { open: "Aberto", "in-progress": "Em andamento", closed: "Encerrado" };
const statusStyles = {
  open: "bg-green-50 text-green-700 border-green-200",
  "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
  closed: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [savedProjects, setSavedProjects] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchArea = selectedArea === "Todas" || p.area === selectedArea;
    const matchStatus = selectedStatus === "Todos" || p.status === selectedStatus;
    return matchSearch && matchArea && matchStatus;
  });

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSavedProjects((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.2rem" }}>
            {filtered.length} projetos encontrados
          </h2>
          <p className="text-gray-400 mt-0.5" style={{ fontSize: "0.8rem" }}>
            Encontre a oportunidade certa para sua carreira acadêmica
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${showFilters ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}
          style={{ fontSize: "0.875rem" }}
        >
          <SlidersHorizontal size={16} />
          Filtros
          {(selectedArea !== "Todas" || selectedStatus !== "Todos") && (
            <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center" style={{ fontSize: "0.65rem", fontWeight: 700 }}>
              {(selectedArea !== "Todas" ? 1 : 0) + (selectedStatus !== "Todos" ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          placeholder="Buscar projetos por título, área ou tecnologia..."
          style={{ fontSize: "0.9rem" }}
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 mb-2.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Área de pesquisa
              </label>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      selectedArea === area
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ fontSize: "0.78rem" }}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2.5" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      selectedStatus === status
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ fontSize: "0.78rem" }}
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
              className="mt-4 flex items-center gap-1 text-red-500 hover:text-red-600"
              style={{ fontSize: "0.8rem" }}
            >
              <X size={14} /> Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Area quick filters */}
      {!showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all ${
                selectedArea === area
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              style={{ fontSize: "0.82rem", fontWeight: selectedArea === area ? 600 : 400 }}
            >
              {area}
            </button>
          ))}
        </div>
      )}

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-gray-700 mb-2" style={{ fontWeight: 600, fontSize: "1rem" }}>
            Nenhum projeto encontrado
          </h3>
          <p className="text-gray-400" style={{ fontSize: "0.875rem" }}>
            Tente ajustar os filtros ou o termo de busca.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/app/projects/${project.id}`)}
              className="bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200 cursor-pointer group overflow-hidden"
            >
              {/* Card top bar */}
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-lg border text-xs ${statusStyles[project.status]}`} style={{ fontWeight: 500 }}>
                    {statusLabel[project.status]}
                  </span>
                  <button
                    onClick={(e) => toggleSave(project.id, e)}
                    className={`p-1.5 rounded-lg transition-colors ${savedProjects.includes(project.id) ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"}`}
                  >
                    <Bookmark size={15} fill={savedProjects.includes(project.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-gray-900 mb-2 line-clamp-2 leading-snug" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 mb-4 line-clamp-2" style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg" style={{ fontSize: "0.72rem" }}>
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-lg" style={{ fontSize: "0.72rem" }}>
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Info row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                      <Users size={12} />
                    </div>
                    <p className="text-gray-700" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                      {project.slots - project.slotsUsed}/{project.slots}
                    </p>
                    <p className="text-gray-400" style={{ fontSize: "0.65rem" }}>vagas</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                      <Clock size={12} />
                    </div>
                    <p className="text-gray-700" style={{ fontSize: "0.72rem", fontWeight: 600 }}>{project.duration}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.65rem" }}>duração</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                      <DollarSign size={12} />
                    </div>
                    <p className="text-gray-700" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                      {project.scholarship.split("/")[0]}
                    </p>
                    <p className="text-gray-400" style={{ fontSize: "0.65rem" }}>/mês</p>
                  </div>
                </div>

                {/* Advisor */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center">
                      <span className="text-white" style={{ fontSize: "0.6rem", fontWeight: 700 }}>
                        {project.advisor.avatar}
                      </span>
                    </div>
                    <span className="text-gray-600 truncate" style={{ fontSize: "0.75rem" }}>
                      {project.advisor.name.replace("Prof. Dr. ", "").replace("Profa. Dra. ", "")}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
