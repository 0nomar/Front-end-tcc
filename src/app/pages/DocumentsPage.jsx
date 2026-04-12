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

  // 1. NOVO ESTADO: Guarda qual o tipo de documento o usuário quer enviar
  const [tipoDocumento, setTipoDocumento] = useState("IDENTIDADE");

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

      toast.success("Documento enviado com sucesso.");
      await reload(); // Atualiza a lista
    } catch (error) { // ⬅️ DECLARAMOS A VARIÁVEL COMO 'error'
      // ⬅️ USAMOS A MESMA VARIÁVEL 'error' AQUI DENTRO
      const erroBackend = error.response?.data?.message || error.message;
      toast.error(erroBackend || "Não foi possível enviar o documento.");

      // Coloquei esse console.log para vermos o verdadeiro motivo da falha!
      console.error("O verdadeiro erro do upload foi:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.remove(id);
      await reload(); // <-- MUDE AQUI! Recarrega a lista do backend
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
      verified: docs.length, // Lógica simulada, futuramente você pode checar se o status === 'VERIFICADO'
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

      {/* 3. NOVO ELEMENTO: Select de Tipo de Documento */}
      <div style={{ marginBottom: "1rem", backgroundColor: "var(--cor-branco)", padding: "1rem", borderRadius: "var(--raio-grande)", border: "1px solid var(--cor-borda-clara)" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--cor-texto-secundario)", fontWeight: "600" }}>
          Selecione o tipo de documento que vai enviar:
        </label>
        <select
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--cor-borda)", outline: "none", fontSize: "1rem", backgroundColor: "var(--cor-fundo)" }}
        >
          {/* Lembre-se: os "values" aqui devem ser IGUAIS ao nome do seu Enum no Spring Boot */}
          <option value="HISTORICO">Histórico Escolar</option>
          <option value="CURRICULO">Currículo</option>
        </select>
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
            <p className="pagina-documentos__upload-subtitulo">O arquivo será salvo como: {tipoDocumento}</p>
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
                  {/* Puxando o nome. Se vier vazio, coloca um texto padrão */}
                  <p className="documento-item__nome">{doc.name || "Documento sem nome"}</p>

                  <div className="documento-item__meta">
                    <span className="documento-item__data">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("pt-BR") : "-"}
                    </span>
                    <span className="documento-item__categoria">{doc.type}</span>
                  </div>
                </div>

                <div className="documento-item__status" style={{ background: "var(--cor-sucesso-clara)", color: "var(--cor-sucesso-escura)" }}>
                  <CheckCircle size={12} />
                  {doc.status || "Disponível"}
                </div>

                <div className="documento-item__acoes">
                  <button className="documento-item__botao-acao" title="Visualizar">
                    <Eye size={15} />
                  </button>
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