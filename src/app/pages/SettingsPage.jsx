import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Bell, Shield, User, GraduationCap, Briefcase, Palette, LogOut, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../providers/ThemeProvider";
import { userService } from "../services/userService";
import { StatusView } from "../components/StatusView";
import "./SettingsPage.css";

function SettingsSkeleton() {
  const Sk = ({ w = "100%", h = 14, r = "0.5rem" }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: r }} />
  );
  const Section = ({ rows = 4, iconW = 18 }) => (
    <div style={{ background: "var(--cor-superficie)", borderRadius: "var(--raio-grande)", border: "1px solid var(--cor-borda-clara)", padding: "var(--espaco-5)", marginBottom: "var(--espaco-4)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: "var(--espaco-4)" }}>
        <Sk w={iconW} h={iconW} r="50%" />
        <Sk w={100} h={16} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--espaco-4)" }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Sk w="40%" h={12} />
            <Sk w="100%" h={40} r="var(--raio-medio)" />
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ padding: "var(--espaco-4)" }}>
      <Section rows={4} />
      <Section rows={2} />
      <div style={{ background: "var(--cor-superficie)", borderRadius: "var(--raio-grande)", border: "1px solid var(--cor-borda-clara)", padding: "var(--espaco-5)", marginBottom: "var(--espaco-4)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: "var(--espaco-4)" }}>
          <Sk w={18} h={18} r="50%" />
          <Sk w={120} h={16} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Sk w={160} h={14} />
            <Sk w={120} h={12} />
          </div>
          <Sk w={48} h={26} r="var(--raio-completo)" />
        </div>
      </div>
    </div>
  );
}

const cardEnter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    departamento: "",
    titulacao: "",
    curso: "",
    semestre: "",
    senhaAtual: "",
    senhaNova: "",
    confirmarSenha: "",
  });

  useEffect(() => {
    if (!user?.id) return;
    userService
      .getById(user.id)
      .then((profile) => {
        setForm((prev) => ({
          ...prev,
          nome: profile.nome ?? "",
          email: profile.email ?? "",
          departamento: profile.departamento ?? "",
          titulacao: profile.titulacao ?? "",
          curso: profile.curso ?? "",
          semestre: profile.semestre ?? "",
        }));
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    if (!user?.id) return;
    setSaving(true);

    try {
      await userService.update(user.id, {
        nome: form.nome,
        email: form.email,
        departamento: form.departamento,
        titulacao: form.titulacao,
        curso: form.curso,
        semestre: form.semestre,
      });
      await refreshUser();
      toast.success("Configuracoes salvas com sucesso.");
    } catch (err) {
      toast.error(err.message || "Nao foi possivel salvar as configuracoes.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = () => {
    if (!form.senhaAtual || !form.senhaNova || !form.confirmarSenha) {
      toast.error("Preencha todos os campos de senha.");
      return;
    }
    if (form.senhaNova !== form.confirmarSenha) {
      toast.error("A confirmacao de senha nao confere.");
      return;
    }
    toast.info("O backend atual nao expoe rota de troca de senha. Mantive a interface preparada.");
    setOpenPasswordModal(false);
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="pagina-configuracoes">
      <motion.section {...cardEnter} className="secao-config">
        <div className="secao-config__titulo-linha">
          <User size={18} className="secao-config__icone" />
          <h3 className="secao-config__titulo">Perfil</h3>
        </div>
        <div className="secao-config__grade">
          <div>
            <label className="campo-config__label">Nome</label>
            <input value={form.nome} onChange={(e) => handleInput("nome", e.target.value)} className="campo-config__input" />
          </div>
          <div>
            <label className="campo-config__label">Email</label>
            <input value={form.email} onChange={(e) => handleInput("email", e.target.value)} className="campo-config__input" />
          </div>
          <div className="secao-config__campo-completo">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setOpenPasswordModal(true)} className="secao-config__botao secao-config__botao--neutro">
              Alterar senha
            </motion.button>
          </div>
        </div>
      </motion.section>

      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.05 }} className="secao-config">
        <div className="secao-config__titulo-linha">
          <GraduationCap size={18} className="secao-config__icone" />
          <h3 className="secao-config__titulo">Dados Academicos</h3>
        </div>
        <div className="secao-config__grade">
          <div>
            <label className="campo-config__label">Curso</label>
            <input value={form.curso} onChange={(e) => handleInput("curso", e.target.value)} className="campo-config__input" />
          </div>
          <div>
            <label className="campo-config__label">Semestre</label>
            <input value={form.semestre} onChange={(e) => handleInput("semestre", e.target.value)} className="campo-config__input" />
          </div>
        </div>
      </motion.section>

      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.08 }} className="secao-config">
        <div className="secao-config__titulo-linha">
          <Briefcase size={18} className="secao-config__icone" />
          <h3 className="secao-config__titulo">Informacoes profissionais</h3>
        </div>
        <div className="secao-config__grade">
          <div>
            <label className="campo-config__label">Departamento</label>
            <input value={form.departamento} onChange={(e) => handleInput("departamento", e.target.value)} className="campo-config__input" />
          </div>
          <div>
            <label className="campo-config__label">Titulacao</label>
            <input value={form.titulacao} onChange={(e) => handleInput("titulacao", e.target.value)} className="campo-config__input" />
          </div>
        </div>
      </motion.section>

      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.12 }} className="secao-config">
        <div className="secao-config__titulo-linha">
          <Bell size={18} className="secao-config__icone" />
          <h3 className="secao-config__titulo">Notificacoes</h3>
        </div>
        <div className="secao-config__toggle-linha">
          <p className="secao-config__toggle-label">Ativar/desativar notificacoes</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setNotificationsEnabled((prev) => !prev)} className={`toggle ${notificationsEnabled ? "toggle--ativo" : "toggle--inativo"}`}>
            <span className={`toggle__bolinha ${notificationsEnabled ? "toggle__bolinha--ativa" : "toggle__bolinha--inativa"}`} />
          </motion.button>
        </div>
      </motion.section>

      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.16 }} className="secao-config">
        <div className="secao-config__titulo-linha">
          <Palette size={18} className="secao-config__icone" />
          <h3 className="secao-config__titulo">Aparencia</h3>
        </div>
        <div className="secao-config__toggle-linha">
          <div>
            <p className="secao-config__toggle-label">Modo escuro</p>
            <p className="secao-config__toggle-ajuda">A preferencia fica salva no navegador e continua apos login e logout.</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={toggleTheme} className={`toggle ${isDark ? "toggle--ativo" : "toggle--inativo"}`} aria-pressed={isDark} aria-label="Alternar modo escuro">
            <span className={`toggle__bolinha ${isDark ? "toggle__bolinha--ativa" : "toggle__bolinha--inativa"}`} />
          </motion.button>
        </div>
      </motion.section>

      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.2 }} className="secao-config">
        <div className="secao-config__titulo-linha">
          <Shield size={18} className="secao-config__icone" />
          <h3 className="secao-config__titulo">Seguranca</h3>
        </div>
        <div className="secao-config__acoes">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setOpenPasswordModal(true)} className="secao-config__botao secao-config__botao--neutro">
            Alterar senha
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={logout} className="secao-config__botao secao-config__botao--perigo">
            <span className="secao-config__botao-logout-conteudo">
              <LogOut size={15} />
              Logout
            </span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={saveProfile} disabled={saving} className="secao-config__botao secao-config__botao--primario">
            {saving ? "Salvando..." : "Salvar alteracoes"}
          </motion.button>
        </div>
      </motion.section>

      <AnimatePresence>
        {openPasswordModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="modal-senha__sobreposicao" onClick={() => setOpenPasswordModal(false)} />
            <motion.div className="modal-senha__centralizador">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }} transition={{ duration: 0.25 }} className="modal-senha__painel">
                <div className="modal-senha__titulo-linha">
                  <Lock size={16} className="secao-config__icone" />
                  <h4 className="modal-senha__titulo">Alterar senha</h4>
                </div>
                <div className="modal-senha__campos">
                  <input type="password" placeholder="Senha atual" value={form.senhaAtual} onChange={(e) => handleInput("senhaAtual", e.target.value)} className="modal-senha__input" />
                  <input type="password" placeholder="Nova senha" value={form.senhaNova} onChange={(e) => handleInput("senhaNova", e.target.value)} className="modal-senha__input" />
                  <input type="password" placeholder="Confirmar nova senha" value={form.confirmarSenha} onChange={(e) => handleInput("confirmarSenha", e.target.value)} className="modal-senha__input" />
                </div>
                <div className="modal-senha__acoes">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setOpenPasswordModal(false)} className="modal-senha__botao-cancelar">
                    Cancelar
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={changePassword} className="modal-senha__botao-confirmar">
                    Confirmar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
