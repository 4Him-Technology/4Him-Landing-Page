import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const SITE = "https://www.4him.com.br";
const root = resolve(__dirname, "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");

describe("SEO - arquivos para buscadores", () => {
  const html = read("index.html");

  it("declara o endereco canonico e o og:url no dominio oficial", () => {
    expect(html).toContain(`<link rel="canonical" href="${SITE}/" />`);
    expect(html).toContain(`<meta property="og:url" content="${SITE}/" />`);
  });

  it("permite indexacao", () => {
    expect(html).toMatch(/<meta name="robots" content="index, follow[^"]*" \/>/);
  });

  it("tem titulo e descricao dentro do tamanho que o Google mostra", () => {
    const title = html.match(/<title>(.*)<\/title>/)[1];
    const desc = html.match(/<meta name="description" content="([^"]*)"/)[1];
    expect(title.length).toBeLessThanOrEqual(60);
    expect(desc.length).toBeGreaterThanOrEqual(120);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it("tem dados estruturados validos de Organization e WebSite", () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1]));
    const graph = blocks.flatMap((b) => b["@graph"] || [b]);
    const org = graph.find((n) => n["@type"] === "Organization");
    const site = graph.find((n) => n["@type"] === "WebSite");
    expect(org).toBeTruthy();
    expect(org.url).toBe(`${SITE}/`);
    expect(org.logo).toMatch(new RegExp(`^${SITE}/`));
    expect(site.url).toBe(`${SITE}/`);
    expect(site.inLanguage).toBe("pt-BR");
  });

  it("robots.txt libera tudo e aponta para o sitemap", () => {
    const robots = read("public/robots.txt");
    expect(robots).toMatch(/User-agent: \*\s*\nAllow: \//);
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });

  it("sitemap.xml lista a home no dominio oficial", () => {
    const sm = read("public/sitemap.xml");
    expect(sm).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sm).toContain(`<loc>${SITE}/</loc>`);
    expect(sm).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  });

  it("tem pagina 404 propria e nao devolve a home com status 200 para qualquer URL", () => {
    expect(existsSync(resolve(root, "public/404.html"))).toBe(true);
    const toml = read("netlify.toml");
    expect(toml).not.toMatch(/to\s*=\s*"\/index\.html"\s*\r?\n\s*status\s*=\s*200/);
  });
});
