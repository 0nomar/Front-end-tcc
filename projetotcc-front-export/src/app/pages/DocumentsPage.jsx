import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Image,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Download,
  Eye,
  FolderOpen,
  Plus,
} from "lucide-react";
import { documents } from "../data/mockData";

const categoryColors = {
  Acadêmico: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Pessoal: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  Inscrição: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Certificados: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
};

const statusConfig = {
  verified: { icon: CheckCircle, label: "Verificado", bg: "bg-green-50", text: "text-green-700" },
  pending: { icon: Clock, label: "Em análise", bg: "bg-yellow-50", text: "text-yellow-700" },
  rejected: { icon: XCircle, label: "Rejeitado", bg: "bg-red-50", text: "text-red-700" },
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState(documents);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const fileInputRef = useRef(null);

  const categories = ["Todos", ...Array.from(new Set(docs.map((d) => d.category)))];

  const filteredDocs = selectedCategory === "Todos" ? docs : docs.filter((d) => d.category === selectedCategory);

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
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

  const handleDelete = (id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const verifiedCount = docs.filter((d) => d.status === "verified").length;
  const pendingCount = docs.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total de documentos", value: docs.length, icon: FolderOpen, color: "blue" },
          { label: "Verificados", value: verifiedCount, icon: CheckCircle, color: "green" },
          { label: "Em análise", value: pendingCount, icon: Clock, color: "yellow" },
        ].map((s) => {
          const colorMap = {
            blue: { bg: "bg-blue-50", icon: "text-blue-600" },
            green: { bg: "bg-green-50", icon: "text-green-600" },
            yellow: { bg: "bg-yellow-50", icon: "text-yellow-600" },
          };
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className={`w-10 h-10 ${colorMap[s.color].bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon size={18} className={colorMap[s.color].icon} />
              </div>
              <p className="text-gray-900" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.value}</p>
              <p className="text-gray-500 mt-0.5" style={{ fontSize: "0.75rem" }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
              <Upload size={20} className="text-blue-600 animate-bounce" />
            </div>
            <p className="text-gray-700" style={{ fontWeight: 500 }}>Enviando arquivo...</p>
            <div className="w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-100"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload size={22} className={`${dragging ? "text-blue-700" : "text-blue-600"}`} />
            </div>
            <p className="text-gray-700 mb-2" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
              {dragging ? "Solte os arquivos aqui" : "Arraste arquivos ou clique para fazer upload"}
            </p>
            <p className="text-gray-400" style={{ fontSize: "0.8rem" }}>
              PDF, DOC, DOCX, PNG, JPG até 10MB
            </p>
          </>
        )}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              style={{ fontSize: "0.82rem" }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
            {filteredDocs.length} documento{filteredDocs.length !== 1 ? "s" : ""}
          </h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            <Plus size={14} />
            Adicionar
          </button>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FolderOpen size={22} className="text-gray-400" />
            </div>
            <p className="text-gray-600" style={{ fontWeight: 500 }}>Nenhum documento nesta categoria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredDocs.map((doc) => {
              const sc = statusConfig[doc.status];
              const catColor = categoryColors[doc.category] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
              const StatusIcon = sc.icon;

              return (
                <div key={doc.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                  {/* File icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    doc.type === "image" ? "bg-pink-50" : "bg-red-50"
                  }`}>
                    {doc.type === "image" ? (
                      <Image size={18} className="text-pink-600" />
                    ) : (
                      <FileText size={18} className="text-red-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate" style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5" style={{ fontSize: "0.72rem" }}>
                      <span className="text-gray-400">{doc.size}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString("pt-BR")}</span>
                      <span className={`px-2 py-0.5 rounded-md ${catColor.bg} ${catColor.text} border ${catColor.border}`} style={{ fontWeight: 500 }}>
                        {doc.category}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${sc.bg} ${sc.text} flex-shrink-0`} style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                    <StatusIcon size={12} />
                    {sc.label}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye size={15} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Download size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload guide */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
        <h3 className="text-blue-800 mb-2" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
          📋 Documentos recomendados
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            "Histórico escolar atualizado",
            "Comprovante de matrícula",
            "Curriculum Vitae (CV)",
            "Carta de motivação",
            "Certificados de cursos",
            "RG ou CPF",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-blue-700" style={{ fontSize: "0.8rem" }}>
              <CheckCircle size={13} className="text-blue-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
