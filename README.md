# Marketing Skills para Agentes de IA

Uma biblioteca de *skills* (habilidades) focada em tarefas de marketing para agentes de IA. Criada sob medida para profissionais de marketing técnico, *growth hackers* e fundadores que desejam transformar agentes de IA em assistentes de otimização de conversão (CRO), *copywriting*, SEO, *analytics* e engenharia de *growth*. Totalmente compatível com Claude Code, OpenAI Codex, Cursor, Windsurf e qualquer agente que suporte a [especificação Agent Skills](https://agentskills.io).

Desenvolvido por [Corey Haines](https://corey.co?ref=marketingskills). Precisa de ajuda prática com o seu projeto? Conheça a [Conversion Factory](https://conversionfactory.co?ref=marketingskills) — a agência do Corey especializada em CRO, *landing pages* e estratégias de crescimento. Quer aprofundar seus conhecimentos em marketing? Assine a [Swipe Files](https://swipefiles.com?ref=marketingskills). Prefere um agente de IA autônomo atuando como seu próprio CMO utilizando essas *skills*? Experimente o [Magister](https://magistermarketing.com?ref=marketingskills).

Ainda não tem familiaridade com o terminal ou agentes de código? Dê uma olhada no guia prático[Coding for Marketers](https://codingformarketers.com?ref=marketingskills).

🤝 **Contribuições são super bem-vindas!** Descobriu como melhorar uma *skill* ou tem uma ideia para adicionar uma nova?[Abra um PR](#contributing).

Encontrou algum *bug* ou tem alguma dúvida?[Abra uma *issue*](https://github.com/coreyhaines31/marketingskills/issues) — será um prazer ajudar.

## O que são *Skills*?

*Skills* são arquivos em Markdown que equipam os agentes de IA com conhecimento especializado e fluxos de trabalho para tarefas específicas. Ao adicioná-las ao seu projeto, o agente entende imediatamente o contexto de marketing em que você está trabalhando e aplica os *frameworks* e as melhores práticas corretas do mercado.

## Como as *Skills* funcionam em conjunto

As *skills* conversam entre si e constroem-se sobre um contexto compartilhado. A *skill* `product-marketing-context` é a espinha dorsal — todas as outras *skills* a consultam primeiro para entender o seu produto, público-alvo e posicionamento antes de executar qualquer ação.

```text
                            ┌──────────────────────────────────────┐
                            │      product-marketing-context       │
                            │    (lido por todas as skills antes)  │
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
         Skills se cruzam e fazem referências mútuas:
           copywriting ↔ page-cro ↔ ab-test-setup
           revops ↔ sales-enablement ↔ cold-email
           seo-audit ↔ schema-markup ↔ ai-seo
           customer-research → copywriting, page-cro, competitor-alternatives
```

Consulte a seção **Related Skills** dentro de cada *skill* para ver o mapa completo de dependências.

## *Skills* Disponíveis

<!-- SKILLS:START -->
| Skill | Descrição |
|-------|-------------|
| [ab-test-setup](skills/ab-test-setup/) | Quando o usuário quiser planejar, desenhar ou implementar um teste A/B, ou criar um programa de experimentação de *growth*... |
| [ad-creative](skills/ad-creative/) | Quando o usuário quiser gerar, iterar ou escalar criativos de anúncios — títulos, descrições, textos principais ou anúncios completos... |
| [ai-seo](skills/ai-seo/) | Quando o usuário quiser otimizar conteúdo para motores de busca baseados em IA, ser citado por LLMs ou aparecer em respostas geradas por IA... |
| [analytics-tracking](skills/analytics-tracking/) | Quando o usuário quiser configurar, melhorar ou auditar o rastreamento e as métricas de *analytics* do projeto... |
| [aso-audit](skills/aso-audit/) | Quando o usuário quiser auditar ou otimizar o ranqueamento de um app na App Store ou Google Play (ASO)... |
| [churn-prevention](skills/churn-prevention/) | Quando o usuário quiser reduzir cancelamentos (*churn*), criar fluxos de retenção, recuperar pagamentos falhos ou reter clientes... |
| [cold-email](skills/cold-email/) | Para escrever *cold emails* B2B e sequências de *follow-up* com alta taxa de resposta... |
| [community-marketing](skills/community-marketing/) | Para construir e engajar comunidades online com o objetivo de impulsionar o crescimento do produto e a lealdade à marca... |
| [competitor-alternatives](skills/competitor-alternatives/) | Quando o usuário quiser criar páginas comparativas com concorrentes ou de "alternativas" voltadas para SEO e vendas... |
|[competitor-profiling](skills/competitor-profiling/) | Quando o usuário quiser pesquisar, mapear ou analisar concorrentes diretamente pelas URLs deles... |
| [content-strategy](skills/content-strategy/) | Quando o usuário quiser planejar uma estratégia de conteúdo, definir pautas ou descobrir quais tópicos abordar... |
| [copy-editing](skills/copy-editing/) | Quando o usuário quiser editar, revisar ou aprimorar uma *copy* de marketing já existente, ou atualizar conteúdos antigos... |
| [copywriting](skills/copywriting/) | Quando o usuário quiser escrever, reescrever ou melhorar a *copy* de qualquer página — incluindo *homepages*, *landing pages*, etc... |
| [customer-research](skills/customer-research/) | Quando o usuário quiser conduzir, analisar ou sintetizar pesquisas com usuários e clientes... |
| [directory-submissions](skills/directory-submissions/) | Quando o usuário quiser enviar seu produto para diretórios de *startups*, SaaS, IA, *no-code* ou sites de *reviews*... |
| [email-sequence](skills/email-sequence/) | Quando o usuário quiser criar ou otimizar uma sequência de e-mails, *drip campaigns*, fluxos automatizados ou e-mails de ciclo de vida... |
| [form-cro](skills/form-cro/) | Quando o usuário quiser otimizar qualquer formulário que NÃO seja de cadastro/login — incluindo captura de *leads*, contato ou agendamentos... |
|[free-tool-strategy](skills/free-tool-strategy/) | Quando o usuário quiser planejar ou criar uma ferramenta gratuita como isca de marketing — geração de *leads*, valor de SEO, etc... |
| [launch-strategy](skills/launch-strategy/) | Quando o usuário quiser planejar o lançamento de um produto, anúncio de nova *feature* ou estratégia de *release*... |
| [lead-magnets](skills/lead-magnets/) | Quando o usuário quiser planejar, criar ou otimizar uma isca digital (*lead magnet*) para captação de e-mails e contatos... |
| [marketing-ideas](skills/marketing-ideas/) | Quando o usuário precisar de ideias, inspirações ou estratégias de marketing inovadoras para seu SaaS ou produto de software... |
| [marketing-psychology](skills/marketing-psychology/) | Quando o usuário quiser aplicar princípios de psicologia, modelos mentais ou ciência comportamental na sua estratégia de marketing... |
| [onboarding-cro](skills/onboarding-cro/) | Quando o usuário quiser otimizar o *onboarding* (pós-cadastro), a ativação do usuário, a primeira experiência ou o tempo até o valor (TTV)... |
| [page-cro](skills/page-cro/) | Quando o usuário quiser otimizar, melhorar ou aumentar as conversões em qualquer página — *homepage*, *landing pages*, preços... |
| [paid-ads](skills/paid-ads/) | Quando o usuário precisar de ajuda com campanhas de mídia paga no Google Ads, Meta (Facebook/Instagram), LinkedIn, X... |
| [paywall-upgrade-cro](skills/paywall-upgrade-cro/) | Quando o usuário quiser criar ou otimizar *paywalls* no aplicativo, telas de *upgrade*, modais de *upsell* ou bloqueio de recursos extras... |
| [popup-cro](skills/popup-cro/) | Quando o usuário quiser criar ou otimizar *popups*, modais, *overlays* ou *banners* com foco em conversão... |
| [pricing-strategy](skills/pricing-strategy/) | Quando o usuário precisar de ajuda com decisões de preço, pacotes (*packaging*) ou estratégias de monetização... |
|[product-marketing-context](skills/product-marketing-context/) | Quando o usuário quiser criar ou atualizar o documento principal de contexto de marketing do produto (*core context*)... |
| [programmatic-seo](skills/programmatic-seo/) | Quando o usuário quiser criar páginas focadas em SEO em larga escala utilizando *templates* e dados (*SEO Programático*)... |
| [referral-program](skills/referral-program/) | Quando o usuário quiser criar, otimizar ou analisar um programa de indicação, afiliação ou estratégias de "boca a boca"... |
|[revops](skills/revops/) | Quando o usuário precisar de ajuda com operações de receita (*RevOps*), ciclo de vida do *lead* ou processo de passagem de marketing para vendas... |
| [sales-enablement](skills/sales-enablement/) | Quando o usuário quiser criar materiais de apoio a vendas, *pitch decks*, *one-pagers*, documentos de objeções ou scripts de *demo*... |
| [schema-markup](skills/schema-markup/) | Quando o usuário quiser adicionar, corrigir ou otimizar as marcações de *schema* e dados estruturados no código do site... |
| [seo-audit](skills/seo-audit/) | Quando o usuário quiser auditar, revisar ou diagnosticar problemas técnicos de SEO na sua página... |
| [signup-flow-cro](skills/signup-flow-cro/) | Quando o usuário quiser otimizar o fluxo de cadastro, registro, criação de conta ou ativação de período de testes (*trial*)... |
| [site-architecture](skills/site-architecture/) | Quando o usuário quiser planejar, mapear ou reestruturar a hierarquia de páginas do site, menus de navegação ou arquitetura de URLs... |
| [social-content](skills/social-content/) | Quando o usuário precisar de ajuda para criar, agendar ou otimizar conteúdos nas redes sociais (LinkedIn, Twitter/X, Instagram)... |
<!-- SKILLS:END -->

## Instalação

### Opção 1: Instalação via CLI (Recomendado)

Use o [npx skills](https://github.com/vercel-labs/skills) para instalar as *skills* diretamente no seu projeto:

```bash
# Instalar todas as skills de uma vez
npx skills add coreyhaines31/marketingskills

# Instalar apenas skills específicas
npx skills add coreyhaines31/marketingskills --skill page-cro copywriting

# Listar todas as skills disponíveis
npx skills add coreyhaines31/marketingskills --list
```

Isso fará a instalação automática no diretório `.agents/skills/` (e criará *symlinks* na pasta `.claude/skills/` para manter compatibilidade com o Claude Code).

### Opção 2: Plugin do Claude Code

Instale através do sistema de plugins nativo do Claude Code:

```bash
# Adicionar o repositório ao marketplace
/plugin marketplace add coreyhaines31/marketingskills

# Instalar todas as skills de marketing
/plugin install marketing-skills
```

### Opção 3: Clone manual

Clone o repositório completo e copie a pasta de *skills* para o seu projeto:

```bash
git clone https://github.com/coreyhaines31/marketingskills.git
cp -r marketingskills/skills/* .agents/skills/
```

### Opção 4: Git Submodule

Adicione como um submódulo no seu Git para facilitar futuras atualizações:

```bash
git submodule add https://github.com/coreyhaines31/marketingskills.git .agents/marketingskills
```

Depois, basta referenciar as *skills* a partir de `.agents/marketingskills/skills/`.

### Opção 5: Fork e Personalização

1. Faça um *fork* deste repositório;
2. Personalize as *skills* para as necessidades específicas do seu negócio;
3. Clone o seu *fork* diretamente nos seus projetos.

### Opção 6: SkillKit (Para múltiplos agentes)

Use o[SkillKit](https://github.com/rohitg00/skillkit) para instalar *skills* em diferentes agentes de IA (Claude Code, Cursor, Copilot, etc.) de uma só vez:

```bash
# Instalar todas as skills
npx skillkit install coreyhaines31/marketingskills

# Instalar skills específicas
npx skillkit install coreyhaines31/marketingskills --skill page-cro copywriting

# Listar skills disponíveis
npx skillkit install coreyhaines31/marketingskills --list
```

## Atualizando a partir da v1.0

As *skills* agora utilizam a pasta `.agents/` em vez de `.claude/` para guardar o arquivo de contexto de marketing do produto. Mova seu arquivo de contexto existente rodando:

```bash
mkdir -p .agents
mv .claude/product-marketing-context.md .agents/product-marketing-context.md
```

*Nota: As skills continuam verificando a pasta `.claude/` como fallback (plano B), então nada vai quebrar se você esquecer de fazer isso.*

## Como usar

Uma vez instaladas, basta pedir ao seu agente (em inglês ou português) ajuda com tarefas de marketing:

```text
"Me ajude a otimizar as conversões dessa landing page"
→ O agente utilizará a skill 'page-cro'

"Escreva a copy da homepage para o meu SaaS"
→ O agente utilizará a skill 'copywriting'

"Configure o rastreamento de cadastros no GA4"
→ O agente utilizará a skill 'analytics-tracking'

"Crie uma sequência de boas-vindas de 5 e-mails"
→ O agente utilizará a skill 'email-sequence'
```

Você também pode forçar a invocação de *skills* diretamente no prompt:

```text
/page-cro
/email-sequence
/seo-audit
```

## Categorias de *Skills*

### Otimização de Conversão (CRO)
- `page-cro` - Para qualquer página de marketing.
- `signup-flow-cro` - Fluxos de registro e cadastro.
- `onboarding-cro` - Ativação e experiência do usuário após o cadastro.
- `form-cro` - Formulários de captura de *leads*.
- `popup-cro` - Modais, *overlays* e *pop-ups*.
- `paywall-upgrade-cro` - Telas de conversão para planos pagos dentro do app.

### Conteúdo & Copywriting
- `copywriting` - Criação de textos (*copy*) para páginas de marketing.
- `copy-editing` - Edição e polimento de *copies* já existentes.
- `cold-email` - E-mails de prospecção B2B e sequências.
- `email-sequence` - Fluxos de e-mail e automações de marketing.
- `social-content` - Conteúdo focado em redes sociais.

### SEO & Descoberta
- `seo-audit` - SEO técnico e *on-page*.
- `ai-seo` - Otimização para busca gerada por IA (AEO, GEO, LLMO).
- `programmatic-seo` - Geração inteligente de páginas em escala.
- `site-architecture` - Hierarquia de páginas, navegação e estrutura de URLs.
- `competitor-alternatives` - Páginas focadas em "alternativa ao concorrente X".
- `schema-markup` - Dados estruturados e marcação *schema*.

### Mídia Paga & Distribuição
- `paid-ads` - Campanhas estruturadas no Google, Meta, LinkedIn, etc.
- `ad-creative` - Geração e iteração de criativos e anúncios em volume.
- `social-content` - Estratégia e agendamento para redes sociais.

### Dados & Testes
- `analytics-tracking` - Configuração de eventos e rastreamento de métricas.
- `ab-test-setup` - Design e estruturação de experimentos/Testes A/B.

### Retenção
- `churn-prevention` - Fluxos de cancelamento, ofertas de resgate, réguas de cobrança (*dunning*) e recuperação de pagamentos.

### Engenharia de *Growth*
- `free-tool-strategy` - Criação de calculadoras e ferramentas gratuitas para aquisição.
- `referral-program` - Estruturação de programas de indicação e afiliados.

### Estratégia & Monetização
- `marketing-ideas` - Banco com 140 ideias de marketing para SaaS.
- `marketing-psychology` - Modelos mentais, vieses e psicologia aplicada.
- `launch-strategy` - Estratégia para lançamentos de produtos e anúncios ao mercado.
- `pricing-strategy` - Estruturação de preços, planos e monetização.

### Vendas & RevOps
- `revops` - Gestão do ciclo de vida do *lead*, *lead scoring*, roteamento e gestão de *pipeline*.
- `sales-enablement` - *Decks* de vendas, *one-pagers*, documentos para contorno de objeções e roteiros de demonstração.

## Contribuindo

Descobriu uma maneira inteligente de melhorar uma *skill*? Tem uma ideia de *skill* que ainda não está aqui? PRs e *issues* são sempre bem-vindos!

Leia o arquivo[CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes sobre como adicionar ou melhorar o projeto.

## Licença

[MIT](LICENSE) - Código aberto. Use como quiser!
