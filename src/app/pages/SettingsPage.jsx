import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Bell, Shield, User, GraduationCap, Briefcase, Palette, LogOut, Lock } from "lucide-react";
import { currentUser } from "../data/mockData";

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
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-white border border-gray-100 rounded-2xl" />
        <div className="h-40 bg-white border border-gray-100 rounded-2xl" />
        <div className="h-40 bg-white border border-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.section {...cardEnter} className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-blue-600" />
          <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>Perfil</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1.5 text-sm">Nome</label>
            <input
              value={form.nome}
              onChange={(e) => handleInput("nome", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1.5 text-sm">Email</label>
            <input
              value={form.email}
              onChange={(e) => handleInput("email", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpenPasswordModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Alterar senha
            </motion.button>
          </div>
        </div>
      </motion.section>

      {currentUser.type === "student" && (
        <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.05 }} className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={18} className="text-blue-600" />
            <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>Dados Academicos</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1.5 text-sm">Curso</label>
              <input
                value={form.curso}
                onChange={(e) => handleInput("curso", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1.5 text-sm">Semestre</label>
              <input
                value={form.semestre}
                onChange={(e) => handleInput("semestre", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.section>
      )}

      {(currentUser.type === "advisor" || currentUser.type === "student") && (
        <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.08 }} className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={18} className="text-blue-600" />
            <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>Orientador</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1.5 text-sm">Departamento</label>
              <input
                value={form.departamento}
                onChange={(e) => handleInput("departamento", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1.5 text-sm">Titulacao</label>
              <input
                value={form.titulacao}
                onChange={(e) => handleInput("titulacao", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.section>
      )}

      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.12 }} className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-blue-600" />
          <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>Notificacoes</h3>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">Ativar/desativar notificacoes</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setNotificationsEnabled((prev) => !prev)}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${notificationsEnabled ? "bg-blue-600" : "bg-gray-300"}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${notificationsEnabled ? "translate-x-5" : "translate-x-0"}`} />
          </motion.button>
        </div>
      </motion.section>

      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.16 }} className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={18} className="text-blue-600" />
          <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>Aparencia</h3>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">Tema escuro (opcional)</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDarkTheme((prev) => !prev)}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${darkTheme ? "bg-blue-600" : "bg-gray-300"}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${darkTheme ? "translate-x-5" : "translate-x-0"}`} />
          </motion.button>
        </div>
      </motion.section>

      <motion.section {...cardEnter} transition={{ duration: 0.3, delay: 0.2 }} className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-blue-600" />
          <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1rem" }}>Seguranca</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpenPasswordModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Alterar senha
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
          >
            <span className="inline-flex items-center gap-2">
              <LogOut size={15} />
              Logout
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={saveProfile}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Salvar alteracoes
          </motion.button>
        </div>
      </motion.section>

      <AnimatePresence>
        {openPasswordModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setOpenPasswordModal(false)}
            />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-5 md:p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lock size={16} className="text-blue-600" />
                  <h4 className="text-gray-900" style={{ fontWeight: 700 }}>Alterar senha</h4>
                </div>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Senha atual"
                    value={form.senhaAtual}
                    onChange={(e) => handleInput("senhaAtual", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Nova senha"
                    value={form.senhaNova}
                    onChange={(e) => handleInput("senhaNova", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={form.confirmarSenha}
                    onChange={(e) => handleInput("confirmarSenha", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setOpenPasswordModal(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={changePassword}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
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
