# RB2B

Plataforma de identificação de visitantes de website que desanonimiza tráfego B2B, revelando as pessoas individuais que visitam seu site com perfis do LinkedIn, emails e dados de empresa.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | Limited | API Partner Program (separate from standard app) |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | - | Not available |

A maioria dos times usa RB2B via integrações nativas (Slack, CRM push, Zapier, webhooks), em vez de acesso direto à API. Existe um [API Partner Program](https://www.rb2b.com/apis) separado para acesso programático.

## Autenticação

- **Type**: Integrações nativas (não é necessária API key no uso padrão)
- **API Partner Program**: Separate credentials via https://www.rb2b.com/apis
- **Free tier**: Limited credits/month with Slack alerts

## Faixas de preço

O pricing muda com frequência — confirme em https://www.rb2b.com/pricing.

| Plan | Approx. Price | Key Features |
|------|--------------|-------------|
| Free | $0 | Limited credits, Slack alerts, LinkedIn profiles |
| Starter | ~$79/mo | Person-level ID, basic integrations |
| Pro | ~$129-349/mo | CSV export, CRM push, validated emails |
| Pro+ | ~$299+/mo | All integrations, higher credit volume |

## Principais integrações

O RB2B envia dados de visitors identificados para mais de 50 ferramentas:
- **CRM**: Salesforce, HubSpot
- **Outreach**: Instantly, HeyReach, Lemlist
- **Enrichment**: Clay, Apollo, Clearbit
- **Automation**: Zapier, Make
- **Alerts**: Slack (notificações em tempo real)

## O que o RB2B revela por visitor

- Nome completo e URL do perfil do LinkedIn
- Cargo e empresa
- Email corporativo validado (Pro+)
- Páginas visitadas e duração da visita
- Número de visitas e frequência de retorno
- Dados da empresa (porte, setor, localização)

## Operações comuns do agente

### Alertas de visitor em tempo real

Configure alertas no Slack para visitors de alta intenção:
- Visitors que acessam a pricing page
- Visitors que retornam 3+ vezes
- Visitors da lista de contas-alvo
- Visitors com cargos alinhados ao ICP

### Pipeline Visitor-to-Outreach

1. RB2B identifies visitor with LinkedIn + email
2. Filtre por critérios de ICP (title, tamanho da empresa, páginas visitadas)
3. Direcione para uma ferramenta de outreach (Instantly, Lemlist) ou CRM (HubSpot, Salesforce)
4. Dispare cold email personalizado citando as páginas visitadas

### Scoring de intenção

Atribua score aos visitors por sinais de comportamento:
- **High intent**: Pricing page, demo page, páginas de comparação, 3+ visitas
- **Medium intent**: Páginas de features, case studies, 2 visitas
- **Low intent**: Apenas blog, visita única, bounce rápido

### Listas de supressão

Evite outreach para:
- Customers existentes (comparar com CRM)
- Deals ativos no pipeline
- Concorrentes e agências
- Prospects contatados recentemente

## Quando usar

- Identificar visitors anônimos do website para outreach de vendas
- Construir listas-alvo de ABM (account-based marketing) a partir do tráfego do site
- Entender quais empresas estão pesquisando seu produto
- Disparar outreach personalizado com base em sinais de intenção por página
- Alimentar ferramentas de enrichment (Clay, Apollo) com dados de visitors quentes

## Limitações

- A identificação em nível de pessoa funciona melhor para tráfego B2B dos EUA
- Nem todos os visitors podem ser identificados (taxas típicas de match: 15-30%)
- Requer tráfego suficiente no website para ser custo-efetivo
- Considerações de privacidade — garanta conformidade com regulações aplicáveis
- Plano gratuito limitado a alertas no Slack (sem CRM push ou export de email)

## Skills relevantes

- cold-email
- revops
- customer-research
- paid-ads

## Fontes

- [RB2B pricing](https://www.rb2b.com/pricing)
- [RB2B plans comparison](https://support.rb2b.com/en/articles/9173659-rb2b-plans-side-by-side-comparisons)
- [RB2B API Partner Program](https://support.rb2b.com/en/articles/12579420-rb2b-apis-rb2b-s-api-partner-program)
