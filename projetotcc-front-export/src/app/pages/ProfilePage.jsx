import { useState } from "react";
import { User, Mail, BookOpen, Building2, GraduationCap, Edit3, Save, X, Camera, Star, Award, Calendar } from "lucide-react";
import { currentUser, applications, feedbacks } from "../data/mockData";

const allInterests = [
  "Machine Learning", "NLP", "Visão Computacional", "Python", "Deep Learning",
  "Robótica", "Bioinformática", "Ciência de Dados", "IoT", "Blockchain",
  "Computação Quântica", "Segurança da Informação", "Cloud Computing",
];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [interests, setInterests] = useState(currentUser.interests);
  const [bio, setBio] = useState(currentUser.bio);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setEditing(false);
  };

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else if (interests.length < 8) {
      setInterests([...interests, interest]);
    }
  };

  const approvedApps = applications.filter((a) => a.status === "approved").length;

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Cover */}
            <div className="h-24 bg-gradient-to-r from-blue-600 to-violet-600 relative">
              <button className="absolute bottom-2 right-2 p-1.5 bg-white/20 rounded-lg backdrop-blur text-white hover:bg-white/30 transition-colors">
                <Camera size={14} />
              </button>
            </div>

            {/* Avatar */}
            <div className="px-6 pb-6">
              <div className="relative -mt-8 mb-4 w-fit">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                    {currentUser.avatar}
                  </span>
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                  <Camera size={10} className="text-white" />
                </button>
              </div>

              <h2 className="text-gray-900 mb-0.5" style={{ fontWeight: 700, fontSize: "1rem" }}>
                {currentUser.name}
              </h2>
              <p className="text-gray-500 mb-1" style={{ fontSize: "0.8rem" }}>
                {currentUser.type === "student" ? "Aluno" : "Orientador"}
              </p>
              <p className="text-gray-400 mb-4" style={{ fontSize: "0.75rem" }}>
                {currentUser.institution}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Projetos", value: approvedApps },
                  { label: "Inscrições", value: applications.length },
                  { label: "CRA", value: currentUser.gpa },
                ].map((s) => (
                  <div key={s.label} className="text-center p-2 bg-gray-50 rounded-xl">
                    <p className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>{s.value}</p>
                    <p className="text-gray-400" style={{ fontSize: "0.65rem" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Info list */}
              <div className="space-y-2.5">
                {[
                  { icon: Mail, label: currentUser.email },
                  { icon: BookOpen, label: currentUser.course },
                  { icon: Building2, label: currentUser.institution },
                  { icon: GraduationCap, label: currentUser.semester },
                  { icon: Calendar, label: `Membro desde ${new Date(currentUser.joinedAt).toLocaleDateString("pt-BR")}` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-gray-600">
                    <item.icon size={14} className="text-gray-400 flex-shrink-0" />
                    <span style={{ fontSize: "0.78rem" }} className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-gray-700 mb-3" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Conquistas
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { emoji: "🎯", label: "Primeiro projeto" },
                    { emoji: "⭐", label: "Nota 5.0" },
                    { emoji: "🚀", label: "Early adopter" },
                  ].map((a) => (
                    <div key={a.label} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl border border-blue-100">
                      <span>{a.emoji}</span>
                      <span className="text-blue-700" style={{ fontSize: "0.7rem", fontWeight: 500 }}>{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Edit bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>
                Informações do perfil
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                  style={{ fontSize: "0.8rem", fontWeight: 500 }}
                >
                  <Edit3 size={14} />
                  Editar perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <X size={14} /> Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    style={{ fontSize: "0.8rem", fontWeight: 500 }}
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Salvar
                  </button>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Nome completo", value: currentUser.name, icon: User },
                { label: "E-mail", value: currentUser.email, icon: Mail },
                { label: "Curso", value: currentUser.course, icon: BookOpen },
                { label: "Instituição", value: currentUser.institution, icon: Building2 },
                { label: "Semestre", value: currentUser.semester, icon: GraduationCap },
                { label: "CRA", value: currentUser.gpa, icon: Star },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    {field.label}
                  </label>
                  <div className="relative">
                    <field.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      defaultValue={field.value}
                      disabled={!editing}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border transition-all ${
                        editing
                          ? "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          : "bg-transparent border-transparent text-gray-700"
                      }`}
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="mt-4">
              <label className="block text-gray-600 mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                Biografia
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!editing}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                  editing
                    ? "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    : "bg-transparent border-transparent text-gray-600"
                }`}
                style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
              />
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>
                Áreas de interesse
              </h3>
              <span className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                {interests.length}/8 selecionadas
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                    style={{ fontSize: "0.8rem" }}
                  >
                    {selected && <X size={12} />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academic history */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-gray-900 mb-4" style={{ fontWeight: 700, fontSize: "1rem" }}>
              Histórico acadêmico
            </h3>
            <div className="space-y-4">
              {applications.map((app) => {
                const statusConfig = {
                  approved: { bg: "bg-green-50", text: "text-green-700", label: "Aprovado" },
                  pending: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Pendente" },
                  rejected: { bg: "bg-red-50", text: "text-red-700", label: "Não aprovado" },
                };
                const sc = statusConfig[app.status];
                return (
                  <div key={app.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate" style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                        {app.project.title}
                      </p>
                      <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                        {new Date(app.appliedAt).toLocaleDateString("pt-BR")} · {app.project.area}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg ${sc.bg} ${sc.text} flex-shrink-0`} style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                      {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
