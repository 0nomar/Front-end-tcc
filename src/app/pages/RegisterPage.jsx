import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { FlaskConical, Eye, EyeOff, Mail, Lock, User, Building2, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import "./RegisterPage.css";

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
    <div className="pagina-cadastro">
      <div className="pagina-cadastro__container">
        {/* Cabeçalho */}
        <div className="pagina-cadastro__cabecalho">
          <Link to="/" className="pagina-cadastro__logo-link">
            <div className="pagina-cadastro__logo-icone">
              <FlaskConical size={18} style={{ color: "white" }} />
            </div>
            <span className="pagina-cadastro__logo-nome">IniCiência</span>
          </Link>
          <h1 className="pagina-cadastro__titulo">Criar sua conta</h1>
          <p className="pagina-cadastro__subtitulo">Junte-se à plataforma de iniciação científica</p>
        </div>

        {/* Progresso */}
        <div className="pagina-cadastro__progresso">
          {[1, 2, 3].map((s) => (
            <div key={s} className="pagina-cadastro__passo">
              <div className={`pagina-cadastro__circulo-passo ${s <= step ? "pagina-cadastro__circulo-passo--ativo" : "pagina-cadastro__circulo-passo--inativo"}`}>
                {s < step ? <CheckCircle size={14} /> : s}
              </div>
              <span className={`pagina-cadastro__label-passo ${s === step ? "pagina-cadastro__label-passo--ativo" : "pagina-cadastro__label-passo--inativo"}`}>
                {s === 1 ? "Tipo de conta" : s === 2 ? "Dados pessoais" : "Informações acadêmicas"}
              </span>
              {s < 3 && <div className={`pagina-cadastro__linha-passo ${s < step ? "pagina-cadastro__linha-passo--ativa" : "pagina-cadastro__linha-passo--inativa"}`} />}
            </div>
          ))}
        </div>

        {/* Painel */}
        <div className="pagina-cadastro__painel">
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="cadastro-step__titulo">Como você vai usar a plataforma?</h2>
                <p className="cadastro-step__subtitulo">Escolha o tipo de conta que melhor descreve seu papel.</p>
                <div className="cadastro-tipo__grade">
                  {["student", "advisor"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserType(type)}
                      className={`cadastro-tipo__opcao ${userType === type ? "cadastro-tipo__opcao--selecionado" : "cadastro-tipo__opcao--disponivel"}`}
                    >
                      <span className="cadastro-tipo__emoji">{type === "student" ? "🎓" : "🔬"}</span>
                      <span className={`cadastro-tipo__nome ${userType === type ? "cadastro-tipo__nome--selecionado" : "cadastro-tipo__nome--disponivel"}`}>
                        {type === "student" ? "Aluno" : "Orientador"}
                      </span>
                      <span className={`cadastro-tipo__descricao ${userType === type ? "cadastro-tipo__descricao--selecionado" : "cadastro-tipo__descricao--disponivel"}`}>
                        {type === "student" ? "Busco projetos de IC para participar" : "Tenho projetos e quero orientar alunos"}
                      </span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={handleNext} className="cadastro-step__botao-continuar">
                  Continuar <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="cadastro-step__titulo">Dados pessoais</h2>
                <p className="cadastro-step__subtitulo">Preencha suas informações básicas.</p>
                <div className="cadastro-campos">
                  <div>
                    <label className="campo-cadastro__label">Nome completo</label>
                    <div className="campo-cadastro__wrapper">
                      <User size={16} className="campo-cadastro__icone-esquerda" />
                      <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="campo-cadastro__input" placeholder="Seu nome completo" required />
                    </div>
                  </div>
                  <div>
                    <label className="campo-cadastro__label">E-mail institucional</label>
                    <div className="campo-cadastro__wrapper">
                      <Mail size={16} className="campo-cadastro__icone-esquerda" />
                      <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="campo-cadastro__input" placeholder="seu@universidade.br" required />
                    </div>
                  </div>
                  <div>
                    <label className="campo-cadastro__label">Senha</label>
                    <div className="campo-cadastro__wrapper">
                      <Lock size={16} className="campo-cadastro__icone-esquerda" />
                      <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} className="campo-cadastro__input" placeholder="Mínimo 8 caracteres" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="campo-cadastro__botao-senha">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="campo-cadastro__label">Confirmar senha</label>
                    <div className="campo-cadastro__wrapper">
                      <Lock size={16} className="campo-cadastro__icone-esquerda" />
                      <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} className="campo-cadastro__input" placeholder="Repita a senha" required />
                    </div>
                  </div>
                </div>
                <div className="cadastro-step__acoes">
                  <button type="button" onClick={() => setStep(1)} className="cadastro-step__botao-voltar">Voltar</button>
                  <button type="button" onClick={handleNext} className="cadastro-step__botao-avancar">
                    Continuar <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 className="cadastro-step__titulo">Informações acadêmicas</h2>
                <p className="cadastro-step__subtitulo">Ajude-nos a personalizar sua experiência.</p>
                <div className="cadastro-campos">
                  <div>
                    <label className="campo-cadastro__label">Instituição de ensino</label>
                    <div className="campo-cadastro__wrapper">
                      <Building2 size={16} className="campo-cadastro__icone-esquerda" />
                      <select value={form.institution} onChange={(e) => update("institution", e.target.value)} className="campo-cadastro__select" required>
                        <option value="">Selecione sua instituição</option>
                        {institutions.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="campo-cadastro__label">{userType === "student" ? "Curso" : "Departamento"}</label>
                    <div className="campo-cadastro__wrapper">
                      <BookOpen size={16} className="campo-cadastro__icone-esquerda" />
                      <select
                        value={userType === "student" ? form.course : form.department}
                        onChange={(e) => update(userType === "student" ? "course" : "department", e.target.value)}
                        className="campo-cadastro__select"
                        required
                      >
                        <option value="">Selecione {userType === "student" ? "o curso" : "o departamento"}</option>
                        {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  {userType === "student" && (
                    <div>
                      <label className="campo-cadastro__label">Semestre atual</label>
                      <select value={form.semester} onChange={(e) => update("semester", e.target.value)} className="campo-cadastro__select--sem-icone">
                        <option value="">Selecione o semestre</option>
                        {[1,2,3,4,5,6,7,8,9,10].map((s) => <option key={s} value={`${s}º Semestre`}>{s}º Semestre</option>)}
                      </select>
                    </div>
                  )}
                  <div className="campo-cadastro__termos">
                    <input type="checkbox" id="terms" className="campo-cadastro__checkbox" required />
                    <label htmlFor="terms" className="campo-cadastro__termos-texto">
                      Concordo com os <a href="#" className="campo-cadastro__termos-link">Termos de Uso</a> e a <a href="#" className="campo-cadastro__termos-link">Política de Privacidade</a>
                    </label>
                  </div>
                </div>
                <div className="cadastro-step__acoes">
                  <button type="button" onClick={() => setStep(2)} className="cadastro-step__botao-voltar">Voltar</button>
                  <button type="submit" disabled={loading} className="cadastro-step__botao-enviar">
                    {loading ? <div className="cadastro-step__spinner" /> : <>Criar conta <ArrowRight size={15} /></>}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="pagina-cadastro__rodape">
          Já tem conta?{" "}
          <Link to="/login" className="pagina-cadastro__link-login">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
