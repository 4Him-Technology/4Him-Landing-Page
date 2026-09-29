import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, Menu, X, ChevronUp, MessageCircle, MessageSquare, Mail, MapPin, Headphones,
  Check, Bot, Puzzle, Blocks, Boxes, BrainCircuit, Building2, Globe, Users, ShieldCheck,
  Wallet, Search, Layers, Code2, Rocket, RefreshCw, Network, UserCheck, TrendingUp,
  SlidersHorizontal, Sparkles, LayoutDashboard, CheckCircle2,
} from "lucide-react";

const LOGO_ICON_URL = "/images/logo-icon.png";
const WHATSAPP_URL  = "https://wa.me/5511974514678";

const GOLD        = "#c49a3c";
const GOLD_LIGHT  = "#e8c060";
const CREAM       = "#f5f0e8";
const SERIF       = '"Cormorant Garamond","Playfair Display",Georgia,serif';
const GOLD_BTN_BG = "linear-gradient(135deg,#96682c,#e8c060)";

/* Hooks */
function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  // começa em false para o primeiro render bater com o HTML pré-renderizado
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.(query);
    if (!m) return;
    setReduced(m.matches);
    if (!m.addEventListener) return;
    const fn = (e) => setReduced(e.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function useInView(ref, threshold = 0.15) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setV(true),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return v;
}

function useTypewriterOnce(text, speed = 55, active = true) {
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active || reduced || n >= text.length) return;
    const t = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(t);
  }, [active, reduced, n, text, speed]);
  return reduced ? text : text.slice(0, n);
}

function Reveal({ children, delay = 0, className = "", from = "bottom" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const init = {
    bottom: "translateY(28px)",
    left: "translateX(-32px)",
    right: "translateX(32px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0,0)" : (init[from] || init.bottom),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* Entrada do hero só com CSS: aparece mesmo antes do JavaScript carregar
   (importa para o HTML pré-renderizado e para o LCP). */
function HeroIn({ children, delay = 0 }) {
  return <div style={{ animation: `heroIn 800ms cubic-bezier(.16,1,.3,1) ${delay}ms both` }}>{children}</div>;
}

/* Trecho em itálico dourado. Com `type`, é digitado quando entra na tela;
   o texto completo fica reservado (sem pulo de layout) e disponível para leitor de tela. */
const GOLD_TEXT = {
  fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
  background: "linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)",
  backgroundSize: "200% 100%",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  animation: "shimmer4h 6s linear infinite",
  paddingBottom: "0.14em", lineHeight: 1.25,
};

function Gold({ text, type = true, speed = 55 }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.5);
  const typed = useTypewriterOnce(text, speed, type && inView);
  if (!type) return <span style={{ ...GOLD_TEXT, display: "inline-block" }}>{text}</span>;
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block", textAlign: "left" }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden style={{ ...GOLD_TEXT, display: "inline-block", visibility: "hidden" }}>{text}</span>
      <span aria-hidden style={{ ...GOLD_TEXT, position: "absolute", inset: 0 }}>{typed}</span>
    </span>
  );
}

function SectionHead({ eyebrow, title, sub, subWidth = 620 }) {
  return (
    <div className="text-center" style={{ marginBottom: 56 }}>
      <Reveal>
        <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: GOLD, marginBottom: 16 }}>
          {eyebrow}
        </div>
        <h2 className="font-extrabold" style={{ fontSize: "clamp(30px,4.5vw,58px)", letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 18px" }}>
          {title}
        </h2>
        {sub && (
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(245,240,232,.58)", maxWidth: subWidth, margin: "0 auto" }}>
            {sub}
          </p>
        )}
      </Reveal>
    </div>
  );
}

/* Conteúdo */
const NAV_LINKS = [
  ["inicio",           "Início"],
  ["consultoria",      "A Consultoria"],
  ["como-trabalhamos", "Como Trabalhamos"],
  ["solucoes",         "Soluções"],
  ["contato",          "Contato"],
];

const GENERIC_TOOLS = [
  { icon: MessageSquare, label: "Chatbot genérico",     rot: -3 },
  { icon: Bot,           label: "Assistente de IA",     rot: 2 },
  { icon: Boxes,         label: "Agente “tudo-em-um”",  rot: -1.5 },
  { icon: Puzzle,        label: "Plugin de automação",  rot: 3 },
  { icon: Blocks,        label: "Ferramenta no-code",   rot: -2 },
];

const ORBIT_LEFT  = ["Processos", "Fluxos de trabalho", "Gargalos"];
const ORBIT_RIGHT = ["Gestão de dados", "Atendimento", "Oportunidades"];

const GENERIC_VS = [
  "Solução pronta",
  "Implantação isolada",
  "O time precisa se adaptar",
  "Pode não resolver o problema real",
  "Foco na tecnologia",
];

const CUSTOM_VS = [
  "Desenvolvido para a operação",
  "Processos analisados previamente",
  "Tecnologia adaptada ao negócio",
  "Implantação acompanhada",
  "Foco em produtividade e eficiência",
];

const PROCESS = [
  {
    n: "01", t: "Diagnóstico", icon: Search,
    lead: "Entendemos antes de desenvolver.",
    desc: "Mapeamos sua operação, processos, fluxos, gargalos, necessidades e oportunidades de melhoria.",
    listTitle: "O que analisamos",
    list: ["Processos", "Fluxos de trabalho", "Gargalos", "Retrabalho", "Comunicação", "Gestão de dados",
      "Atendimento", "Oportunidades de automação", "Possibilidades de aplicação de IA"],
  },
  {
    n: "02", t: "Projeto", icon: Layers,
    lead: "Transformamos necessidades em uma solução.",
    desc: "A partir do diagnóstico, desenhamos a arquitetura da solução e definimos quais tecnologias realmente fazem sentido.",
    highlight: "Com IA, sem IA ou com uma combinação de tecnologias: a solução é definida pela necessidade do negócio.",
  },
  {
    n: "03", t: "Desenvolvimento", icon: Code2,
    lead: "Construímos o sistema.",
    desc: "Desenvolvimento de plataformas, sistemas, integrações, automações, interfaces e agentes inteligentes personalizados.",
    listTitle: "O que desenvolvemos",
    list: ["Plataformas", "Sistemas", "Integrações", "Automações", "Interfaces", "Agentes inteligentes personalizados"],
  },
  {
    n: "04", t: "Implantação", icon: Rocket,
    lead: "Colocamos a solução para funcionar.",
    desc: "A implantação acontece junto ao time, buscando não apenas entregar tecnologia, mas garantir utilização e adoção.",
    listTitle: "Nosso foco",
    list: ["Junto ao time", "Utilização", "Adoção"],
  },
  {
    n: "05", t: "Evolução", icon: RefreshCw,
    lead: "O sistema acompanha a evolução da operação.",
    desc: "Após a implantação, a solução pode ser aprimorada conforme novas necessidades, processos e oportunidades sejam identificados.",
    listTitle: "Evolui com",
    list: ["Novas necessidades", "Novos processos", "Novas oportunidades"],
  },
];

const AI_FLOW = ["Problema", "Diagnóstico", "Estratégia", "Tecnologia", "Sistema", "Resultado"];

const SOLUTIONS = [
  { icon: BrainCircuit,    title: "Inteligência Artificial & Agentes",
    items: ["Agentes de IA", "Atendimento inteligente", "Automação de processos", "Assistentes internos", "Integração de múltiplos agentes", "IA aplicada à operação"] },
  { icon: LayoutDashboard, title: "Sistemas de Gestão",
    items: ["Sistemas financeiros", "Gestão de pessoas", "Gestão de recursos", "Controle patrimonial", "Gestão de estoque", "Controle de pedidos"] },
  { icon: MessageCircle,   title: "Atendimento & Relacionamento",
    items: ["Atendimento via WhatsApp", "Sistemas de atendimento", "Call centers inteligentes", "Integração com agendas", "Automação de atendimento"] },
  { icon: Building2,       title: "Plataformas Corporativas",
    items: ["Sistemas personalizados", "Dashboards", "Gestão de processos", "Plataformas de treinamento", "Gestão de riscos", "Sistemas internos"] },
  { icon: Globe,           title: "Sites & Experiências Digitais",
    items: ["Sites profissionais", "Sites integrados a sistemas", "Chatbots", "Portais personalizados", "Integrações"] },
];

const CASES = [
  { icon: Wallet,        area: "Financeiro",   title: "Sistemas financeiros" },
  { icon: Users,         area: "Pessoas",      title: "Gestão de recursos humanos" },
  { icon: ShieldCheck,   area: "Riscos",       title: "Gestão de riscos (NR1)" },
  { icon: MessageCircle, area: "Atendimento",  title: "Atendimento via WhatsApp" },
];

const REASONS = [
  { icon: Search,            title: "Diagnóstico antes da tecnologia", desc: "Não começamos pela ferramenta. Começamos pelo problema." },
  { icon: SlidersHorizontal, title: "Personalização",                  desc: "Cada sistema é pensado de acordo com a realidade da operação." },
  { icon: Sparkles,          title: "IA quando faz sentido",           desc: "Utilizamos Inteligência Artificial como parte da solução, quando ela realmente agrega valor." },
  { icon: Network,           title: "Integração",                      desc: "Sistemas, dados, pessoas e processos podem trabalhar de forma integrada." },
  { icon: UserCheck,         title: "Foco em adoção",                  desc: "Não basta entregar um sistema. Ele precisa ser utilizado pelo time." },
  { icon: TrendingUp,        title: "Foco em resultado",               desc: "Nosso objetivo é aumentar produtividade e eficiência." },
];

function generateEKG(seed, width = 2400, baseY = 70) {
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  let x = 0;
  const pts = [`M${x},${baseY}`];
  while (x < width) {
    x += 60 + rnd() * 220;
    pts.push(`L${x},${baseY}`);
    if (x >= width) break;
    const t = Math.floor(rnd() * 4);
    if (t === 0) {
      const a = 30 + rnd() * 35;
      x += 6;  pts.push(`L${x},${baseY + 8}`);
      x += 8;  pts.push(`L${x},${baseY - a}`);
      x += 8;  pts.push(`L${x},${baseY + 14}`);
      x += 10; pts.push(`L${x},${baseY}`);
    } else if (t === 1) {
      const a = 8 + rnd() * 18;
      x += 14; pts.push(`L${x},${baseY - a}`);
      x += 18; pts.push(`L${x},${baseY - a}`);
      x += 14; pts.push(`L${x},${baseY}`);
    } else if (t === 2) {
      const a1 = 18 + rnd() * 22;
      const a2 = 14 + rnd() * 26;
      x += 6; pts.push(`L${x},${baseY - a1}`);
      x += 5; pts.push(`L${x},${baseY + 6}`);
      x += 5; pts.push(`L${x},${baseY - a2}`);
      x += 8; pts.push(`L${x},${baseY}`);
    } else {
      const a = 5 + rnd() * 8;
      x += 12; pts.push(`L${x},${baseY - a}`);
      x += 10; pts.push(`L${x},${baseY + a / 2}`);
      x += 14; pts.push(`L${x},${baseY}`);
    }
  }
  return pts.join(" ");
}

const EKG_PATHS = [generateEKG(7), generateEKG(31), generateEKG(89)];

/* Peças com estado próprio (não re-renderizam a página inteira) */
function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const fn = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.width = `${total > 0 ? (window.scrollY / total) * 100 : 0}%`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div aria-hidden style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 1000, background: "rgba(255,255,255,.04)" }}>
      <div ref={barRef} style={{ height: "100%", width: 0, background: "linear-gradient(90deg,#96682c,#e8c060,#ffe9a8)", transition: "width 80ms linear", borderRadius: 2 }} />
    </div>
  );
}

function MouseGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => {
      if (ref.current) ref.current.style.background =
        `radial-gradient(650px circle at ${e.clientX}px ${e.clientY}px, rgba(196,154,60,.055), transparent 50%)`;
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div ref={ref} aria-hidden className="fixed inset-0 z-0 pointer-events-none" />;
}

function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Voltar ao topo"
      className="fixed flex items-center justify-center transition-all duration-200 hover:scale-110"
      style={{ bottom: 24, right: 24, zIndex: 50, width: 44, height: 44, borderRadius: 12, background: "rgba(10,10,10,.88)", border: "1px solid rgba(196,154,60,.4)", color: GOLD, backdropFilter: "blur(12px)", boxShadow: "0 8px 24px rgba(0,0,0,.5)", animation: "fadeIn4h 300ms ease" }}>
      <ChevronUp className="w-5 h-5" aria-hidden />
    </button>
  );
}

/* Página */
export default function LandingPage() {
  const reduced = usePrefersReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [flowIdx, setFlowIdx] = useState(0);
  const tabRefs = useRef([]);

  const toolsRef = useRef(null);
  const toolsView = useInView(toolsRef, 0.4);

  const flowRef = useRef(null);
  const flowView = useInView(flowRef, 0.4);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  /* luz que percorre a cadeia problema -> resultado */
  useEffect(() => {
    if (!flowView || reduced) return;
    const t = setInterval(() => setFlowIdx((i) => (i + 1) % (AI_FLOW.length + 2)), 900);
    return () => clearInterval(t);
  }, [flowView, reduced]);
  const flowLit = reduced ? AI_FLOW.length - 1 : Math.min(flowIdx, AI_FLOW.length - 1);

  const goTo = (e, id) => {
    e?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    setMenuOpen(false);
  };

  const onTabKey = (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (step + dir + PROCESS.length) % PROCESS.length;
    setStep(next);
    tabRefs.current[next]?.focus();
  };

  const current = PROCESS[step];
  const StepIcon = current.icon;

  return (
    <div className="min-h-screen relative overflow-hidden font-inter" style={{ backgroundColor: "#050505", color: CREAM }}>

      <style>{`
        @keyframes shimmer4h  { from{ background-position:200% 0 } to{ background-position:-200% 0 } }
        @keyframes fadeIn4h   { from{ opacity:0;transform:translateY(10px) } to{ opacity:1;transform:translateY(0) } }
        @keyframes fadeInFast { from{ opacity:0 } to{ opacity:1 } }
        @keyframes heroIn     { from{ opacity:0;transform:translateY(24px) } to{ opacity:1;transform:translateY(0) } }
        @keyframes float1     { 0%,100%{ transform:translate(0,0) } 33%{ transform:translate(60px,-40px) } 66%{ transform:translate(-40px,30px) } }
        @keyframes float2     { 0%,100%{ transform:translate(0,0) } 25%{ transform:translate(-80px,50px) } 75%{ transform:translate(50px,-60px) } }
        @keyframes float3     { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(70px,70px) } }
        @keyframes slidePanel { from{ opacity:0;transform:translateY(16px) } to{ opacity:1;transform:translateY(0) } }
        @keyframes scanline   { 0%{ top:-4px } 100%{ top:104% } }
        @keyframes pulseRing  { 0%{ transform:scale(1);opacity:1 } 100%{ transform:scale(1.5);opacity:0 } }
        @keyframes ekgScroll  { from{ transform:translateX(0) } to{ transform:translateX(-50%) } }
        @keyframes floatH4h   { 0%,100%{ transform:translateY(0) rotate(-2deg) } 50%{ transform:translateY(-18px) rotate(2deg) } }
        @keyframes floatBadge4h { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-9px) } }
        @keyframes spin4h     { from{ transform:rotate(0) } to{ transform:rotate(360deg) } }
        @keyframes toolDrift  { 0%,100%{ transform:translateY(0) rotate(var(--rot)) } 50%{ transform:translateY(-6px) rotate(var(--rot)) } }

        section[id] { scroll-margin-top: 96px; }
        .lp-btn-primary { transition: transform 200ms ease, box-shadow 200ms ease; }
        .lp-btn-primary:hover { transform: scale(1.04); box-shadow: 0 12px 40px rgba(196,154,60,.5); }
        .lp-btn-ghost { transition: border-color 200ms ease, background 200ms ease; }
        .lp-btn-ghost:hover { background: rgba(196,154,60,.08) !important; border-color: rgba(196,154,60,.5) !important; }
        .lp-card { transition: border-color 260ms ease, transform 260ms ease, box-shadow 260ms ease; }
        .lp-card:hover { transform: translateY(-4px); border-color: rgba(196,154,60,.45) !important; box-shadow: 0 0 32px rgba(196,154,60,.12), 0 18px 40px rgba(0,0,0,.5) !important; }
        .lp-navlink { color: rgba(245,240,232,.75); transition: background 200ms ease, color 200ms ease; }
        .lp-navlink:hover { background: rgba(196,154,60,.12); color: #f5f0e8; }
        .lp-tab { transition: all 300ms ease; }
        button:focus-visible, a:focus-visible { outline:2px solid #c49a3c; outline-offset:3px; border-radius:6px; }
        @media(prefers-reduced-motion:reduce){ *,*::before,*::after{ animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; } }
      `}</style>

      <ScrollProgress />
      <MouseGlow />

      {/* drifting orbs */}
      <div aria-hidden style={{ position: "absolute", top: "-5%", left: "-5%", width: 900, height: 900, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle,rgba(196,154,60,.1),transparent 60%)", filter: "blur(100px)", animation: "float1 28s ease-in-out infinite" }} />
      <div aria-hidden style={{ position: "absolute", top: "40%", right: "-10%", width: 700, height: 700, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle,rgba(150,104,44,.09),transparent 60%)", filter: "blur(80px)", animation: "float2 35s ease-in-out infinite" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "5%", left: "20%", width: 500, height: 500, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle,rgba(196,154,60,.07),transparent 60%)", filter: "blur(70px)", animation: "float3 22s ease-in-out infinite" }} />

      {/* holofote dourado sobre o hero: luz localizada no lugar de textura de fundo */}
      <div aria-hidden className="absolute inset-x-0 top-0 z-0 pointer-events-none" style={{
        height: 1100,
        background: "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(232,192,96,.17), rgba(196,154,60,.06) 45%, transparent 75%)",
      }} />
      <div aria-hidden className="absolute inset-x-0 top-0 z-0 pointer-events-none" style={{
        height: 900,
        background: "conic-gradient(from 180deg at 50% -8%, transparent 162deg, rgba(232,192,96,.07) 172deg, rgba(255,233,168,.11) 180deg, rgba(232,192,96,.07) 188deg, transparent 198deg)",
        maskImage: "linear-gradient(180deg, black 0%, black 35%, transparent 90%)",
        WebkitMaskImage: "linear-gradient(180deg, black 0%, black 35%, transparent 90%)",
      }} />

      {/* mobile menu */}
      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu de navegação"
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ background: "rgba(5,5,5,.97)", backdropFilter: "blur(24px)", animation: "fadeInFast 200ms ease" }}>
          <div className="flex items-center justify-between" style={{ padding: "20px 24px" }}>
            <div className="flex items-center gap-3">
              <img src={LOGO_ICON_URL} alt="4Him" className="h-9 w-auto" />
              <div>
                <div className="font-bold text-sm" style={{ color: CREAM }}>4Him<span style={{ color: GOLD }}>.</span></div>
                <div className="text-[8px] font-medium uppercase -mt-0.5" style={{ letterSpacing: "0.2em", color: "rgba(245,240,232,.45)" }}>Technology</div>
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu" style={{ color: "rgba(245,240,232,.8)", padding: 8, borderRadius: 8 }}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav aria-label="Menu móvel" className="flex flex-col items-center justify-center flex-1 gap-1">
            {NAV_LINKS.map(([id, label], i) => (
              <a key={id} href={`#${id}`} onClick={(e) => goTo(e, id)}
                className="font-extrabold py-3 px-8 transition-colors duration-200 hover:text-[#c49a3c]"
                style={{ fontSize: "clamp(28px,8vw,40px)", color: "rgba(245,240,232,.85)", letterSpacing: "-0.03em", textDecoration: "none", animation: `fadeIn4h 300ms ease ${i * 60}ms both` }}>
                {label}
              </a>
            ))}
            <a href="#contato" onClick={(e) => goTo(e, "contato")} className="lp-btn-primary font-bold rounded-full text-center"
              style={{ marginTop: 24, padding: "16px 28px", width: "min(340px, 85vw)", background: GOLD_BTN_BG, color: "#050505", fontSize: 15, textDecoration: "none", boxShadow: "0 8px 32px rgba(196,154,60,.4)", animation: "fadeIn4h 300ms ease 300ms both" }}>
              Fale com um consultor
            </a>
          </nav>
        </div>
      )}

      {/* NAV */}
      <nav className="sticky z-50 flex items-center justify-between" aria-label="Navegação principal"
        style={{ top: 16, margin: "16px clamp(12px,3vw,32px) 0", padding: "12px 20px", background: "rgba(10,10,10,.7)", backdropFilter: "blur(24px) saturate(1.4)", WebkitBackdropFilter: "blur(24px) saturate(1.4)", border: "1px solid rgba(196,154,60,.18)", borderRadius: 100, boxShadow: "0 16px 48px -16px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.04)" }}>
        <a href="#inicio" onClick={(e) => goTo(e, "inicio")} className="flex items-center gap-3" style={{ textDecoration: "none" }} aria-label="4Him Technology, voltar ao início">
          <img src={LOGO_ICON_URL} alt="" className="h-9 w-auto" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold" style={{ color: CREAM, letterSpacing: "-0.01em" }}>4Him<span style={{ color: GOLD }}>.</span></div>
            <div className="text-[8px] font-medium uppercase -mt-0.5" style={{ letterSpacing: "0.2em", color: "rgba(245,240,232,.45)" }}>Technology</div>
          </div>
        </a>
        <div className="hidden lg:flex gap-1 p-1 rounded-full" style={{ background: "rgba(0,0,0,.3)", border: "1px solid rgba(196,154,60,.08)" }}>
          {NAV_LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => goTo(e, id)}
              className="lp-navlink px-3.5 py-[7px] text-xs font-medium rounded-full" style={{ textDecoration: "none" }}>
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href="#contato" onClick={(e) => goTo(e, "contato")}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-full lp-btn-primary"
            style={{ background: GOLD_BTN_BG, color: "#050505", textDecoration: "none", boxShadow: "0 4px 20px rgba(196,154,60,.4)" }}>
            Fale com um consultor <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </a>
          <button className="lg:hidden flex items-center justify-center" onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu" aria-expanded={menuOpen}
            style={{ color: CREAM, padding: 8, borderRadius: 8, background: "rgba(196,154,60,.1)", border: "1px solid rgba(196,154,60,.2)" }}>
            <Menu className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </nav>

      <main>
        {/* 01. HERO */}
        <section id="inicio" className="relative z-10 text-center" style={{ padding: "clamp(80px,12vw,130px) 24px clamp(72px,10vw,110px)", maxWidth: 1400, margin: "0 auto" }}>
          <HeroIn>
            <div className="inline-flex items-center gap-2.5 text-xs font-medium rounded-full"
              style={{ padding: "7px 18px", border: "1px solid rgba(196,154,60,.3)", color: GOLD, background: "rgba(196,154,60,.06)", marginBottom: 40 }}>
              <span aria-hidden className="rounded-full" style={{ width: 6, height: 6, background: GOLD_LIGHT, boxShadow: "0 0 12px #e8c060" }} />
              Consultoria de sistemas inteligentes
            </div>
          </HeroIn>

          <HeroIn delay={100}>
            <h1 className="font-extrabold" style={{ fontSize: "clamp(36px,6vw,92px)", letterSpacing: "-0.045em", lineHeight: 1.02, margin: "0 auto 36px", maxWidth: 1200, color: CREAM }}>
              A tecnologia certa não é ter mais ferramentas.{" "}
              <span style={{ display: "block", marginTop: "0.12em", letterSpacing: "-0.02em" }}>
                <Gold text="É ter o sistema certo." type={false} />
              </span>
            </h1>
          </HeroIn>

          <HeroIn delay={250}>
            <p style={{ fontSize: "clamp(15px,1.5vw,20px)", lineHeight: 1.65, color: "rgba(245,240,232,.64)", maxWidth: 720, margin: "0 auto 48px" }}>
              Somos uma consultoria de sistemas inteligentes. Analisamos sua operação, identificamos oportunidades
              de melhoria e desenvolvemos soluções personalizadas, com IA integrada quando ela realmente faz sentido.
            </p>
          </HeroIn>

          <HeroIn delay={400}>
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
              <a href="#consultoria" onClick={(e) => goTo(e, "consultoria")} className="lp-btn-primary font-bold rounded-full"
                style={{ padding: "17px 32px", background: GOLD_BTN_BG, color: "#050505", fontSize: 14, textDecoration: "none", boxShadow: "0 10px 36px rgba(196,154,60,.5), inset 0 1px 0 rgba(255,255,255,.25)" }}>
                Conheça nossa consultoria →
              </a>
              <a href="#solucoes" onClick={(e) => goTo(e, "solucoes")} className="lp-btn-ghost font-semibold rounded-full"
                style={{ padding: "17px 32px", background: "rgba(255,255,255,.025)", color: CREAM, border: "1px solid rgba(196,154,60,.25)", fontSize: 14, textDecoration: "none" }}>
                Ver soluções
              </a>
            </div>
          </HeroIn>
        </section>

        {/* 02. O PROBLEMA */}
        <section id="problema" className="relative z-10" style={{ padding: "100px 24px", borderTop: "1px solid rgba(196,154,60,.1)" }}>
          <div className="mx-auto" style={{ maxWidth: 1100 }}>
            <SectionHead
              eyebrow="O problema"
              title={<>Sua empresa não precisa de <Gold text="mais uma ferramenta." /></>}
              sub="Vivemos uma verdadeira onda de Agentes de Inteligência Artificial, automações e novas tecnologias. Mas, em meio a tantas opções, fica cada vez mais difícil saber o que realmente pode gerar resultado para a sua operação."
              subWidth={700}
            />

            <ul ref={toolsRef} className="flex flex-wrap justify-center gap-3 md:gap-4" style={{ margin: "0 auto 64px", maxWidth: 900, padding: 0, listStyle: "none" }}>
              {GENERIC_TOOLS.map(({ icon: Icon, label, rot }, i) => (
                <li key={label} className="relative flex items-center gap-2.5 rounded-2xl font-semibold"
                  style={{
                    "--rot": `${rot}deg`,
                    padding: "14px 20px", fontSize: 14,
                    background: "rgba(14,14,14,.85)", border: "1px solid rgba(245,240,232,.1)",
                    color: toolsView ? "rgba(245,240,232,.42)" : "rgba(245,240,232,.85)",
                    boxShadow: "0 10px 28px rgba(0,0,0,.45)",
                    animation: `toolDrift ${5 + i * 0.6}s ease-in-out ${i * 0.4}s infinite`,
                    transition: `color 500ms ease ${600 + i * 180}ms`,
                  }}>
                  <Icon className="w-4 h-4 shrink-0" style={{ color: "rgba(245,240,232,.4)" }} aria-hidden />
                  {label}
                  <span aria-hidden style={{
                    position: "absolute", left: 14, right: 14, top: "50%", height: 1.5, borderRadius: 2,
                    background: "rgba(232,192,96,.7)", transformOrigin: "left",
                    transform: toolsView ? "scaleX(1)" : "scaleX(0)",
                    transition: `transform 500ms cubic-bezier(.65,0,.35,1) ${600 + i * 180}ms`,
                  }} />
                </li>
              ))}
            </ul>

            <Reveal delay={200}>
              <div className="text-center mx-auto" style={{ maxWidth: 820 }}>
                <p style={{ fontSize: "clamp(18px,2vw,24px)", color: "rgba(245,240,232,.6)", margin: "0 0 10px" }}>
                  A pergunta não é “qual ferramenta eu compro?”
                </p>
                <p className="font-extrabold" style={{ fontSize: "clamp(26px,3.6vw,46px)", letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0 }}>
                  É: <Gold text="o que a minha operação realmente precisa?" speed={45} />
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 03. A CONSULTORIA */}
        <section id="consultoria" className="relative z-10" style={{ padding: "110px 24px", borderTop: "1px solid rgba(196,154,60,.1)" }}>
          <div className="mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center" style={{ maxWidth: 1250 }}>
            <div>
              <Reveal>
                <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: GOLD, marginBottom: 16 }}>
                  A consultoria
                </div>
                <h2 className="font-extrabold" style={{ fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 24px" }}>
                  Por que uma consultoria de <Gold text="sistemas inteligentes?" />
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="font-semibold" style={{ fontSize: "clamp(17px,1.6vw,21px)", lineHeight: 1.55, color: CREAM, margin: "0 0 18px" }}>
                  Porque antes de desenvolver qualquer sistema, nós precisamos entender o seu negócio.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "rgba(245,240,232,.62)", margin: "0 0 18px" }}>
                  Analisamos processos, identificamos gargalos e oportunidades e, a partir dessa compreensão, projetamos
                  e desenvolvemos sistemas capazes de tornar a operação mais produtiva, eficiente e inteligente.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "rgba(245,240,232,.62)", margin: "0 0 32px" }}>
                  Sua operação pode e precisa melhorar, e sim, a tecnologia é a solução que você está buscando. Talvez você
                  só não saiba como aplicá-la. Mas nós sabemos.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <div style={{ padding: "22px 26px", borderRadius: 18, borderLeft: `3px solid ${GOLD}`, background: "linear-gradient(90deg,rgba(196,154,60,.1),rgba(196,154,60,0))" }}>
                  <p className="font-bold" style={{ fontSize: "clamp(17px,1.7vw,22px)", lineHeight: 1.45, margin: 0, letterSpacing: "-0.01em" }}>
                    A tecnologia é o meio.{" "}
                    <span style={{ color: GOLD_LIGHT }}>O resultado da operação é o objetivo.</span>
                  </p>
                </div>
              </Reveal>
            </div>

            {/* H + anéis + badges do que analisamos */}
            <Reveal delay={150} from="right">
              <div className="flex items-center justify-center" style={{ gap: "clamp(12px,2vw,28px)" }}>
                <div className="hidden md:flex lg:hidden xl:flex flex-col gap-7 items-end" aria-hidden>
                  {ORBIT_LEFT.map((text, i) => (
                    <div key={text} className="flex items-center gap-2 font-semibold rounded-full whitespace-nowrap"
                      style={{ background: "rgba(10,10,10,.85)", border: "1px solid rgba(196,154,60,.3)", padding: "9px 16px", fontSize: 12, color: CREAM, boxShadow: "0 8px 24px rgba(0,0,0,.4)", animation: `floatBadge4h ${4 + i * 0.5}s ease-in-out infinite ${i * 0.6}s` }}>
                      <span style={{ color: GOLD, fontSize: 8 }}>●</span>{text}
                    </div>
                  ))}
                </div>
                <div className="relative flex-shrink-0" style={{ padding: 36 }}>
                  <div aria-hidden className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(196,154,60,.2)", animation: "spin4h 30s linear infinite" }} />
                  <div aria-hidden className="absolute rounded-full" style={{ inset: 18, border: "1px dashed rgba(196,154,60,.15)", animation: "spin4h 20s linear infinite reverse" }} />
                  <div className="flex items-center justify-center" style={{ width: "clamp(170px,20vw,240px)", height: "clamp(170px,20vw,240px)", animation: "floatH4h 6s ease-in-out infinite", filter: "drop-shadow(0 40px 80px rgba(0,0,0,.9)) drop-shadow(0 0 60px rgba(196,154,60,.35))" }}>
                    <img src={LOGO_ICON_URL} alt="" loading="lazy" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="hidden md:flex lg:hidden xl:flex flex-col gap-7 items-start" aria-hidden>
                  {ORBIT_RIGHT.map((text, i) => (
                    <div key={text} className="flex items-center gap-2 font-semibold rounded-full whitespace-nowrap"
                      style={{ background: "rgba(10,10,10,.85)", border: "1px solid rgba(196,154,60,.3)", padding: "9px 16px", fontSize: 12, color: CREAM, boxShadow: "0 8px 24px rgba(0,0,0,.4)", animation: `floatBadge4h ${4.5 + i * 0.5}s ease-in-out infinite ${1 + i * 0.6}s` }}>
                      <span style={{ color: GOLD, fontSize: 8 }}>●</span>{text}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 04. DIFERENCIAL */}
        <section id="diferencial" className="relative z-10" style={{ padding: "110px 24px", borderTop: "1px solid rgba(196,154,60,.1)" }}>
          <div className="mx-auto" style={{ maxWidth: 1150 }}>
            <SectionHead
              eyebrow="Nosso diferencial"
              title={<>Não vendemos ferramentas. <Gold text="Construímos sistemas." /></>}
            />

            <div className="relative grid md:grid-cols-2 gap-6 md:gap-10 items-stretch">
              <Reveal from="left" className="h-full">
                <div className="h-full" style={{ padding: "32px 30px", borderRadius: 24, background: "rgba(14,14,14,.7)", border: "1px solid rgba(245,240,232,.08)" }}>
                  <div className="uppercase" style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(245,240,232,.4)", marginBottom: 10 }}>O que o mercado oferece</div>
                  <h3 className="font-bold" style={{ fontSize: 24, color: "rgba(245,240,232,.7)", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Ferramenta genérica</h3>
                  <ul className="flex flex-col gap-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {GENERIC_VS.map((t) => (
                      <li key={t} className="flex items-center gap-3" style={{ fontSize: 15, color: "rgba(245,240,232,.5)" }}>
                        <span aria-hidden className="flex items-center justify-center shrink-0" style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(245,240,232,.05)", border: "1px solid rgba(245,240,232,.1)" }}>
                          <X className="w-3 h-3" strokeWidth={3} style={{ color: "rgba(245,240,232,.4)" }} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <div aria-hidden className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 flex justify-center">
                <div className="font-black flex items-center justify-center" style={{ width: 64, height: 64, borderRadius: "50%", fontSize: 16, color: "#050505", background: GOLD_BTN_BG, boxShadow: "0 0 0 8px #050505, 0 0 40px rgba(196,154,60,.5)" }}>
                  VS.
                </div>
              </div>

              <Reveal from="right" delay={120} className="h-full">
                <div className="h-full relative overflow-hidden" style={{ padding: "32px 30px", borderRadius: 24, background: "linear-gradient(155deg,rgba(196,154,60,.14),rgba(10,10,10,.85))", border: "1px solid rgba(196,154,60,.45)", boxShadow: "0 0 48px rgba(196,154,60,.14), 0 24px 48px rgba(0,0,0,.5)" }}>
                  <div aria-hidden style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,rgba(196,154,60,.18),transparent 65%)", filter: "blur(30px)" }} />
                  <div className="relative">
                    <div className="uppercase" style={{ fontSize: 10, letterSpacing: "0.25em", color: GOLD, marginBottom: 10 }}>O que a 4Him constrói</div>
                    <h3 className="font-bold" style={{ fontSize: 24, color: CREAM, margin: "0 0 24px", letterSpacing: "-0.02em" }}>Sistema sob medida</h3>
                    <ul className="flex flex-col gap-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {CUSTOM_VS.map((t) => (
                        <li key={t} className="flex items-center gap-3" style={{ fontSize: 15, color: "rgba(245,240,232,.9)" }}>
                          <span aria-hidden className="flex items-center justify-center shrink-0" style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg,#96682c,#c49a3c)" }}>
                            <Check className="w-3 h-3" strokeWidth={4} style={{ color: "#050505" }} />
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 05. COMO TRABALHAMOS */}
        <section id="como-trabalhamos" className="relative z-10" style={{ padding: "110px 24px", borderTop: "1px solid rgba(196,154,60,.1)" }}>
          <div className="mx-auto" style={{ maxWidth: 1250 }}>
            <SectionHead
              eyebrow="Como trabalhamos"
              title={<>Da operação ao <Gold text="sistema." /></>}
              sub="Cinco etapas, do entendimento do seu negócio à evolução contínua da solução."
            />

            <div className="relative" style={{ marginBottom: 32 }}>
              <div aria-hidden className="hidden md:block absolute" style={{ top: 30, left: "10%", right: "10%", height: 2, background: "rgba(196,154,60,.12)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${(step / (PROCESS.length - 1)) * 100}%`, background: "linear-gradient(90deg,#96682c,#e8c060,#ffe9a8)", transition: "width 600ms cubic-bezier(.34,1,.64,1)", borderRadius: 2, boxShadow: "0 0 12px rgba(196,154,60,.5)" }} />
              </div>

              <div role="tablist" aria-label="Etapas do método" className="relative grid grid-cols-5 gap-1 md:gap-4" onKeyDown={onTabKey}>
                {PROCESS.map((p, i) => {
                  const active = i === step;
                  const done = i <= step;
                  return (
                    <button key={p.n} ref={(el) => (tabRefs.current[i] = el)}
                      role="tab" id={`etapa-tab-${i}`} aria-selected={active} aria-controls="etapa-painel"
                      tabIndex={active ? 0 : -1} onClick={() => setStep(i)}
                      className="lp-tab flex flex-col items-center gap-3">
                      <span className="font-extrabold flex items-center justify-center relative" style={{
                        width: "clamp(44px,5vw,60px)", height: "clamp(44px,5vw,60px)", borderRadius: 16, fontSize: "clamp(14px,1.4vw,18px)",
                        background: done ? "linear-gradient(135deg,#96682c,#c49a3c)" : "rgba(20,20,20,.9)",
                        color: done ? "#050505" : "rgba(245,240,232,.45)",
                        border: done ? "none" : "1px solid rgba(196,154,60,.2)",
                        boxShadow: active ? "0 8px 32px rgba(196,154,60,.55), inset 0 1px 0 rgba(255,255,255,.2)" : "none",
                        transition: "all 400ms ease",
                      }}>
                        {p.n}
                        {active && <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 16, border: `2px solid ${GOLD}`, animation: "pulseRing 2.4s ease-out infinite" }} />}
                      </span>
                      <span className="sr-only md:not-sr-only font-bold" style={{ fontSize: "clamp(12px,1.3vw,16px)", color: active ? CREAM : "rgba(245,240,232,.55)", letterSpacing: "-0.01em", transition: "color 300ms ease" }}>
                        {p.t}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div id="etapa-painel" role="tabpanel" aria-labelledby={`etapa-tab-${step}`} key={step}
              style={{ animation: "slidePanel 400ms cubic-bezier(.34,1.4,.64,1)" }}>
              <div style={{ borderRadius: 28, padding: 1, background: "linear-gradient(135deg,rgba(196,154,60,.6),rgba(196,154,60,.1))", boxShadow: "0 0 40px rgba(196,154,60,.12), 0 24px 48px rgba(0,0,0,.6)" }}>
                <div className="relative overflow-hidden grid md:grid-cols-2 gap-10 items-start" style={{ padding: "clamp(26px,4vw,48px)", borderRadius: 27, background: "linear-gradient(135deg,#14100a,#0a0a0a)" }}>
                  <div>
                    <span className="inline-flex items-center gap-2" style={{ padding: "6px 14px", borderRadius: 100, background: "rgba(196,154,60,.12)", border: "1px solid rgba(196,154,60,.35)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD_LIGHT, marginBottom: 20 }}>
                      <StepIcon className="w-3.5 h-3.5" aria-hidden /> {current.n} · {current.t}
                    </span>
                    <h3 className="font-bold" style={{ fontSize: "clamp(22px,2.8vw,34px)", color: CREAM, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                      {current.lead}
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(245,240,232,.66)", margin: 0 }}>{current.desc}</p>
                  </div>
                  <div>
                    {current.highlight ? (
                      <div style={{ padding: "26px 28px", borderRadius: 20, background: "rgba(196,154,60,.08)", border: "1px solid rgba(196,154,60,.3)" }}>
                        <div className="flex items-center gap-2 uppercase" style={{ fontSize: 10, letterSpacing: "0.25em", color: GOLD, marginBottom: 14 }}>
                          <Sparkles className="w-3.5 h-3.5" aria-hidden /> A tecnologia certa
                        </div>
                        <p className="font-semibold" style={{ fontSize: "clamp(17px,1.8vw,22px)", lineHeight: 1.5, color: CREAM, margin: 0 }}>
                          {current.highlight}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(245,240,232,.45)", marginBottom: 16 }}>{current.listTitle}</div>
                        <ul className="flex flex-wrap gap-2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {current.list.map((f, i) => (
                            <li key={f} className="flex items-center gap-2" style={{ padding: "10px 14px", background: "rgba(5,5,5,.5)", border: "1px solid rgba(196,154,60,.16)", borderRadius: 12, fontSize: 13, color: "rgba(245,240,232,.88)", animation: `fadeIn4h 350ms ease ${i * 50}ms both` }}>
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} aria-hidden />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 06. IA COMO PARTE DA SOLUÇÃO */}
        <section id="ia" className="relative z-10" style={{ padding: "110px 24px", borderTop: "1px solid rgba(196,154,60,.1)" }}>
          <div className="mx-auto" style={{ maxWidth: 1200 }}>
            <SectionHead
              eyebrow="IA como parte da solução"
              title={<>IA não é o produto. <Gold text="É parte da solução." /></>}
              sub="É uma das tecnologias que usamos para transformar sua operação. Inteligência Artificial pode transformar processos, atendimento, análise de dados e tomada de decisão. Mas nem todo problema precisa de um agente de IA. Por isso, antes de escolher a tecnologia, entendemos o problema."
              subWidth={760}
            />

            <ol ref={flowRef} aria-label="Do problema ao resultado" className="flex flex-wrap justify-center items-center gap-y-4" style={{ listStyle: "none", padding: 0, margin: "0 auto 64px" }}>
              {AI_FLOW.map((label, i) => {
                const lit = i <= flowLit;
                const last = i === AI_FLOW.length - 1;
                return (
                  <li key={label} className="flex items-center">
                    <span className="font-bold rounded-full" style={{
                      padding: "12px clamp(14px,1.6vw,22px)", fontSize: "clamp(12px,1.2vw,15px)",
                      background: lit ? (last ? GOLD_BTN_BG : "rgba(196,154,60,.14)") : "rgba(14,14,14,.8)",
                      color: lit ? (last ? "#050505" : CREAM) : "rgba(245,240,232,.45)",
                      border: `1px solid ${lit ? "rgba(196,154,60,.55)" : "rgba(245,240,232,.08)"}`,
                      boxShadow: lit && i === flowLit ? "0 0 28px rgba(196,154,60,.4)" : "none",
                      transition: "all 400ms ease",
                    }}>
                      {label}
                    </span>
                    {!last && (
                      <ArrowRight aria-hidden className="shrink-0" style={{ width: 18, height: 18, margin: "0 clamp(4px,.8vw,10px)", color: i < flowLit ? GOLD_LIGHT : "rgba(245,240,232,.2)", transition: "color 400ms ease" }} />
                    )}
                  </li>
                );
              })}
            </ol>

            <Reveal>
              <div className="relative overflow-hidden text-center mx-auto" style={{ maxWidth: 900, padding: "clamp(32px,5vw,56px) clamp(24px,5vw,64px)", borderRadius: 28, background: "linear-gradient(135deg,rgba(150,104,44,.2),rgba(10,10,10,.85))", border: "1px solid rgba(196,154,60,.3)" }}>
                <div aria-hidden style={{ position: "absolute", left: 0, right: 0, height: 4, background: "linear-gradient(90deg,transparent,rgba(196,154,60,.1),transparent)", animation: "scanline 5s ease-in-out infinite", top: 0 }} />
                <p style={{ fontSize: "clamp(17px,1.9vw,23px)", color: "rgba(245,240,232,.6)", margin: "0 0 12px" }}>
                  A pergunta não é “onde colocar IA?”
                </p>
                <p className="font-extrabold" style={{ fontSize: "clamp(24px,3.2vw,40px)", letterSpacing: "-0.03em", lineHeight: 1.25, margin: 0 }}>
                  É “onde a inteligência pode <Gold text="gerar valor para a operação?”" speed={45} />
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 07. SOLUÇÕES */}
        <section id="solucoes" className="relative z-10" style={{ padding: "110px 24px", borderTop: "1px solid rgba(196,154,60,.1)" }}>
          <div className="mx-auto" style={{ maxWidth: 1250 }}>
            <SectionHead
              eyebrow="Soluções"
              title={<>Soluções desenvolvidas para a <Gold text="sua operação." /></>}
              sub="Cada empresa possui processos, desafios e necessidades diferentes. Por isso, desenvolvemos sistemas personalizados para diferentes áreas e objetivos."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
              {SOLUTIONS.map(({ icon: Icon, title, items }, i) => (
                <Reveal key={title} delay={i * 80} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}>
                  <div className="lp-card h-full relative overflow-hidden" style={{ padding: "28px 28px 30px", borderRadius: 24, background: "linear-gradient(155deg,rgba(196,154,60,.07),rgba(10,10,10,.85))", border: "1px solid rgba(196,154,60,.16)", boxShadow: "0 12px 32px rgba(0,0,0,.35)" }}>
                    <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(196,154,60,.1)", border: "1px solid rgba(196,154,60,.28)", color: GOLD_LIGHT, marginBottom: 20 }}>
                      <Icon className="w-5 h-5" aria-hidden />
                    </div>
                    <h3 className="font-bold" style={{ fontSize: 19, color: CREAM, margin: "0 0 18px", letterSpacing: "-0.01em" }}>{title}</h3>
                    <ul className={`grid gap-2 ${i < 3 ? "" : "sm:grid-cols-2"}`} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {items.map((it) => (
                        <li key={it} className="flex items-center gap-2.5" style={{ fontSize: 14, color: "rgba(245,240,232,.72)" }}>
                          <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, boxShadow: "0 0 6px rgba(196,154,60,.8)", flexShrink: 0 }} />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 08. CASES */}
        <section id="cases" className="relative z-10" style={{ padding: "110px 24px", borderTop: "1px solid rgba(196,154,60,.1)" }}>
          <div className="mx-auto" style={{ maxWidth: 1250 }}>
            <SectionHead
              eyebrow="Cases"
              title={<>Sistemas que já colocamos em <Gold text="produção." /></>}
              sub="Já desenvolvemos projetos para diversas áreas, oferecendo soluções que realmente funcionam para setores, empresas e segmentos distintos."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginBottom: 20 }}>
              {CASES.map(({ icon: Icon, area, title }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className="lp-card h-full flex flex-col" style={{ padding: "26px 24px", borderRadius: 22, background: "rgba(10,10,10,.7)", border: "1px solid rgba(196,154,60,.16)" }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 28 }}>
                      <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(196,154,60,.1)", border: "1px solid rgba(196,154,60,.28)", color: GOLD_LIGHT }}>
                        <Icon className="w-5 h-5" aria-hidden />
                      </div>
                      <span className="flex items-center gap-1.5" style={{ fontSize: 11, color: "rgba(245,240,232,.55)" }}>
                        <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
                        Em produção
                      </span>
                    </div>
                    <div className="uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", color: GOLD, marginBottom: 8 }}>{area}</div>
                    <h3 className="font-bold" style={{ fontSize: 18, color: CREAM, margin: 0, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{title}</h3>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-5" style={{ padding: "26px 30px", borderRadius: 22, background: "linear-gradient(90deg,rgba(196,154,60,.12),rgba(10,10,10,.8))", border: "1px dashed rgba(196,154,60,.4)" }}>
                <p style={{ fontSize: 17, color: "rgba(245,240,232,.8)", margin: 0 }}>
                  E muito mais. <strong style={{ color: CREAM }}>Nossa próxima solução pode ser a sua.</strong>
                </p>
                <a href="#contato" onClick={(e) => goTo(e, "contato")} className="lp-btn-ghost font-semibold rounded-full whitespace-nowrap"
                  style={{ padding: "13px 24px", border: "1px solid rgba(196,154,60,.45)", color: GOLD_LIGHT, fontSize: 14, textDecoration: "none" }}>
                  Fale com o nosso time →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 09. POR QUE A 4HIM */}
        <section id="por-que" className="relative z-10" style={{ padding: "110px 24px", borderTop: "1px solid rgba(196,154,60,.1)" }}>
          <div className="mx-auto" style={{ maxWidth: 1250 }}>
            <SectionHead
              eyebrow="Por que a 4Him?"
              title={<>Tecnologia com <Gold text="propósito operacional." /></>}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {REASONS.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 70}>
                  <div className="lp-card h-full" style={{ padding: "28px 28px 30px", borderRadius: 22, background: "linear-gradient(155deg,rgba(196,154,60,.05),rgba(10,10,10,.85))", border: "1px solid rgba(196,154,60,.14)" }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 22 }}>
                      <div className="flex items-center justify-center" style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(196,154,60,.1)", border: "1px solid rgba(196,154,60,.28)", color: GOLD_LIGHT }}>
                        <Icon className="w-5 h-5" aria-hidden />
                      </div>
                      <span aria-hidden style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", color: "rgba(196,154,60,.45)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-bold" style={{ fontSize: 19, color: CREAM, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(245,240,232,.6)", margin: 0 }}>{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 10. CTA + EKG */}
        <section id="contato" className="relative z-10" style={{ padding: "60px 24px 90px" }}>
          <div aria-hidden className="absolute inset-0 flex flex-col justify-center pointer-events-none" style={{ overflow: "hidden", gap: 24 }}>
            {[0, 1, 2].map((idx) => (
              <div key={idx} style={{ position: "relative", width: "100%", height: 140, overflow: "visible", opacity: 0.5 }}>
                <svg style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", animation: `ekgScroll ${16 + idx * 3}s linear infinite`, animationDelay: `${idx * -4}s`, overflow: "visible" }}
                  width="200%" height="100%" viewBox="0 0 2400 140" preserveAspectRatio="none">
                  <path d={EKG_PATHS[idx]} fill="none" stroke={`url(#ekg-${idx})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id={`ekg-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={GOLD} stopOpacity="0" />
                      <stop offset="20%" stopColor={GOLD} stopOpacity=".5" />
                      <stop offset="50%" stopColor="#ffe9a8" stopOpacity="1" />
                      <stop offset="80%" stopColor={GOLD} stopOpacity=".5" />
                      <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            ))}
          </div>

          <Reveal>
            <div className="relative mx-auto overflow-hidden"
              style={{ maxWidth: 1200, borderRadius: 36, background: "linear-gradient(135deg,rgba(150,104,44,.24),rgba(10,10,10,.85))", border: "1px solid rgba(196,154,60,.3)", boxShadow: "0 40px 80px -32px rgba(0,0,0,.9), 0 0 120px rgba(196,154,60,.1)", backdropFilter: "blur(8px)" }}>
              <div aria-hidden style={{ position: "absolute", left: 0, right: 0, height: 4, background: "linear-gradient(90deg,transparent,rgba(196,154,60,.08),transparent)", animation: "scanline 5s ease-in-out infinite", top: 0, zIndex: 0 }} />
              <div aria-hidden style={{ position: "absolute", left: "50%", top: "-60%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(196,154,60,.14),transparent 60%)", filter: "blur(80px)", zIndex: 0 }} />

              <div className="relative z-10 text-center" style={{ padding: "clamp(48px,6vw,88px) clamp(24px,5vw,80px)" }}>
                <div className="inline-flex items-center gap-2.5 text-xs font-medium rounded-full"
                  style={{ padding: "7px 18px", border: "1px solid rgba(196,154,60,.35)", color: GOLD, background: "rgba(196,154,60,.08)", marginBottom: 28 }}>
                  <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD_LIGHT, boxShadow: "0 0 12px #e8c060" }} />
                  Sua operação pode funcionar melhor
                </div>
                <h2 className="font-extrabold" style={{ fontSize: "clamp(30px,4.6vw,62px)", letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 auto 26px", maxWidth: 980, color: CREAM }}>
                  Sua próxima solução pode ser a nossa próxima <Gold text="história de sucesso." />
                </h2>
                <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(245,240,232,.66)", maxWidth: 640, margin: "0 auto 14px", lineHeight: 1.65 }}>
                  Conte-nos como sua empresa funciona, quais desafios enfrenta e onde você acredita que existem oportunidades de melhoria.
                </p>
                <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(245,240,232,.66)", maxWidth: 640, margin: "0 auto 44px", lineHeight: 1.65 }}>
                  Nosso time vai analisar o cenário e entender como podemos desenvolver uma solução para sua operação.
                </p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="lp-btn-primary font-bold rounded-full inline-flex items-center justify-center gap-2.5"
                  style={{ padding: "18px 36px", background: "linear-gradient(135deg,#e8c060,#ffe9a8)", color: "#050505", fontSize: 15, textDecoration: "none", boxShadow: "0 14px 40px rgba(255,233,168,.4), inset 0 1px 0 rgba(255,255,255,.4)" }}>
                  <MessageCircle className="w-4 h-4" aria-hidden />
                  Quero otimizar minha operação
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10" style={{ padding: "64px 24px 32px", borderTop: "1px solid rgba(196,154,60,.12)" }}>
        <div className="mx-auto" style={{ maxWidth: 1300 }}>
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1.2fr]" style={{ marginBottom: 48 }}>
            <div>
              <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                <img src={LOGO_ICON_URL} alt="" loading="lazy" className="h-10 w-auto" />
                <div>
                  <div className="font-bold" style={{ fontSize: 16, color: CREAM }}>4Him</div>
                  <div className="uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(245,240,232,.4)" }}>Technology</div>
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(245,240,232,.5)", maxWidth: 340, margin: 0 }}>
                Consultoria de sistemas inteligentes. Diagnóstico, projeto, desenvolvimento, implantação e evolução de
                soluções personalizadas para a sua operação.
              </p>
            </div>

            {[
              ["Soluções", SOLUTIONS.map((s) => s.title)],
              ["Como trabalhamos", PROCESS.map((p) => p.t)],
              ["Contato", [
                { icon: MessageCircle, label: "+55 11 97451-4678",                  href: WHATSAPP_URL },
                { icon: Mail,          label: "contato@4him.com.br",                href: "mailto:contato@4him.com.br" },
                { icon: MapPin,        label: "Atendimento em todo o Brasil",       href: null },
                { icon: Headphones,    label: "Treinamento presencial sob demanda", href: null },
              ]],
            ].map(([h, items]) => (
              <div key={h}>
                <div className="uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", color: GOLD, marginBottom: 16 }}>{h}</div>
                {items.map((v) => {
                  if (typeof v === "string") return <div key={v} style={{ fontSize: 13, color: "rgba(245,240,232,.65)", padding: "6px 0" }}>{v}</div>;
                  const Icon = v.icon;
                  const inner = <><Icon className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} aria-hidden />{v.label}</>;
                  return v.href
                    ? <a key={v.label} href={v.href} target={v.href.startsWith("http") ? "_blank" : undefined} rel={v.href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center gap-2" style={{ fontSize: 13, color: "rgba(245,240,232,.65)", padding: "6px 0", textDecoration: "none" }}>{inner}</a>
                    : <div key={v.label} className="flex items-center gap-2" style={{ fontSize: 13, color: "rgba(245,240,232,.65)", padding: "6px 0" }}>{inner}</div>;
                })}
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:justify-between gap-2"
            style={{ paddingTop: 24, borderTop: "1px solid rgba(196,154,60,.1)", fontSize: 11, color: "rgba(245,240,232,.35)" }}>
            <div>© {new Date().getFullYear()} 4Him Technology. Todos os direitos reservados.</div>
            <div>A tecnologia é o meio. O resultado da operação é o objetivo.</div>
          </div>
        </div>
      </footer>

      <ScrollTop />
    </div>
  );
}
