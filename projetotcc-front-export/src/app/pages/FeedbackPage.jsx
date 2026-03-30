import { useState } from "react";
import { Star, Send, CheckCircle, MessageSquare, Award } from "lucide-react";
import { feedbacks, projects } from "../data/mockData";

const categories = [
  { key: "technical", label: "Técnico" },
  { key: "communication", label: "Comunicação" },
  { key: "punctuality", label: "Pontualidade" },
  { key: "initiative", label: "Iniciativa" },
];

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => !readOnly && onChange?.(s)}
          onMouseEnter={() => !readOnly && setHovered(s)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          disabled={readOnly}
          className={`transition-transform ${!readOnly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <Star
            size={20}
            className={`transition-colors ${
              s <= (hovered || value) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState({
    technical: 0,
    communication: 0,
    punctuality: 0,
    initiative: 0,
  });
  const [comment, setComment] = useState("");
  const [selectedProject, setSelectedProject] = useState(projects[0].id);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    setShowForm(false);
  };

  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
      : 0;

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Feedbacks recebidos", value: feedbacks.length, icon: MessageSquare, color: "blue" },
          { label: "Nota média", value: averageRating.toFixed(1), icon: Star, color: "yellow" },
          { label: "Desempenho geral", value: "Excelente", icon: Award, color: "violet" },
        ].map((s) => {
          const colorMap = {
            blue: { bg: "bg-blue-50", icon: "text-blue-600" },
            yellow: { bg: "bg-yellow-50", icon: "text-yellow-600" },
            violet: { bg: "bg-violet-50", icon: "text-violet-600" },
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Received feedbacks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>
              Feedbacks recebidos
            </h3>
          </div>

          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                    <span className="text-white" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                      {fb.from.avatar}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900" style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                      {fb.from.name}
                    </p>
                    <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                      {new Date(fb.date).toLocaleDateString("pt-BR")} · {fb.project.title.slice(0, 30)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= fb.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-gray-600 mb-4 p-4 bg-gray-50 rounded-xl" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
                  "{fb.comment}"
                </p>

                {/* Category ratings */}
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const val = fb.categories[cat.key];
                    return (
                      <div key={cat.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-500" style={{ fontSize: "0.72rem" }}>{cat.label}</span>
                          <span className="text-gray-700" style={{ fontSize: "0.72rem", fontWeight: 600 }}>{val}/5</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                            style={{ width: `${(val / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {feedbacks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Star size={22} className="text-gray-400" />
                </div>
                <p className="text-gray-600" style={{ fontWeight: 500 }}>Nenhum feedback ainda</p>
                <p className="text-gray-400 mt-1" style={{ fontSize: "0.875rem" }}>
                  Feedbacks aparecerão aqui quando recebidos.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Give feedback */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>
              Avaliar orientador
            </h3>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl border border-green-100 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                Feedback enviado!
              </h3>
              <p className="text-gray-500 mb-4" style={{ fontSize: "0.875rem" }}>
                Obrigado pela sua avaliação. Isso ajuda a melhorar a experiência de pesquisa.
              </p>
              <button
                onClick={() => { setSubmitted(false); setShowForm(false); setRating(0); setComment(""); }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                style={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                Dar outro feedback
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              {!showForm ? (
                <div className="text-center py-6">
                  <div className="flex justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={28} className="text-gray-200 fill-gray-200" />
                    ))}
                  </div>
                  <h4 className="text-gray-900 mb-2" style={{ fontWeight: 600, fontSize: "1rem" }}>
                    Como foi sua experiência?
                  </h4>
                  <p className="text-gray-500 mb-6" style={{ fontSize: "0.875rem" }}>
                    Avalie seu orientador e contribua para a comunidade acadêmica.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    style={{ fontSize: "0.875rem", fontWeight: 600 }}
                  >
                    Avaliar orientador
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Project select */}
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      Projeto
                    </label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.title.slice(0, 50)}...</option>
                      ))}
                    </select>
                  </div>

                  {/* Overall rating */}
                  <div>
                    <label className="block text-gray-700 mb-3" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      Avaliação geral
                    </label>
                    <div className="flex items-center gap-4">
                      <StarRating value={rating} onChange={setRating} />
                      {rating > 0 && (
                        <span className="text-gray-500" style={{ fontSize: "0.875rem" }}>
                          {["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"][rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category ratings */}
                  <div>
                    <label className="block text-gray-700 mb-3" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      Avaliação por categoria
                    </label>
                    <div className="space-y-3">
                      {categories.map((cat) => (
                        <div key={cat.key} className="flex items-center justify-between">
                          <span className="text-gray-600 w-32" style={{ fontSize: "0.875rem" }}>{cat.label}</span>
                          <StarRating
                            value={categoryRatings[cat.key]}
                            onChange={(v) => setCategoryRatings({ ...categoryRatings, [cat.key]: v })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      Comentário
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                      placeholder="Compartilhe sua experiência com este orientador..."
                      style={{ fontSize: "0.875rem" }}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || rating === 0 || !comment}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ fontWeight: 600, fontSize: "0.875rem" }}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={15} /> Enviar avaliação
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
