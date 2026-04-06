import { useEffect, useMemo, useState } from "react";
import { User, Mail, BookOpen, Building2, GraduationCap, Edit3, Save, X, Award, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useAsyncData } from "../hooks/useAsyncData";
import { userService } from "../services/userService";
import { applicationService } from "../services/applicationService";
import { mapApplication } from "../utils/adapters";
import { formatApplicationStatus, formatUserType } from "../utils/formatters";
import { StatusView } from "../components/StatusView";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { data, loading, error } = useAsyncData(async () => {
    if (!user?.id) return { profile: user, applications: [] };
    const [profile, applications] = await Promise.all([
      userService.getById(user.id).catch(() => user),
      applicationService.listMine().catch(() => []),
    ]);

    return {
      profile,
      applications: Array.isArray(applications) ? applications.map(mapApplication) : [],
    };
  }, [user?.id], { initialData: { profile: user, applications: [] } });
  const [editing, setEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    curso: "",
    instituicao: "",
    semestre: "",
    bio: "",
  });

  useEffect(() => {
    if (data?.profile) {
      setForm({
        nome: data.profile.nome ?? "",
        email: data.profile.email ?? "",
        curso: data.profile.curso ?? "",
        instituicao: data.profile.instituicao ?? "",
        semestre: data.profile.semestre ?? "",
        bio: data.profile.bio ?? "",
      });
    }
  }, [data]);

  const approvedApps = useMemo(
    () => (data?.applications ?? []).filter((item) => item.status === "APROVADO").length,
    [data],
  );

  const handleSave = async () => {
    if (!user?.id) return;
    setLoadingSave(true);

    try {
      await userService.update(user.id, form);
      await refreshUser();
      toast.success("Perfil atualizado com sucesso.");
      setEditing(false);
    } catch (err) {
      toast.error(err.message || "Nao foi possivel salvar o perfil.");
    } finally {
      setLoadingSave(false);
    }
  };

  if (loading) {
    return <StatusView title="Carregando perfil" description="Buscando suas informacoes na API." />;
  }

  if (error || !data?.profile) {
    return <StatusView title="Falha ao carregar perfil" description={error?.message || "Perfil indisponivel."} />;
  }

  const profile = data.profile;

  return (
    <div className="pagina-perfil">
      <div className="pagina-perfil__grade">
        <div className="cartao-perfil">
          <div className="cartao-perfil__capa" />
          <div className="cartao-perfil__corpo">
            <div className="cartao-perfil__avatar-wrapper">
              <div className="cartao-perfil__avatar">
                <span className="cartao-perfil__avatar-inicial">
                  {(profile.nome ?? "IC").split(" ").slice(0, 2).map((part) => part[0]).join("")}
                </span>
              </div>
            </div>

            <h2 className="cartao-perfil__nome">{profile.nome}</h2>
            <p className="cartao-perfil__tipo">{formatUserType(profile.tipo)}</p>
            <p className="cartao-perfil__instituicao">{profile.instituicao ?? "Instituicao nao informada"}</p>

            <div className="cartao-perfil__estatisticas">
              {[
                { label: "Projetos", value: approvedApps },
                { label: "Inscricoes", value: data.applications.length },
                { label: "Tipo", value: formatUserType(profile.tipo) },
              ].map((item) => (
                <div key={item.label} className="cartao-perfil__stat">
                  <p className="cartao-perfil__stat-valor">{item.value}</p>
                  <p className="cartao-perfil__stat-label">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="cartao-perfil__info-lista">
              {[
                { icon: Mail, label: profile.email },
                { icon: BookOpen, label: profile.curso ?? "Curso nao informado" },
                { icon: Building2, label: profile.instituicao ?? "Instituicao nao informada" },
                { icon: GraduationCap, label: profile.semestre ?? "Semestre nao informado" },
                { icon: Calendar, label: "Conta autenticada via API" },
              ].map((item) => (
                <div key={item.label} className="cartao-perfil__info-item">
                  <item.icon size={14} className="cartao-perfil__info-icone" />
                  <span className="cartao-perfil__info-texto">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pagina-perfil__conteudo-principal">
          <div className="secao-perfil">
            <div className="secao-perfil__cabecalho">
              <h3 className="secao-perfil__titulo">Informacoes do perfil</h3>
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
                  <button onClick={handleSave} disabled={loadingSave} className="secao-perfil__botao-salvar">
                    {loadingSave ? <div className="secao-perfil__spinner" /> : <Save size={14} />}
                    Salvar
                  </button>
                </div>
              )}
            </div>

            <div className="secao-perfil__grade-campos">
              {[
                { label: "Nome completo", value: form.nome, icon: User, field: "nome" },
                { label: "E-mail", value: form.email, icon: Mail, field: "email" },
                { label: "Curso", value: form.curso, icon: BookOpen, field: "curso" },
                { label: "Instituicao", value: form.instituicao, icon: Building2, field: "instituicao" },
                { label: "Semestre", value: form.semestre, icon: GraduationCap, field: "semestre" },
                { label: "Tipo", value: formatUserType(profile.tipo), icon: Award, field: null },
              ].map((field) => (
                <div key={field.label}>
                  <label className="campo-perfil__label">{field.label}</label>
                  <div className="campo-perfil__wrapper">
                    <field.icon size={14} className="campo-perfil__icone" />
                    <input
                      type="text"
                      value={field.value}
                      disabled={!editing || !field.field}
                      onChange={(e) => field.field && setForm((prev) => ({ ...prev, [field.field]: e.target.value }))}
                      className={`campo-perfil__input ${editing && field.field ? "campo-perfil__input--editando" : "campo-perfil__input--leitura"}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "var(--espaco-4)" }}>
              <label className="campo-perfil__label">Biografia</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                disabled={!editing}
                rows={3}
                className={`campo-perfil__bio ${editing ? "campo-perfil__bio--editando" : "campo-perfil__bio--leitura"}`}
              />
            </div>
          </div>

          <div className="secao-perfil">
            <h3 className="secao-perfil__titulo">Historico academico</h3>
            <div className="historico-academico__lista">
              {data.applications.length === 0 ? (
                <StatusView title="Sem historico" description="Suas inscricoes e aprovacoes aparecerao aqui." />
              ) : (
                data.applications.map((application) => (
                  <div key={application.id} className="historico-item">
                    <div className="historico-item__icone-area">
                      <Award size={18} style={{ color: "var(--cor-primaria)" }} />
                    </div>
                    <div className="historico-item__info">
                      <p className="historico-item__titulo">{application.project?.title ?? "Projeto"}</p>
                      <p className="historico-item__meta">
                        {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString("pt-BR") : "-"} · {application.project?.area ?? "Area nao informada"}
                      </p>
                    </div>
                    <span className="historico-item__etiqueta historico-item__etiqueta--aprovado">
                      {formatApplicationStatus(application.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
