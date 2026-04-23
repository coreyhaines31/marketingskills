# Marketing Skills Versions

Versões atuais de todas as skills. Os agentes podem comparar com as versões locais para verificar atualizações.

| Skill | Version | Last Updated |
|-------|---------|--------------|
| ab-test-setup | 1.2.0 | 2026-03-14 |
| ad-creative | 1.2.0 | 2026-03-14 |
| ai-seo | 1.2.0 | 2026-03-14 |
| analytics-tracking | 1.2.0 | 2026-03-14 |
| aso-audit | 1.0.0 | 2026-04-21 |
| churn-prevention | 1.2.0 | 2026-03-14 |
| cold-email | 1.2.0 | 2026-03-14 |
| competitor-alternatives | 1.2.0 | 2026-03-14 |
| community-marketing | 1.0.0 | 2026-04-21 |
| competitor-profiling | 1.0.0 | 2026-04-07 |
| content-strategy | 1.2.0 | 2026-03-14 |
| copy-editing | 1.2.0 | 2026-03-14 |
| copywriting | 1.2.0 | 2026-03-14 |
| customer-research | 1.0.0 | 2026-04-21 |
| directory-submissions | 1.0.0 | 2026-04-21 |
| email-sequence | 1.2.0 | 2026-03-14 |
| form-cro | 1.2.0 | 2026-03-14 |
| free-tool-strategy | 1.2.0 | 2026-03-14 |
| launch-strategy | 1.2.0 | 2026-03-14 |
| lead-magnets | 1.0.0 | 2026-03-14 |
| marketing-ideas | 1.2.0 | 2026-03-14 |
| marketing-psychology | 1.2.0 | 2026-03-14 |
| onboarding-cro | 1.2.0 | 2026-03-14 |
| page-cro | 1.2.0 | 2026-03-14 |
| paid-ads | 1.2.0 | 2026-03-14 |
| paywall-upgrade-cro | 1.2.0 | 2026-03-14 |
| popup-cro | 1.2.0 | 2026-03-14 |
| pricing-strategy | 1.2.0 | 2026-03-14 |
| product-marketing-context | 1.2.0 | 2026-03-14 |
| programmatic-seo | 1.2.0 | 2026-03-14 |
| referral-program | 1.2.0 | 2026-03-14 |
| revops | 1.2.0 | 2026-03-14 |
| sales-enablement | 1.2.0 | 2026-03-14 |
| schema-markup | 1.2.0 | 2026-03-14 |
| seo-audit | 1.2.0 | 2026-03-14 |
| signup-flow-cro | 1.2.0 | 2026-03-14 |
| site-architecture | 1.2.0 | 2026-03-14 |
| social-content | 1.2.0 | 2026-03-14 |

## Alterações Recentes

### 2026-04-21
- Adicionada skill `directory-submissions` para Product Hunt, G2, diretórios de IA e estratégia de backlinks
- Adicionada skill `competitor-profiling` para pesquisa de inteligência competitiva
- Adicionada seção de SEO internacional e localização ao `seo-audit` (1.2.0)
- Adicionada referência de rastreamento de conversão ao `paid-ads` (configuração de pixel multiplataforma)
- Adicionada integração com Zapier SDK para acesso a mais de 8.000 aplicativos
- Corrigido carregamento de plugins: prefixo `./` removido dos caminhos de skills no marketplace.json (#243)
- Robustez dos CLIs: chave de API da Supermetrics movida para o header, JWT do ZoomInfo mascarado por padrão
- Corrigido frontmatter YAML do community-marketing (#240)
- Corrigida validação de URL de webhook do Zapier (#247)
- Adicionadas skills ausentes ao VERSIONS.md (aso-audit, community-marketing, customer-research — lançadas em versões anteriores)
- Total de skills: 38

### 2026-03-14
- Adicionada skill `lead-magnets` para estratégia de lead magnet, seleção de formato e otimização de conversão
- Adicionada camada de integração Composio para acesso MCP a ferramentas com OAuth pesado (HubSpot, Salesforce, Meta Ads, LinkedIn Ads, Google Sheets, Slack, Notion, etc.)
- Adicionados guias de integração com headless CMS (Sanity, Contentful, Strapi) com referência headless-cms
- Adicionados 197 evals em todas as 33 skills para testes automatizados de qualidade
- Otimizadas todas as 32 descrições de skills para melhor correspondência de frases de gatilho
- Substituídos imperativos rígidos por orientações baseadas em raciocínio em todas as skills
- Adicionados 10 novos CLIs (airops, clay, close, coupler, crossbeam, outreach, pendo, similarweb, supermetrics, zoominfo)
- Adicionados 13 novos guias de integração
- Todas as 32 skills existentes atualizadas de 1.1.0 → 1.2.0

### 2026-02-27
- Migrado caminho de contexto de `.claude/` para `.agents/` para compatibilidade agnóstica de agente
- Todas as skills agora verificam `.agents/product-marketing-context.md` primeiro, com fallback para `.claude/` em configurações mais antigas
- Caminhos de instalação no README atualizados para referenciar `.agents/skills/`
- Todas as 32 skills atualizadas de 1.0.0 → 1.1.0

### 2026-02-22
- Adicionada skill `revops` para operações de receita, ciclo de vida de leads, pontuação, roteamento, gestão de pipeline e automação de CRM
- Adicionada skill `sales-enablement` para decks de vendas, one-pagers, tratamento de objeções, scripts de demo e playbooks de vendas

### 2026-02-21
- Adicionada skill `site-architecture` para planejamento de estrutura de site, hierarquia de páginas, design de navegação, estrutura de URL e estratégia de links internos

### 2026-02-18
- Adicionada skill `ai-seo` para otimização de busca com IA (AEO, GEO, LLMO, AI Overviews)
- Padrões de conteúdo AEO/GEO movidos das referências do `seo-audit` para a skill `ai-seo`
- Adicionada skill `churn-prevention` para fluxos de cancelamento, ofertas de salvamento, dunning e recuperação de pagamentos

### 2026-02-17
- Adicionada skill `ad-creative` para geração em volume de criativos e iteração baseada em performance
- Adicionados 51 CLIs zero-dependência para plataformas de marketing (`tools/clis/`)
- Adicionados 31 novos guias de integração (`tools/integrations/`)
- Adicionados 4 CLIs de prospecção por e-mail: hunter, snov, lemlist, instantly
- Robustez de segurança: autenticação via header para meta-ads, codificação de URL, validação de entrada
- Todos os CLIs revisados por auditoria independente via codex (autenticação, segurança, tratamento de erros, consistência)

### 2026-01-27
- Rastreamento inicial de versões adicionado
- Adicionado registro de ferramentas com 29 guias de integração
