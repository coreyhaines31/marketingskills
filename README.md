# Marketing Skills for AI Agents

Uma coleção de skills para agentes de IA focadas em tarefas de marketing. Desenvolvida para profissionais de marketing técnico e fundadores que querem que agentes de IA auxiliem com otimização de conversão, copywriting, SEO, analytics e growth engineering. Compatível com Claude Code, OpenAI Codex, Cursor, Windsurf e qualquer agente que suporte a [especificação Agent Skills](https://agentskills.io).

Desenvolvido por [Corey Haines](https://corey.co?ref=marketingskills). Precisa de ajuda prática? Conheça a [Conversion Factory](https://conversionfactory.co?ref=marketingskills) — a agência de Corey para otimização de conversão, landing pages e estratégia de crescimento. Quer aprender mais sobre marketing? Assine a [Swipe Files](https://swipefiles.com?ref=marketingskills). Quer um agente de IA autônomo que use essas skills como seu CMO? Experimente o [Magister](https://magistermarketing.com?ref=marketingskills).

Novo no terminal e em agentes de código? Confira o guia complementar [Coding for Marketers](https://codingformarketers.com?ref=marketingskills).

**Contribuições são bem-vindas!** Encontrou uma forma de melhorar uma skill ou tem uma nova para adicionar? [Abra um PR](#contributing).

Encontrou algum problema ou tem uma dúvida? [Abra uma issue](https://github.com/coreyhaines31/marketingskills/issues) — estamos felizes em ajudar.

## O que são Skills?

Skills são arquivos markdown que fornecem aos agentes de IA conhecimento especializado e fluxos de trabalho para tarefas específicas. Ao adicioná-las ao seu projeto, o agente consegue identificar quando você está trabalhando em uma tarefa de marketing e aplicar os frameworks e boas práticas corretos.

## Como as Skills Funcionam em Conjunto

As skills se referenciam entre si e se constroem sobre um contexto compartilhado. A skill `product-marketing-context` é a base — todas as outras skills a consultam primeiro para entender seu produto, público e posicionamento antes de fazer qualquer coisa.

```
                            ┌──────────────────────────────────────┐
                            │      product-marketing-context       │
                            │    (read by all other skills first)  │
                            └──────────────────┬───────────────────┘
                                               │
    ┌──────────────┬─────────────┬─────────────┼─────────────┬──────────────┬──────────────┐
    ▼              ▼             ▼             ▼             ▼              ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────┐ ┌───────────┐
│  SEO &   │ │   CRO    │ │Content & │ │  Paid &    │ │ Growth & │ │  Sales &    │ │ Strategy  │
│ Content  │ │          │ │   Copy   │ │Measurement │ │Retention │ │    GTM      │ │           │
├──────────┤ ├──────────┤ ├──────────┤ ├────────────┤ ├──────────┤ ├─────────────┤ ├───────────┤
│seo-audit │ │page-cro  │ │copywritng│ │paid-ads    │ │referral  │ │revops       │ │mktg-ideas │
│ai-seo    │ │signup-cro│ │copy-edit │ │ad-creative │ │free-tool │ │sales-enable │ │mktg-psych │
│site-arch │ │onboard   │ │cold-email│ │ab-test     │ │churn-    │ │launch       │ │customer-  │
│programm  │ │form-cro  │ │email-seq │ │analytics   │ │ prevent  │ │pricing      │ │ research  │
│schema    │ │popup-cro │ │social    │ │            │ │community │ │comp-alts    │ │           │
│content   │ │paywall   │ │          │ │            │ │lead-magnt│ │comp-profile │ │           │
│aso-audit │ │          │ │          │ │            │ │          │ │directory    │ │           │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ └────┬─────┘ └──────┬──────┘ └─────┬─────┘
     │            │            │              │             │              │              │
     └────────────┴─────┬──────┴──────────────┴─────────────┴──────────────┴──────────────┘
                        │
         Skills cross-reference each other:
           copywriting ↔ page-cro ↔ ab-test-setup
           revops ↔ sales-enablement ↔ cold-email
           seo-audit ↔ schema-markup ↔ ai-seo
           customer-research → copywriting, page-cro, competitor-alternatives
```

Veja a seção **Related Skills** de cada skill para o mapa completo de dependências.

## Skills Disponíveis

<!-- SKILLS:START -->
| Skill | Descrição |
|-------|-------------|
| [ab-test-setup](skills/ab-test-setup/) | When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation program.... |
| [ad-creative](skills/ad-creative/) | When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or full ad... |
| [ai-seo](skills/ai-seo/) | When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers.... |
| [analytics-tracking](skills/analytics-tracking/) | When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when the user mentions... |
| [aso-audit](skills/aso-audit/) | When the user wants to audit or optimize an App Store or Google Play listing. Also use when the user mentions 'ASO... |
| [churn-prevention](skills/churn-prevention/) | When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed payments, or... |
| [cold-email](skills/cold-email/) | Write B2B cold emails and follow-up sequences that get replies. Use when the user wants to write cold outreach emails,... |
| [community-marketing](skills/community-marketing/) | Build and leverage online communities to drive product growth and brand loyalty. Use when the user wants to create a... |
| [competitor-alternatives](skills/competitor-alternatives/) | When the user wants to create competitor comparison or alternative pages for SEO and sales enablement. Also use when... |
| [competitor-profiling](skills/competitor-profiling/) | When the user wants to research, profile, or analyze competitors from their URLs. Also use when the user mentions... |
| [content-strategy](skills/content-strategy/) | When the user wants to plan a content strategy, decide what content to create, or figure out what topics to cover. Also... |
| [copy-editing](skills/copy-editing/) | When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content. Also use when the... |
| [copywriting](skills/copywriting/) | When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages,... |
| [customer-research](skills/customer-research/) | When the user wants to conduct, analyze, or synthesize customer research. Use when the user mentions "customer... |
| [directory-submissions](skills/directory-submissions/) | When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories for... |
| [email-sequence](skills/email-sequence/) | When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle email... |
| [form-cro](skills/form-cro/) | When the user wants to optimize any form that is NOT signup/registration — including lead capture forms, contact forms,... |
| [free-tool-strategy](skills/free-tool-strategy/) | When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO value, or... |
| [launch-strategy](skills/launch-strategy/) | When the user wants to plan a product launch, feature announcement, or release strategy. Also use when the user... |
| [lead-magnets](skills/lead-magnets/) | When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation. Also use when the... |
| [marketing-ideas](skills/marketing-ideas/) | When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product. Also use when the... |
| [marketing-psychology](skills/marketing-psychology/) | When the user wants to apply psychological principles, mental models, or behavioral science to marketing. Also use when... |
| [onboarding-cro](skills/onboarding-cro/) | When the user wants to optimize post-signup onboarding, user activation, first-run experience, or time-to-value. Also... |
| [page-cro](skills/page-cro/) | When the user wants to optimize, improve, or increase conversions on any marketing page — including homepage, landing... |
| [paid-ads](skills/paid-ads/) | When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X,... |
| [paywall-upgrade-cro](skills/paywall-upgrade-cro/) | When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or feature gates. Also use... |
| [popup-cro](skills/popup-cro/) | When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. Also... |
| [pricing-strategy](skills/pricing-strategy/) | When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when the user mentions... |
| [product-marketing-context](skills/product-marketing-context/) | When the user wants to create or update their product marketing context document. Also use when the user mentions... |
| [programmatic-seo](skills/programmatic-seo/) | When the user wants to create SEO-driven pages at scale using templates and data. Also use when the user mentions... |
| [referral-program](skills/referral-program/) | When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth strategy.... |
| [revops](skills/revops/) | When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales handoff processes.... |
| [sales-enablement](skills/sales-enablement/) | When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scripts. Also... |
| [schema-markup](skills/schema-markup/) | When the user wants to add, fix, or optimize schema markup and structured data on their site. Also use when the user... |
| [seo-audit](skills/seo-audit/) | When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions "SEO... |
| [signup-flow-cro](skills/signup-flow-cro/) | When the user wants to optimize signup, registration, account creation, or trial activation flows. Also use when the... |
| [site-architecture](skills/site-architecture/) | When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal... |
| [social-content](skills/social-content/) | When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram,... |
<!-- SKILLS:END -->

## Instalação

### Opção 1: Instalação via CLI (Recomendado)

Use [npx skills](https://github.com/vercel-labs/skills) para instalar skills diretamente:

```bash
# Instalar todas as skills
npx skills add coreyhaines31/marketingskills

# Instalar skills específicas
npx skills add coreyhaines31/marketingskills --skill page-cro copywriting

# Listar skills disponíveis
npx skills add coreyhaines31/marketingskills --list
```

Isso instala automaticamente no diretório `.agents/skills/` (e cria symlinks em `.claude/skills/` para compatibilidade com Claude Code).

### Opção 2: Plugin do Claude Code

Instale pelo sistema de plugins integrado do Claude Code:

```bash
# Adicionar o marketplace
/plugin marketplace add coreyhaines31/marketingskills

# Instalar todas as marketing skills
/plugin install marketing-skills
```

### Opção 3: Clone e Cópia

Clone o repositório completo e copie a pasta de skills:

```bash
git clone https://github.com/coreyhaines31/marketingskills.git
cp -r marketingskills/skills/* .agents/skills/
```

### Opção 4: Git Submodule

Adicione como submódulo para atualizações fáceis:

```bash
git submodule add https://github.com/coreyhaines31/marketingskills.git .agents/marketingskills
```

Depois referencie as skills em `.agents/marketingskills/skills/`.

### Opção 5: Fork e Personalização

1. Faça um fork deste repositório
2. Personalize as skills para suas necessidades específicas
3. Clone seu fork nos seus projetos

### Opção 6: SkillKit (Multi-Agente)

Use o [SkillKit](https://github.com/rohitg00/skillkit) para instalar skills em múltiplos agentes de IA (Claude Code, Cursor, Copilot, etc.):

```bash
# Instalar todas as skills
npx skillkit install coreyhaines31/marketingskills

# Instalar skills específicas
npx skillkit install coreyhaines31/marketingskills --skill page-cro copywriting

# Listar skills disponíveis
npx skillkit install coreyhaines31/marketingskills --list
```

## Atualizando a partir da v1.0

As skills agora usam `.agents/` em vez de `.claude/` para o arquivo de contexto de marketing de produto. Mova seu arquivo de contexto existente:

```bash
mkdir -p .agents
mv .claude/product-marketing-context.md .agents/product-marketing-context.md
```

As skills ainda verificam `.claude/` como fallback, então nada quebra se você não fizer isso.

## Uso

Uma vez instaladas, basta pedir ao seu agente ajuda com tarefas de marketing:

```
"Help me optimize this landing page for conversions"
→ Uses page-cro skill

"Write homepage copy for my SaaS"
→ Uses copywriting skill

"Set up GA4 tracking for signups"
→ Uses analytics-tracking skill

"Create a 5-email welcome sequence"
→ Uses email-sequence skill
```

Você também pode invocar skills diretamente:

```
/page-cro
/email-sequence
/seo-audit
```

## Categorias de Skills

### Otimização de Conversão
- `page-cro` - Qualquer página de marketing
- `signup-flow-cro` - Fluxos de registro
- `onboarding-cro` - Ativação pós-cadastro
- `form-cro` - Formulários de captura de leads
- `popup-cro` - Modais e overlays
- `paywall-upgrade-cro` - Momentos de upgrade no app

### Conteúdo & Copy
- `copywriting` - Copy para páginas de marketing
- `copy-editing` - Editar e polir copy existente
- `cold-email` - E-mails de prospecção B2B e sequências
- `email-sequence` - Fluxos de e-mail automatizados
- `social-content` - Conteúdo para redes sociais

### SEO & Descoberta
- `seo-audit` - SEO técnico e on-page
- `ai-seo` - Otimização para busca com IA (AEO, GEO, LLMO)
- `programmatic-seo` - Geração de páginas em escala
- `site-architecture` - Hierarquia de páginas, navegação, estrutura de URL
- `competitor-alternatives` - Páginas de comparação e alternativas
- `schema-markup` - Dados estruturados

### Mídia Paga & Distribuição
- `paid-ads` - Campanhas no Google, Meta, LinkedIn
- `ad-creative` - Geração e iteração de criativos em volume
- `social-content` - Agendamento e estratégia de redes sociais

### Mensuração & Testes
- `analytics-tracking` - Configuração de rastreamento de eventos
- `ab-test-setup` - Design de experimentos

### Retenção
- `churn-prevention` - Fluxos de cancelamento, ofertas de salvamento, dunning, recuperação de pagamentos

### Growth Engineering
- `free-tool-strategy` - Ferramentas de marketing e calculadoras
- `referral-program` - Programas de indicação e afiliados

### Estratégia & Monetização
- `marketing-ideas` - 140 ideias de marketing para SaaS
- `marketing-psychology` - Modelos mentais e psicologia
- `launch-strategy` - Lançamentos de produto e anúncios
- `pricing-strategy` - Precificação, empacotamento e monetização

### Vendas & RevOps
- `revops` - Ciclo de vida de leads, pontuação, roteamento, gestão de pipeline
- `sales-enablement` - Decks de vendas, one-pagers, docs de objeções, scripts de demo

## Contribuindo

Encontrou uma forma de melhorar uma skill? Tem uma nova skill para sugerir? PRs e issues são bem-vindos!

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes sobre como adicionar ou melhorar skills.

## Licença

[MIT](LICENSE) - Use como quiser.
