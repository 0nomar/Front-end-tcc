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
import { useAsyncData } from "../hooks/useAsyncDataHook";
import { userService } from "../services/userService";
import { api } from "../services/api";
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

  // 1. ESTADO: Guarda qual o tipo de documento o usuário quer enviar
  const [tipoDocumento, setTipoDocumento] = useState("HISTORICO");

  // ... dentro do componente DocumentsPage ...
const { data, loading, error, reload } = useAsyncData(
    async () => {
      if (!user?.id) return [];
      
      const response = await documentService.getDocuments(user.id);
      const listaDocumentos = response?.data || response || [];
      
      if (!Array.isArray(listaDocumentos)) return [];

      return listaDocumentos.map(doc => ({
        id: doc.id,
        name: doc.nomeArquivo, 
        type: doc.tipo,
        uploadedAt: doc.dataEnvio,
        status: doc.status
      }));
    },
    [user?.id], 
    { initialData: [] }
);

  const docs = Array.isArray(data) ? data : [];

  const handleUpload = async (files) => {
    const file = files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await documentService.upload(user.id, tipoDocumento, file);

      toast.success(`${tipoDocumento === "HISTORICO" ? "Histórico" : "Currículo"} enviado com sucesso.`);
      await reload(); // Atualiza a lista
    } catch (error) {
      const erroBackend = error.response?.data?.message || error.message;
      toast.error(erroBackend || "Não foi possível enviar o documento.");
      console.error("Erro no upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.remove(id);
      await reload(); 
      toast.success("Documento removido.");
    } catch (err) {
      toast.error(err.message || "Não foi possível remover o documento.");
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
      verified: docs.filter(d => d.status === "VERIFICADO" || d.status === "ATIVO" || !d.status).length, 
    }),
    [docs],
  );

  if (loading) {
    return <StatusView title="Carregando documentos" description="Buscando documentos do usuário na API." />;
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

      {/* Seleção de Tipo de Documento com Chips */}
      <div className="pagina-documentos__secao-tipo">
        <p className="pagina-documentos__tipo-label">Selecione o que deseja enviar:</p>
        <div className="pagina-documentos__tipo-opcoes">
          <button 
            onClick={() => setTipoDocumento("HISTORICO")}
            className={`pagina-documentos__tipo-botao ${tipoDocumento === "HISTORICO" ? "pagina-documentos__tipo-botao--ativo" : ""}`}
          >
            <FileText size={16} />
            Histórico Escolar
          </button>
          <button 
            onClick={() => setTipoDocumento("CURRICULO")}
            className={`pagina-documentos__tipo-botao ${tipoDocumento === "CURRICULO" ? "pagina-documentos__tipo-botao--ativo" : ""}`}
          >
            <FileText size={16} />
            Currículo (Lattes/PDF)
          </button>
        </div>
      </div>

      {/* Área de Drop do Arquivo */}
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
          accept=".pdf,.doc,.docx"
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files)}
        />

        {uploading ? (
          <div className="pagina-documentos__progresso-upload">
            <div className="pagina-documentos__upload-icone-animado">
              <Upload size={20} />
            </div>
            <p className="pagina-documentos__upload-label">Enviando {tipoDocumento === "HISTORICO" ? "Histórico" : "Currículo"}...</p>
          </div>
        ) : (
          <>
            <div className="pagina-documentos__upload-icone-area">
              <Upload size={22} className={dragging ? "pagina-documentos__upload-icone--arrastando" : "pagina-documentos__upload-icone--normal"} />
            </div>
            <p className="pagina-documentos__upload-titulo">
              {dragging ? "Solte o arquivo aqui" : "Clique ou arraste seu arquivo aqui"}
            </p>
            <p className="pagina-documentos__upload-subtitulo">
              Formatos aceitos: PDF, DOC, DOCX
            </p>
          </>
        )}
      </div>

      {/* Lista de Documentos */}
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
            <p className="pagina-documentos__texto-vazio">Nenhum documento enviado até o momento</p>
          </div>
        ) : (
          <div className="pagina-documentos__grade-itens">
            {docs.map((doc) => (
              <div key={doc.id} className="documento-item">
                <div className="documento-item__icone-area documento-item__icone-area--pdf">
                  <FileText size={18} className="documento-item__icone--pdf" />
                </div>

                <div className="documento-item__info">
                  <p className="documento-item__nome">{doc.name || "Documento sem nome"}</p>

                  <div className="documento-item__meta">
                    <span className="documento-item__data">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("pt-BR") : "-"}
                    </span>
                    <span className={`documento-item__categoria documento-item__categoria--${doc.type?.toLowerCase()}`}>
                      {doc.type === "HISTORICO" ? "Histórico Escolar" : "Currículo"}
                    </span>
                  </div>
                </div>

                <div className={`documento-item__status documento-item__status--${doc.status?.toLowerCase() || "enviado"}`}>
                  <CheckCircle size={12} />
                  {doc.status || "Enviado"}
                </div>

                <div className="documento-item__acoes">
                  <a 
                    href={`${api.baseUrl}/api/documentos/${doc.id}/preview`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="documento-item__botao-acao" 
                    title="Visualizar"
                  >
                    <Eye size={15} />
                  </a>
                  <button onClick={() => handleDelete(doc.id)} className="documento-item__botao-acao documento-item__botao-excluir" title="Excluir">
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