import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight, Check, Clock, Calendar, BarChart3, Target,
  MessageSquare, Sparkles, Mail, MapPin, Globe, Menu, X,
  ChevronUp, MessageCircle, ChevronDown, Bot, Zap, Shield,
  TrendingUp, Users, Phone, Layers, Star
} from "lucide-react";

/* ─── Assets ─── */
const LOGO_ICON_URL = "/images/logo-icon.png";
const LOGO_FULL_URL = "/images/logo-full.png";
const LOGO_FULL_WHITE_URL = "/images/logo-full-white.png";
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
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

/* ─── Reveal animation wrapper ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
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
  { label: "Soluções", href: "#solucoes" },
  { label: "Produtos", href: "#produtos" },
  { label: "Como funciona", href: "#processo" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

const TYPEWRITER_WORDS = [
  "Automatize seu atendimento.",
  "Escale sem contratar.",
  "Converta mais leads.",
  "Opere 24h por dia.",
  "Cresça com IA.",
];

const STATS = [
  { value: 24, suffix: "h", label: "Disponibilidade do agente" },
  { value: 6, suffix: "+", label: "Canais integrados" },
  { value: 100, suffix: "%", label: "Personalizado por empresa" },
  { value: 3, suffix: "x", label: "Mais produtividade" },
];

const BOTTLENECKS = [
  {
    icon: <Clock size={22} />,
    title: "Atendimento lento",
    problem: "Clientes esperam horas por uma resposta e desistem antes de comprar.",
    solution: "Nosso agente responde em segundos, 24h por dia, em todos os canais.",
  },
  {
    icon: <Users size={22} />,
    title: "Equipe sobrecarregada",
    problem: "Sua equipe perde tempo com perguntas repetitivas em vez de fechar negócios.",
    solution: "O agente resolve 80% das demandas sozinho, liberando seu time para o que importa.",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Leads perdidos",
    problem: "Potenciais clientes entram em contato fora do horário e nunca recebem resposta.",
    solution: "Captamos, qualificamos e nutrimos leads automaticamente, sem intervenção humana.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Sem dados acionáveis",
    problem: "Você não sabe o que seus clientes perguntam, reclamam ou desejam.",
    solution: "O agente gera relatórios e insights em tempo real para decisões estratégicas.",
  },
  {
    icon: <Globe size={22} />,
    title: "Presença limitada",
    problem: "Sua empresa só opera em um ou dois canais e perde clientes nos demais.",
    solution: "Integramos WhatsApp, Instagram, site, e-mail e muito mais em um único agente.",
  },
  {
    icon: <Target size={22} />,
    title: "Processos manuais",
    problem: "Tarefas repetitivas consomem horas valiosas e geram erros humanos.",
    solution: "Automatizamos fluxos completos: agendamentos, cobranças, follow-ups e mais.",
  },
];

const BENTO_FEATURES = [
  {
    icon: <Bot size={28} />,
    title: "Agente Inteligente",
    desc: "IA treinada com o DNA da sua empresa — produtos, tom de voz, políticas e processos.",
    wide: true,
  },
  {
    icon: <Zap size={28} />,
    title: "Resposta Instantânea",
    desc: "Tempo de resposta em segundos, sem fila de espera.",
  },
  {
    icon: <Shield size={28} />,
    title: "Seguro e Confiável",
    desc: "Dados protegidos, respostas auditáveis e controle total.",
  },
  {
    icon: <Layers size={28} />,
    title: "Multi-canal",
    desc: "WhatsApp, Instagram, site, e-mail — tudo integrado.",
    wide: true,
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Analytics em Tempo Real",
    desc: "Dashboards com conversas, conversões e insights do seu negócio.",
  },
  {
    icon: <Star size={28} />,
    title: "Melhoria Contínua",
    desc: "O agente aprende e evolui com cada interação.",
  },
];

const PRODUCTS = [
  {
    id: "elo4h",
    name: "ELO4H",
    tagline: "Seu agente completo de IA",
    description:
      "O ELO4H é o coração da 4Him. Um agente de IA personalizado que atua como recepcionista virtual, analista de dados e assistente de vendas — tudo ao mesmo tempo, em todos os canais.",
    features: [
      "Atendimento 24/7 sem interrupções",
      "Integração com WhatsApp, Instagram e site",
      "Qualificação e nutrição automática de leads",
      "Relatórios e insights em tempo real",
      "Treinado com o conteúdo da sua empresa",
      "Escalonamento inteligente para humanos",
    ],
    color: "#c49a3c",
  },
  {
    id: "4hbel",
    name: "4Hbel",
    tagline: "Automação de processos internos",
    description:
      "4Hbel automatiza os fluxos internos da sua empresa: agendamentos, cobranças, follow-ups, relatórios e tarefas repetitivas que consomem o tempo da sua equipe.",
    features: [
      "Automação de agendamentos e lembretes",
      "Fluxos de cobrança automatizados",
      "Follow-up de propostas e orçamentos",
      "Integração com sistemas ERP e CRM",
      "Geração automática de relatórios",
      "Notificações inteligentes por canal",
    ],
    color: "#7b9e87",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Diagnóstico",
    desc: "Mapeamos os processos, gargalos e oportunidades da sua empresa para entender exatamente onde a IA gera mais valor.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Criamos a arquitetura do agente: fluxos de conversa, integrações, tom de voz e base de conhecimento personalizada.",
  },
  {
    num: "03",
    title: "Implantação",
    desc: "Implementamos e integramos o agente nos canais escolhidos com testes rigorosos antes do go-live.",
  },
  {
    num: "04",
    title: "Operação",
    desc: "Monitoramos, ajustamos e evoluímos o agente continuamente com base em dados reais de uso.",
  },
];

const FAQS = [
  {
    q: "Em quanto tempo o agente fica pronto?",
    a: "O tempo de implantação varia conforme a complexidade. Projetos simples ficam prontos em 2 semanas. Integrações mais complexas levam de 4 a 6 semanas.",
  },
  {
    q: "O agente precisa de supervisão constante?",
    a: "Não. Após a implantação, o agente opera de forma autônoma. Nossa equipe monitora o desempenho e realiza ajustes periódicos. Você recebe relatórios regulares.",
  },
  {
    q: "Quais canais são suportados?",
    a: "WhatsApp Business, Instagram Direct, Messenger, site (chat widget), e-mail e telefone via URA inteligente. Novas integrações são adicionadas conforme a demanda.",
  },
  {
    q: "O agente funciona para qualquer segmento?",
    a: "Sim. Já implementamos soluções para saúde, jurídico, varejo, serviços, educação e tecnologia. O agente é 100% personalizado para o contexto da sua empresa.",
  },
  {
    q: "Como é feita a precificação?",
    a: "A precificação é baseada no escopo do projeto e no volume de interações mensais. Agende uma conversa para receber uma proposta personalizada.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Navbar ─── */
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
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-[#c49a3c] to-[#e8c060]"
        style={{ width: `${scrollProgress}%`, transition: "width 0.1s linear" }}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-3" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={LOGO_ICON_URL} alt="4Him" className="h-8 w-auto" />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l.href)}
                className="text-sm text-[#f5f0e8]/70 hover:text-[#c49a3c] transition-colors duration-200 cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#c49a3c] text-[#050505] hover:bg-[#e8c060] transition-all duration-200 hover:scale-105"
            >
              <MessageCircle size={15} />
              Fale conosco
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#f5f0e8]/70 hover:text-[#c49a3c]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0d0d0d] border-b border-white/5 py-4 px-6">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.label}
                  onClick={() => handleNav(l.href)}
                  className="text-left text-[#f5f0e8]/70 hover:text-[#c49a3c] text-sm py-2 transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-[#c49a3c] text-[#050505] mt-2"
              >
                <MessageCircle size={15} />
                Fale conosco
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

/* ─── Hero ─── */
function Hero() {
  const typed = useTypewriter(TYPEWRITER_WORDS);
  const mousePos = useRef({ x: 0, y: 0 });
  const glowRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgba(196,154,60,0.07), transparent 70%)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background elements */}
      <div ref={glowRef} className="pointer-events-none fixed inset-0 z-0 transition-all duration-300" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#f5f0e8 1px, transparent 1px), linear-gradient(90deg, #f5f0e8 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 animate-float"
        style={{ background: "radial-gradient(circle, #c49a3c, transparent 70%)" }} />
      <div className="absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full opacity-8 animate-float"
        style={{ background: "radial-gradient(circle, #e8c060, transparent 70%)", animationDelay: "2s" }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c49a3c]/30 bg-[#c49a3c]/5 text-[#c49a3c] text-xs font-medium mb-8 tracking-wide uppercase">
            <Sparkles size={13} />
            Inteligência Artificial para empresas
          </div>
        </Reveal>

        {/* Main heading */}
        <Reveal delay={100}>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            <span className="text-[#f5f0e8]">4Him Technology</span>
            <br />
            <span
              className="inline-block min-h-[1.2em]"
              style={{
                background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {typed}
              <span className="animate-pulse">|</span>
            </span>
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal delay={200}>
          <p className="text-lg md:text-xl text-[#f5f0e8]/60 max-w-2xl mx-auto leading-relaxed mb-10">
            Criamos agentes de IA personalizados que trabalham pelo seu negócio 24 horas por dia — atendendo clientes, qualificando leads e automatizando processos repetitivos.
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#050505] bg-gradient-to-r from-[#c49a3c] to-[#e8c060] hover:scale-105 hover:shadow-[0_0_30px_rgba(196,154,60,0.4)] transition-all duration-300"
            >
              <MessageCircle size={18} />
              Quero meu agente de IA
            </a>
            <button
              onClick={() => document.querySelector("#solucoes")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#f5f0e8] border border-[#f5f0e8]/20 hover:border-[#c49a3c]/50 hover:text-[#c49a3c] transition-all duration-300"
            >
              Ver soluções
              <ArrowRight size={16} />
            </button>
          </div>
        </Reveal>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs tracking-widest uppercase text-[#f5f0e8]/50">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#c49a3c] to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ─── */
function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, 0.3);

  const counts = [
    useCounter(STATS[0].value, 1500, inView),
    useCounter(STATS[1].value, 1500, inView),
    useCounter(STATS[2].value, 1800, inView),
    useCounter(STATS[3].value, 1200, inView),
  ];

  return (
    <section ref={ref} className="py-16 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={s.label} className="text-center">
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{
                  background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {counts[i]}{s.suffix}
              </div>
              <p className="text-sm text-[#f5f0e8]/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Bottlenecks ─── */
function Bottlenecks() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="solucoes" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#c49a3c] mb-4 block">
              Seus Desafios
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8] mb-5">
              Reconhece algum desses <br />
              <span style={{
                background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>gargalos?</span>
            </h2>
            <p className="text-[#f5f0e8]/50 max-w-xl mx-auto">
              Clique em qualquer card para ver como a 4Him resolve esse problema.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOTTLENECKS.map((b, i) => (
            <Reveal key={b.title} delay={i * 80}>
              <div
                onClick={() => setSelected(selected === i ? null : i)}
                className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                  selected === i
                    ? "border-[#c49a3c]/60 bg-[#c49a3c]/5"
                    : "border-white/8 bg-white/[0.02] hover:border-[#c49a3c]/30 hover:bg-white/[0.04]"
                }`}
              >
                <div className={`inline-flex p-2.5 rounded-xl mb-4 transition-colors ${
                  selected === i ? "bg-[#c49a3c]/20 text-[#c49a3c]" : "bg-white/5 text-[#f5f0e8]/50 group-hover:text-[#c49a3c]"
                }`}>
                  {b.icon}
                </div>
                <h3 className="font-semibold text-[#f5f0e8] mb-2">{b.title}</h3>
                <p className="text-sm text-[#f5f0e8]/50 leading-relaxed">
                  {selected === i ? b.solution : b.problem}
                </p>
                {selected === i && (
                  <div className="absolute top-4 right-4">
                    <div className="w-5 h-5 rounded-full bg-[#c49a3c] flex items-center justify-center">
                      <Check size={11} className="text-[#050505]" />
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Bento Grid ─── */
function BentoGrid() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#c49a3c] mb-4 block">
              Capacidades
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8]">
              Tudo que seu negócio
              <br />
              <span style={{
                background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>precisa em um agente</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
          {BENTO_FEATURES.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 60}
              className={f.wide ? "md:col-span-2" : ""}
            >
              <div className="h-full p-7 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-[#c49a3c]/30 hover:bg-white/[0.04] transition-all duration-300 group">
                <div className="inline-flex p-3 rounded-xl bg-[#c49a3c]/10 text-[#c49a3c] mb-5 group-hover:bg-[#c49a3c]/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#f5f0e8] mb-3">{f.title}</h3>
                <p className="text-[#f5f0e8]/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Products ─── */
function Products() {
  const [active, setActive] = useState("elo4h");
  const product = PRODUCTS.find((p) => p.id === active);

  return (
    <section id="produtos" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#c49a3c] mb-4 block">
              Nossos Produtos
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8]">
              Soluções pensadas para
              <br />
              <span style={{
                background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>cada necessidade</span>
            </h2>
          </div>
        </Reveal>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                active === p.id
                  ? "bg-[#c49a3c] text-[#050505]"
                  : "border border-white/10 text-[#f5f0e8]/50 hover:border-[#c49a3c]/40 hover:text-[#c49a3c]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Product card */}
        <Reveal key={active}>
          <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-12 rounded-3xl border border-white/8 bg-white/[0.02]">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: product.color }}>
                {product.name}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#f5f0e8] mb-4">
                {product.tagline}
              </h3>
              <p className="text-[#f5f0e8]/60 leading-relaxed mb-8">{product.description}</p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[#050505] transition-all duration-300 hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${product.color}, #e8c060)` }}
              >
                <MessageCircle size={16} />
                Saiba mais
              </a>
            </div>
            <div>
              <ul className="space-y-4">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div
                      className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${product.color}25` }}
                    >
                      <Check size={11} style={{ color: product.color }} />
                    </div>
                    <span className="text-[#f5f0e8]/70 text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Process ─── */
function Process() {
  return (
    <section id="processo" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#c49a3c] mb-4 block">
              Como Funciona
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8]">
              Do diagnóstico ao
              <br />
              <span style={{
                background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>agente em produção</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 100}>
              <div className="relative p-7 rounded-2xl border border-white/8 bg-white/[0.02] h-full">
                {/* Connector line */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-[#c49a3c]/30 z-10" />
                )}
                <div
                  className="text-4xl font-black mb-5 leading-none"
                  style={{
                    background: "linear-gradient(135deg, #c49a3c20, #c49a3c40)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.num}
                </div>
                <div className="w-8 h-[2px] bg-[#c49a3c] mb-5 rounded" />
                <h3 className="text-lg font-semibold text-[#f5f0e8] mb-3">{s.title}</h3>
                <p className="text-sm text-[#f5f0e8]/50 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#c49a3c] mb-4 block">
              Perguntas Frequentes
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8]">
              Ainda tem <span style={{
                background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>dúvidas?</span>
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i ? "border-[#c49a3c]/40 bg-[#c49a3c]/5" : "border-white/8 bg-white/[0.02]"
              }`}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-[#f5f0e8] pr-4">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#c49a3c] flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && (
                  <div className="px-6 pb-6">
                    <p className="text-[#f5f0e8]/60 text-sm leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA / Contact ─── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("success");
    setTimeout(() => setStatus(null), 4000);
    setForm({ name: "", email: "", company: "", message: "" });
  };

  return (
    <section id="contato" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <Reveal>
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#c49a3c] mb-4 block">
                Contato
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8] mb-6">
                Vamos construir<br />
                <span style={{
                  background: "linear-gradient(135deg, #c49a3c, #e8c060)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>seu agente de IA?</span>
              </h2>
              <p className="text-[#f5f0e8]/60 leading-relaxed mb-10">
                Agende uma conversa com nosso time. Vamos entender o seu negócio e apresentar a solução ideal para você.
              </p>

              {/* Contact info */}
              <div className="space-y-5">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 hover:border-[#c49a3c]/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#c49a3c]/10 flex items-center justify-center text-[#c49a3c] group-hover:bg-[#c49a3c]/20 transition-colors">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-[#f5f0e8]/40 mb-0.5">WhatsApp</p>
                    <p className="text-sm font-medium text-[#f5f0e8]">Chamar agora</p>
                  </div>
                </a>

                <a href="mailto:contato@4him.tech"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 hover:border-[#c49a3c]/30 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#c49a3c]/10 flex items-center justify-center text-[#c49a3c] group-hover:bg-[#c49a3c]/20 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-[#f5f0e8]/40 mb-0.5">E-mail</p>
                    <p className="text-sm font-medium text-[#f5f0e8]">contato@4him.tech</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/8">
                  <div className="w-10 h-10 rounded-xl bg-[#c49a3c]/10 flex items-center justify-center text-[#c49a3c]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-[#f5f0e8]/40 mb-0.5">Localização</p>
                    <p className="text-sm font-medium text-[#f5f0e8]">São Paulo, Brasil</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — Form */}
          <Reveal delay={150}>
            <form onSubmit={handleSubmit} className="p-8 rounded-3xl border border-white/8 bg-white/[0.02] space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#f5f0e8]/40 mb-1.5 block font-medium">Nome *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/20 focus:outline-none focus:border-[#c49a3c]/50 transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#f5f0e8]/40 mb-1.5 block font-medium">Empresa *</label>
                  <input
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/20 focus:outline-none focus:border-[#c49a3c]/50 transition-colors"
                    placeholder="Sua empresa"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#f5f0e8]/40 mb-1.5 block font-medium">E-mail *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/20 focus:outline-none focus:border-[#c49a3c]/50 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="text-xs text-[#f5f0e8]/40 mb-1.5 block font-medium">Mensagem</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/20 focus:outline-none focus:border-[#c49a3c]/50 transition-colors resize-none"
                  placeholder="Conte sobre seu negócio e o que deseja automatizar..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-[#050505] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(196,154,60,0.3)]"
                style={{ background: "linear-gradient(135deg, #c49a3c, #e8c060)" }}
              >
                {status === "success" ? "✓ Mensagem enviada!" : "Enviar mensagem"}
              </button>

              <p className="text-xs text-[#f5f0e8]/30 text-center">
                Respondemos em até 24 horas úteis
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src={LOGO_FULL_WHITE_URL} alt="4Him Technology" className="h-8 w-auto mb-4" />
            <p className="text-sm text-[#f5f0e8]/40 leading-relaxed max-w-xs">
              Agentes de IA personalizados que trabalham pelo seu negócio 24 horas por dia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#f5f0e8]/30 mb-4">Produtos</h4>
            <ul className="space-y-3">
              {["ELO4H", "4Hbel"].map((item) => (
                <li key={item}>
                  <a href="#produtos" className="text-sm text-[#f5f0e8]/50 hover:text-[#c49a3c] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-[#f5f0e8]/30 mb-4">Empresa</h4>
            <ul className="space-y-3">
              {[
                { label: "Soluções", href: "#solucoes" },
                { label: "Como funciona", href: "#processo" },
                { label: "FAQ", href: "#faq" },
                { label: "Contato", href: "#contato" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-[#f5f0e8]/50 hover:text-[#c49a3c] transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#f5f0e8]/30">
            © {year} 4Him Technology. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#f5f0e8]/30 hover:text-[#c49a3c] transition-colors">Privacidade</a>
            <a href="#" className="text-xs text-[#f5f0e8]/30 hover:text-[#c49a3c] transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Scroll to top ─── */
function ScrollToTop({ scrollProgress }) {
  if (scrollProgress < 20) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-[#c49a3c] text-[#050505] flex items-center justify-center shadow-lg hover:bg-[#e8c060] hover:scale-110 transition-all duration-200"
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
      <Stats />
      <Bottlenecks />
      <BentoGrid />
      <Products />
      <Process />
      <FAQ />
      <Contact />
      <Footer />
      <ScrollToTop scrollProgress={scrollProgress} />
    </div>
  );
}
