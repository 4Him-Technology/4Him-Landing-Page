# Política de Segurança — 4Him Landing Page

## 📦 Versão suportada

Apenas a branch `main` (versão em produção em [4him.com.br](https://4him.com.br)) recebe correções de segurança.

| Versão | Suporte |
| ------ | ------- |
| `main` (produção) | ✅ |
| Branches antigas / forks | ❌ |

## 🛡️ Como reportar uma vulnerabilidade

Encontrou algum problema de segurança neste projeto ou no site?

- **E-mail privado:** [contato@4him.com.br](mailto:contato@4him.com.br)
- **Assunto sugerido:** `[SECURITY] <descrição curta>`

Por favor, **não abra issues públicas** para vulnerabilidades. Em vez disso, mande os detalhes pelo e-mail acima.

## 📋 O que incluir no report

Para acelerar a análise, inclua se possível:

1. **Descrição do problema** e impacto potencial
2. **Passos para reproduzir** (URL, payload, contexto)
3. **Versão / commit** afetado
4. **Recomendação de correção** (opcional)

## ⏱️ Tempo de resposta

| Etapa | Prazo alvo |
| ----- | ---------- |
| Confirmação de recebimento | até 48h úteis |
| Avaliação inicial e classificação | até 7 dias |
| Correção e deploy (vulnerabilidades altas/críticas) | até 14 dias |

## 🔒 Stack e superfície de ataque

Este repositório é uma **landing page estática** (React + Vite, hospedada na Netlify):

- Sem backend, sem banco de dados, sem autenticação
- Sem coleta ou armazenamento de dados de usuários
- Único contato externo: `wa.me` (WhatsApp) e `mailto:`
- Headers de segurança configurados via `netlify.toml` (CSP, HSTS, X-Frame-Options, Permissions-Policy, etc.)
- Dependências monitoradas por Dependabot
