import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { FlaskConical, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import "./LoginPage.css";

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
    <div className="pagina-login">
      {/* Painel esquerdo */}
      <div className="pagina-login__painel-esquerdo">
        <div className="pagina-login__decoracao-esquerda">
          <div className="pagina-login__decoracao-circulo-topo" />
          <div className="pagina-login__decoracao-circulo-base" />
        </div>
        <Link to="/" className="pagina-login__logo-esquerda">
          <div className="pagina-login__logo-icone-area">
            <FlaskConical size={18} style={{ color: "var(--cor-branco)" }} />
          </div>
          <span className="pagina-login__logo-nome">IniCiência</span>
        </Link>
        <div className="pagina-login__conteudo-esquerdo">
          <h2 className="pagina-login__titulo-esquerdo">
            Bem-vindo de volta à sua plataforma de pesquisa
          </h2>
          <p className="pagina-login__descricao-esquerda">
            Gerencie seus projetos de iniciação científica, comunique-se com orientadores e acompanhe seu progresso.
          </p>
          <div className="pagina-login__lista-beneficios">
            {["Acesse seus projetos ativos", "Verifique o status das inscrições", "Converse com seu orientador"].map((item) => (
              <div key={item} className="pagina-login__item-beneficio">
                <div className="pagina-login__icone-beneficio">
                  <ArrowRight size={12} style={{ color: "var(--cor-branco)" }} />
                </div>
                <span className="pagina-login__texto-beneficio">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="pagina-login__rodape-esquerdo">© 2025 IniCiência. Todos os direitos reservados.</p>
      </div>

      {/* Painel direito */}
      <div className="pagina-login__painel-direito">
        <div className="pagina-login__formulario-area">
          <Link to="/" className="pagina-login__logo-mobile">
            <div className="pagina-login__logo-icone-mobile">
              <FlaskConical size={18} style={{ color: "var(--cor-branco)" }} />
            </div>
            <span className="pagina-login__logo-nome-mobile">IniCiência</span>
          </Link>

          <div className="pagina-login__cabecalho">
            <h1 className="pagina-login__titulo">Entrar na plataforma</h1>
            <p className="pagina-login__subtitulo">Digite suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleLogin} className="pagina-login__form">
            <div>
              <label className="campo-formulario__rotulo">E-mail institucional</label>
              <div className="campo-formulario__area-input">
                <Mail size={16} className="campo-formulario__icone-esquerda" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="campo-formulario__input"
                  placeholder="seu@universidade.br"
                />
              </div>
            </div>

            <div>
              <div className="campo-formulario__cabecalho">
                <label className="campo-formulario__rotulo" style={{ margin: 0 }}>Senha</label>
                <a href="#" className="campo-formulario__link-esqueceu">Esqueceu a senha?</a>
              </div>
              <div className="campo-formulario__area-input">
                <Lock size={16} className="campo-formulario__icone-esquerda" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="campo-formulario__input campo-formulario__input--com-icone-direita"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="campo-formulario__botao-visibilidade"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="campo-formulario__linha-checkbox">
              <input type="checkbox" id="remember" className="campo-formulario__checkbox" defaultChecked />
              <label htmlFor="remember" className="campo-formulario__rotulo-checkbox">Manter conectado</label>
            </div>

            <button type="submit" disabled={loading} className="pagina-login__botao-entrar">
              {loading ? (
                <><div className="pagina-login__spinner" /> Entrando...</>
              ) : (
                <>Entrar <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="pagina-login__divisor">
            <div className="pagina-login__divisor-linha" />
            <span className="pagina-login__divisor-texto">ou</span>
            <div className="pagina-login__divisor-linha" />
          </div>

          <button onClick={() => navigate("/app")} className="pagina-login__botao-demo">
            <span>🎓</span> Acessar como demonstração
          </button>

          <p className="pagina-login__link-cadastro">
            Não tem conta?{" "}
            <Link to="/register" className="pagina-login__link-cadastro-link">Cadastre-se grátis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
