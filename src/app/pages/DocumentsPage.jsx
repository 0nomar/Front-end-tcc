import { useMemo, useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  Trash2,
  Eye,
  FolderOpen,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncData";
import { userService } from "../services/userService";
import { documentService } from "../services/documentService";
import { mapDocument } from "../utils/adapters";
import { StatusView } from "../components/StatusView";
import "./DocumentsPage.css";

const statItems = [
  { key: "total", label: "Total de documentos", icon: FolderOpen, areaClass: "resumo-documentos__icone-area--azul", iconClass: "resumo-documentos__icone--azul" },
  { key: "verified", label: "Verificados", icon: CheckCircle, areaClass: "resumo-documentos__icone-area--verde", iconClass: "resumo-documentos__icone--verde" },
];

export default function DocumentsPage() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { data, loading, error, reload, setData } = useAsyncData(
    async () => {
      if (!user?.id) return [];
      const result = await userService.getDocuments(user.id);
      return Array.isArray(result) ? result.map(mapDocument) : [];
    },
    [user?.id],
    { initialData: [] },
  );
  const docs = Array.isArray(data) ? data : [];

  const handleUpload = async (files) => {
    const file = files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await documentService.upload("CURRICULO", file);
      toast.success("Documento enviado com sucesso.");
      await reload();
    } catch (err) {
      toast.error(err.message || "Nao foi possivel enviar o documento.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.remove(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Documento removido.");
    } catch (err) {
      toast.error(err.message || "Nao foi possivel remover o documento.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const statValues = useMemo(
    () => ({
      total: docs.length,
      verified: docs.length,
    }),
    [docs],
  );

  if (loading) {
    return <StatusView title="Carregando documentos" description="Buscando documentos do usuario na API." />;
  }

  if (error) {
    return <StatusView title="Falha ao carregar documentos" description={error.message} />;
  }

  return (
    <div className="pagina-documentos">
      <div className="pagina-documentos__grade-resumos">
        {statItems.map((item) => (
          <div key={item.label} className="resumo-documentos">
            <div className={`resumo-documentos__icone-area ${item.areaClass}`}>
              <item.icon size={18} className={item.iconClass} />
            </div>
            <p className="resumo-documentos__valor">{statValues[item.key]}</p>
            <p className="resumo-documentos__label">{item.label}</p>
          </div>
        ))}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`pagina-documentos__zona-upload ${dragging ? "pagina-documentos__zona-upload--arrastando" : "pagina-documentos__zona-upload--normal"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={false}
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
          </div>
        ) : (
          <>
            <div className="pagina-documentos__upload-icone-area">
              <Upload size={22} className={dragging ? "pagina-documentos__upload-icone--arrastando" : "pagina-documentos__upload-icone--normal"} />
            </div>
            <p className="pagina-documentos__upload-titulo">
              {dragging ? "Solte o arquivo aqui" : "Arraste arquivos ou clique para fazer upload"}
            </p>
            <p className="pagina-documentos__upload-subtitulo">A integração usa o endpoint real de upload da API</p>
          </>
        )}
      </div>

      <div className="pagina-documentos__lista">
        <div className="pagina-documentos__cabecalho-lista">
          <h3 className="pagina-documentos__contagem">
            {docs.length} documento{docs.length !== 1 ? "s" : ""}
          </h3>
          <button onClick={() => fileInputRef.current?.click()} className="pagina-documentos__botao-adicionar">
            <Plus size={14} />
            Adicionar
          </button>
        </div>

        {docs.length === 0 ? (
          <div className="pagina-documentos__vazio">
            <div className="pagina-documentos__icone-vazio">
              <FolderOpen size={22} />
            </div>
            <p className="pagina-documentos__texto-vazio">Nenhum documento enviado ate o momento</p>
          </div>
        ) : (
          <div>
            {docs.map((doc) => (
              <div key={doc.id} className="documento-item">
                <div className="documento-item__icone-area documento-item__icone-area--pdf">
                  <FileText size={18} className="documento-item__icone--pdf" />
                </div>

                <div className="documento-item__info">
                  <p className="documento-item__nome">{doc.name}</p>
                  <div className="documento-item__meta">
                    <span className="documento-item__data">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("pt-BR") : "-"}
                    </span>
                    <span className="documento-item__categoria">{doc.type}</span>
                  </div>
                </div>

                <div className="documento-item__status" style={{ background: "var(--cor-sucesso-clara)", color: "var(--cor-sucesso-escura)" }}>
                  <CheckCircle size={12} />
                  Disponivel
                </div>

                <div className="documento-item__acoes">
                  <button className="documento-item__botao-acao"><Eye size={15} /></button>
                  <button onClick={() => handleDelete(doc.id)} className="documento-item__botao-acao documento-item__botao-excluir">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
