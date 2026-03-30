import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { FlaskConical, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("lucas.mendes@universidade.br");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-violet-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
            <FlaskConical size={18} className="text-white" />
          </div>
          <span className="text-white" style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "'Poppins', sans-serif" }}>IniCiência</span>
        </Link>
        <div className="relative z-10">
          <h2 className="text-white mb-4" style={{ fontSize: "2.2rem", fontWeight: 700, lineHeight: 1.2, fontFamily: "'Poppins', sans-serif" }}>
            Bem-vindo de volta à sua plataforma de pesquisa
          </h2>
          <p className="text-blue-100" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
            Gerencie seus projetos de iniciação científica, comunique-se com orientadores e acompanhe seu progresso.
          </p>
          <div className="mt-10 space-y-4">
            {["Acesse seus projetos ativos", "Verifique o status das inscrições", "Converse com seu orientador"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-blue-100">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={12} className="text-white" />
                </div>
                <span style={{ fontSize: "0.9rem" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-200 relative z-10" style={{ fontSize: "0.8rem" }}>© 2025 IniCiência. Todos os direitos reservados.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2.5 mb-10 lg:hidden justify-center">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
              <FlaskConical size={18} className="text-white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "'Poppins', sans-serif" }}>IniCiência</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-gray-900 mb-2" style={{ fontWeight: 700, fontSize: "1.6rem" }}>Entrar na plataforma</h1>
            <p className="text-gray-500" style={{ fontSize: "0.875rem" }}>Digite suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontSize: "0.875rem", fontWeight: 500 }}>E-mail institucional</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400" placeholder="seu@universidade.br" style={{ fontSize: "0.875rem" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-700" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Senha</label>
                <a href="#" className="text-blue-600 hover:text-blue-700" style={{ fontSize: "0.8rem" }}>Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900" placeholder="••••••••" style={{ fontSize: "0.875rem" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded text-blue-600" defaultChecked />
              <label htmlFor="remember" className="text-gray-600" style={{ fontSize: "0.875rem" }}>Manter conectado</label>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Entrando...</>
              ) : (
                <>Entrar <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400" style={{ fontSize: "0.8rem" }}>ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button onClick={() => navigate("/app")} className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2" style={{ fontSize: "0.875rem" }}>
            <span>🎓</span> Acessar como demonstração
          </button>

          <p className="text-center text-gray-500 mt-6" style={{ fontSize: "0.875rem" }}>
            Não tem conta?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700" style={{ fontWeight: 600 }}>Cadastre-se grátis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
