import { describe, it, expect } from "vitest";
import { render } from "./entry-server";

describe("pre-renderizacao da home", () => {
  it("gera o HTML com o texto da pagina, legivel sem JavaScript", () => {
    const html = render();
    expect(html).toContain("A tecnologia certa não é ter mais ferramentas.");
    expect(html).toContain("É ter o sistema certo.");
    for (const id of ["inicio", "problema", "consultoria", "diferencial", "como-trabalhamos",
      "ia", "solucoes", "cases", "por-que", "contato"]) {
      expect(html).toContain(`id="${id}"`);
    }
  });

  it("deixa o hero visivel no HTML estatico, sem depender do JavaScript para aparecer", () => {
    const html = render();
    const hero = html.slice(html.indexOf('id="inicio"'), html.indexOf('id="problema"'));
    expect(hero).not.toContain("opacity:0");
  });
});
