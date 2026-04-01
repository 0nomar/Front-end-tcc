import { useState, useRef, useMemo } from "react";
import {
  Upload, FileText, Image, CheckCircle, Clock,
  XCircle, Trash2, Download, Eye, FolderOpen, Plus,
} from "lucide-react";
import { documents } from "../data/mockData";
import "./DocumentsPage.css";

const categoryColors = {
  "Acadêmico":   { chipClass: "documento-item__categoria", style: { background: "var(--cor-primaria-clara)", color: "var(--cor-primaria-texto)", borderColor: "var(--cor-primaria-borda)" } },
  "Pessoal":     { chipClass: "documento-item__categoria", style: { background: "var(--cor-secundaria-clara)", color: "var(--cor-secundaria-escura)", borderColor: "var(--cor-secundaria-borda)" } },
  "Inscrição":   { chipClass: "documento-item__categoria", style: { background: "var(--cor-laranja-clara)", color: "var(--cor-laranja-escura)", borderColor: "var(--cor-laranja-borda)" } },
  "Certificados":{ chipClass: "documento-item__categoria", style: { background: "var(--cor-sucesso-clara)", color: "var(--cor-sucesso-escura)", borderColor: "var(--cor-sucesso-borda)" } },
};

const statusConfig = {
  verified: { icon: CheckCircle, label: "Verificado", style: { background: "var(--cor-sucesso-clara)", color: "var(--cor-sucesso-escura)" } },
  pending:  { icon: Clock,       label: "Em análise", style: { background: "var(--cor-atencao-clara)", color: "var(--cor-atencao-escura)" } },
  rejected: { icon: XCircle,     label: "Rejeitado",  style: { background: "var(--cor-erro-clara)",   color: "var(--cor-erro-escura)" } },
};

const statItems = [
  { key: "total",   label: "Total de documentos", icon: FolderOpen, areaClass: "resumo-documentos__icone-area--azul",    iconClass: "resumo-documentos__icone--azul" },
  { key: "verified",label: "Verificados",          icon: CheckCircle, areaClass: "resumo-documentos__icone-area--verde",  iconClass: "resumo-documentos__icone--verde" },
  { key: "pending", label: "Em análise",           icon: Clock,       areaClass: "resumo-documentos__icone-area--amarelo",iconClass: "resumo-documentos__icone--amarelo" },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState(documents);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const fileInputRef = useRef(null);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(docs.map((d) => d.category)))],
    [docs]
  );
  const filteredDocs = useMemo(
    () => (selectedCategory === "Todos" ? docs : docs.filter((d) => d.category === selectedCategory)),
    [docs, selectedCategory]
  );

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 10;
      });
    }, 100);

    await new Promise((r) => setTimeout(r, 1200));
    clearInterval(interval);
    setUploadProgress(100);

    const newDocs = Array.from(files).map((file, i) => ({
      id: `doc${Date.now()}${i}`,
      name: file.name,
      type: file.type.includes("image") ? "image" : "pdf",
      size: `${Math.round(file.size / 1024)} KB`,
      uploadedAt: new Date().toISOString().split("T")[0],
      category: "Pessoal",
      status: "pending",
    }));

    setDocs((prev) => [...newDocs, ...prev]);
    setUploading(false);
    setUploadProgress(0);
  };

  const handleDelete = (id) => setDocs((prev) => prev.filter((d) => d.id !== id));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const verifiedCount = docs.filter((d) => d.status === "verified").length;
  const pendingCount  = docs.filter((d) => d.status === "pending").length;
  const statValues = { total: docs.length, verified: verifiedCount, pending: pendingCount };

  return (
    <div className="pagina-documentos">
      {/* Resumos */}
      <div className="pagina-documentos__grade-resumos">
        {statItems.map((s) => (
          <div key={s.label} className="resumo-documentos">
            <div className={`resumo-documentos__icone-area ${s.areaClass}`}>
              <s.icon size={18} className={s.iconClass} />
            </div>
            <p className="resumo-documentos__valor">{statValues[s.key]}</p>
            <p className="resumo-documentos__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Zona de upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`pagina-documentos__zona-upload ${dragging ? "pagina-documentos__zona-upload--arrastando" : "pagina-documentos__zona-upload--normal"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files)}
        />

        {uploading ? (
          <div className="pagina-documentos__progresso-upload">
            <div className="pagina-documentos__upload-icone-animado">
              <Upload size={20} />
            </div>
            <p className="pagina-documentos__upload-label">Enviando arquivo...</p>
            <div className="pagina-documentos__trilha-progresso">
              <div className="pagina-documentos__barra-progresso" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="pagina-documentos__percentual-progresso">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <div className="pagina-documentos__upload-icone-area">
              <Upload size={22} className={dragging ? "pagina-documentos__upload-icone--arrastando" : "pagina-documentos__upload-icone--normal"} />
            </div>
            <p className="pagina-documentos__upload-titulo">
              {dragging ? "Solte os arquivos aqui" : "Arraste arquivos ou clique para fazer upload"}
            </p>
            <p className="pagina-documentos__upload-subtitulo">PDF, DOC, DOCX, PNG, JPG até 10MB</p>
          </>
        )}
      </div>

      {/* Filtros */}
      <div className="pagina-documentos__filtros">
        <div className="pagina-documentos__lista-filtros">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pagina-documentos__chip-filtro ${selectedCategory === cat ? "pagina-documentos__chip-filtro--ativo" : "pagina-documentos__chip-filtro--inativo"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="pagina-documentos__lista">
        <div className="pagina-documentos__cabecalho-lista">
          <h3 className="pagina-documentos__contagem">
            {filteredDocs.length} documento{filteredDocs.length !== 1 ? "s" : ""}
          </h3>
          <button onClick={() => fileInputRef.current?.click()} className="pagina-documentos__botao-adicionar">
            <Plus size={14} />
            Adicionar
          </button>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="pagina-documentos__vazio">
            <div className="pagina-documentos__icone-vazio">
              <FolderOpen size={22} />
            </div>
            <p className="pagina-documentos__texto-vazio">Nenhum documento nesta categoria</p>
          </div>
        ) : (
          <div>
            {filteredDocs.map((doc) => {
              const sc = statusConfig[doc.status];
              const catColor = categoryColors[doc.category] || { style: { background: "var(--cor-fundo)", color: "var(--cor-texto-secundario)", borderColor: "var(--cor-borda)" } };
              const StatusIcon = sc.icon;

              return (
                <div key={doc.id} className="documento-item">
                  <div className={`documento-item__icone-area ${doc.type === "image" ? "documento-item__icone-area--imagem" : "documento-item__icone-area--pdf"}`}>
                    {doc.type === "image" ? (
                      <Image size={18} className="documento-item__icone--imagem" />
                    ) : (
                      <FileText size={18} className="documento-item__icone--pdf" />
                    )}
                  </div>

                  <div className="documento-item__info">
                    <p className="documento-item__nome">{doc.name}</p>
                    <div className="documento-item__meta">
                      <span className="documento-item__tamanho">{doc.size}</span>
                      <span className="documento-item__separador">·</span>
                      <span className="documento-item__data">{new Date(doc.uploadedAt).toLocaleDateString("pt-BR")}</span>
                      <span className="documento-item__categoria" style={catColor.style}>{doc.category}</span>
                    </div>
                  </div>

                  <div className="documento-item__status" style={sc.style}>
                    <StatusIcon size={12} />
                    {sc.label}
                  </div>

                  <div className="documento-item__acoes">
                    <button className="documento-item__botao-acao"><Eye size={15} /></button>
                    <button className="documento-item__botao-acao"><Download size={15} /></button>
                    <button onClick={() => handleDelete(doc.id)} className="documento-item__botao-acao documento-item__botao-excluir">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Documentos recomendados */}
      <div className="pagina-documentos__recomendados">
        <h3 className="pagina-documentos__recomendados-titulo">📋 Documentos recomendados</h3>
        <div className="pagina-documentos__grade-recomendados">
          {[
            "Histórico escolar atualizado",
            "Comprovante de matrícula",
            "Curriculum Vitae (CV)",
            "Carta de motivação",
            "Certificados de cursos",
            "RG ou CPF",
          ].map((item) => (
            <div key={item} className="pagina-documentos__item-recomendado">
              <CheckCircle size={13} className="pagina-documentos__icone-recomendado" />
              <span className="pagina-documentos__texto-recomendado">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
