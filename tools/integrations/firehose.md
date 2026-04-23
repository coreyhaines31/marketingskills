# Firehose

API de streaming de dados da web em tempo real que monitora páginas e entrega conteúdo correspondente instantaneamente via server-sent events (SSE). Feita para inteligência competitiva, monitoramento de marca e acompanhamento de notícias sem necessidade de polling.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Endpoints RESTful para gerenciar regras + SSE para streaming |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | - | Skill nativa para agente de IA disponível |

## Autenticação

- **Tipo**: API Key
- **Currently**: Beta gratuito — sem necessidade de cartão de crédito
- **Obter acesso**: Cadastre-se em firehose.com

## Conceitos principais

**Rules** — Filtros que definem qual conteúdo deve ser correspondido. Usa sintaxe de consulta Lucene.

**Stream** — Uma conexão server-sent event (SSE) que entrega conteúdo correspondente em tempo real conforme ele é publicado na web.

Em vez de fazer polling em um endpoint em intervalos programados, você define as regras uma vez e recebe um fluxo contínuo de correspondências conforme acontecem.

## Sintaxe de consulta (Lucene)

```
# Exact phrase
"your brand name"

# Field-specific
title:tesla
domain:reuters.com
domain:techcrunch.com

# Boolean operators
"Series A" AND (SaaS OR software)
competitor OR "competitor name" NOT "your company"

# Wildcard
market* AND funding

# Language filter
language:en

# Date range
publish_time:[2026-01-01 TO 2026-03-18]

# ML-classified categories
category:finance
category:technology
```

## Operações comuns de agent

### Criar uma regra de monitoramento

```bash
POST https://api.firehose.com/rules

{
  "query": "\"your brand name\" OR \"your product name\"",
  "label": "brand-mentions"
}
```

### Listar regras ativas

```bash
GET https://api.firehose.com/rules
```

### Excluir uma regra

```bash
DELETE https://api.firehose.com/rules/{rule_id}
```

### Conectar ao stream

```bash
GET https://api.firehose.com/stream
Authorization: Bearer {api_key}

# Returns server-sent events:
# data: {"url": "...", "title": "...", "publish_time": "...", "matched_rule": "..."}
```

### Exemplo: consumidor de stream em Node.js

```javascript
import EventSource from 'eventsource';

const stream = new EventSource('https://api.firehose.com/stream', {
  headers: { Authorization: `Bearer ${process.env.FIREHOSE_API_KEY}` }
});

stream.onmessage = (event) => {
  const item = JSON.parse(event.data);
  console.log(`[${item.matched_rule}] ${item.title} — ${item.url}`);
};
```

## Casos de uso para marketing

### Inteligência competitiva
Monitore cobertura de imprensa de concorrentes, anúncios de produto e notícias de captação em tempo real.

```
query: "CompetitorName" AND (launch OR funding OR "product update" OR partnership)
```

### Monitoramento de marca
Acompanhe menções à sua marca em notícias e conteúdo da web.

```
query: "YourBrand" OR "YourProductName" NOT site:yourdomain.com
```

### Notícias de categoria / mercado
Mantenha-se atualizado sobre seu mercado sem verificar fontes manualmente.

```
query: category:technology AND ("no-code" OR "low-code") AND funding
domain:techcrunch.com OR domain:venturebeat.com
```

### Monitoramento de gatilhos de lead
Acompanhe sinais que indicam que um prospect está pronto para comprar (contratações, captação, menções a ferramentas).

```
query: ("hiring" OR "we're growing") AND "RevOps" AND (HubSpot OR Salesforce)
```

### PR e link building
Receba alertas quando publicações cobrirem temas do seu nicho, permitindo outreach no momento certo.

```
query: "best [category] tools" OR "top [category] software" AND publish_time:[now-7d TO now]
```

## Quando usar

- Inteligência competitiva em tempo real (mais rápido que Google Alerts)
- Monitoramento de menções de marca em notícias e web
- Acompanhamento de sinais de mercado para prospecção comercial
- Pipelines automatizados de curadoria de conteúdo
- Workflows baseados em gatilhos (nova menção → alerta no Slack, atualização no CRM etc.)

## Habilidades relevantes

- competitor-alternatives
- customer-research
- content-strategy
- cold-email
- marketing-ideas
