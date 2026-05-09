import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight, LayoutDashboard, Menu, X, ChevronUp, MessageCircle,
  MessageSquare, Target, BarChart3, DollarSign, Zap, TrendingUp,
  Mail, MapPin, Globe, Check, Clock, Sparkles, ChevronRight, Lock, Calendar,
  CheckCircle2, Headphones, LineChart, Bot, Megaphone, Lightbulb,
} from "lucide-react";

const LOGO_ICON_URL = "/images/logo-icon.png";
const WHATSAPP_URL  = "https://wa.me/5511974514678";

/* ─────────────────────────────────────────────────────────────
   Hooks (LP3 originais)
───────────────────────────────────────────────────────────── */
function useScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return pct;
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

function useCounter(target, dur = 1600, active = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setN(target); return; }
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, dur, active]);
  return n;
}

function useTypewriter(words, speed = 60, delSpeed = 32, pause = 2200, active = true) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (!active) return;
    const w = words[wi];
    if (!del && ci === w.length) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && ci === 0) {
      setDel(false);
      setWi(i => (i + 1) % words.length);
      return;
    }
    const nx = del ? ci - 1 : ci + 1;
    const t = setTimeout(() => { setCi(nx); setText(w.slice(0, nx)); }, del ? delSpeed : speed);
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed, delSpeed, pause, active]);
  return text;
}

function useTypewriterOnce(text, speed = 70, active = true) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active || done) return;
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setOut(text.slice(0, i));
      if (i < text.length) {
        i++;
        setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };
    tick();
    return () => { cancelled = true; };
  }, [active, text, speed, done]);
  return out;
}

function useTilt(strength = 9) {
  const ref = useRef(null);
  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * strength * 2}deg) rotateX(${-y * strength * 2}deg) translateZ(12px)`;
    el.style.transition = "transform 80ms linear";
  }, [strength]);
  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 450ms cubic-bezier(.34,1.56,.64,1)";
    el.style.transform = "";
  }, []);
  return { ref, onMouseMove, onMouseLeave };
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

/* ─────────────────────────────────────────────────────────────
   Content (mesclado LP3 + LP2)
───────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  ["desafio",  "Seu desafio"],
  ["produtos", "Produtos"],
  ["pilares",  "Pilares"],
  ["metodo",   "Método"],
  ["contato",  "Contato"],
];

const TYPEWRITER_WORDS = [
  "resolve gargalos operacionais.",
  "automatiza seu atendimento.",
  "transforma dados em decisão.",
  "escala sem ampliar equipe.",
  "gera inteligência estratégica.",
];

const AGENT_COLORS = {
  ELO4H:   "#c49a3c",
  "4HBEL": "#a78bfa",
  AD4HN:   "#ec4899",
  MARI4H:  "#34d399",
};

function agentBorder(agents) {
  const colors = agents.map(a => AGENT_COLORS[a]);
  if (colors.length === 1) return colors[0];
  const stops = [];
  colors.forEach((c, i) => {
    const start = (i / colors.length) * 100;
    const end = ((i + 1) / colors.length) * 100;
    stops.push(`${c} ${start}%`, `${c} ${end}%`);
  });
  return `linear-gradient(135deg, ${stops.join(", ")})`;
}

function agentLabel(agents) {
  if (agents.length === 4) return "Todos os agentes";
  return agents.join(" + ");
}

function generateEKG(seed, width = 2400, baseY = 70) {
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  let x = 0;
  const pts = [`M${x},${baseY}`];
  while (x < width) {
    const flat = 60 + rnd() * 220;
    x += flat;
    pts.push(`L${x},${baseY}`);
    if (x >= width) break;
    const t = Math.floor(rnd() * 6);
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
    } else if (t === 3) {
      const a = 28 + rnd() * 32;
      const dir = rnd() > 0.5 ? 1 : -1;
      x += 6;  pts.push(`L${x},${baseY + dir * 4}`);
      x += 5;  pts.push(`L${x},${baseY - dir * a}`);
      x += 12; pts.push(`L${x},${baseY}`);
    } else if (t === 4) {
      const a = 12 + rnd() * 10;
      x += 8;  pts.push(`L${x},${baseY - a}`);
      x += 6;  pts.push(`L${x},${baseY + a / 2}`);
      x += 6;  pts.push(`L${x},${baseY - a / 1.5}`);
      x += 10; pts.push(`L${x},${baseY}`);
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

const BOTTLENECKS = [
  {
    id: "atendimento", icon: MessageSquare, agents: ["ELO4H"],
    title: "Atendimento sobrecarregado",
    pain: "Equipe não dá conta do volume. Respostas lentas, clientes perdidos.",
    product: "ELO4H — Atendimento",
    solution: "Um agente treinado no seu negócio responde em todos os canais 24h, com o tom de voz da sua empresa. Handoff para humano quando necessário.",
    metric: "3× mais capacidade sem contratar",
  },
  {
    id: "leads", icon: Target, agents: ["ELO4H", "AD4HN"],
    title: "Leads sem qualificação",
    pain: "Muitos contatos chegando, poucos convertendo. Tráfego desconectado da triagem comercial.",
    product: "ELO4H — Comercial · AD4HN — Performance",
    solution: "AD4HN entrega tráfego qualificado e ELO4H qualifica + faz follow-up. Só chega ao time comercial quem está pronto para fechar.",
    metric: "↑ taxa de conversão de ponta a ponta",
  },
  {
    id: "dados", icon: BarChart3, agents: ["ELO4H", "4HBEL", "AD4HN", "MARI4H"],
    title: "Decisões sem dados reais",
    pain: "Gestão no escuro. Métricas espalhadas entre canais, financeiro, marketing e operação.",
    product: "Inteligência · todos os agentes",
    solution: "Cada agente alimenta o dashboard central. ELO4H traz operação, 4HBEL traz financeiro, AD4HN traz marketing e MARI4H costura o que faltar — uma única visão estratégica.",
    metric: "→ decisão com dado de toda a operação",
  },
  {
    id: "financeiro", icon: DollarSign, agents: ["4HBEL"],
    title: "Financeiro manual e lento",
    pain: "Conciliações demoradas, sem previsibilidade. BPO caro e ineficiente.",
    product: "4HBEL — BPO Financeiro",
    solution: "IA aplicada ao BPO financeiro. Automação de conciliações, relatórios automatizados e previsibilidade de fluxo de caixa.",
    metric: "↓ custo operacional financeiro",
  },
  {
    id: "conciliacao", icon: LineChart, agents: ["4HBEL", "MARI4H"],
    title: "Conciliação bancária imprecisa",
    pain: "Lançamentos manuais geram erros. Sistemas bancários e contábeis não conversam.",
    product: "4HBEL — Conciliação · MARI4H — Integrações",
    solution: "4HBEL automatiza conciliação e auditoria. MARI4H cria as integrações sob medida com seus bancos e ERP — fluxo end-to-end sem retrabalho.",
    metric: "→ fechamento sem ajustes manuais",
  },
  {
    id: "midias", icon: Megaphone, agents: ["AD4HN", "ELO4H"],
    title: "Mídias sociais sem estratégia",
    pain: "Publicações irregulares, comentários e DMs sem resposta. Marca perdida na timeline.",
    product: "AD4HN — Mídias · ELO4H — Atendimento",
    solution: "AD4HN planeja e publica conteúdo com tom de voz consistente. ELO4H responde DMs e comentários no mesmo padrão — engajamento que vira conversa.",
    metric: "→ marca ativa e responsiva 24/7",
  },
  {
    id: "trafego", icon: TrendingUp, agents: ["AD4HN"],
    title: "Tráfego pago sem ROI",
    pain: "Verba queimada com criativos genéricos e públicos mal segmentados.",
    product: "AD4HN — Performance",
    solution: "Otimização contínua de criativos e segmentação automática. Cada anúncio é testado e ajustado para maximizar o retorno.",
    metric: "↑ retorno por real investido",
  },
  {
    id: "custom", icon: Lightbulb, agents: ["MARI4H"],
    title: "Tem um problema fora do padrão",
    pain: "A demanda não se encaixa em produto pronto. Você precisa de uma solução totalmente sob medida.",
    product: "MARI4H — Soluções sob medida",
    solution: "Agente de soluções customizadas. Se pode ser feito com IA, fazemos. Da automação inusitada à integração estratégica — o céu é o limite.",
    metric: "→ qualquer problema, qualquer escala",
  },
  {
    id: "integracao", icon: Zap, agents: ["MARI4H", "ELO4H", "4HBEL", "AD4HN"],
    title: "Sistemas que não conversam",
    pain: "Dados espalhados entre CRM, ERP, marketing e atendimento. Retrabalho em todos os times.",
    product: "MARI4H orquestra · todos os agentes",
    solution: "MARI4H conecta os sistemas e os outros agentes consomem os dados unificados. ELO4H, 4HBEL e AD4HN passam a operar sobre uma única fonte de verdade.",
    metric: "→ um único fluxo para a empresa inteira",
  },
];

const ELO4H_TABS = [
  {
    id: "atendimento", label: "Atendimento",
    title: "Atendimento 24h que não perde oportunidade",
    desc: "Um agente treinado no seu negócio responde clientes a qualquer hora, em qualquer canal — com o mesmo tom de voz da sua empresa.",
    features: ["Disponível 24/7","WhatsApp · Instagram · Site","Leitura de áudio e imagem","Respostas humanizadas","Handoff para humano","Histórico completo"],
  },
  {
    id: "comercial", label: "Comercial",
    title: "Qualificação e conversão automatizadas",
    desc: "Triagem automática de leads, follow-up no tempo certo e agendamento integrado — sem aumentar a equipe.",
    features: ["Qualificação automática","Follow-up no tempo ideal","Agenda inteligente","Zero conflito de horário","Conversão monitorada","Integração com CRM"],
  },
  {
    id: "inteligencia", label: "Inteligência",
    title: "Dados que viram decisão",
    desc: "Dashboard em tempo real com métricas por unidade, canal e campanha. Recomendações estratégicas baseadas na operação real.",
    features: ["Métricas em tempo real","Análise por unidade/canal","Recomendações do agente","Relatórios exportáveis","Identificação de gargalos","Base para o gestor"],
  },
];

const PILLARS = [
  {
    id: "atendimento", label: "Atendimento", agents: ["ELO4H"],
    title: "Atendimento 24h que não perde oportunidade",
    desc: "Um agente treinado no seu negócio responde clientes a qualquer hora, em qualquer canal — com o mesmo tom de voz da sua empresa.",
    features: ["Disponível 24/7","WhatsApp · Instagram · Site","Leitura de áudio e imagem","Respostas humanizadas","Handoff para humano","Histórico completo"],
  },
  {
    id: "financeiro", label: "Financeiro", agents: ["4HBEL"],
    title: "BPO financeiro automatizado com IA",
    desc: "IA aplicada ao BPO financeiro. Conciliações automáticas, relatórios em tempo real e previsibilidade de fluxo de caixa.",
    features: ["Conciliação automática","Relatórios em tempo real","Previsibilidade de fluxo","Redução de custo operacional","Integração bancária","Auditoria contínua"],
  },
  {
    id: "midias", label: "Mídias Sociais", agents: ["AD4HN"],
    title: "Tráfego pago e gestão de conteúdo",
    desc: "Agente de mídias sociais que gerencia tráfego pago, planeja e publica conteúdo, otimiza criativos e conecta cada métrica ao funil comercial.",
    features: ["Tráfego pago otimizado","Calendário editorial automático","Gestão multi-plataforma","Métricas conectadas a vendas","Otimização de criativos","Relatórios de ROAS"],
  },
  {
    id: "custom", label: "Customizado", agents: ["MARI4H"],
    title: "Soluções de IA sob medida",
    desc: "Agente de soluções customizadas. Se pode ser feito com IA, fazemos. Da automação inusitada à integração estratégica — o céu é o limite.",
    features: ["Automações fora do padrão","Integrações sob medida","Casos de uso únicos","Prototipagem rápida com IA","Discovery completo","Suporte dedicado"],
  },
  {
    id: "inteligencia", label: "Inteligência", agents: ["ELO4H", "4HBEL", "AD4HN", "MARI4H"],
    title: "Dados de toda a operação no mesmo dashboard",
    desc: "Cada agente alimenta a inteligência central — operação, financeiro, marketing e integrações sob medida. Decisão estratégica baseada na empresa inteira.",
    features: ["Métricas em tempo real","Operação · Financeiro · Marketing","Recomendações do agente","Relatórios exportáveis","Identificação de gargalos","Visão única da empresa"],
  },
];

const PILLAR_ICONS = [Headphones, DollarSign, Megaphone, Lightbulb, LineChart];

const PROCESS = [
  { n:"01", t:"Diagnóstico",  dur:"Semana 1",          desc:"Mergulho na sua operação. Mapeamento de processos, gargalos e oportunidades.",       out:"Mapa de processos + relatório"   },
  { n:"02", t:"Desenho",      dur:"Semanas 2–3",       desc:"Arquitetura sob medida. Personalização por CNPJ, canal e equipe — zero template.",  out:"Especificação técnica + fluxos"  },
  { n:"03", t:"Implantação",  dur:"Semanas 3–5",       desc:"Integrações de canais, treinamento do agente com dados reais e dashboard.",         out:"Agente ativo + dashboard"        },
  { n:"04", t:"Operação",     dur:"A partir da sem. 6",desc:"Treinamento da equipe, suporte no onboarding e melhorias contínuas inclusas.",      out:"Suporte + revisões mensais"      },
];

const STATS = [
  { v:24,  s:"h",  l:"Disponibilidade do agente" },
  { v:6,   s:"+",  l:"Canais integrados"         },
  { v:100, s:"%",  l:"Personalizado por empresa" },
  { v:0,   s:"",   l:"Templates genéricos"       },
];

const SECTORS = ["Saúde","Jurídico","Educação","Varejo","Serviços","Imobiliário","Franquias","Indústria"];

const ORBIT_LEFT  = ["Atendimento 24h","Follow-up automático","Dashboard ao vivo"];
const ORBIT_RIGHT = ["Multicanal","Agenda integrada","Qualificação de leads"];

const CHAT = [
  { role: "user", text: "Oi! Quero agendar uma consulta para amanhã." },
  { role: "bot",  text: "Olá! Tenho horários disponíveis às 10h, 14h e 16h. Qual prefere?" },
  { role: "user", text: "14h está ótimo!" },
  { role: "bot",  text: "Perfeito! Consulta confirmada para amanhã às 14h. Enviarei um lembrete. 📅" },
  { role: "bot",  text: "Posso ajudar com mais alguma coisa?" },
];

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const scrollPct = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop,  setShowTop]  = useState(false);
  const [mouse,    setMouse]    = useState({ x: -9999, y: -9999 });
  const [selected, setSelected] = useState(null);
  const [eloTab,   setEloTab]   = useState(0);
  const [pillar,   setPillar]   = useState(0);
  const [chatStep, setChatStep] = useState(0);
  const [chatStarted, setChatStarted] = useState(false);
  const chatRef = useRef(null);
  const chatInView = useInView(chatRef, 0.3);

  const typed = useTypewriter(TYPEWRITER_WORDS);

  /* italic-gold scroll-triggered typewriters */
  const tw1Ref = useRef(null); const tw1InView = useInView(tw1Ref, 0.5);
  const tw2Ref = useRef(null); const tw2InView = useInView(tw2Ref, 0.5);
  const tw3Ref = useRef(null); const tw3InView = useInView(tw3Ref, 0.5);
  const tw4Ref = useRef(null); const tw4InView = useInView(tw4Ref, 0.4);
  const tw5Ref = useRef(null); const tw5InView = useInView(tw5Ref, 0.5);

  const t1 = useTypewriterOnce("gargalo.", 70, tw1InView);
  const t2 = useTypewriterOnce("gargalo específico.", 60, tw2InView);
  const t3 = useTypewriterOnce("operação.", 70, tw3InView);
  const t5 = useTypewriterOnce("Uma operação inteira.", 55, tw5InView);
  const t4 = useTypewriter(
    ["seus gargalos.", "sua operação.", "seu atendimento.", "seus processos."],
    65, 32, 2200, tw4InView
  );

  /* start chat only when it scrolls into view */
  useEffect(() => {
    if (chatInView && !chatStarted) setChatStarted(true);
  }, [chatInView, chatStarted]);

  /* chat sequencer — runs only after chatStarted */
  useEffect(() => {
    if (!chatStarted || chatStep >= CHAT.length) return;
    const delay = chatStep === 0 ? 600 : 1300;
    const t = setTimeout(() => setChatStep(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [chatStarted, chatStep]);

  /* Stats counters */
  const statsRef  = useRef(null);
  const statsView = useInView(statsRef, 0.3);
  const s0 = useCounter(STATS[0].v, 1400, statsView);
  const s1 = useCounter(STATS[1].v, 1200, statsView);
  const s2 = useCounter(STATS[2].v, 1800, statsView);
  const s3 = useCounter(STATS[3].v,  600, statsView);
  const counters = [s0, s1, s2, s3];

  /* Horizontal timeline */
  const timelineRef  = useRef(null);
  const timelineView = useInView(timelineRef, 0.25);

  /* Tilt effects */
  const eloTilt  = useTilt(5);
  const hbelTilt = useTilt(7);
  const adTilt   = useTilt(7);
  const mariTilt = useTilt(7);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const activeBG = selected ? BOTTLENECKS.find(b => b.id === selected) : null;
  const PIcon = PILLAR_ICONS[pillar];

  return (
    <div className="min-h-screen relative overflow-hidden font-inter" style={{ backgroundColor: "#050505", color: "#f5f0e8" }}>

      <style>{`
        @keyframes pulse4h    { 0%,100%{ opacity:.5 } 50%{ opacity:1 } }
        @keyframes shimmer4h  { from{ background-position:200% 0 } to{ background-position:-200% 0 } }
        @keyframes fadeIn4h   { from{ opacity:0;transform:translateY(10px) } to{ opacity:1;transform:translateY(0) } }
        @keyframes fadeInFast { from{ opacity:0 } to{ opacity:1 } }
        @keyframes marquee4h  { from{ transform:translateX(0) } to{ transform:translateX(-50%) } }
        @keyframes float1     { 0%,100%{ transform:translate(0,0) } 33%{ transform:translate(60px,-40px) } 66%{ transform:translate(-40px,30px) } }
        @keyframes float2     { 0%,100%{ transform:translate(0,0) } 25%{ transform:translate(-80px,50px) } 75%{ transform:translate(50px,-60px) } }
        @keyframes float3     { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(70px,70px) } }
        @keyframes blink      { 0%,100%{ opacity:1 } 50%{ opacity:0 } }
        @keyframes slidePanel { from{ opacity:0;transform:translateY(16px) } to{ opacity:1;transform:translateY(0) } }
        @keyframes scaleIn    { from{ opacity:0;transform:scale(.96) } to{ opacity:1;transform:scale(1) } }
        @keyframes scanline   { 0%{ top:-4px } 100%{ top:104% } }
        @keyframes scanV      { 0%,100%{ transform:translateY(-100%) } 50%{ transform:translateY(100%) } }
        @keyframes pulseRing  { 0%{ transform:scale(1);opacity:1 } 100%{ transform:scale(1.5);opacity:0 } }
        @keyframes ekgScroll  { from{ transform:translateX(0) } to{ transform:translateX(-50%) } }
        @keyframes floatH     { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-12px) } }
        @keyframes floatH4h   { 0%,100%{ transform:translateY(0) rotate(-2deg) } 50%{ transform:translateY(-18px) rotate(2deg) } }
        @keyframes floatBadge4h { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-9px) } }
        @keyframes spin4h     { from{ transform:rotate(0) } to{ transform:rotate(360deg) } }
        @keyframes pulseGlow  { 0%,100%{ opacity:.55; transform:scale(1) } 50%{ opacity:1; transform:scale(1.08) } }
        @keyframes barRise    { 0%{ transform:scaleY(.3) } 50%{ transform:scaleY(1) } 100%{ transform:scaleY(.5) } }
        @keyframes orbit      { from{ transform:rotate(0deg) translateX(22px) rotate(0deg) } to{ transform:rotate(360deg) translateX(22px) rotate(-360deg) } }
        @keyframes slideMsg   { from{ opacity:0;transform:translateY(8px) } to{ opacity:1;transform:translateY(0) } }
        @keyframes typingDot  { 0%,80%,100%{ opacity:0 } 40%{ opacity:1 } }
        @keyframes floatA     { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-8px) } }
        @keyframes floatB     { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }

        .lp-btn-primary { transition: transform 200ms ease, box-shadow 200ms ease; }
        .lp-btn-primary:hover { transform: scale(1.04); box-shadow: 0 12px 40px rgba(196,154,60,.5); }
        .lp-btn-ghost { transition: border-color 200ms ease, background 200ms ease; }
        .lp-btn-ghost:hover { background: rgba(196,154,60,.08) !important; border-color: rgba(196,154,60,.5) !important; }
        .lp-bcard { transition: border-color 220ms ease, background 220ms ease, transform 220ms ease; cursor: pointer; }
        .lp-bcard:hover { transform: translateY(-3px); }
        .lp-tab { transition: all 250ms ease; }
        button:focus-visible, a:focus-visible { outline:2px solid #c49a3c; outline-offset:3px; border-radius:6px; }
        @media(prefers-reduced-motion:reduce){ *,*::before,*::after{ animation-duration:.01ms!important; transition-duration:.01ms!important; } }
      `}</style>

      {/* scroll progress bar */}
      <div aria-hidden style={{ position:"fixed", top:0, left:0, right:0, height:2, zIndex:1000, background:"rgba(255,255,255,.04)" }}>
        <div style={{ height:"100%", width:`${scrollPct}%`, background:"linear-gradient(90deg,#96682c,#e8c060,#ffe9a8)", transition:"width 80ms linear", borderRadius:2 }} />
      </div>

      {/* mouse glow */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none" style={{
        background: `radial-gradient(650px circle at ${mouse.x}px ${mouse.y}px, rgba(196,154,60,.055), transparent 50%)`,
        transition: "background 100ms linear",
      }} />

      {/* drifting orbs */}
      <div aria-hidden style={{ position:"absolute", top:"-5%", left:"-5%", width:900, height:900, borderRadius:"50%", pointerEvents:"none", zIndex:0, background:"radial-gradient(circle,rgba(196,154,60,.1),transparent 60%)", filter:"blur(100px)", animation:"float1 28s ease-in-out infinite" }} />
      <div aria-hidden style={{ position:"absolute", top:"40%", right:"-10%", width:700, height:700, borderRadius:"50%", pointerEvents:"none", zIndex:0, background:"radial-gradient(circle,rgba(150,104,44,.09),transparent 60%)", filter:"blur(80px)", animation:"float2 35s ease-in-out infinite" }} />
      <div aria-hidden style={{ position:"absolute", bottom:"5%", left:"20%", width:500, height:500, borderRadius:"50%", pointerEvents:"none", zIndex:0, background:"radial-gradient(circle,rgba(196,154,60,.07),transparent 60%)", filter:"blur(70px)", animation:"float3 22s ease-in-out infinite" }} />

      {/* grid background */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(150,104,44,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(150,104,44,.12) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)",
      }} />

      {/* ── mobile menu ── */}
      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu de navegação"
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ background:"rgba(5,5,5,.97)", backdropFilter:"blur(24px)", animation:"fadeInFast 200ms ease" }}>
          <div className="flex items-center justify-between" style={{ padding:"20px 24px" }}>
            <div className="flex items-center gap-3">
              <img src={LOGO_ICON_URL} alt="4Him" className="h-9 w-auto" />
              <div>
                <div className="font-bold text-sm" style={{ color:"#f5f0e8" }}>4Him<span style={{ color:"#c49a3c" }}>.</span></div>
                <div className="text-[8px] font-medium uppercase -mt-0.5" style={{ letterSpacing:"0.2em", color:"rgba(245,240,232,.45)" }}>Technology</div>
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu" style={{ color:"rgba(245,240,232,.8)", padding:8, borderRadius:8 }}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center flex-1 gap-1">
            {NAV_LINKS.map(([id, label], i) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="font-extrabold py-3 px-8 transition-colors duration-200"
                style={{ fontSize:"clamp(28px,8vw,40px)", color:"rgba(245,240,232,.85)", letterSpacing:"-0.03em", animation:`fadeIn4h 300ms ease ${i*60}ms both` }}
                onMouseEnter={e => { e.currentTarget.style.color="#c49a3c"; }}
                onMouseLeave={e => { e.currentTarget.style.color="rgba(245,240,232,.85)"; }}
              >{label}</button>
            ))}
            <div className="flex flex-col gap-3 w-full items-center mt-6"
              style={{ animation:"fadeIn4h 300ms ease 300ms both", padding:"0 32px", maxWidth:340 }}>
              <button onClick={() => scrollTo("contato")} className="lp-btn-primary font-bold rounded-full w-full"
                style={{ padding:"16px 28px", background:"linear-gradient(135deg,#96682c,#e8c060)", color:"#050505", fontSize:15, boxShadow:"0 8px 32px rgba(196,154,60,.4)" }}>
                Falar com a 4Him →
              </button>
              <button className="lp-btn-ghost font-semibold rounded-full w-full"
                style={{ padding:"16px 28px", border:"1px solid rgba(196,154,60,.35)", color:"#c49a3c", fontSize:15, background:"transparent" }}>
                Acessar Portal
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* ════════ NAV ════════ */}
      <nav className="sticky z-50 flex items-center justify-between" aria-label="Navegação principal"
        style={{ top:16, margin:"16px 32px 0", padding:"12px 20px", background:"rgba(10,10,10,.7)", backdropFilter:"blur(24px) saturate(1.4)", WebkitBackdropFilter:"blur(24px) saturate(1.4)", border:"1px solid rgba(196,154,60,.18)", borderRadius:100, boxShadow:"0 16px 48px -16px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.04)" }}>
        <div className="flex items-center gap-3">
          <img src={LOGO_ICON_URL} alt="4Him" className="h-9 w-auto" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold" style={{ color:"#f5f0e8", letterSpacing:"-0.01em" }}>4Him<span style={{ color:"#c49a3c" }}>.</span></div>
            <div className="text-[8px] font-medium uppercase -mt-0.5" style={{ letterSpacing:"0.2em", color:"rgba(245,240,232,.45)" }}>Technology</div>
          </div>
        </div>
        <div className="hidden md:flex gap-1 p-1 rounded-full" style={{ background:"rgba(0,0,0,.3)", border:"1px solid rgba(196,154,60,.08)" }}>
          {NAV_LINKS.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="px-3.5 py-[7px] text-xs font-medium rounded-full transition-all duration-200"
              style={{ color:"rgba(245,240,232,.75)" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(196,154,60,.12)"; e.currentTarget.style.color="#f5f0e8"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(245,240,232,.75)"; }}
            >{label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Acessar portal"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full lp-btn-ghost"
            style={{ border:"1px solid rgba(196,154,60,.35)", color:"#c49a3c", background:"transparent" }}>
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden /> Portal
          </button>
          <button onClick={() => scrollTo("contato")}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-full lp-btn-primary"
            style={{ background:"linear-gradient(135deg,#96682c,#e8c060)", color:"#050505", boxShadow:"0 4px 20px rgba(196,154,60,.4)" }}>
            Falar com a 4Him <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </button>
          <button className="md:hidden flex items-center justify-center" onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu" aria-expanded={menuOpen}
            style={{ color:"#f5f0e8", padding:8, borderRadius:8, background:"rgba(196,154,60,.1)", border:"1px solid rgba(196,154,60,.2)" }}>
            <Menu className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </nav>

      {/* ════════ 1. HERO (LP3 EXATO) ════════ */}
      <section className="relative z-10 text-center" style={{ padding:"120px 24px 100px", maxWidth:1400, margin:"0 auto" }}>
        <Reveal>
          <div className="inline-flex items-center gap-2.5 text-xs font-medium rounded-full"
            style={{ padding:"7px 18px", border:"1px solid rgba(196,154,60,.3)", color:"#c49a3c", background:"rgba(196,154,60,.06)", marginBottom:40 }}>
            <span aria-hidden className="rounded-full" style={{ width:6, height:6, background:"#e8c060", boxShadow:"0 0 12px #e8c060" }} />
            Consultoria Estratégica em IA · Ecossistema de produtos sob medida
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="font-extrabold" style={{ fontSize:"clamp(40px,6.5vw,104px)", letterSpacing:"-0.045em", lineHeight:0.93, margin:"0 0 20px", color:"#f5f0e8" }}>
            IA estratégica que
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <div style={{ fontSize:"clamp(32px,5.5vw,88px)", fontWeight:900, letterSpacing:"-0.045em", lineHeight:1.4, margin:"0 0 40px", minHeight:"clamp(60px,9vw,130px)", display:"flex", alignItems:"center", justifyContent:"center", gap:8, paddingBottom:"0.25em", overflow:"visible" }}>
            <span style={{
              fontFamily:'"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontStyle:"italic", fontWeight:400,
              lineHeight:1.4, paddingBottom:"0.15em",
              background:"linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)",
              backgroundSize:"200% 100%",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              animation:"shimmer4h 6s linear infinite",
              display:"inline-block",
            }}>
              {typed}
            </span>
            <span aria-hidden style={{ width:3, height:"0.85em", background:"#e8c060", borderRadius:2, animation:"blink 1s ease-in-out infinite", display:"inline-block", verticalAlign:"middle", flexShrink:0 }} />
          </div>
        </Reveal>

        <Reveal delay={300}>
          <p style={{ fontSize:"clamp(15px,1.5vw,20px)", lineHeight:1.65, color:"rgba(245,240,232,.62)", maxWidth:680, margin:"0 auto 52px" }}>
            Somos uma consultoria que desenha, implanta e opera agentes inteligentes para empresas de qualquer setor.
            Cada solução é construída sob medida — do diagnóstico à operação contínua.
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center" style={{ marginBottom:72 }}>
            <button onClick={() => scrollTo("desafio")} className="lp-btn-primary font-bold rounded-full"
              style={{ padding:"17px 32px", background:"linear-gradient(135deg,#96682c,#e8c060)", color:"#050505", fontSize:14, boxShadow:"0 10px 36px rgba(196,154,60,.5), inset 0 1px 0 rgba(255,255,255,.25)" }}>
              Qual é o seu gargalo? →
            </button>
            <button onClick={() => scrollTo("produtos")} className="lp-btn-ghost font-semibold rounded-full"
              style={{ padding:"17px 32px", background:"rgba(255,255,255,.025)", color:"#f5f0e8", border:"1px solid rgba(196,154,60,.25)", fontSize:14 }}>
              Ver o ecossistema
            </button>
          </div>
        </Reveal>

        <Reveal delay={500}>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {[
              { icon: Clock,       label:"Atendimento 24h"      },
              { icon: Target,      label:"Qualificação de leads" },
              { icon: BarChart3,   label:"Dashboard ao vivo"    },
              { icon: Calendar,    label:"Agenda integrada"     },
              { icon: Sparkles,    label:"IA personalizada"     },
              { icon: DollarSign,  label:"BPO Financeiro"       },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2 rounded-full font-medium"
                style={{ padding:"8px 16px", fontSize:12, color:"rgba(245,240,232,.8)", background:"rgba(10,10,10,.7)", border:"1px solid rgba(196,154,60,.15)", backdropFilter:"blur(8px)", boxShadow:"0 4px 16px rgba(0,0,0,.3)", animation:`fadeIn4h 400ms ease ${i*80+600}ms both` }}>
                <Icon className="w-3.5 h-3.5" style={{ color:"#c49a3c" }} aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ════════ 2. CENTER H + ORBITS + STATS + MARQUEE ════════ */}
      <section ref={statsRef} className="relative z-10" style={{ padding:"40px 24px 80px" }}>
        <div className="mx-auto" style={{ maxWidth:1100 }}>

          {/* H + orbital pills (estrutura idêntica à LP1) */}
          <div className="mx-auto flex items-center justify-center" style={{ gap:"clamp(16px, 4vw, 56px)", marginBottom:48 }}>
            {/* Left badges */}
            <div className="hidden md:flex flex-col gap-7 items-end">
              {ORBIT_LEFT.map((text, i) => (
                <div
                  key={text}
                  aria-hidden
                  className="flex items-center gap-2 font-semibold rounded-full whitespace-nowrap"
                  style={{
                    background: "rgba(10,10,10,0.85)",
                    border: "1px solid rgba(196,154,60,0.3)",
                    padding: "9px 16px",
                    fontSize: 12,
                    color: "#f5f0e8",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    animation: `floatBadge4h ${4 + i * 0.5}s ease-in-out infinite ${i * 0.6}s`,
                  }}
                >
                  <span style={{ color: "#c49a3c", fontSize: 8 }} aria-hidden>●</span>
                  {text}
                </div>
              ))}
            </div>

            {/* Logo + rings */}
            <div className="relative flex-shrink-0" style={{ padding: 40 }}>
              <div
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid rgba(196,154,60,0.2)", animation: "spin4h 30s linear infinite" }}
              />
              <div
                aria-hidden
                className="absolute rounded-full"
                style={{
                  inset: 20,
                  border: "1px dashed rgba(196,154,60,0.15)",
                  animation: "spin4h 20s linear infinite reverse",
                }}
              />
              <div
                className="flex items-center justify-center"
                style={{
                  width: 280, height: 280,
                  animation: "floatH4h 6s ease-in-out infinite",
                  filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.9)) drop-shadow(0 0 60px rgba(196,154,60,0.35))",
                }}
              >
                <img src={LOGO_ICON_URL} alt="" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Right badges */}
            <div className="hidden md:flex flex-col gap-7 items-start">
              {ORBIT_RIGHT.map((text, i) => (
                <div
                  key={text}
                  aria-hidden
                  className="flex items-center gap-2 font-semibold rounded-full whitespace-nowrap"
                  style={{
                    background: "rgba(10,10,10,0.85)",
                    border: "1px solid rgba(196,154,60,0.3)",
                    padding: "9px 16px",
                    fontSize: 12,
                    color: "#f5f0e8",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    animation: `floatBadge4h ${4.5 + i * 0.5}s ease-in-out infinite ${1 + i * 0.6}s`,
                  }}
                >
                  <span style={{ color: "#c49a3c", fontSize: 8 }} aria-hidden>●</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* mobile pills */}
          <div className="md:hidden flex flex-wrap justify-center gap-2 px-4" style={{ marginBottom:48 }}>
            {[...ORBIT_LEFT, ...ORBIT_RIGHT].map(label => (
              <span key={label} style={{ padding:"6px 12px", borderRadius:100, background:"rgba(10,10,10,.85)", border:"1px solid rgba(196,154,60,.2)", fontSize:11, color:"#f5f0e8" }}>
                {label}
              </span>
            ))}
          </div>

          {/* Stats card */}
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              style={{ padding:"36px 28px", borderRadius:24, background:"rgba(10,10,10,.5)", border:"1px solid rgba(196,154,60,.15)", backdropFilter:"blur(8px)" }}>
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-black" style={{ fontSize:"clamp(40px,5vw,68px)", lineHeight:1, letterSpacing:"-0.045em", background:"linear-gradient(135deg,#c49a3c,#ffe9a8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:8 }}>
                    {counters[i]}{s.s}
                  </div>
                  <div style={{ fontSize:12, color:"rgba(245,240,232,.5)", letterSpacing:"0.04em", lineHeight:1.4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Marquee */}
        <div style={{ paddingTop:64 }}>
          <div style={{ fontSize:10, letterSpacing:"0.3em", color:"rgba(245,240,232,.3)", textAlign:"center", textTransform:"uppercase", marginBottom:16 }}>
            Para empresas de qualquer setor que tenham atendimento ao cliente
          </div>
          <div className="overflow-hidden" style={{ maskImage:"linear-gradient(90deg,transparent 0%,black 12%,black 88%,transparent 100%)", WebkitMaskImage:"linear-gradient(90deg,transparent 0%,black 12%,black 88%,transparent 100%)" }}>
            <div style={{ display:"flex", width:"max-content", animation:"marquee4h 22s linear infinite" }}>
              {[...SECTORS,...SECTORS,...SECTORS,...SECTORS].map((s, i) => (
                <div key={i} className="flex items-center shrink-0">
                  <span style={{ color:"rgba(245,240,232,.46)", fontSize:13, fontWeight:500, padding:"0 22px", letterSpacing:"0.04em" }}>{s}</span>
                  <span aria-hidden style={{ color:"rgba(196,154,60,.28)" }}>·</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 3. BOTTLENECKS (LP3 logic + refined cards) ════════ */}
      <section id="desafio" className="relative z-10" style={{ padding:"100px 24px", borderTop:"1px solid rgba(196,154,60,.1)" }}>
        <div className="mx-auto" style={{ maxWidth:1200 }}>
          <div className="text-center" style={{ marginBottom:56 }}>
            <Reveal>
              <div className="uppercase" style={{ fontSize:11, letterSpacing:"0.3em", color:"#c49a3c", marginBottom:16 }}>──── Qual é o seu maior desafio? ────</div>
              <h2 className="font-extrabold" style={{ fontSize:"clamp(28px,4vw,52px)", letterSpacing:"-0.03em", lineHeight:1.15, margin:"0 0 16px" }}>
                Identifique o seu{" "}
                <span ref={tw1Ref} style={{ fontFamily:'"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle:"italic", fontWeight:400, background:"linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)", backgroundSize:"200% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer4h 6s linear infinite", paddingBottom:"0.3em", display:"inline-block", lineHeight:1.4, verticalAlign:"baseline" }}>{t1 || " "}</span>
              </h2>
              <p style={{ fontSize:16, color:"rgba(245,240,232,.55)", maxWidth:520, margin:"0 auto" }}>
                Selecione o desafio mais crítico da sua operação e veja como a 4Him resolve.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginBottom:24 }}>
            {BOTTLENECKS.map((b, i) => {
              const Icon = b.icon;
              const isActive = selected === b.id;
              return (
                <Reveal key={b.id} delay={i * 60}>
                  <button onClick={() => setSelected(isActive ? null : b.id)}
                    aria-pressed={isActive}
                    className="lp-bcard w-full text-left h-full"
                    style={{
                      padding:"26px 28px", borderRadius:20,
                      background: isActive
                        ? "linear-gradient(155deg,rgba(196,154,60,.08),rgba(10,10,10,.85))"
                        : "linear-gradient(155deg,rgba(196,154,60,.04),rgba(10,10,10,.85))",
                      border: isActive ? "1px solid rgba(196,154,60,.55)" : "1px solid rgba(196,154,60,.14)",
                      boxShadow: isActive ? "0 0 40px rgba(196,154,60,.18), 0 16px 32px rgba(0,0,0,.5)" : "0 8px 24px rgba(0,0,0,.3)",
                    }}>
                    <div className="flex items-start gap-4">
                      <div style={{ width:42, height:42, borderRadius:12, flexShrink:0, background:isActive ? "rgba(196,154,60,.18)" : "rgba(196,154,60,.08)", border:`1px solid ${isActive ? "rgba(196,154,60,.5)" : "rgba(196,154,60,.18)"}`, display:"flex", alignItems:"center", justifyContent:"center", color:isActive ? "#e8c060" : "#c49a3c", transition:"all 220ms ease" }}>
                        <Icon style={{ width:18, height:18 }} aria-hidden />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="font-bold" style={{ fontSize:15, color:isActive ? "#f5f0e8" : "rgba(245,240,232,.92)", marginBottom:6, letterSpacing:"-0.01em" }}>
                          {b.title}
                        </div>
                        <div style={{ fontSize:13, lineHeight:1.6, color:"rgba(245,240,232,.55)" }}>{b.pain}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" aria-hidden
                        style={{ color:isActive ? "#c49a3c" : "rgba(196,154,60,.35)", transform:isActive ? "rotate(90deg)" : "", transition:"transform 220ms ease" }} />
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* solution panel */}
          {selected && activeBG && (
            <div style={{ animation:"slidePanel 320ms cubic-bezier(.34,1.4,.64,1)" }}>
              <div style={{ borderRadius:24, padding:2, background:agentBorder(activeBG.agents), boxShadow: activeBG.agents.length === 1 ? `0 0 32px ${AGENT_COLORS[activeBG.agents[0]]}66, 0 0 8px ${AGENT_COLORS[activeBG.agents[0]]}44, 0 24px 48px rgba(0,0,0,.6)` : `0 0 32px ${AGENT_COLORS[activeBG.agents[0]]}55, 0 0 32px ${AGENT_COLORS[activeBG.agents[1] || activeBG.agents[0]]}55, 0 24px 48px rgba(0,0,0,.6)` }}>
                <div style={{ padding:"clamp(24px,4vw,40px)", borderRadius:22, background:"linear-gradient(135deg, #14100a, #0a0a0a)" }}>
                  <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom:18 }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 12px", borderRadius:100, background:"rgba(196,154,60,.12)", border:"1px solid rgba(196,154,60,.35)", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#e8c060" }}>
                          {activeBG.product}
                        </span>
                        {activeBG.agents.length > 1 && (
                          <span className="flex items-center gap-1.5" aria-label="Agentes envolvidos">
                            {activeBG.agents.map(a => (
                              <span key={a} aria-hidden style={{ width:8, height:8, borderRadius:"50%", background:AGENT_COLORS[a], boxShadow:`0 0 8px ${AGENT_COLORS[a]}` }} />
                            ))}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold" style={{ fontSize:"clamp(20px,3vw,32px)", color:"#f5f0e8", margin:"0 0 14px", letterSpacing:"-0.02em" }}>
                        Como resolvemos esse desafio
                      </h3>
                      <p style={{ fontSize:15, lineHeight:1.7, color:"rgba(245,240,232,.7)", margin:"0 0 20px", maxWidth:600 }}>
                        {activeBG.solution}
                      </p>
                      <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:100, background:"rgba(196,154,60,.1)", border:"1px solid rgba(196,154,60,.3)", fontSize:13, color:"#c49a3c", fontWeight:700 }}>
                        <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden />
                        {activeBG.metric}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => scrollTo("contato")} className="lp-btn-primary font-bold rounded-full whitespace-nowrap"
                        style={{ padding:"16px 28px", background:"linear-gradient(135deg,#96682c,#e8c060)", color:"#050505", fontSize:14, boxShadow:"0 8px 28px rgba(196,154,60,.45)" }}>
                        Quero essa solução →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════ 4. PRODUCTS (LP3 EXATO) ════════ */}
      <section id="produtos" className="relative z-10" style={{ padding:"120px 24px", borderTop:"1px solid rgba(196,154,60,.12)" }}>
        <div className="mx-auto" style={{ maxWidth:1300 }}>
          <div className="text-center" style={{ marginBottom:72 }}>
            <Reveal>
              <div className="uppercase" style={{ fontSize:11, letterSpacing:"0.3em", color:"#c49a3c", marginBottom:16 }}>──── Ecossistema de produtos ────</div>
              <h2 className="font-extrabold" style={{ fontSize:"clamp(32px,4.5vw,60px)", letterSpacing:"-0.03em", lineHeight:1.18, margin:"0 0 16px" }}>
                Cada produto resolve um{" "}
                <span ref={tw2Ref} style={{ fontFamily:'"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle:"italic", fontWeight:400, background:"linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)", backgroundSize:"200% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer4h 6s linear infinite", paddingBottom:"0.3em", display:"inline-block", lineHeight:1.4, verticalAlign:"baseline" }}>{t2 || " "}</span>
              </h2>
              <p style={{ fontSize:16, color:"rgba(245,240,232,.55)", maxWidth:560, margin:"0 auto" }}>
                Começamos pelo mais crítico e expandimos. Cada empresa tem seu próprio caminho.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ELO4H */}
            <Reveal className="lg:col-span-2">
              <div ref={eloTilt.ref} onMouseMove={eloTilt.onMouseMove} onMouseLeave={eloTilt.onMouseLeave}
                style={{ borderRadius:28, overflow:"hidden", height:"100%", background:"linear-gradient(155deg,rgba(150,104,44,.18),rgba(10,10,10,.75))", border:"1px solid rgba(196,154,60,.3)", boxShadow:"0 24px 64px -16px rgba(0,0,0,.7)", position:"relative", transformStyle:"preserve-3d" }}>

                <div aria-hidden style={{ position:"absolute", top:0, right:0, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(196,154,60,.12),transparent 65%)", filter:"blur(50px)", pointerEvents:"none" }} />

                {/* Header */}
                <div style={{ padding:"32px 36px 0", position:"relative" }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:100, background:"rgba(196,154,60,.12)", border:"1px solid rgba(196,154,60,.3)", fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#e8c060", marginBottom:14 }}>
                    <span aria-hidden style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 6px #4ade80" }} />
                    Produto principal · Ativo
                  </div>
                  <div className="font-black" style={{ fontSize:64, letterSpacing:"-0.04em", lineHeight:0.88, background:"linear-gradient(135deg,#f5f0e8 20%,#c49a3c 60%,#96682c 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:16 }}>
                    ELO4H
                  </div>
                  <p style={{ fontSize:15, lineHeight:1.6, color:"rgba(245,240,232,.65)", maxWidth:500, marginBottom:24 }}>
                    Nosso agente de atendimento e inteligência comercial. Carro-chefe da 4Him — normalmente a primeira implementação.
                  </p>

                  <div role="tablist" aria-label="Módulos ELO4H" className="flex gap-1"
                    style={{ padding:"6px", background:"rgba(0,0,0,.35)", borderRadius:14, border:"1px solid rgba(196,154,60,.12)", width:"fit-content" }}>
                    {ELO4H_TABS.map((tab, i) => (
                      <button key={tab.id} role="tab" aria-selected={eloTab===i}
                        aria-controls={`elo-panel-${i}`}
                        onClick={() => setEloTab(i)}
                        className="lp-tab rounded-[10px] font-semibold"
                        style={{ padding:"9px 18px", fontSize:12, background:eloTab===i ? "linear-gradient(135deg,#96682c,#c49a3c)" : "transparent", color:eloTab===i ? "#050505" : "rgba(245,240,232,.65)", boxShadow:eloTab===i ? "0 2px 12px rgba(196,154,60,.3)" : "none" }}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Two-column body: text + chat mockup */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start" style={{ padding:"32px 36px 40px", position:"relative" }}>

                  {/* Left: tab content */}
                  <div id={`elo-panel-${eloTab}`} role="tabpanel" key={eloTab} style={{ animation:"scaleIn 250ms ease" }}>
                    <h3 className="font-bold" style={{ fontSize:"clamp(18px,2vw,26px)", color:"#f5f0e8", margin:"0 0 12px", letterSpacing:"-0.02em" }}>
                      {ELO4H_TABS[eloTab].title}
                    </h3>
                    <p style={{ fontSize:14, lineHeight:1.65, color:"rgba(245,240,232,.6)", margin:"0 0 24px" }}>
                      {ELO4H_TABS[eloTab].desc}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ELO4H_TABS[eloTab].features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2"
                          style={{ padding:"10px 12px", background:"rgba(10,10,10,.55)", border:"1px solid rgba(196,154,60,.1)", borderRadius:10, fontSize:12, color:"rgba(245,240,232,.82)" }}>
                          <div aria-hidden style={{ width:14, height:14, borderRadius:4, background:"linear-gradient(135deg,#96682c,#c49a3c)", color:"#050505", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <Check className="w-2 h-2" strokeWidth={4} />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: animated chat mockup (LP2) */}
                  <div ref={chatRef} className="relative mx-auto lg:mx-0" style={{ maxWidth:480, width:"100%", animation:"floatB 7s ease-in-out infinite" }}>
                    {/* window */}
                    <div style={{
                      borderRadius:24, overflow:"hidden",
                      background:"rgba(10,10,10,.85)",
                      border:"1px solid rgba(196,154,60,.22)",
                      boxShadow:"0 40px 80px -20px rgba(0,0,0,.8), 0 0 60px rgba(196,154,60,.08)",
                    }}>
                      {/* chrome */}
                      <div className="flex items-center justify-between"
                        style={{ padding:"14px 18px", background:"rgba(5,5,5,.8)", borderBottom:"1px solid rgba(196,154,60,.1)" }}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center"
                            style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#96682c,#c49a3c)", boxShadow:"0 4px 12px rgba(196,154,60,.4)" }}>
                            <Bot style={{ width:18, height:18, color:"#050505" }} aria-hidden />
                          </div>
                          <div>
                            <div className="font-bold" style={{ fontSize:13, color:"#f5f0e8" }}>ELO4H</div>
                            <div className="flex items-center gap-1.5" style={{ fontSize:11, color:"rgba(245,240,232,.5)" }}>
                              <span aria-hidden style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", display:"inline-block", boxShadow:"0 0 8px #4ade80" }} />
                              Online agora
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1.5" aria-hidden>
                          {["#ff5f57","#ffbd2e","#28c840"].map((c, i) => (
                            <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c, opacity:.7 }} />
                          ))}
                        </div>
                      </div>

                      {/* messages */}
                      <div style={{ padding:"18px 14px", minHeight:280, display:"flex", flexDirection:"column", gap:10 }}>
                        {CHAT.slice(0, chatStep).map((msg, i) => (
                          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                            style={{ animation:"slideMsg 280ms ease" }}>
                            {msg.role === "bot" && (
                              <div aria-hidden style={{
                                width:28, height:28, borderRadius:8, flexShrink:0,
                                background:"linear-gradient(135deg,#96682c,#c49a3c)",
                                display:"flex", alignItems:"center", justifyContent:"center", alignSelf:"flex-end",
                              }}>
                                <Bot style={{ width:14, height:14, color:"#050505" }} />
                              </div>
                            )}
                            <div style={{
                              padding:"9px 13px", maxWidth:"78%", fontSize:13, lineHeight:1.5, color:"#f5f0e8",
                              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                              background: msg.role === "user" ? "linear-gradient(135deg,#96682c,#c49a3c)" : "rgba(28,28,28,.9)",
                              border: msg.role === "bot" ? "1px solid rgba(196,154,60,.12)" : "none",
                            }}>
                              {msg.text}
                            </div>
                          </div>
                        ))}

                        {/* typing indicator */}
                        {chatStarted && chatStep < CHAT.length && chatStep > 0 && CHAT[chatStep].role === "bot" && (
                          <div className="flex gap-2 items-end" aria-label="Digitando...">
                            <div aria-hidden style={{
                              width:28, height:28, borderRadius:8, flexShrink:0,
                              background:"linear-gradient(135deg,#96682c,#c49a3c)",
                              display:"flex", alignItems:"center", justifyContent:"center",
                            }}>
                              <Bot style={{ width:14, height:14, color:"#050505" }} />
                            </div>
                            <div style={{
                              padding:"11px 14px", borderRadius:"18px 18px 18px 4px",
                              background:"rgba(28,28,28,.9)", border:"1px solid rgba(196,154,60,.12)",
                              display:"flex", gap:4, alignItems:"center",
                            }}>
                              {[0,1,2].map(i => (
                                <span key={i} aria-hidden style={{
                                  width:6, height:6, borderRadius:"50%", background:"#c49a3c",
                                  animation:`typingDot 1.4s ease-in-out ${i * 0.22}s infinite`,
                                }} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* input bar */}
                      <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(196,154,60,.08)", display:"flex", gap:8, alignItems:"center" }}>
                        <div style={{ flex:1, padding:"9px 14px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(196,154,60,.12)", borderRadius:100, fontSize:12, color:"rgba(245,240,232,.3)" }}>
                          Digite uma mensagem...
                        </div>
                        <div aria-hidden style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#96682c,#c49a3c)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <ArrowRight style={{ width:14, height:14, color:"#050505" }} />
                        </div>
                      </div>
                    </div>

                    {/* floating badges */}
                    <div aria-hidden style={{
                      position:"absolute", top:-18, left:-28,
                      padding:"10px 14px", borderRadius:14,
                      background:"rgba(5,5,5,.92)", border:"1px solid rgba(196,154,60,.28)",
                      backdropFilter:"blur(12px)", boxShadow:"0 8px 24px rgba(0,0,0,.5)",
                      animation:"floatA 6s ease-in-out infinite",
                    }}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 style={{ width:15, height:15, color:"#4ade80" }} />
                        <span style={{ fontSize:12, color:"#f5f0e8", fontWeight:600 }}>Consulta confirmada</span>
                      </div>
                      <div style={{ fontSize:10, color:"rgba(245,240,232,.4)", marginTop:2 }}>Amanhã às 14h · Dr. Carlos</div>
                    </div>

                    <div aria-hidden style={{
                      position:"absolute", bottom:72, right:-36,
                      padding:"10px 14px", borderRadius:14,
                      background:"rgba(5,5,5,.92)", border:"1px solid rgba(196,154,60,.28)",
                      backdropFilter:"blur(12px)", boxShadow:"0 8px 24px rgba(0,0,0,.5)",
                      animation:"floatA 8s ease-in-out infinite 1.5s",
                    }}>
                      <div style={{ fontSize:10, color:"rgba(245,240,232,.4)", marginBottom:4 }}>Hoje · 23:47</div>
                      <div className="flex items-center gap-2">
                        <span style={{ width:6, height:6, borderRadius:"50%", background:"#e8c060", boxShadow:"0 0 8px #e8c060" }} />
                        <span style={{ fontSize:12, color:"#f5f0e8", fontWeight:600 }}>4 leads qualificados</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA — testar agente no WhatsApp */}
                <div className="flex justify-center" style={{ padding:"0 36px 40px" }}>
                  <a
                    href="https://wa.me/5511974514678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lp-btn-primary font-bold rounded-full inline-flex items-center gap-3 text-center"
                    style={{
                      padding:"18px 32px",
                      background:"linear-gradient(135deg, #96682c, #e8c060)",
                      color:"#050505",
                      fontSize:14,
                      textDecoration:"none",
                      boxShadow:"0 12px 40px rgba(196,154,60,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
                      maxWidth:"100%",
                    }}
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" aria-hidden />
                    <span>Teste nosso agente e aproveite para marcar uma reunião conosco</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
                  </a>
                </div>
              </div>
            </Reveal>

            <div className="flex flex-col gap-5">
              <Reveal delay={100} className="flex-1">
                <div ref={hbelTilt.ref} onMouseMove={hbelTilt.onMouseMove} onMouseLeave={hbelTilt.onMouseLeave}
                  className="relative overflow-hidden"
                  style={{ borderRadius:24, padding:"28px 28px 32px", height:"100%", background:"linear-gradient(155deg,rgba(167,139,250,.12),rgba(10,10,10,.75))", border:"1px solid rgba(167,139,250,.3)", boxShadow:"0 24px 48px -16px rgba(0,0,0,.6)", transformStyle:"preserve-3d" }}>
                  {/* dynamic icon — animated bar chart */}
                  <div aria-hidden style={{ position:"absolute", top:24, right:24, width:56, height:56, borderRadius:14, background:"radial-gradient(circle,rgba(167,139,250,.25),rgba(10,10,10,.6))", border:"1px solid rgba(167,139,250,.35)", display:"flex", alignItems:"flex-end", justifyContent:"center", gap:3, padding:8, boxShadow:"0 8px 24px rgba(167,139,250,.25)" }}>
                    <span aria-hidden style={{ position:"absolute", inset:-2, borderRadius:16, border:"1px solid rgba(167,139,250,.25)", animation:"pulseGlow 2.4s ease-in-out infinite" }} />
                    {[0.4, 0.7, 0.55, 0.9].map((h, i) => (
                      <span key={i} style={{ width:6, height:`${h*100}%`, background:"linear-gradient(180deg,#e0d7ff,#a78bfa)", borderRadius:2, transformOrigin:"bottom", animation:`barRise 2s ease-in-out ${i*0.18}s infinite` }} />
                    ))}
                  </div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:100, background:"rgba(167,139,250,.12)", border:"1px solid rgba(167,139,250,.35)", fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#a78bfa", marginBottom:16 }}>
                    <LineChart className="w-3 h-3" aria-hidden /> BPO Financeiro · Novo
                  </div>
                  <div className="font-black" style={{ fontSize:44, letterSpacing:"-0.04em", lineHeight:0.9, background:"linear-gradient(135deg,#e0d7ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:14 }}>
                    4HBEL
                  </div>
                  <p style={{ fontSize:14, lineHeight:1.65, color:"rgba(245,240,232,.6)", marginBottom:20 }}>
                    IA aplicada ao BPO financeiro. Automação de conciliações, relatórios automáticos e previsibilidade de fluxo de caixa.
                  </p>
                  <div className="flex flex-col gap-2">
                    {["Conciliação automática","Relatórios em tempo real","Previsibilidade de fluxo","Redução de custo operacional"].map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5" style={{ fontSize:12, color:"rgba(245,240,232,.75)" }}>
                        <div aria-hidden style={{ width:14, height:14, borderRadius:4, background:"linear-gradient(135deg,#7c3aed,#a78bfa)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Check className="w-2 h-2" strokeWidth={4} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* AD4HN — mídias sociais */}
              <Reveal delay={160} className="flex-1">
                <div ref={adTilt.ref} onMouseMove={adTilt.onMouseMove} onMouseLeave={adTilt.onMouseLeave}
                  className="relative overflow-hidden"
                  style={{ borderRadius:24, padding:"28px 28px 32px", height:"100%", background:"linear-gradient(155deg,rgba(236,72,153,.12),rgba(10,10,10,.75))", border:"1px solid rgba(236,72,153,.3)", boxShadow:"0 24px 48px -16px rgba(0,0,0,.6)", transformStyle:"preserve-3d" }}>
                  {/* dynamic icon — megaphone with pulse rings */}
                  <div aria-hidden style={{ position:"absolute", top:24, right:24, width:56, height:56, borderRadius:14, background:"radial-gradient(circle,rgba(236,72,153,.25),rgba(10,10,10,.6))", border:"1px solid rgba(236,72,153,.35)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(236,72,153,.25)" }}>
                    <span aria-hidden style={{ position:"absolute", inset:-2, borderRadius:16, border:"1px solid rgba(236,72,153,.3)", animation:"pulseGlow 2.4s ease-in-out infinite" }} />
                    <span aria-hidden style={{ position:"absolute", inset:-10, borderRadius:22, border:"1px solid rgba(236,72,153,.18)", animation:"pulseGlow 2.4s ease-in-out 0.4s infinite" }} />
                    <Megaphone style={{ width:22, height:22, color:"#fbcfe8" }} />
                  </div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:100, background:"rgba(236,72,153,.12)", border:"1px solid rgba(236,72,153,.35)", fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#f472b6", marginBottom:16 }}>
                    <Megaphone className="w-3 h-3" aria-hidden /> Mídias sociais
                  </div>
                  <div className="font-black" style={{ fontSize:44, letterSpacing:"-0.04em", lineHeight:0.9, background:"linear-gradient(135deg,#fbcfe8,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:14 }}>
                    AD4HN
                  </div>
                  <p style={{ fontSize:14, lineHeight:1.65, color:"rgba(245,240,232,.6)", marginBottom:20 }}>
                    Agente de tráfego pago e gestão de conteúdo. Publica, otimiza criativos e conecta cada métrica ao funil comercial.
                  </p>
                  <div className="flex flex-col gap-2">
                    {["Tráfego pago otimizado","Calendário editorial automático","Gestão multi-plataforma","Métricas conectadas a vendas"].map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5" style={{ fontSize:12, color:"rgba(245,240,232,.75)" }}>
                        <div aria-hidden style={{ width:14, height:14, borderRadius:4, background:"linear-gradient(135deg,#be185d,#ec4899)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Check className="w-2 h-2" strokeWidth={4} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* MARI4H — soluções customizadas */}
              <Reveal delay={220} className="flex-1">
                <div ref={mariTilt.ref} onMouseMove={mariTilt.onMouseMove} onMouseLeave={mariTilt.onMouseLeave}
                  className="relative overflow-hidden"
                  style={{ borderRadius:24, padding:"28px 28px 32px", height:"100%", background:"linear-gradient(155deg,rgba(52,211,153,.12),rgba(10,10,10,.75))", border:"1px solid rgba(52,211,153,.3)", boxShadow:"0 24px 48px -16px rgba(0,0,0,.6)", transformStyle:"preserve-3d" }}>
                  {/* dynamic icon — lightbulb with orbiting particles */}
                  <div aria-hidden style={{ position:"absolute", top:24, right:24, width:56, height:56, borderRadius:14, background:"radial-gradient(circle,rgba(52,211,153,.25),rgba(10,10,10,.6))", border:"1px solid rgba(52,211,153,.35)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(52,211,153,.25)" }}>
                    <span aria-hidden style={{ position:"absolute", inset:-2, borderRadius:16, border:"1px solid rgba(52,211,153,.3)", animation:"pulseGlow 2.6s ease-in-out infinite" }} />
                    <Lightbulb style={{ width:22, height:22, color:"#a7f3d0", animation:"pulseGlow 2.6s ease-in-out infinite" }} />
                    <span aria-hidden style={{ position:"absolute", left:"50%", top:"50%", width:6, height:6, marginLeft:-3, marginTop:-3, borderRadius:"50%", background:"#34d399", boxShadow:"0 0 8px #34d399", animation:"orbit 4s linear infinite" }} />
                    <span aria-hidden style={{ position:"absolute", left:"50%", top:"50%", width:4, height:4, marginLeft:-2, marginTop:-2, borderRadius:"50%", background:"#a7f3d0", boxShadow:"0 0 6px #a7f3d0", animation:"orbit 5s linear -1.5s infinite reverse" }} />
                  </div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:100, background:"rgba(52,211,153,.12)", border:"1px solid rgba(52,211,153,.35)", fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#34d399", marginBottom:16 }}>
                    <Lightbulb className="w-3 h-3" aria-hidden /> Soluções sob medida
                  </div>
                  <div className="font-black" style={{ fontSize:44, letterSpacing:"-0.04em", lineHeight:0.9, background:"linear-gradient(135deg,#a7f3d0,#10b981)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", marginBottom:14 }}>
                    MARI4H
                  </div>
                  <p style={{ fontSize:14, lineHeight:1.65, color:"rgba(245,240,232,.6)", marginBottom:20 }}>
                    Agente de soluções customizadas. Se pode ser feito com IA, fazemos. O céu é o limite — qualquer problema, qualquer escala.
                  </p>
                  <div className="flex flex-col gap-2">
                    {["Automações fora do padrão","Integrações sob medida","Casos de uso únicos","Prototipagem rápida com IA"].map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5" style={{ fontSize:12, color:"rgba(245,240,232,.75)" }}>
                        <div aria-hidden style={{ width:14, height:14, borderRadius:4, background:"linear-gradient(135deg,#059669,#34d399)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Check className="w-2 h-2" strokeWidth={4} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 5. HORIZONTAL TIMELINE (LP2 → horizontal) ════════ */}
      <section id="metodo" ref={timelineRef} className="relative z-10" style={{ padding:"120px 24px", borderTop:"1px solid rgba(196,154,60,.12)" }}>
        <div className="mx-auto" style={{ maxWidth:1300 }}>
          <div className="text-center" style={{ marginBottom:80 }}>
            <Reveal>
              <div className="uppercase" style={{ fontSize:11, letterSpacing:"0.3em", color:"#c49a3c", marginBottom:16 }}>──── Como funciona ────</div>
              <h2 className="font-extrabold" style={{ fontSize:"clamp(32px,4.5vw,56px)", letterSpacing:"-0.03em", lineHeight:1.15, margin:0 }}>
                Do diagnóstico à{" "}
                <span ref={tw3Ref} style={{ fontFamily:'"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle:"italic", fontWeight:400, background:"linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)", backgroundSize:"200% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer4h 6s linear infinite", paddingBottom:"0.3em", display:"inline-block", lineHeight:1.4, verticalAlign:"baseline" }}>{t3 || " "}</span>
              </h2>
            </Reveal>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* horizontal line */}
            <div aria-hidden className="hidden lg:block absolute" style={{ top:30, left:"6%", right:"6%", height:2, background:"rgba(196,154,60,.12)", borderRadius:2 }}>
              <div style={{ height:"100%", width: timelineView ? "100%" : "0%", background:"linear-gradient(90deg,#96682c,#e8c060,#ffe9a8)", transition:"width 2.4s cubic-bezier(.34,1,.64,1)", borderRadius:2, boxShadow:"0 0 12px rgba(196,154,60,.5)" }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4 relative">
              {PROCESS.map((step, i) => {
                const delay = i * 250;
                return (
                  <div key={step.n} className="relative"
                    style={{
                      opacity: timelineView ? 1 : 0,
                      transform: timelineView ? "translateY(0)" : "translateY(40px)",
                      transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
                    }}>
                    {/* numbered node */}
                    <div className="hidden lg:flex justify-center" style={{ marginBottom:36 }}>
                      <div className="font-extrabold flex items-center justify-center relative"
                        style={{
                          width:60, height:60, borderRadius:16,
                          background: timelineView ? "linear-gradient(135deg,#96682c,#c49a3c)" : "rgba(20,20,20,.8)",
                          fontSize:18,
                          color: timelineView ? "#050505" : "rgba(245,240,232,.4)",
                          boxShadow: timelineView ? "0 8px 32px rgba(196,154,60,.5), inset 0 1px 0 rgba(255,255,255,.2)" : "none",
                          transition:`background 600ms ease ${delay+200}ms, color 600ms ease ${delay+200}ms, box-shadow 600ms ease ${delay+200}ms`,
                          zIndex:1,
                        }}>
                        {step.n}
                        {timelineView && (
                          <span aria-hidden style={{ position:"absolute", inset:0, borderRadius:16, border:"2px solid #c49a3c", animation:`pulseRing 2.4s ease-out ${delay+800}ms infinite` }} />
                        )}
                      </div>
                    </div>

                    {/* card */}
                    <div style={{ padding:"24px 26px", borderRadius:20, background:"rgba(10,10,10,.6)", border:"1px solid rgba(196,154,60,.15)", backdropFilter:"blur(8px)", height:"100%" }}>
                      {/* mobile number */}
                      <div className="lg:hidden flex items-center gap-3" style={{ marginBottom:16 }}>
                        <div className="font-extrabold flex items-center justify-center"
                          style={{ width:50, height:50, borderRadius:14, background:"linear-gradient(135deg,#96682c,#c49a3c)", fontSize:16, color:"#050505" }}>
                          {step.n}
                        </div>
                      </div>
                      <div style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:6, background:"rgba(196,154,60,.1)", border:"1px solid rgba(196,154,60,.22)", color:"#c49a3c", display:"inline-block", marginBottom:14 }}>{step.dur}</div>
                      <h3 className="font-bold" style={{ fontSize:21, color:"#f5f0e8", margin:"0 0 10px" }}>{step.t}</h3>
                      <p style={{ fontSize:14, lineHeight:1.7, color:"rgba(245,240,232,.6)", margin:"0 0 14px" }}>{step.desc}</p>
                      <div className="flex items-center gap-2" style={{ fontSize:12, color:"#c49a3c", padding:"8px 12px", borderRadius:8, background:"rgba(196,154,60,.06)", border:"1px solid rgba(196,154,60,.14)" }}>
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden />
                        {step.out}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 6. THREE PILLARS — DYNAMIC ════════ */}
      <section id="pilares" className="relative z-10" style={{ padding:"120px 24px", borderTop:"1px solid rgba(196,154,60,.12)" }}>
        <div className="mx-auto" style={{ maxWidth:1300 }}>
          <div className="text-center" style={{ marginBottom:56 }}>
            <Reveal>
              <div className="uppercase" style={{ fontSize:11, letterSpacing:"0.3em", color:"#c49a3c", marginBottom:16 }}>──── O que nossos agentes fazem ────</div>
              <h2 className="font-extrabold" style={{ fontSize:"clamp(32px,4.5vw,60px)", letterSpacing:"-0.03em", lineHeight:1.18, margin:"0 0 16px" }}>
                Cinco pilares.{" "}
                <span ref={tw5Ref} style={{ fontFamily:'"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle:"italic", fontWeight:400, background:"linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)", backgroundSize:"200% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer4h 6s linear infinite", paddingBottom:"0.3em", display:"inline-block", lineHeight:1.4, verticalAlign:"baseline" }}>{t5 || " "}</span>
              </h2>
              <p style={{ fontSize:16, color:"rgba(245,240,232,.55)", maxWidth:620, margin:"0 auto" }}>
                Atendimento, comercial, inteligência, financeiro, mídias e soluções sob medida — todos os agentes conectados na mesma operação.
              </p>
            </Reveal>
          </div>

          {/* Pillar towers */}
          <Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5" style={{ maxWidth:1300, margin:"0 auto 32px" }}>
              {PILLARS.map((p, i) => {
                const Icon = PILLAR_ICONS[i];
                const isActive = pillar === i;
                return (
                  <button key={p.id} onClick={() => setPillar(i)} className="group relative">
                    <div className="relative overflow-hidden" style={{
                      height:"clamp(120px,16vw,160px)", borderRadius:18,
                      background: isActive ? "linear-gradient(180deg, #1a1408, #0a0a0a)" : "#0a0a0a",
                      border: isActive ? "1px solid rgba(196,154,60,.6)" : "1px solid rgba(196,154,60,.14)",
                      boxShadow: isActive ? "0 0 24px rgba(196,154,60,.18), 0 8px 24px rgba(0,0,0,.4)" : "0 4px 12px rgba(0,0,0,.3)",
                      transition: "all 400ms ease",
                    }}>
                      {isActive && (
                        <>
                          <div aria-hidden style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent,rgba(196,154,60,.12),transparent)", animation:"scanV 3s ease-in-out infinite", opacity:.6 }} />
                          <div aria-hidden style={{ position:"absolute", top:-2, left:"50%", transform:"translateX(-50%)", width:3, height:8, borderRadius:2, background:"#e8c060", boxShadow:"0 0 16px #e8c060" }} />
                        </>
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ padding:16 }}>
                        <div style={{ width:44, height:44, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", background:isActive ? "rgba(196,154,60,.22)" : "rgba(196,154,60,.08)", border:`1px solid ${isActive ? "rgba(196,154,60,.5)" : "rgba(196,154,60,.18)"}`, color:isActive ? "#e8c060" : "#c49a3c", transition:"all 300ms ease" }}>
                          <Icon className="w-5 h-5" aria-hidden />
                        </div>
                        <div className="font-bold" style={{ fontSize:"clamp(13px,1.3vw,16px)", color:isActive ? "#f5f0e8" : "rgba(245,240,232,.75)", letterSpacing:"-0.01em", textAlign:"center" }}>
                          {p.label}
                        </div>
                        <div className="flex items-center gap-1.5" aria-label="Agentes envolvidos">
                          {p.agents.map(a => (
                            <span key={a} aria-hidden style={{ width:7, height:7, borderRadius:"50%", background:AGENT_COLORS[a], boxShadow:isActive ? `0 0 8px ${AGENT_COLORS[a]}` : `0 0 4px ${AGENT_COLORS[a]}66`, transition:"box-shadow 300ms ease" }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop:10, fontFamily:"monospace", fontSize:10, letterSpacing:"0.2em", color:isActive ? "#c49a3c" : "rgba(245,240,232,.3)", textAlign:"center", transition:"color 300ms ease" }}>
                      PILAR · {String(i+1).padStart(2,"0")}
                    </div>
                  </button>
                );
              })}
            </div>

            <p style={{ textAlign:"center", marginBottom:40, fontSize:11, fontStyle:"italic", color:"rgba(245,240,232,.35)" }}>
              Quatro agentes. Uma inteligência conectada — cinco pilares operando em sincronia.
            </p>
          </Reveal>

          {/* Active pillar content */}
          {(() => {
            const pAgents = PILLARS[pillar].agents;
            const pPrimary = AGENT_COLORS[pAgents[0]];
            const pSecond = AGENT_COLORS[pAgents[1] || pAgents[0]];
            const panelGlow = pAgents.length === 1
              ? `0 0 40px ${pPrimary}66, 0 0 12px ${pPrimary}44, 0 24px 48px rgba(0,0,0,.6)`
              : `0 0 40px ${pPrimary}55, 0 0 40px ${pSecond}55, 0 24px 48px rgba(0,0,0,.6)`;
            return (
          <div key={pillar} style={{ animation:"slidePanel 400ms cubic-bezier(.34,1.4,.64,1)" }}>
            <div style={{ borderRadius:28, padding:2, background:agentBorder(pAgents), boxShadow:panelGlow }}>
              <div style={{ padding:"clamp(28px,4vw,48px)", borderRadius:26, background:"linear-gradient(135deg, #14100a, #0a0a0a)", position:"relative", overflow:"hidden" }}>
                <div aria-hidden style={{ position:"absolute", top:-100, right:-100, width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(196,154,60,.10),transparent 60%)", filter:"blur(50px)" }} />

                <div className="relative grid md:grid-cols-2 gap-10 items-start">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom:20 }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:100, background:"rgba(196,154,60,.12)", border:"1px solid rgba(196,154,60,.35)", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#e8c060" }}>
                        <PIcon className="w-3.5 h-3.5" aria-hidden />
                        Pilar · {PILLARS[pillar].label}
                      </span>
                      <span className="flex items-center gap-1.5" aria-label="Agentes envolvidos">
                        {PILLARS[pillar].agents.map(a => (
                          <span key={a} aria-hidden style={{ width:9, height:9, borderRadius:"50%", background:AGENT_COLORS[a], boxShadow:`0 0 10px ${AGENT_COLORS[a]}` }} />
                        ))}
                      </span>
                    </div>
                    <h3 className="font-bold" style={{ fontSize:"clamp(22px,2.8vw,32px)", color:"#f5f0e8", margin:"0 0 16px", letterSpacing:"-0.02em", lineHeight:1.15 }}>
                      {PILLARS[pillar].title}
                    </h3>
                    <p style={{ fontSize:15, lineHeight:1.7, color:"rgba(245,240,232,.65)", margin:"0 0 28px" }}>
                      {PILLARS[pillar].desc}
                    </p>
                    <button onClick={() => scrollTo("contato")} className="lp-btn-primary font-bold rounded-full"
                      style={{ padding:"14px 26px", background:"linear-gradient(135deg,#96682c,#e8c060)", color:"#050505", fontSize:13, boxShadow:"0 8px 28px rgba(196,154,60,.45)" }}>
                      Conversar sobre o seu caso →
                    </button>
                  </div>
                  <div>
                    <div className="uppercase" style={{ fontSize:10, letterSpacing:"0.28em", color:"rgba(245,240,232,.45)", marginBottom:18 }}>O que está incluso</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PILLARS[pillar].features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3"
                          style={{ padding:"12px 14px", background:"rgba(5,5,5,.5)", border:"1px solid rgba(196,154,60,.14)", borderRadius:12, fontSize:13, color:"rgba(245,240,232,.85)", animation:`fadeIn4h 350ms ease ${i*60}ms both` }}>
                          <div aria-hidden style={{ width:18, height:18, borderRadius:6, background:"linear-gradient(135deg,#96682c,#c49a3c)", color:"#050505", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <Check className="w-2.5 h-2.5" strokeWidth={4} />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            );
          })()}
        </div>
      </section>

      {/* ════════ 7. CTA + EKG ANIMATION ════════ */}
      <section id="contato" className="relative z-10" style={{ padding:"60px 24px 80px" }}>
        {/* EKG cardiac lines */}
        <div aria-hidden className="absolute inset-0 flex flex-col justify-center pointer-events-none" style={{ overflow:"hidden", gap:24 }}>
          {[0,1,2].map(idx => (
            <div key={idx} style={{ position:"relative", width:"100%", height:140, overflow:"visible", opacity:.5 }}>
              <svg style={{ position:"absolute", top:"50%", left:0, transform:"translateY(-50%)", animation:`ekgScroll ${16+idx*3}s linear infinite`, animationDelay:`${idx*-4}s`, overflow:"visible" }}
                width="200%" height="100%" viewBox="0 0 2400 140" preserveAspectRatio="none">
                <path
                  d={EKG_PATHS[idx]}
                  fill="none" stroke={`url(#ekg-${idx})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id={`ekg-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"  stopColor="#c49a3c" stopOpacity="0" />
                    <stop offset="20%" stopColor="#c49a3c" stopOpacity=".5" />
                    <stop offset="50%" stopColor="#ffe9a8" stopOpacity="1" />
                    <stop offset="80%" stopColor="#c49a3c" stopOpacity=".5" />
                    <stop offset="100%" stopColor="#c49a3c" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ))}
        </div>

        <Reveal>
          <div className="relative mx-auto overflow-hidden"
            style={{ maxWidth:1200, borderRadius:36, background:"linear-gradient(135deg,rgba(150,104,44,.24),rgba(10,10,10,.85))", border:"1px solid rgba(196,154,60,.3)", boxShadow:"0 40px 80px -32px rgba(0,0,0,.9), 0 0 120px rgba(196,154,60,.1)", backdropFilter:"blur(8px)" }}>
            <div aria-hidden style={{ position:"absolute", left:0, right:0, height:4, background:"linear-gradient(90deg,transparent,rgba(196,154,60,.08),transparent)", animation:"scanline 5s ease-in-out infinite", top:0, zIndex:0 }} />
            <div aria-hidden style={{ position:"absolute", left:"50%", top:"-60%", transform:"translateX(-50%)", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(196,154,60,.14),transparent 60%)", filter:"blur(80px)", zIndex:0 }} />

            <div className="relative z-10 text-center" style={{ padding:"clamp(48px,6vw,88px) clamp(24px,5vw,80px)" }}>
              <div className="inline-flex items-center gap-2.5 text-xs font-medium rounded-full"
                style={{ padding:"7px 18px", border:"1px solid rgba(196,154,60,.35)", color:"#c49a3c", background:"rgba(196,154,60,.08)", marginBottom:28 }}>
                <span aria-hidden style={{ width:6, height:6, borderRadius:"50%", background:"#e8c060", boxShadow:"0 0 12px #e8c060" }} />
                Sem compromisso · Diagnóstico gratuito
              </div>
              <h2 className="font-extrabold" style={{ fontSize:"clamp(32px,5vw,68px)", letterSpacing:"-0.045em", lineHeight:1.15, margin:"0 0 24px", color:"#f5f0e8" }}>
                Vamos resolver os{" "}<br />
                <span ref={tw4Ref} style={{ fontFamily:'"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle:"italic", fontWeight:400, background:"linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)", backgroundSize:"200% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer4h 6s linear infinite", paddingBottom:"0.3em", display:"inline-block", lineHeight:1.4, verticalAlign:"baseline", minHeight:"1.4em" }}>
                  {t4 || " "}
                  <span aria-hidden style={{ display:"inline-block", width:3, height:"0.85em", background:"#e8c060", borderRadius:2, animation:"blink 1s ease-in-out infinite", verticalAlign:"middle", marginLeft:6, WebkitTextFillColor:"#e8c060" }} />
                </span>
              </h2>
              <p style={{ fontSize:"clamp(15px,1.5vw,19px)", color:"rgba(245,240,232,.65)", maxWidth:560, margin:"0 auto 44px", lineHeight:1.65 }}>
                Converse com a 4Him. Entendemos seu processo, mapeamos oportunidades e desenhamos uma solução sob medida — do atendimento ao BPO financeiro.
              </p>
              <div className="flex justify-center">
                <button onClick={() => window.open(WHATSAPP_URL,"_blank")}
                  className="lp-btn-primary font-bold rounded-full inline-flex items-center justify-center gap-2.5"
                  style={{ padding:"18px 36px", background:"linear-gradient(135deg,#e8c060,#ffe9a8)", color:"#050505", fontSize:15, boxShadow:"0 14px 40px rgba(255,233,168,.4), inset 0 1px 0 rgba(255,255,255,.4)" }}>
                  <MessageCircle className="w-4 h-4" aria-hidden />
                  Agendar diagnóstico gratuito no WhatsApp →
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════ FOOTER (LP3 EXATO) ════════ */}
      <footer className="relative z-10" style={{ padding:"64px 24px 32px", borderTop:"1px solid rgba(196,154,60,.12)" }}>
        <div className="mx-auto" style={{ maxWidth:1300 }}>
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]" style={{ marginBottom:48 }}>
            <div>
              <div className="flex items-center gap-3" style={{ marginBottom:16 }}>
                <img src={LOGO_ICON_URL} alt="" className="h-10 w-auto" />
                <div>
                  <div className="font-bold" style={{ fontSize:16, color:"#f5f0e8" }}>4Him Technology</div>
                  <div className="uppercase" style={{ fontSize:9, letterSpacing:"0.22em", color:"rgba(245,240,232,.4)" }}>Consultoria em IA</div>
                </div>
              </div>
              <p style={{ fontSize:13, lineHeight:1.7, color:"rgba(245,240,232,.5)", maxWidth:320, margin:"0 0 20px" }}>
                Consultoria estratégica em IA. Desenhamos, implantamos e operamos soluções sob medida — do diagnóstico à operação contínua.
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { name:"ELO4H",  desc:"Atendimento · Comercial · Inteligência", color:"#c49a3c" },
                  { name:"4HBEL",  desc:"BPO Financeiro",                          color:"#a78bfa" },
                  { name:"AD4HN",  desc:"Mídias Sociais · Tráfego pago",           color:"#ec4899" },
                  { name:"MARI4H", desc:"Soluções customizadas com IA",            color:"#34d399" },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-2.5"
                    style={{ padding:"7px 12px", borderRadius:10, background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:p.color, boxShadow:`0 0 8px ${p.color}`, flexShrink:0 }} aria-hidden />
                    <span className="font-bold" style={{ fontSize:12, color:p.color }}>{p.name}</span>
                    <span style={{ fontSize:11, color:"rgba(245,240,232,.4)" }}>—</span>
                    <span style={{ fontSize:11, color:"rgba(245,240,232,.45)" }}>{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              ["Soluções", ["ELO4H","4HBEL","AD4HN","MARI4H","Consultoria estratégica"]],
              ["Método",   ["Diagnóstico","Desenho","Implantação","Operação contínua"]],
              ["Contato",  [
                { icon:MessageCircle, label:"+55 11 97451-4678",                    href:WHATSAPP_URL },
                { icon:Mail,          label:"contato@4him.com.br",                  href:"mailto:contato@4him.com.br" },
                { icon:MapPin,        label:"Atendimento em todo o Brasil",         href:null },
                { icon:Headphones,    label:"Treinamento presencial sob demanda",   href:null },
              ]],
            ].map(([h, items], i) => (
              <div key={i}>
                <div className="uppercase" style={{ fontSize:10, letterSpacing:"0.3em", color:"#c49a3c", marginBottom:16 }}>{h}</div>
                {items.map((v, j) => {
                  if (typeof v === "string") return <div key={j} style={{ fontSize:13, color:"rgba(245,240,232,.65)", padding:"6px 0" }}>{v}</div>;
                  const Icon = v.icon;
                  const inner = <><Icon className="w-3.5 h-3.5 shrink-0" style={{ color:"#c49a3c" }} aria-hidden />{v.label}</>;
                  return v.href
                    ? <a key={j} href={v.href} target={v.href.startsWith("http")?"_blank":undefined} rel={v.href.startsWith("http")?"noopener noreferrer":undefined} className="flex items-center gap-2" style={{ fontSize:13, color:"rgba(245,240,232,.65)", padding:"6px 0", textDecoration:"none" }}>{inner}</a>
                    : <div key={j} className="flex items-center gap-2" style={{ fontSize:13, color:"rgba(245,240,232,.65)", padding:"6px 0" }}>{inner}</div>;
                })}
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:justify-between gap-2"
            style={{ paddingTop:24, borderTop:"1px solid rgba(196,154,60,.1)", fontSize:11, color:"rgba(245,240,232,.3)" }}>
            <div>© {new Date().getFullYear()} 4Him Technology. Todos os direitos reservados.</div>
            <div>Consultoria estratégica em IA — do diagnóstico à operação.</div>
          </div>
        </div>
      </footer>

      {/* scroll to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top:0, behavior:"smooth" })} aria-label="Voltar ao topo"
          className="fixed flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ bottom:24, right:24, zIndex:50, width:44, height:44, borderRadius:12, background:"rgba(10,10,10,.88)", border:"1px solid rgba(196,154,60,.4)", color:"#c49a3c", backdropFilter:"blur(12px)", boxShadow:"0 8px 24px rgba(0,0,0,.5)", animation:"fadeIn4h 300ms ease" }}>
          <ChevronUp className="w-5 h-5" aria-hidden />
        </button>
      )}
    </div>
  );
}
