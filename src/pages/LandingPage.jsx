import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, Check, Clock, MessageSquare, BarChart3, Target,
  Mail, MapPin, Globe, Menu, X, ChevronUp, MessageCircle,
  Bot, Zap, TrendingUp, Lock,
  Brain, Headphones, LineChart, LayoutDashboard, Calendar,
  Sparkles, DollarSign, Volume2, Repeat, Database,
  History, UserCheck,
} from "lucide-react";

/* ─── Assets ─── */
const LOGO_ICON_URL = "/images/logo-icon.png";
const WHATSAPP_URL = "https://wa.me/5511999999999";

/* ═══════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════ */

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useInView(ref, threshold = 0.15, once = true) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
  return inView;
}

function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useTypewriter(words, speed = 80, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const delay = deleting ? speed / 2 : charIdx === current.length ? pause : speed;

    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setDeleting(true);
      } else if (deleting && charIdx > 0) {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      } else {
        setDeleting(false);
        setWordIdx((w) => (w + 1) % words.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function Reveal({ children, delay = 0, className = "", from = "bottom" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const init = {
    bottom: "translateY(28px)",
    left: "translateX(-28px)",
    right: "translateX(28px)",
    scale: "scale(0.95)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0,0) scale(1)" : (init[from] || init.bottom),
        transition: `opacity 0.8s ease-out ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTENT DATA
   ═══════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Seu desafio", href: "#desafio" },
  { label: "Produtos", href: "#produtos" },
  { label: "Método", href: "#metodo" },
  { label: "Contato", href: "#contato" },
];

const TYPEWRITER_WORDS = [
  "automatiza seu atendimento.",
  "qualifica seus leads.",
  "opera seu BPO financeiro.",
  "escala sua operação.",
];

const HERO_FEATURES = [
  { icon: <Clock size={14} />, label: "Atendimento 24h" },
  { icon: <Target size={14} />, label: "Qualificação de leads" },
  { icon: <BarChart3 size={14} />, label: "Dashboard ao vivo" },
  { icon: <Calendar size={14} />, label: "Agenda integrada" },
  { icon: <Sparkles size={14} />, label: "IA personalizada" },
  { icon: <DollarSign size={14} />, label: "BPO Financeiro" },
];

const ORBIT_FEATURES_LEFT = [
  { label: "Atendimento 24h" },
  { label: "Follow-up automático" },
  { label: "Dashboard ao vivo" },
];

const ORBIT_FEATURES_RIGHT = [
  { label: "Multicanal" },
  { label: "Agenda integrada" },
  { label: "Qualificação de leads" },
];

const STATS = [
  { value: 24, suffix: "h", label: "Disponibilidade do agente" },
  { value: 6, suffix: "+", label: "Canais integrados" },
  { value: 100, suffix: "%", label: "Personalizado por empresa" },
  { value: 0, suffix: "", label: "Templates genéricos" },
];

const INDUSTRIES = [
  "Varejo", "Indústria", "Imobiliário", "Franquias", "Serviços",
  "Saúde", "Educação", "Jurídico", "Financeiro", "Logística",
];

const BOTTLENECKS = [
  {
    icon: <MessageSquare size={20} />,
    title: "Atendimento sobrecarregado",
    desc: "Equipe não dá conta do volume. Respostas lentas, clientes perdidos.",
    solution: "Nosso agente responde em segundos, 24h por dia. Sua equipe foca no que importa.",
  },
  {
    icon: <Target size={20} />,
    title: "Leads sem qualificação",
    desc: "Muitos contatos chegando, poucos convertendo. Triagem manual ineficiente.",
    solution: "Qualificamos e nutrimos leads automaticamente, com handoff inteligente para vendas.",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Decisões sem dados reais",
    desc: "Gestão no escuro. Sem métricas em tempo real por canal ou unidade.",
    solution: "Dashboard ao vivo com insights de cada conversa, conversão e gargalo da operação.",
  },
  {
    icon: <DollarSign size={20} />,
    title: "Financeiro manual e lento",
    desc: "Conciliações demoradas, sem previsibilidade. BPO caro e ineficiente.",
    solution: "4Hbel automatiza conciliações, fluxo de caixa e relatórios — com previsibilidade real.",
  },
  {
    icon: <Zap size={20} />,
    title: "Processos 100% manuais",
    desc: "Tarefas repetitivas que consomem o time e geram erros sistemáticos.",
    solution: "Mapeamos e automatizamos cada fluxo crítico — agendamentos, cobranças, follow-ups.",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Crescer sem ampliar equipe",
    desc: "Quer escalar mas não pode contratar. Capacidade limitada segurando o crescimento.",
    solution: "Agentes de IA escalam infinitamente sem custo proporcional. Cresça sem inflar custo.",
  },
];

const PILLARS = [
  {
    id: "atendimento",
    name: "Atendimento",
    icon: <Headphones size={22} />,
    tagline: "Atendimento 24h que não perde oportunidade",
    desc: "Um agente treinado no seu negócio responde clientes a qualquer hora, em qualquer canal — com o mesmo tom de voz da sua empresa.",
    features: [
      { icon: <Clock size={14} />, label: "Disponível 24/7" },
      { icon: <MessageSquare size={14} />, label: "WhatsApp · Instagram · Site" },
      { icon: <Volume2 size={14} />, label: "Leitura de áudio e imagem" },
      { icon: <Brain size={14} />, label: "Respostas humanizadas" },
      { icon: <UserCheck size={14} />, label: "Handoff para humano quando preciso" },
      { icon: <History size={14} />, label: "Histórico completo preservado" },
    ],
  },
  {
    id: "comercial",
    name: "Comercial",
    icon: <Target size={22} />,
    tagline: "Conversão comercial que trabalha sem parar",
    desc: "Qualifica leads, envia propostas, faz follow-up e agenda reuniões — tudo automatizado, integrado ao seu CRM e medido em tempo real.",
    features: [
      { icon: <Target size={14} />, label: "Qualificação automática" },
      { icon: <Repeat size={14} />, label: "Follow-up sistemático" },
      { icon: <Calendar size={14} />, label: "Agendamento integrado" },
      { icon: <Database size={14} />, label: "Sincronização com CRM" },
      { icon: <TrendingUp size={14} />, label: "Pipeline visível" },
      { icon: <Sparkles size={14} />, label: "Cross-sell inteligente" },
    ],
  },
  {
    id: "inteligencia",
    name: "Inteligência",
    icon: <LineChart size={22} />,
    tagline: "Inteligência de dados que vira decisão",
    desc: "Cada conversa vira insight. Dashboards ao vivo, relatórios automáticos e alertas estratégicos — você opera com clareza total.",
    features: [
      { icon: <LayoutDashboard size={14} />, label: "Dashboard ao vivo" },
      { icon: <BarChart3 size={14} />, label: "Métricas por canal" },
      { icon: <Brain size={14} />, label: "Análise de sentimento" },
      { icon: <Zap size={14} />, label: "Alertas em tempo real" },
      { icon: <LineChart size={14} />, label: "Tendências e padrões" },
      { icon: <Sparkles size={14} />, label: "Recomendações de IA" },
    ],
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    week: "Semana 1",
    title: "Diagnóstico",
    desc: "Mergulho na sua operação. Mapeamento de processos, gargalos e oportunidades.",
    deliverable: "Mapa de processos + relatório",
  },
  {
    num: "02",
    week: "Semanas 2–3",
    title: "Desenho",
    desc: "Arquitetura sob medida. Personalização por CNPJ, fluxos e integrações.",
    deliverable: "Blueprint da solução",
  },
  {
    num: "03",
    week: "Semanas 4–6",
    title: "Implantação",
    desc: "Implementação, integração e testes rigorosos antes do go-live em produção.",
    deliverable: "Agente em operação",
  },
  {
    num: "04",
    week: "Contínuo",
    title: "Operação",
    desc: "Monitoramento 24h, ajustes e evolução com base em dados reais de uso.",
    deliverable: "Relatórios + otimização",
  },
];

/* ═══════════════════════════════════════════════════════════════
   1. NAVBAR
   ═══════════════════════════════════════════════════════════════ */
function Navbar({ scrollProgress }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-[#c49a3c] to-[#e8c060]"
        style={{ width: `${scrollProgress}%`, transition: "width 0.1s linear" }}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#050505]/90 backdrop-blur-lg border-b border-white/5 py-3" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src={LOGO_ICON_URL} alt="" className="h-9 w-auto" />
            <div className="leading-tight hidden sm:block">
              <div className="font-bold text-[#f5f0e8] text-base tracking-tight">
                4Him<span className="text-[#c49a3c]">.</span>
              </div>
              <div className="text-[10px] text-[#f5f0e8]/40 tracking-[0.2em]">TECHNOLOGY</div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-1 px-1 py-1 rounded-full border border-white/5 bg-white/[0.02]">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l.href)}
                className="px-4 py-2 text-sm text-[#f5f0e8]/70 hover:text-[#c49a3c] hover:bg-white/5 rounded-full transition-all duration-200"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-white/10 text-[#f5f0e8]/80 hover:border-[#c49a3c]/40 hover:text-[#c49a3c] transition-all">
              <LayoutDashboard size={14} />
              Portal
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-br from-[#c49a3c] to-[#e8c060] text-[#050505] hover:shadow-[0_0_20px_rgba(196,154,60,0.4)] transition-all duration-300"
            >
              Falar com a 4Him
              <ArrowRight size={14} />
            </a>
          </div>

          <button
            className="lg:hidden p-2 text-[#f5f0e8]/80 hover:text-[#c49a3c]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-white/5 px-6 py-5">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.label}
                  onClick={() => handleNav(l.href)}
                  className="text-left text-[#f5f0e8]/70 hover:text-[#c49a3c] py-2.5 transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-gradient-to-br from-[#c49a3c] to-[#e8c060] text-[#050505]"
              >
                Falar com a 4Him
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. HERO (LP3)
   ═══════════════════════════════════════════════════════════════ */
function Hero() {
  const typed = useTypewriter(TYPEWRITER_WORDS, 70, 2400);
  const glowRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(700px at ${e.clientX}px ${e.clientY}px, rgba(196,154,60,0.06), transparent 70%)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      <div ref={glowRef} className="pointer-events-none fixed inset-0 z-0 transition-all duration-300" />

      <div
        className="absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#f5f0e8 1px, transparent 1px), linear-gradient(90deg, #f5f0e8 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div
        className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full opacity-[0.07] animate-float"
        style={{ background: "radial-gradient(circle, #c49a3c, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 left-1/5 w-56 h-56 rounded-full opacity-[0.05] animate-float"
        style={{
          background: "radial-gradient(circle, #e8c060, transparent 70%)",
          animationDelay: "2s",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#c49a3c]/30 bg-[#c49a3c]/[0.05] mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c49a3c] animate-pulse" />
            <span className="text-xs text-[#c49a3c] font-medium tracking-wide">
              Consultoria Estratégica em IA · Ecossistema de produtos sob medida
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="font-bold leading-[1.05] tracking-tight mb-8">
            <span className="block text-5xl md:text-7xl lg:text-[88px] text-[#f5f0e8]">
              IA estratégica que
            </span>
            <span
              className="block text-5xl md:text-7xl lg:text-[88px] font-serif italic min-h-[1.1em] mt-2"
              style={{
                background: "linear-gradient(135deg, #c49a3c 0%, #e8c060 50%, #c49a3c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {typed}
              <span
                className="inline-block w-1 h-[0.85em] align-middle ml-1 animate-pulse"
                style={{ background: "#c49a3c" }}
              />
            </span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-base md:text-lg text-[#f5f0e8]/60 max-w-2xl mx-auto leading-relaxed mb-10">
            Somos uma consultoria que desenha, implanta e opera agentes inteligentes para empresas
            de qualquer setor. Cada solução é construída sob medida — do diagnóstico à operação contínua.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <button
              onClick={() => document.querySelector("#desafio")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#050505] bg-gradient-to-br from-[#c49a3c] to-[#e8c060] hover:shadow-[0_0_40px_rgba(196,154,60,0.5)] hover:scale-[1.03] transition-all duration-300"
            >
              Qual é o seu gargalo?
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.querySelector("#produtos")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-full font-semibold text-[#f5f0e8] border border-[#f5f0e8]/15 hover:border-[#c49a3c]/40 hover:text-[#c49a3c] transition-all"
            >
              Ver o ecossistema
            </button>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {HERO_FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/8 bg-white/[0.02] text-xs text-[#f5f0e8]/70 hover:border-[#c49a3c]/30 hover:text-[#c49a3c] transition-all"
              >
                <span className="text-[#c49a3c]">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. CENTER H + ORBITS + STATS + MARQUEE
   ═══════════════════════════════════════════════════════════════ */
function CenterH() {
  const ref = useRef(null);
  const inView = useInView(ref, 0.3);
  const counts = [
    useCounter(STATS[0].value, 1500, inView),
    useCounter(STATS[1].value, 1500, inView),
    useCounter(STATS[2].value, 1800, inView),
    useCounter(STATS[3].value, 1200, inView),
  ];

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#f5f0e8 1px, transparent 1px), linear-gradient(90deg, #f5f0e8 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="relative h-[420px] md:h-[460px] mb-16 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[340px] h-[340px] rounded-full opacity-30"
              style={{
                background: "radial-gradient(circle, rgba(196,154,60,0.4), transparent 60%)",
                filter: "blur(40px)",
              }}
            />
          </div>

          <div className="absolute w-[360px] h-[360px] rounded-full border border-[#c49a3c]/15" />
          <div className="absolute w-[420px] h-[420px] rounded-full border border-[#c49a3c]/8" />

          <div className="relative z-10 animate-float">
            <img
              src={LOGO_ICON_URL}
              alt=""
              className="h-52 md:h-60 w-auto drop-shadow-[0_0_40px_rgba(196,154,60,0.3)]"
            />
          </div>

          <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col gap-5">
            {ORBIT_FEATURES_LEFT.map((f, i) => (
              <Reveal key={f.label} delay={i * 120} from="left">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur text-sm text-[#f5f0e8]"
                  style={{ transform: `translateX(${i === 1 ? "30px" : "0"})` }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#c49a3c]" />
                  {f.label}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-5 items-end">
            {ORBIT_FEATURES_RIGHT.map((f, i) => (
              <Reveal key={f.label} delay={i * 120} from="right">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur text-sm text-[#f5f0e8]"
                  style={{ transform: `translateX(${i === 1 ? "-30px" : "0"})` }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#c49a3c]" />
                  {f.label}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="md:hidden absolute -bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 px-6">
            {[...ORBIT_FEATURES_LEFT, ...ORBIT_FEATURES_RIGHT].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-[#0a0a0a]/80 text-xs text-[#f5f0e8]"
              >
                <span className="w-1 h-1 rounded-full bg-[#c49a3c]" />
                {f.label}
              </div>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s, i) => (
                <div key={s.label} className="text-center md:text-left">
                  <div
                    className="text-4xl md:text-5xl font-bold mb-2"
                    style={{
                      background: "linear-gradient(135deg, #e8c060, #c49a3c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {counts[i]}
                    {s.suffix}
                  </div>
                  <p className="text-xs md:text-sm text-[#f5f0e8]/50 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-20 py-4 overflow-hidden border-y border-white/5 bg-[#080808]">
        <p className="absolute left-1/2 -translate-x-1/2 -top-3 px-3 bg-[#050505] text-[10px] tracking-[0.3em] uppercase text-[#f5f0e8]/30 whitespace-nowrap">
          Para empresas de qualquer setor que tenham atendimento ao cliente
        </p>
        <div className="flex animate-marquee whitespace-nowrap gap-12 mt-4">
          {[...INDUSTRIES, ...INDUSTRIES, ...INDUSTRIES].map((ind, i) => (
            <span key={i} className="text-2xl md:text-3xl font-bold text-[#f5f0e8]/15 hover:text-[#c49a3c]/40 transition-colors flex items-center gap-12">
              {ind}
              <span className="text-[#c49a3c]/40">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. BOTTLENECKS
   ═══════════════════════════════════════════════════════════════ */
function Bottlenecks() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="desafio" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#c49a3c]/40" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#c49a3c]">
                Qual é o seu maior desafio?
              </span>
              <span className="h-px w-8 bg-[#c49a3c]/40" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[#f5f0e8]">
              Identifique o seu{" "}
              <span
                className="font-serif italic"
                style={{
                  background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                gargalo.
              </span>
            </h2>
            <p className="text-[#f5f0e8]/50 mt-5 max-w-xl mx-auto">
              Selecione o desafio mais crítico da sua operação e veja como a 4Him resolve.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOTTLENECKS.map((b, i) => {
            const isOpen = expanded === i;
            return (
              <Reveal key={b.title} delay={i * 70}>
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className={`group relative w-full text-left p-7 rounded-2xl border transition-all duration-300 overflow-hidden h-full ${
                    isOpen
                      ? "border-[#c49a3c]/50 bg-gradient-to-br from-[#c49a3c]/[0.08] to-transparent"
                      : "border-white/8 bg-gradient-to-br from-white/[0.025] to-transparent hover:border-[#c49a3c]/30 hover:from-white/[0.04]"
                  }`}
                >
                  {isOpen && (
                    <div
                      className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-30 pointer-events-none"
                      style={{ background: "radial-gradient(circle, rgba(196,154,60,0.5), transparent 70%)" }}
                    />
                  )}

                  <div className="relative flex items-start justify-between mb-4">
                    <div
                      className={`p-2.5 rounded-xl transition-all ${
                        isOpen
                          ? "bg-[#c49a3c]/20 text-[#c49a3c]"
                          : "bg-white/5 text-[#c49a3c] group-hover:bg-[#c49a3c]/10"
                      }`}
                    >
                      {b.icon}
                    </div>
                    <ArrowRight
                      size={16}
                      className={`text-[#c49a3c] transition-transform ${
                        isOpen ? "rotate-90" : "group-hover:translate-x-1"
                      }`}
                    />
                  </div>

                  <h3 className="relative font-semibold text-[#f5f0e8] mb-2 text-base">
                    {b.title}
                  </h3>
                  <p className="relative text-sm text-[#f5f0e8]/55 leading-relaxed">
                    {isOpen ? b.solution : b.desc}
                  </p>

                  {isOpen && (
                    <div className="relative mt-4 pt-4 border-t border-[#c49a3c]/15 flex items-center gap-2 text-xs text-[#c49a3c] font-medium">
                      <Check size={13} />
                      Como a 4Him resolve
                    </div>
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. THREE PILLARS — DYNAMIC
   ═══════════════════════════════════════════════════════════════ */
function ThreePillars() {
  const [active, setActive] = useState(0);
  const pillar = PILLARS[active];

  return (
    <section className="py-28 relative bg-gradient-to-b from-transparent via-[#080808] to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#c49a3c]/40" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#c49a3c]">
                O que nossos agentes fazem
              </span>
              <span className="h-px w-8 bg-[#c49a3c]/40" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[#f5f0e8]">
              Três pilares.{" "}
              <span
                className="font-serif italic"
                style={{
                  background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Uma
              </span>{" "}
              operação inteira.
            </h2>
            <p className="text-[#f5f0e8]/50 mt-5 max-w-2xl mx-auto">
              Atendimento, conversão comercial e inteligência de dados conectados no mesmo agente —
              desenhados especificamente para a sua empresa.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 max-w-3xl mx-auto">
            {PILLARS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className="group relative"
              >
                <div
                  className={`relative h-32 md:h-40 rounded-2xl border transition-all duration-500 overflow-hidden ${
                    active === i
                      ? "border-[#c49a3c]/60 bg-gradient-to-b from-[#c49a3c]/[0.15] to-[#c49a3c]/[0.02]"
                      : "border-white/8 bg-white/[0.02] hover:border-[#c49a3c]/30 hover:bg-white/[0.04]"
                  }`}
                >
                  {active === i && (
                    <>
                      <div
                        className="absolute inset-x-0 top-0 h-full opacity-60"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent, rgba(196,154,60,0.15), transparent)",
                          animation: "scan 3s ease-in-out infinite",
                        }}
                      />
                      <div
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full"
                        style={{ background: "#c49a3c", boxShadow: "0 0 20px #c49a3c" }}
                      />
                    </>
                  )}

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-3">
                    <div
                      className={`p-2.5 rounded-xl transition-all ${
                        active === i
                          ? "bg-[#c49a3c]/20 text-[#c49a3c]"
                          : "bg-white/5 text-[#f5f0e8]/60 group-hover:text-[#c49a3c]"
                      }`}
                    >
                      {p.icon}
                    </div>
                    <span
                      className={`font-semibold text-sm md:text-base transition-colors ${
                        active === i ? "text-[#c49a3c]" : "text-[#f5f0e8]/70"
                      }`}
                    >
                      {p.name}
                    </span>
                  </div>
                </div>

                <div
                  className={`mt-3 text-center text-[10px] font-mono tracking-widest transition-colors ${
                    active === i ? "text-[#c49a3c]" : "text-[#f5f0e8]/30"
                  }`}
                >
                  PILAR · 0{i + 1}
                </div>
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto px-12 mb-12">
            <div className="relative h-px bg-gradient-to-r from-transparent via-[#c49a3c]/30 to-transparent">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-500"
                style={{
                  background: "#c49a3c",
                  boxShadow: "0 0 12px #c49a3c",
                  left: `calc(${(active / 2) * 100}% - 4px)`,
                }}
              />
            </div>
            <p className="text-center text-xs text-[#f5f0e8]/30 mt-4 italic">
              Os três pilares operam em sincronia — um único agente, três frentes.
            </p>
          </div>
        </Reveal>

        <div
          key={pillar.id}
          className="relative rounded-3xl border border-[#c49a3c]/20 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[#c49a3c]/[0.04] p-8 md:p-12 overflow-hidden"
          style={{ animation: "fadeInUp 0.6s ease-out" }}
        >
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(196,154,60,0.5), transparent 60%)" }}
          />

          <div className="relative grid md:grid-cols-2 gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-[#c49a3c]/10 border border-[#c49a3c]/30">
                <span className="text-[#c49a3c]">{pillar.icon}</span>
                <span className="text-xs font-semibold text-[#c49a3c] tracking-wider uppercase">
                  Pilar · {pillar.name}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#f5f0e8] mb-4 leading-tight">
                {pillar.tagline}
              </h3>
              <p className="text-[#f5f0e8]/60 leading-relaxed mb-8">{pillar.desc}</p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-[#050505] bg-gradient-to-br from-[#c49a3c] to-[#e8c060] hover:shadow-[0_0_25px_rgba(196,154,60,0.4)] transition-all"
              >
                Conversar sobre o seu caso
                <ArrowRight size={14} />
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#f5f0e8]/40 mb-5">
                O que está incluso
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pillar.features.map((f, i) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/[0.02]"
                    style={{ animation: `fadeInUp 0.4s ease-out ${i * 60}ms backwards` }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#c49a3c]/15 flex items-center justify-center text-[#c49a3c] flex-shrink-0">
                      <Check size={13} />
                    </div>
                    <span className="text-sm text-[#f5f0e8]/80">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. PRODUCTS
   ═══════════════════════════════════════════════════════════════ */
function Products() {
  const [tab, setTab] = useState(0);

  return (
    <section id="produtos" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#c49a3c]/40" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#c49a3c]">
                Ecossistema de produtos
              </span>
              <span className="h-px w-8 bg-[#c49a3c]/40" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[#f5f0e8]">
              Cada produto resolve um{" "}
              <span
                className="font-serif italic"
                style={{
                  background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                gargalo específico.
              </span>
            </h2>
            <p className="text-[#f5f0e8]/50 mt-5 max-w-xl mx-auto">
              Começamos pelo mais crítico e expandimos. Cada empresa tem seu próprio caminho.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-5">
          <Reveal className="lg:col-span-2">
            <div className="relative h-full p-8 md:p-10 rounded-3xl border border-[#c49a3c]/30 bg-gradient-to-br from-[#0a0a0a] to-[#c49a3c]/[0.04] overflow-hidden">
              <div
                className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-15 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(196,154,60,0.6), transparent 60%)" }}
              />

              <div className="relative">
                <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald-400">
                    Produto Principal · Ativo
                  </span>
                </div>

                <h3
                  className="text-5xl md:text-6xl font-black mb-4 tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #c49a3c, #e8c060, #c49a3c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ELO4H
                </h3>

                <p className="text-[#f5f0e8]/60 leading-relaxed mb-8 max-w-lg">
                  Nosso agente de atendimento e inteligência comercial. Carro-chefe da 4Him —
                  normalmente a primeira implementação.
                </p>

                <div className="inline-flex p-1 rounded-full border border-white/10 bg-white/[0.03] mb-7">
                  {PILLARS.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setTab(i)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                        tab === i
                          ? "bg-gradient-to-br from-[#c49a3c] to-[#e8c060] text-[#050505]"
                          : "text-[#f5f0e8]/60 hover:text-[#c49a3c]"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div key={tab} style={{ animation: "fadeInUp 0.4s ease-out" }}>
                  <h4 className="text-xl md:text-2xl font-bold text-[#f5f0e8] mb-4">
                    {PILLARS[tab].tagline}
                  </h4>
                  <p className="text-[#f5f0e8]/55 mb-6 leading-relaxed">
                    {PILLARS[tab].desc}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PILLARS[tab].features.slice(0, 6).map((f) => (
                      <div
                        key={f.label}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/8 bg-white/[0.02]"
                      >
                        <div className="w-6 h-6 rounded-md bg-[#c49a3c]/15 flex items-center justify-center text-[#c49a3c] flex-shrink-0">
                          <Check size={12} />
                        </div>
                        <span className="text-xs md:text-sm text-[#f5f0e8]/80">{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="space-y-5">
            <div className="relative p-7 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#0a0a0a] to-purple-500/[0.04] overflow-hidden">
              <div
                className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-15 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5), transparent 60%)" }}
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-purple-300">
                    BPO Financeiro · Novo
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-purple-300 mb-3 tracking-tight">
                  4Hbel
                </h3>
                <p className="text-sm text-[#f5f0e8]/55 leading-relaxed mb-5">
                  IA aplicada ao BPO financeiro. Automação de conciliações, relatórios automáticos
                  e previsibilidade de fluxo de caixa.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Conciliação automática",
                    "Relatórios em tempo real",
                    "Previsibilidade de fluxo",
                    "Redução de custo operacional",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#f5f0e8]/75">
                      <div className="w-5 h-5 rounded-md bg-purple-500/15 flex items-center justify-center text-purple-300 flex-shrink-0">
                        <Check size={11} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative p-6 rounded-3xl border border-white/8 bg-white/[0.015]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#f5f0e8]/30">
                  <Lock size={16} />
                </div>
                <div>
                  <p className="font-semibold text-[#f5f0e8]/70 text-sm">Mais produtos em breve</p>
                  <p className="text-xs text-[#f5f0e8]/40">Novas soluções verticais chegando</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. HORIZONTAL TIMELINE
   ═══════════════════════════════════════════════════════════════ */
function HorizontalTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, 0.25);

  return (
    <section id="metodo" ref={ref} className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#c49a3c]/40" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#c49a3c]">
                Como funciona
              </span>
              <span className="h-px w-8 bg-[#c49a3c]/40" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[#f5f0e8]">
              Do diagnóstico à{" "}
              <span
                className="font-serif italic"
                style={{
                  background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                operação.
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          <div className="hidden lg:block absolute top-[88px] left-0 right-0 h-px bg-white/8">
            <div
              className="h-full bg-gradient-to-r from-[#c49a3c] via-[#e8c060] to-[#c49a3c] transition-all duration-[2.5s] ease-out"
              style={{ width: inView ? "100%" : "0%" }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4 relative">
            {PROCESS_STEPS.map((s, i) => {
              const delay = i * 250;
              return (
                <div
                  key={s.num}
                  className="relative"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(40px)",
                    transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                  }}
                >
                  <div className="hidden lg:flex justify-center mb-6">
                    <div
                      className="relative w-14 h-14 rounded-2xl flex items-center justify-center font-black text-base z-10 transition-all duration-500"
                      style={{
                        background: inView ? "linear-gradient(135deg, #c49a3c, #e8c060)" : "#1a1a1a",
                        color: inView ? "#050505" : "#f5f0e8",
                        boxShadow: inView ? "0 0 30px rgba(196,154,60,0.4)" : "none",
                        transitionDelay: `${delay + 200}ms`,
                      }}
                    >
                      {s.num}
                      {inView && (
                        <span
                          className="absolute inset-0 rounded-2xl border-2 border-[#c49a3c]"
                          style={{ animation: `pulseRing 2s ease-out ${delay + 600}ms infinite` }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.025] to-transparent hover:border-[#c49a3c]/30 transition-all">
                    <div className="lg:hidden flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base"
                        style={{
                          background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                          color: "#050505",
                        }}
                      >
                        {s.num}
                      </div>
                    </div>

                    <span className="inline-block px-2.5 py-1 rounded-md bg-[#c49a3c]/10 border border-[#c49a3c]/20 text-[10px] font-semibold tracking-wider uppercase text-[#c49a3c] mb-4">
                      {s.week}
                    </span>
                    <h3 className="text-xl font-bold text-[#f5f0e8] mb-3">{s.title}</h3>
                    <p className="text-sm text-[#f5f0e8]/55 leading-relaxed mb-5">{s.desc}</p>
                    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                      <div className="w-5 h-5 rounded-md bg-[#c49a3c]/15 flex items-center justify-center text-[#c49a3c]">
                        <Check size={11} />
                      </div>
                      <span className="text-xs text-[#f5f0e8]/70 font-medium">{s.deliverable}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. CTA + EKG ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section id="contato" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className="relative w-full h-32 overflow-hidden opacity-40"
            style={{
              marginTop: idx === 0 ? "-40px" : "0",
              marginBottom: idx === 2 ? "-40px" : "0",
            }}
          >
            <svg
              className="absolute top-1/2 left-0 -translate-y-1/2"
              width="200%"
              height="100%"
              viewBox="0 0 2400 100"
              preserveAspectRatio="none"
              style={{
                animation: `ekgScroll ${12 + idx * 2}s linear infinite`,
                animationDelay: `${idx * -3}s`,
              }}
            >
              <path
                d="M0,50 L300,50 L320,50 L340,30 L360,70 L380,20 L400,50 L420,50 L600,50 L620,50 L640,30 L660,10 L680,90 L700,30 L720,50 L900,50 L920,50 L940,40 L960,60 L980,50 L1200,50 L1220,30 L1240,70 L1260,20 L1280,50 L1500,50 L1520,40 L1540,10 L1560,90 L1580,30 L1600,50 L1800,50 L1820,30 L1840,70 L1860,20 L1880,50 L2100,50 L2120,40 L2140,60 L2160,50 L2400,50"
                fill="none"
                stroke={`url(#ekgGradient-${idx})`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id={`ekgGradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c49a3c" stopOpacity="0" />
                  <stop offset="20%" stopColor="#c49a3c" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#e8c060" stopOpacity="1" />
                  <stop offset="80%" stopColor="#c49a3c" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#c49a3c" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#f5f0e8 1px, transparent 1px), linear-gradient(90deg, #f5f0e8 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Reveal>
          <div className="relative rounded-3xl border border-[#c49a3c]/20 bg-gradient-to-br from-[#0a0a0a]/95 via-[#0a0a0a]/95 to-[#c49a3c]/[0.04] backdrop-blur-sm p-10 md:p-16 text-center overflow-hidden">
            <div
              className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(196,154,60,0.4), transparent 60%)" }}
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c49a3c]/30 bg-[#c49a3c]/[0.05] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c49a3c] animate-pulse" />
                <span className="text-xs font-medium text-[#c49a3c] tracking-wide">
                  Sem compromisso · Diagnóstico gratuito
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-[#f5f0e8] mb-6 leading-[1.1]">
                Vamos resolver os
                <br />
                <span
                  className="font-serif italic"
                  style={{
                    background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  seus gargalos.
                </span>
              </h2>

              <p className="text-base md:text-lg text-[#f5f0e8]/60 max-w-2xl mx-auto leading-relaxed mb-10">
                Converse com a 4Him. Entendemos seu processo, mapeamos oportunidades e desenhamos
                uma solução sob medida — do atendimento ao BPO financeiro.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-[#050505] bg-gradient-to-br from-[#c49a3c] to-[#e8c060] hover:shadow-[0_0_45px_rgba(196,154,60,0.6)] hover:scale-[1.03] transition-all duration-300"
                >
                  Agendar diagnóstico gratuito
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-[#f5f0e8] border border-white/15 hover:border-[#c49a3c]/40 hover:text-[#c49a3c] transition-all"
                >
                  <MessageCircle size={16} />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. FOOTER
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <img src={LOGO_ICON_URL} alt="" className="h-9 w-auto" />
              <div className="leading-tight">
                <div className="font-bold text-[#f5f0e8] text-base tracking-tight">
                  4Him Technology
                </div>
                <div className="text-[10px] text-[#c49a3c] tracking-[0.2em]">CONSULTORIA EM IA</div>
              </div>
            </div>
            <p className="text-sm text-[#f5f0e8]/45 leading-relaxed mb-6 max-w-sm">
              Consultoria estratégica em IA. Desenhamos, implantamos e operamos soluções sob
              medida — do diagnóstico à operação contínua.
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#c49a3c]/20 bg-[#c49a3c]/[0.03] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c49a3c]" />
                <span className="text-xs font-bold text-[#c49a3c]">ELO4H</span>
                <span className="text-xs text-[#f5f0e8]/40">— Atendimento · Comercial · Inteligência</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-purple-500/20 bg-purple-500/[0.03] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-xs font-bold text-purple-300">4Hbel</span>
                <span className="text-xs text-[#f5f0e8]/40">— BPO Financeiro</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#f5f0e8]/40 mb-5">
              Soluções
            </h4>
            <ul className="space-y-3">
              {["ELO4H", "4Hbel", "Agentes customizados", "Consultoria estratégica"].map((i) => (
                <li key={i}>
                  <a href="#produtos" className="text-sm text-[#f5f0e8]/60 hover:text-[#c49a3c] transition-colors">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#f5f0e8]/40 mb-5">
              Método
            </h4>
            <ul className="space-y-3">
              {PROCESS_STEPS.map((s) => (
                <li key={s.title}>
                  <a href="#metodo" className="text-sm text-[#f5f0e8]/60 hover:text-[#c49a3c] transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#f5f0e8]/40 mb-5">
              Contato
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contato@4himtechnology.com"
                  className="flex items-center gap-3 text-sm text-[#f5f0e8]/60 hover:text-[#c49a3c] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-[#c49a3c] group-hover:bg-[#c49a3c]/15 transition-colors">
                    <Mail size={13} />
                  </div>
                  contato@4himtechnology.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.4himtechnology.com"
                  className="flex items-center gap-3 text-sm text-[#f5f0e8]/60 hover:text-[#c49a3c] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-[#c49a3c] group-hover:bg-[#c49a3c]/15 transition-colors">
                    <Globe size={13} />
                  </div>
                  www.4himtechnology.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#f5f0e8]/60">
                <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-[#c49a3c]">
                  <MapPin size={13} />
                </div>
                Brasil
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#f5f0e8]/30">
            © {year} 4Him Technology. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#f5f0e8]/30 hover:text-[#c49a3c] transition-colors">
              Privacidade
            </a>
            <a href="#" className="text-xs text-[#f5f0e8]/30 hover:text-[#c49a3c] transition-colors">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop({ scrollProgress }) {
  if (scrollProgress < 20) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-[#c49a3c] to-[#e8c060] text-[#050505] flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
      aria-label="Voltar ao topo"
    >
      <ChevronUp size={18} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const scrollProgress = useScrollProgress();

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f0e8]">
      <Navbar scrollProgress={scrollProgress} />
      <Hero />
      <CenterH />
      <Bottlenecks />
      <ThreePillars />
      <Products />
      <HorizontalTimeline />
      <CTASection />
      <Footer />
      <ScrollToTop scrollProgress={scrollProgress} />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes ekgScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
