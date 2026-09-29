import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import LandingPage from "./LandingPage";

const WHATSAPP = "https://wa.me/5511974514678";

function renderPage() {
  return render(<LandingPage />);
}

describe("LandingPage - reposicionamento como consultoria de sistemas", () => {
  it("abre com o titulo principal do briefing no h1", () => {
    renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("A tecnologia certa não é ter mais ferramentas.");
    expect(h1).toHaveTextContent("É ter o sistema certo.");
  });

  it("tem o menu do briefing e cada item aponta para uma secao que existe", () => {
    const { container } = renderPage();
    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    const esperados = {
      "Início": "inicio",
      "A Consultoria": "consultoria",
      "Como Trabalhamos": "como-trabalhamos",
      "Soluções": "solucoes",
      "Contato": "contato",
    };
    for (const [rotulo, id] of Object.entries(esperados)) {
      const link = within(nav).getByRole("link", { name: rotulo });
      expect(link).toHaveAttribute("href", `#${id}`);
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
    expect(within(nav).getByRole("link", { name: /Fale com um consultor/ })).toBeInTheDocument();
  });

  it("segue a ordem das 10 secoes da home", () => {
    const { container } = renderPage();
    const ordem = ["inicio", "problema", "consultoria", "diferencial", "como-trabalhamos",
      "ia", "solucoes", "cases", "por-que", "contato"];
    const ids = [...container.querySelectorAll("main > section[id]")].map((s) => s.id);
    expect(ids).toEqual(ordem);
  });

  it("mostra as cinco ferramentas avulsas e o gancho da pergunta certa", () => {
    renderPage();
    const problema = document.getElementById("problema");
    for (const f of ["Chatbot genérico", "Assistente de IA", "Agente “tudo-em-um”",
      "Plugin de automação", "Ferramenta no-code"]) {
      expect(within(problema).getByText(f)).toBeInTheDocument();
    }
    expect(problema).toHaveTextContent("o que a minha operação realmente precisa?");
  });

  it("compara ferramenta generica com sistema sob medida", () => {
    renderPage();
    const dif = document.getElementById("diferencial");
    expect(within(dif).getByRole("heading", { name: "Ferramenta genérica" })).toBeInTheDocument();
    expect(within(dif).getByRole("heading", { name: "Sistema sob medida" })).toBeInTheDocument();
    expect(dif).toHaveTextContent("Pode não resolver o problema real");
    expect(dif).toHaveTextContent("Foco em produtividade e eficiência");
  });

  it("apresenta as cinco etapas do metodo na ordem", () => {
    renderPage();
    const metodo = document.getElementById("como-trabalhamos");
    const etapas = within(metodo).getAllByRole("tab").map((t) => t.textContent);
    expect(etapas.map((e) => e.replace(/^\d+/, ""))).toEqual(
      ["Diagnóstico", "Projeto", "Desenvolvimento", "Implantação", "Evolução"]);
  });

  it("mostra a cadeia do problema ao resultado na secao de IA", () => {
    renderPage();
    const ia = document.getElementById("ia");
    const passos = within(ia).getAllByRole("listitem").map((li) => li.textContent);
    expect(passos).toEqual(["Problema", "Diagnóstico", "Estratégia", "Tecnologia", "Sistema", "Resultado"]);
  });

  it("lista as cinco frentes de solucao", () => {
    renderPage();
    const sol = document.getElementById("solucoes");
    for (const t of ["Inteligência Artificial & Agentes", "Sistemas de Gestão",
      "Atendimento & Relacionamento", "Plataformas Corporativas", "Sites & Experiências Digitais"]) {
      expect(within(sol).getByRole("heading", { name: t })).toBeInTheDocument();
    }
  });

  it("cita os cases do briefing", () => {
    renderPage();
    const cases = document.getElementById("cases");
    expect(cases).toHaveTextContent("Sistemas financeiros");
    expect(cases).toHaveTextContent("Gestão de recursos humanos");
    expect(cases).toHaveTextContent("NR1");
    expect(cases).toHaveTextContent("Atendimento via WhatsApp");
  });

  it("tem os seis motivos do por que 4Him", () => {
    renderPage();
    const pq = document.getElementById("por-que");
    for (const t of ["Diagnóstico antes da tecnologia", "Personalização", "IA quando faz sentido",
      "Integração", "Foco em adoção", "Foco em resultado"]) {
      expect(within(pq).getByRole("heading", { name: t })).toBeInTheDocument();
    }
  });

  it("fecha com o CTA que leva ao WhatsApp", () => {
    renderPage();
    const cta = within(document.getElementById("contato"))
      .getByRole("link", { name: /Quero otimizar minha operação/ });
    expect(cta).toHaveAttribute("href", WHATSAPP);
    expect(cta).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("nao fala mais em produtos nem nos agentes antigos", () => {
    const { container } = renderPage();
    const texto = container.textContent;
    for (const antigo of ["ELO4H", "4HBEL", "AD4HN", "MARI4H", "Ecossistema de produtos"]) {
      expect(texto).not.toContain(antigo);
    }
  });

  it("nao usa travessao em nenhum texto da pagina", () => {
    const { container } = renderPage();
    expect(container.textContent).not.toContain("—");
  });

  it("nao usa tracos decorativos de box-drawing em nenhum texto da pagina", () => {
    const { container } = renderPage();
    expect(container.textContent).not.toMatch(/[─-╿]/);
  });
});
