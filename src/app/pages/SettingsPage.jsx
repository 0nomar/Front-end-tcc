import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Bell, Shield, User, GraduationCap, Briefcase, Palette, LogOut, Lock } from "lucide-react";
import { currentUser } from "../data/mockData";
import "./SettingsPage.css";

const cardEnter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [form, setForm] = useState({
    nome: currentUser.name,
    email: currentUser.email,
    departamento: "Departamento de Computacao",
    titulacao: "Doutorado",
    curso: currentUser.course || "",
    semestre: currentUser.semester || "",
    senhaAtual: "",
    senhaNova: "",
    confirmarSenha: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const handleInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    if (!form.nome.trim() || !form.email.trim()) {
      toast.error("Preencha nome e email antes de salvar.");
      return;
    }
    toast.success("Configuracoes salvas com sucesso.");
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
    toast.success("Senha alterada com sucesso.");
    setOpenPasswordModal(false);
    setForm((prev) => ({ ...prev, senhaAtual: "", senhaNova: "", confirmarSenha: "" }));
  };

  const handleLogout = () => {
    toast.success("Sessao encerrada.");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="pagina-configuracoes--carregando">
        <div className="pagina-configuracoes__skeleton" style={{ height: "7rem" }} />
        <div className="pagina-configuracoes__skeleton" style={{ height: "10rem" }} />
        <div className="pagina-configuracoes__skeleton" style={{ height: "10rem" }} />
      </div>
    );
  }

  return (
    <div className="pagina-configuracoes">
      {/* Perfil */}
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpenPasswordModal(true)}
              className="secao-config__botao secao-config__botao--neutro"
            >
              Alterar senha
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Dados acadêmicos (aluno) */}
      {currentUser.type === "student" && (
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
      )}

      {/* Orientador */}
      {(currentUser.type === "advisor" || currentUser.type === "student") && (
        <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.08 }} className="secao-config">
          <div className="secao-config__titulo-linha">
            <Briefcase size={18} className="secao-config__icone" />
            <h3 className="secao-config__titulo">Orientador</h3>
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
      )}

      {/* Notificações */}
      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.12 }} className="secao-config">
        <div className="secao-config__titulo-linha">
          <Bell size={18} className="secao-config__icone" />
          <h3 className="secao-config__titulo">Notificacoes</h3>
        </div>
        <div className="secao-config__toggle-linha">
          <p className="secao-config__toggle-label">Ativar/desativar notificacoes</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setNotificationsEnabled((prev) => !prev)}
            className={`toggle ${notificationsEnabled ? "toggle--ativo" : "toggle--inativo"}`}
          >
            <span className={`toggle__bolinha ${notificationsEnabled ? "toggle__bolinha--ativa" : "toggle__bolinha--inativa"}`} />
          </motion.button>
        </div>
      </motion.section>

      {/* Aparência */}
      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.16 }} className="secao-config">
        <div className="secao-config__titulo-linha">
          <Palette size={18} className="secao-config__icone" />
          <h3 className="secao-config__titulo">Aparencia</h3>
        </div>
        <div className="secao-config__toggle-linha">
          <p className="secao-config__toggle-label">Tema escuro (opcional)</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDarkTheme((prev) => !prev)}
            className={`toggle ${darkTheme ? "toggle--ativo" : "toggle--inativo"}`}
          >
            <span className={`toggle__bolinha ${darkTheme ? "toggle__bolinha--ativa" : "toggle__bolinha--inativa"}`} />
          </motion.button>
        </div>
      </motion.section>

      {/* Segurança */}
      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.2 }} className="secao-config">
        <div className="secao-config__titulo-linha">
          <Shield size={18} className="secao-config__icone" />
          <h3 className="secao-config__titulo">Seguranca</h3>
        </div>
        <div className="secao-config__acoes">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpenPasswordModal(true)}
            className="secao-config__botao secao-config__botao--neutro"
          >
            Alterar senha
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="secao-config__botao secao-config__botao--perigo"
          >
            <span className="secao-config__botao-logout-conteudo">
              <LogOut size={15} />
              Logout
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={saveProfile}
            className="secao-config__botao secao-config__botao--primario"
          >
            Salvar alteracoes
          </motion.button>
        </div>
      </motion.section>

      {/* Modal de senha */}
      <AnimatePresence>
        {openPasswordModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="modal-senha__sobreposicao"
              onClick={() => setOpenPasswordModal(false)}
            />
            <motion.div className="modal-senha__centralizador">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.25 }}
                className="modal-senha__painel"
              >
                <div className="modal-senha__titulo-linha">
                  <Lock size={16} className="secao-config__icone" />
                  <h4 className="modal-senha__titulo">Alterar senha</h4>
                </div>
                <div className="modal-senha__campos">
                  <input
                    type="password"
                    placeholder="Senha atual"
                    value={form.senhaAtual}
                    onChange={(e) => handleInput("senhaAtual", e.target.value)}
                    className="modal-senha__input"
                  />
                  <input
                    type="password"
                    placeholder="Nova senha"
                    value={form.senhaNova}
                    onChange={(e) => handleInput("senhaNova", e.target.value)}
                    className="modal-senha__input"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={form.confirmarSenha}
                    onChange={(e) => handleInput("confirmarSenha", e.target.value)}
                    className="modal-senha__input"
                  />
                </div>
                <div className="modal-senha__acoes">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setOpenPasswordModal(false)}
                    className="modal-senha__botao-cancelar"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={changePassword}
                    className="modal-senha__botao-confirmar"
                  >
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
