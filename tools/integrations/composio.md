# Composio

OAuth gerenciado e conectores de ferramentas pré-construídos para 500+ apps por meio de um único servidor MCP. Fornece acesso agent-native a ferramentas de marketing que não têm suporte nativo a MCP.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | REST API para gerenciar conexões e disparar ações |
| MCP | ✓ | Um único servidor MCP expõe todas as ferramentas conectadas |
| CLI | ✓ | `npx composio` para gerenciar apps, conexões e ações |
| SDK | ✓ | SDKs TypeScript e Python |

## Autenticação

- **Tipo**: OAuth 2.0 (por ferramenta, gerenciado pelo Composio) ou API Key
- **Configuração**: `npx @composio/mcp@latest setup` para instalar, depois autenticar cada ferramenta via Connect Link no navegador
- **API Key** (optional): `COMPOSIO_API_KEY` variável de ambiente para uso avançado/em equipe

Composio gerencia o gerenciamento, refresh e armazenamento de tokens OAuth para todas as ferramentas conectadas. Os tipos de autenticação de cada ferramenta estão listados na tabela Marketing Tools abaixo.

## Quando Usar Composio vs. Ferramentas Nativas

Composio é um **método alternativo de integração**, não um substituto. Use este guia de decisão:

| Scenario | Use |
|----------|-----|
| A ferramenta tem servidor MCP nativo (GA4, Stripe, Mailchimp) | Servidor MCP nativo |
| A ferramenta tem CLI, mas não MCP (Meta Ads, LinkedIn Ads, HubSpot) | Composio para acesso MCP |
| Ferramenta com OAuth pesado e sem CLI (Google Sheets, Slack, Notion) | Composio |
| Precisa de integração profunda e customizada | API nativa + CLI |
| Precisa de acesso rápido de leitura/escrita em muitas ferramentas | Composio |
| Ferramenta não coberta pelo Composio | Guia de API nativa |

## Configuração

### 1. Instale o servidor MCP

```bash
npx @composio/mcp@latest setup
```

Isso adiciona o servidor MCP do Composio à sua configuração do Claude Code.

### 2. Verifique a instalação

No Claude Code, execute `/mcp` para confirmar que `composio` aparece na lista de servidores MCP.

### 3. Autentique uma ferramenta

Quando você usar uma ferramenta com suporte do Composio pela primeira vez, receberá um Connect Link. Abra no navegador para concluir o OAuth. A conexão persiste entre sessões.

```
# Example: connect HubSpot
> "Pull my top 10 HubSpot contacts"
# Agent will prompt: "Please authenticate HubSpot: [Connect Link]"
# Click link → authorize → done
```

### 4. API key (opcional)

Para uso avançado ou configurações em equipe, defina sua API key do Composio:

```bash
export COMPOSIO_API_KEY=your_key_here
```

## Ferramentas de Marketing Disponíveis via Composio

### Nova Cobertura MCP

Estas ferramentas têm guias de API neste repositório, mas **não têm servidor MCP nativo**. Composio adiciona acesso MCP:

| Tool | Composio Toolkit | Auth Type | Coverage Depth |
|------|-----------------|-----------|----------------|
| HubSpot | `HUBSPOT` | OAuth 2.0 | Deep (contacts, deals, companies, lists, email) |
| Salesforce | `SALESFORCE` | OAuth 2.0 | Deep (SOQL, objects, leads, opportunities) |
| Meta Ads | `FACEBOOKADS` | OAuth 2.0 | Medium (campaigns, ad sets, insights) |
| LinkedIn Ads | `LINKEDIN` | OAuth 2.0 | Medium (campaigns, analytics, company pages) |
| Google Sheets | `GOOGLESHEETS` | OAuth 2.0 | Deep (read, write, create, format) |
| Slack | `SLACK` | OAuth 2.0 | Deep (messages, channels, files) |
| Notion | `NOTION` | OAuth 2.0 | Deep (pages, databases, blocks) |
| Airtable | `AIRTABLE` | OAuth 2.0 | Deep (records, tables, views) |
| ActiveCampaign | `ACTIVECAMPAIGN` | API Key | Medium (contacts, lists, automations) |
| Klaviyo | `KLAVIYO` | API Key | Medium (profiles, lists, campaigns) |
| Shopify | `SHOPIFY` | OAuth 2.0 | Deep (products, orders, customers) |
| Gmail | `GMAIL` | OAuth 2.0 | Deep (read, send, labels, search) |

### Alternativa às Ferramentas Existentes

Estas ferramentas **já têm MCP nativo ou CLI** neste repositório. Composio oferece um caminho alternativo:

| Ferramenta | Integração Nativa | Composio Toolkit | Quando Usar Composio |
|------|-------------------|-----------------|---------------------|
| Mailchimp | MCP ✓, CLI ✓ | `MAILCHIMP` | If native MCP setup fails |
| Google Ads | MCP ✓, CLI ✓ | `GOOGLEADS` | If OAuth is simpler via Composio |
| Stripe | MCP ✓, CLI ✓ | `STRIPE` | Prefira nativo (cobertura mais profunda) |
| GA4 | MCP ✓, CLI ✓ | `GOOGLEANALYTICS` | Prefira nativo (cobertura mais profunda) |

## Operações Comuns do Agente

### Listar ferramentas disponíveis

```bash
# Via Composio CLI
npx composio apps list
```

### Verificar status da conexão

```bash
npx composio connections list
```

### Disparar uma ação programaticamente

```bash
POST https://backend.composio.dev/api/v1/actions/{action_id}/execute

{
  "connectedAccountId": "account_xxx",
  "input": {
    "query": "contact email = user@example.com"
  }
}
```

### Desconectar uma ferramenta

```bash
npx composio connections remove {connection_id}
```

## Workflows de Exemplo

### Trazer dados de CRM para uma planilha

```
> "Get my top 20 HubSpot contacts by last activity and add them to a Google Sheet"
```
O agente usa o `HUBSPOT` do Composio para buscar contatos e `GOOGLESHEETS` para gravar linhas.

### Relatórios de anúncios cross-platform

```
> "Compare my Meta Ads and LinkedIn Ads spend this month"
```
O agente usa os toolkits `FACEBOOKADS` e `LINKEDIN` para buscar dados de campanha.

### Notificar a equipe sobre novos leads

```
> "Get my Salesforce leads from today and post a summary in Slack #sales"
```
O agente usa `SALESFORCE` para ler leads e `SLACK` para postar mensagens.

## Limitações

- **A profundidade da cobertura varia** — alguns toolkits expõem centenas de ações (HubSpot, Google Sheets), outros apenas algumas
- **Sem customização** — você não pode modificar os schemas de ação do Composio nem adicionar endpoints customizados
- **Dependência de fornecedor** — se os servidores do Composio estiverem fora do ar, todas as ferramentas conectadas ficam indisponíveis
- **Limites de taxa se aplicam** — Composio aplica seus próprios limites de taxa além dos limites nativos de cada ferramenta
- **OAuth tokens** — gerenciados pelo Composio; você não controla refresh ou armazenamento dos tokens
- **Nomenclatura de ações** — os nomes de ação do Composio podem diferir da terminologia da API nativa

## Preços

| Plan | Monthly Price | API Calls | Notes |
|------|--------------|-----------|-------|
| Free | $0 | 20,000 | Bom para exploração e uso pessoal |
| Growth | $29 | 200,000 | Para uso regular em múltiplas ferramentas |
| Business | $229 | 2,000,000 | Para equipes e automação intensa |

## Limites de Taxa

- Free tier: 20,000 calls/month, 10 req/sec
- Growth tier: 200,000 calls/month, 50 req/sec
- Business tier: 2,000,000 calls/month, 100 req/sec

## Veja Também

- [Guia de início rápido](../composio/README.md) — instale, conecte e use em 5 minutos
- [Marketing tools mapping](../composio/marketing-tools.md) — detailed toolkit-to-category reference

## Skills Relevantes

- analytics-tracking (cross-platform data via Composio connectors)
- email-sequence (ActiveCampaign, Klaviyo access)
- paid-ads (Meta Ads, LinkedIn Ads MCP access)
- referral-program (Shopify integration)
