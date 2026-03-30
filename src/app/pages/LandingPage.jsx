import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FlaskConical, Search, FileText, TrendingUp, MessageSquare,
  CheckCircle, ArrowRight, Star, Users, Zap, Shield,
  Globe, Menu, X, GraduationCap, Award,
} from "lucide-react";

const navItems = [
  { label: "Problema", id: "problema" },
  { label: "Solucao", id: "solucao" },
  { label: "Funcionalidades", id: "funcionalidades" },
  { label: "Como Funciona", id: "como-funciona" },
];

const features = [
  { icon: Search, title: "Busca Inteligente de Projetos", description: "Encontre projetos alinhados ao seu perfil com filtros por area, curso e bolsa disponivel.", color: "blue" },
  { icon: FileText, title: "Inscricao 100% Online", description: "Candidate-se a projetos, envie documentos e acompanhe tudo em um unico lugar.", color: "violet" },
  { icon: TrendingUp, title: "Acompanhamento de Progresso", description: "Visualize marcos, entregas e evolucao do projeto com timelines interativas.", color: "emerald" },
  { icon: MessageSquare, title: "Chat com Orientadores", description: "Comunicacao direta e agil com seu orientador sem precisar de e-mails.", color: "orange" },
  { icon: Star, title: "Sistema de Feedback", description: "Receba avaliacoes detalhadas e construtivas ao longo da pesquisa.", color: "yellow" },
  { icon: Shield, title: "Gestao de Documentos", description: "Faca upload e gerencie todos os seus documentos academicos com seguranca.", color: "pink" },
];

const steps = [
  { number: "01", title: "Crie sua conta", description: "Cadastre-se como aluno ou orientador e complete seu perfil academico." },
  { number: "02", title: "Explore e candidate-se", description: "Busque projetos por area de interesse e envie sua candidatura online." },
  { number: "03", title: "Desenvolva sua pesquisa", description: "Acompanhe o progresso, comunique-se com seu orientador e entregue resultados." },
];

const benefits = {
  students: [
    "Acesso centralizado a projetos de IC",
    "Candidatura simples e rapida",
    "Comunicacao direta com orientadores",
    "Acompanhamento do seu progresso",
    "Feedback estruturado e construtivo",
    "Gestao de documentos integrada",
  ],
  advisors: [
    "Publicacao e gestao de projetos",
    "Selecao eficiente de candidatos",
    "Comunicacao centralizada",
    "Monitoramento de alunos em tempo real",
    "Emissao de feedbacks organizados",
    "Relatorios e metricas de progresso",
  ],
};

const stats = [
  { value: "500+", label: "Projetos publicados" },
  { value: "2.400+", label: "Alunos inscritos" },
  { value: "180+", label: "Orientadores ativos" },
  { value: "94%", label: "Taxa de satisfacao" },
];

const sectionFadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const buttonMotion = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.97 },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-shadow ${isScrolled ? "shadow-sm" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <FlaskConical size={18} className="text-white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "'Poppins', sans-serif", color: "#111" }}>IniCiencia</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-gray-500 hover:text-gray-900 transition-colors" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <motion.button {...buttonMotion} onClick={() => navigate("/login")} className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              Entrar
            </motion.button>
            <motion.button {...buttonMotion} onClick={() => navigate("/register")} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              Criar conta
            </motion.button>
          </div>

          <motion.button {...buttonMotion} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block py-2 text-gray-600 hover:text-gray-900"
                style={{ fontSize: "0.875rem" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <motion.button {...buttonMotion} onClick={() => navigate("/login")} className="w-full py-2.5 border border-gray-200 rounded-xl text-gray-700" style={{ fontSize: "0.875rem" }}>Entrar</motion.button>
              <motion.button {...buttonMotion} onClick={() => navigate("/register")} className="w-full py-2.5 bg-blue-600 text-white rounded-xl" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Criar conta gratis</motion.button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div
          aria-hidden
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50 to-violet-50 rounded-full opacity-50 translate-x-1/3 -translate-y-1/4 blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full opacity-40 -translate-x-1/3 translate-y-1/4 blur-3xl"
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex-1 text-center lg:text-left w-full"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-8 border border-blue-100">
                <Zap size={14} className="text-blue-600" />
                <span className="text-blue-700" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Plataforma #1 para Iniciacao Cientifica</span>
              </div>

              <h1 className="text-gray-900 mb-6 leading-tight" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, fontFamily: "'Poppins', sans-serif" }}>
                Sua pesquisa comeca{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">aqui.</span>
              </h1>

              <p className="text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0" style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                A plataforma completa para alunos encontrarem projetos de iniciacao cientifica e orientadores gerirem suas pesquisas de forma simples e eficiente.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button {...buttonMotion} onClick={() => navigate("/register")} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                  Criar conta gratis <ArrowRight size={18} />
                </motion.button>
                <motion.button {...buttonMotion} onClick={() => navigate("/login")} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                  Fazer login
                </motion.button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                {["Gratuito para estudantes", "Seguro e confiavel", "Suporte ativo"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-gray-500" style={{ fontSize: "0.8rem" }}>
                    <CheckCircle size={14} className="text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex-1 w-full max-w-xl lg:max-w-none"
            >
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="relative">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-full">
                  <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="flex-1 mx-4 h-6 bg-gray-100 rounded-lg flex items-center px-3">
                      <span className="text-gray-400" style={{ fontSize: "0.7rem" }}>app.iniciacao.edu.br</span>
                    </div>
                  </div>
                  <div className="flex h-64">
                    <div className="w-14 bg-white border-r border-gray-50 flex flex-col items-center py-3 gap-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                        <FlaskConical size={12} className="text-white" />
                      </div>
                      {[true, false, false, false].map((active, i) => (
                        <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                          <div className={`w-3 h-3 rounded-sm ${active ? "bg-blue-500" : "bg-gray-300"}`} />
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 p-4 bg-gray-50 min-w-0">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {[
                          { label: "Projetos ativos", value: "1", color: "blue" },
                          { label: "Inscricoes", value: "3", color: "violet" },
                          { label: "Mensagens", value: "2", color: "emerald" },
                          { label: "Notificacoes", value: "3", color: "orange" },
                        ].map((s) => (
                          <div key={s.label} className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100">
                            <p className="text-gray-400" style={{ fontSize: "0.55rem" }}>{s.label}</p>
                            <p className={`text-${s.color}-600`} style={{ fontSize: "1rem", fontWeight: 700 }}>{s.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700" style={{ fontSize: "0.65rem", fontWeight: 600 }}>Projeto NLP</span>
                          <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full" style={{ fontSize: "0.55rem" }}>Aprovado</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                        </div>
                        <p className="text-gray-400 mt-1" style={{ fontSize: "0.55rem" }}>35% concluido</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-2 md:-left-6 top-1/4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-800" style={{ fontSize: "0.7rem", fontWeight: 600 }}>Inscricao aprovada!</p>
                      <p className="text-gray-400" style={{ fontSize: "0.6rem" }}>Projeto NLP - agora</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-2 md:-right-4 bottom-1/4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MessageSquare size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-800" style={{ fontSize: "0.7rem", fontWeight: 600 }}>Nova mensagem</p>
                      <p className="text-gray-400" style={{ fontSize: "0.6rem" }}>Prof. Ana Carolina</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section variants={sectionFadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="py-14 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-gray-900 mb-1" style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
                <p className="text-gray-500" style={{ fontSize: "0.875rem" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="problema" variants={sectionFadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 rounded-full mb-4" style={{ fontSize: "0.8rem", fontWeight: 600 }}>O Problema</span>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
              A iniciacao cientifica ainda e <span className="text-red-500">caotica</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto" style={{ fontSize: "1rem", lineHeight: 1.7 }}>
              Hoje, o processo envolve e-mails dispersos, planilhas desatualizadas e comunicacoes confusas.
            </p>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "📧", title: "E-mails e planilhas", desc: "Processos seletivos gerenciados por e-mail, causando perda de informacoes e atrasos." },
              { emoji: "🔍", title: "Falta de visibilidade", desc: "Alunos nao sabem quais projetos estao disponiveis ou como candidatar-se." },
              { emoji: "📋", title: "Acompanhamento manual", desc: "Sem sistema centralizado, progresso e feedbacks ficam perdidos ou esquecidos." },
            ].map((item) => (
              <motion.div key={item.title} variants={itemFadeUp} whileHover={{ scale: 1.03, boxShadow: "0 16px 28px rgba(220,38,38,0.12)" }} className="p-6 bg-red-50 rounded-2xl border border-red-100">
                <div className="text-3xl mb-4">{item.emoji}</div>
                <h3 className="text-gray-900 mb-2" style={{ fontWeight: 600, fontSize: "1rem" }}>{item.title}</h3>
                <p className="text-gray-500" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="solucao" variants={sectionFadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full mb-6" style={{ fontSize: "0.8rem", fontWeight: 600 }}>A Solucao</span>
          <h2 className="text-white mb-6" style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>Uma plataforma feita para a pesquisa academica</h2>
          <p className="text-blue-100 max-w-3xl mx-auto mb-12" style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
            O <strong className="text-white">IniCiencia</strong> centraliza todo o ecossistema de iniciacao cientifica.
          </p>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Users, label: "Para alunos e orientadores" },
              { icon: Globe, label: "100% online e acessivel" },
              { icon: Zap, label: "Rapido e facil de usar" },
            ].map((item) => (
              <motion.div key={item.label} variants={itemFadeUp} whileHover={{ scale: 1.03, boxShadow: "0 12px 26px rgba(255,255,255,0.2)" }} className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-4 text-white">
                <item.icon size={20} className="flex-shrink-0" />
                <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="funcionalidades" variants={sectionFadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full mb-4" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Funcionalidades</span>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>Tudo que voce precisa, em um so lugar</h2>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const colorMap = { blue: "bg-blue-50 text-blue-600", violet: "bg-violet-50 text-violet-600", emerald: "bg-emerald-50 text-emerald-600", orange: "bg-orange-50 text-orange-600", yellow: "bg-yellow-50 text-yellow-600", pink: "bg-pink-50 text-pink-600" };
              return (
                <motion.div
                  key={feature.title}
                  variants={itemFadeUp}
                  whileHover={{ scale: 1.03, boxShadow: "0 16px 30px rgba(37,99,235,0.16)" }}
                  className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-100 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${colorMap[feature.color]}`}>
                    <feature.icon size={22} />
                  </div>
                  <h3 className="text-gray-900 mb-2" style={{ fontWeight: 600, fontSize: "1rem" }}>{feature.title}</h3>
                  <p className="text-gray-500" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="como-funciona" variants={sectionFadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full mb-4" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Como Funciona</span>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>Simples como 1, 2, 3</h2>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            <div className="hidden lg:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-violet-200" />
            {steps.map((step) => (
              <motion.div key={step.number} variants={itemFadeUp} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                  <span className="text-white" style={{ fontSize: "1.2rem", fontWeight: 700 }}>{step.number}</span>
                </div>
                <h3 className="text-gray-900 mb-3" style={{ fontWeight: 700, fontSize: "1.1rem" }}>{step.title}</h3>
                <p className="text-gray-500 max-w-xs mx-auto" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={sectionFadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full mb-4" style={{ fontSize: "0.8rem", fontWeight: 600 }}>Beneficios</span>
            <h2 className="text-gray-900 mb-4" style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>Para toda a comunidade academica</h2>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemFadeUp} whileHover={{ scale: 1.03, boxShadow: "0 16px 28px rgba(37,99,235,0.16)" }} className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap size={22} className="text-white" />
                </div>
                <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.2rem" }}>Para Alunos</h3>
              </div>
              <ul className="space-y-3">
                {benefits.students.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-gray-600" style={{ fontSize: "0.9rem" }}>
                    <CheckCircle size={16} className="text-blue-600 flex-shrink-0" />{b}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={itemFadeUp} whileHover={{ scale: 1.03, boxShadow: "0 16px 28px rgba(124,58,237,0.16)" }} className="p-8 bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl border border-violet-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center">
                  <Award size={22} className="text-white" />
                </div>
                <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.2rem" }}>Para Orientadores</h3>
              </div>
              <ul className="space-y-3">
                {benefits.advisors.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-gray-600" style={{ fontSize: "0.9rem" }}>
                    <CheckCircle size={16} className="text-violet-600 flex-shrink-0" />{b}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={sectionFadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-violet-900/30" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-white mb-4" style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>Comece sua jornada cientifica hoje</h2>
          <p className="text-gray-400 mb-10" style={{ fontSize: "1rem", lineHeight: 1.7 }}>Junte-se a milhares de estudantes e orientadores que ja transformaram sua experiencia.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button {...buttonMotion} onClick={() => navigate("/register")} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/50" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
              Criar conta gratis <ArrowRight size={18} />
            </motion.button>
            <motion.button {...buttonMotion} onClick={() => navigate("/login")} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
              Ja tenho conta
            </motion.button>
          </div>
        </div>
      </motion.section>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-950 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
                <FlaskConical size={15} className="text-white" />
              </div>
              <span className="text-white" style={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>IniCiencia</span>
            </div>
            <p className="text-gray-500 text-center" style={{ fontSize: "0.85rem" }}>© 2025 IniCiencia. Plataforma de Gerenciamento de Iniciacao Cientifica.</p>
            <div className="flex gap-6">
              {["Termos", "Privacidade", "Contato"].map((item) => (
                <a key={item} href="#" className="text-gray-500 hover:text-gray-300 transition-colors footer-link" style={{ fontSize: "0.85rem" }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
