import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { FlaskConical, Eye, EyeOff, Mail, Lock, User, Building2, BookOpen, ArrowRight, CheckCircle } from "lucide-react";

const courses = ["Ciência da Computação","Sistemas de Informação","Engenharia de Computação","Engenharia Elétrica","Física","Matemática","Biologia","Biomedicina","Medicina","Química","Psicologia","Administração","Outro"];
const institutions = ["Universidade Federal do Brasil (UFB)","Universidade Estadual de São Paulo (UNESP)","Universidade de São Paulo (USP)","Universidade Federal de Minas Gerais (UFMG)","Pontifícia Universidade Católica (PUC)","Outra"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", course: "", institution: "", semester: "", department: "" });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleNext = () => { if (step < 3) setStep(step + 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <FlaskConical size={18} className="text-white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "'Poppins', sans-serif" }}>IniCiência</span>
          </Link>
          <h1 className="text-gray-900 mb-2" style={{ fontWeight: 700, fontSize: "1.6rem" }}>Criar sua conta</h1>
          <p className="text-gray-500" style={{ fontSize: "0.875rem" }}>Junte-se à plataforma de iniciação científica</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${s <= step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`} style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                {s < step ? <CheckCircle size={14} /> : s}
              </div>
              <span className={`hidden sm:block ${s === step ? "text-blue-600" : "text-gray-400"}`} style={{ fontSize: "0.75rem", fontWeight: s === step ? 600 : 400 }}>
                {s === 1 ? "Tipo de conta" : s === 2 ? "Dados pessoais" : "Informações acadêmicas"}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 ${s < step ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-gray-900 mb-2" style={{ fontWeight: 600, fontSize: "1.1rem" }}>Como você vai usar a plataforma?</h2>
                <p className="text-gray-500 mb-6" style={{ fontSize: "0.875rem" }}>Escolha o tipo de conta que melhor descreve seu papel.</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {["student", "advisor"].map((type) => (
                    <button key={type} type="button" onClick={() => setUserType(type)} className={`p-5 rounded-2xl border-2 text-left transition-all ${userType === type ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
                      <div className="text-3xl mb-3">{type === "student" ? "🎓" : "🔬"}</div>
                      <p className={`${userType === type ? "text-blue-700" : "text-gray-800"}`} style={{ fontWeight: 600, fontSize: "0.9rem" }}>{type === "student" ? "Aluno" : "Orientador"}</p>
                      <p className={`mt-1 ${userType === type ? "text-blue-600" : "text-gray-500"}`} style={{ fontSize: "0.75rem" }}>{type === "student" ? "Busco projetos de IC para participar" : "Tenho projetos e quero orientar alunos"}</p>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={handleNext} className="w-full py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  Continuar <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-gray-900 mb-2" style={{ fontWeight: 600, fontSize: "1.1rem" }}>Dados pessoais</h2>
                <p className="text-gray-500 mb-6" style={{ fontSize: "0.875rem" }}>Preencha suas informações básicas.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Nome completo</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Seu nome completo" style={{ fontSize: "0.875rem" }} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>E-mail institucional</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="seu@universidade.br" style={{ fontSize: "0.875rem" }} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Senha</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Mínimo 8 caracteres" style={{ fontSize: "0.875rem" }} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Confirmar senha</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Repita a senha" style={{ fontSize: "0.875rem" }} required />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: "0.875rem" }}>Voltar</button>
                  <button type="button" onClick={handleNext} className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2" style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Continuar <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 className="text-gray-900 mb-2" style={{ fontWeight: 600, fontSize: "1.1rem" }}>Informações acadêmicas</h2>
                <p className="text-gray-500 mb-6" style={{ fontSize: "0.875rem" }}>Ajude-nos a personalizar sua experiência.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Instituição de ensino</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select value={form.institution} onChange={(e) => update("institution", e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none" style={{ fontSize: "0.875rem" }} required>
                        <option value="">Selecione sua instituição</option>
                        {institutions.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{userType === "student" ? "Curso" : "Departamento"}</label>
                    <div className="relative">
                      <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select value={userType === "student" ? form.course : form.department} onChange={(e) => update(userType === "student" ? "course" : "department", e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none" style={{ fontSize: "0.875rem" }} required>
                        <option value="">Selecione {userType === "student" ? "o curso" : "o departamento"}</option>
                        {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  {userType === "student" && (
                    <div>
                      <label className="block text-gray-700 mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Semestre atual</label>
                      <select value={form.semester} onChange={(e) => update("semester", e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" style={{ fontSize: "0.875rem" }}>
                        <option value="">Selecione o semestre</option>
                        {[1,2,3,4,5,6,7,8,9,10].map((s) => <option key={s} value={`${s}º Semestre`}>{s}º Semestre</option>)}
                      </select>
                    </div>
                  )}
                  <div className="flex items-start gap-2 pt-2">
                    <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 rounded text-blue-600" required />
                    <label htmlFor="terms" className="text-gray-500" style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>
                      Concordo com os <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a> e a <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: "0.875rem" }}>Voltar</button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70" style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Criar conta <ArrowRight size={15} /></>}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-gray-500 mt-6" style={{ fontSize: "0.875rem" }}>
          Já tem conta?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700" style={{ fontWeight: 600 }}>Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
