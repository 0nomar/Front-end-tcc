import { useState } from "react";
import { User, Mail, BookOpen, Building2, GraduationCap, Edit3, Save, X, Camera, Star, Award, Calendar } from "lucide-react";
import { currentUser, applications, feedbacks } from "../data/mockData";
import "./ProfilePage.css";

const allInterests = [
  "Machine Learning", "NLP", "Visão Computacional", "Python", "Deep Learning",
  "Robótica", "Bioinformática", "Ciência de Dados", "IoT", "Blockchain",
  "Computação Quântica", "Segurança da Informação", "Cloud Computing",
];

const statusConfig = {
  approved: { etiquetaClass: "historico-item__etiqueta--aprovado", label: "Aprovado" },
  pending:  { etiquetaClass: "historico-item__etiqueta--pendente",  label: "Pendente" },
  rejected: { etiquetaClass: "historico-item__etiqueta--rejeitado", label: "Não aprovado" },
};

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
    <div className="pagina-perfil">
      <div className="pagina-perfil__grade">
        {/* Card de perfil */}
        <div className="cartao-perfil">
          <div className="cartao-perfil__capa">
            <button className="cartao-perfil__botao-capa">
              <Camera size={14} />
            </button>
          </div>

          <div className="cartao-perfil__corpo">
            <div className="cartao-perfil__avatar-wrapper">
              <div className="cartao-perfil__avatar">
                <span className="cartao-perfil__avatar-inicial">{currentUser.avatar}</span>
              </div>
              <button className="cartao-perfil__botao-avatar">
                <Camera size={10} style={{ color: "white" }} />
              </button>
            </div>

            <h2 className="cartao-perfil__nome">{currentUser.name}</h2>
            <p className="cartao-perfil__tipo">{currentUser.type === "student" ? "Aluno" : "Orientador"}</p>
            <p className="cartao-perfil__instituicao">{currentUser.institution}</p>

            <div className="cartao-perfil__estatisticas">
              {[
                { label: "Projetos", value: approvedApps },
                { label: "Inscrições", value: applications.length },
                { label: "CRA", value: currentUser.gpa },
              ].map((s) => (
                <div key={s.label} className="cartao-perfil__stat">
                  <p className="cartao-perfil__stat-valor">{s.value}</p>
                  <p className="cartao-perfil__stat-label">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="cartao-perfil__info-lista">
              {[
                { icon: Mail, label: currentUser.email },
                { icon: BookOpen, label: currentUser.course },
                { icon: Building2, label: currentUser.institution },
                { icon: GraduationCap, label: currentUser.semester },
                { icon: Calendar, label: `Membro desde ${new Date(currentUser.joinedAt).toLocaleDateString("pt-BR")}` },
              ].map((item) => (
                <div key={item.label} className="cartao-perfil__info-item">
                  <item.icon size={14} className="cartao-perfil__info-icone" />
                  <span className="cartao-perfil__info-texto">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="cartao-perfil__conquistas">
              <p className="cartao-perfil__conquistas-titulo">Conquistas</p>
              <div className="cartao-perfil__lista-conquistas">
                {[
                  { emoji: "🎯", label: "Primeiro projeto" },
                  { emoji: "⭐", label: "Nota 5.0" },
                  { emoji: "🚀", label: "Early adopter" },
                ].map((a) => (
                  <div key={a.label} className="cartao-perfil__conquista">
                    <span>{a.emoji}</span>
                    <span className="cartao-perfil__conquista-texto">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="pagina-perfil__conteudo-principal">
          {/* Informações do perfil */}
          <div className="secao-perfil">
            <div className="secao-perfil__cabecalho">
              <h3 className="secao-perfil__titulo">Informações do perfil</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="secao-perfil__botao-editar">
                  <Edit3 size={14} />
                  Editar perfil
                </button>
              ) : (
                <div className="secao-perfil__acoes-edicao">
                  <button onClick={() => setEditing(false)} className="secao-perfil__botao-cancelar">
                    <X size={14} /> Cancelar
                  </button>
                  <button onClick={handleSave} disabled={loading} className="secao-perfil__botao-salvar">
                    {loading ? (
                      <div className="secao-perfil__spinner" />
                    ) : (
                      <Save size={14} />
                    )}
                    Salvar
                  </button>
                </div>
              )}
            </div>

            <div className="secao-perfil__grade-campos">
              {[
                { label: "Nome completo", value: currentUser.name, icon: User },
                { label: "E-mail", value: currentUser.email, icon: Mail },
                { label: "Curso", value: currentUser.course, icon: BookOpen },
                { label: "Instituição", value: currentUser.institution, icon: Building2 },
                { label: "Semestre", value: currentUser.semester, icon: GraduationCap },
                { label: "CRA", value: currentUser.gpa, icon: Star },
              ].map((field) => (
                <div key={field.label}>
                  <label className="campo-perfil__label">{field.label}</label>
                  <div className="campo-perfil__wrapper">
                    <field.icon size={14} className="campo-perfil__icone" />
                    <input
                      type="text"
                      defaultValue={field.value}
                      disabled={!editing}
                      className={`campo-perfil__input ${editing ? "campo-perfil__input--editando" : "campo-perfil__input--leitura"}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "var(--espaco-4)" }}>
              <label className="campo-perfil__label">Biografia</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!editing}
                rows={3}
                className={`campo-perfil__bio ${editing ? "campo-perfil__bio--editando" : "campo-perfil__bio--leitura"}`}
              />
            </div>
          </div>

          {/* Interesses */}
          <div className="secao-perfil">
            <div className="secao-interesses__cabecalho">
              <h3 className="secao-perfil__titulo">Áreas de interesse</h3>
              <span className="secao-interesses__contador">{interests.length}/8 selecionadas</span>
            </div>
            <div className="secao-interesses__lista">
              {allInterests.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`interesse-chip ${selected ? "interesse-chip--selecionado" : "interesse-chip--disponivel"}`}
                  >
                    {selected && <X size={12} />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Histórico acadêmico */}
          <div className="secao-perfil">
            <h3 className="secao-perfil__titulo">Histórico acadêmico</h3>
            <div className="historico-academico__lista">
              {applications.map((app) => {
                const sc = statusConfig[app.status];
                return (
                  <div key={app.id} className="historico-item">
                    <div className="historico-item__icone-area">
                      <Award size={18} style={{ color: "var(--cor-primaria)" }} />
                    </div>
                    <div className="historico-item__info">
                      <p className="historico-item__titulo">{app.project.title}</p>
                      <p className="historico-item__meta">
                        {new Date(app.appliedAt).toLocaleDateString("pt-BR")} · {app.project.area}
                      </p>
                    </div>
                    <span className={`historico-item__etiqueta ${sc.etiquetaClass}`}>{sc.label}</span>
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
