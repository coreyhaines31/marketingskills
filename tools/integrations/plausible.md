# Plausible Analytics

Web analytics open-source com foco em privacidade e API simples para consultas de stats sem cookies ou coleta de dados pessoais.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Stats v2 Query, Sites Provisioning, Goals, Shared Links |
| MCP | - | Not available |
| CLI | ✓ | [plausible.js](../clis/plausible.js) |
| SDK | - | REST API only |

## Autenticação

- **Type**: Bearer Token
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: https://plausible.io/settings > API Keys
- **Note**: A Sites API requer plano Enterprise

## Operações comuns do agente

### Query de stats (v2)

```bash
POST https://plausible.io/api/v2/query

{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews", "bounce_rate", "visit_duration"],
  "date_range": "30d"
}
```

### Top páginas

```bash
POST https://plausible.io/api/v2/query

{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews"],
  "date_range": "30d",
  "dimensions": ["event:page"]
}
```

### Fontes de tráfego

```bash
POST https://plausible.io/api/v2/query

{
  "site_id": "example.com",
  "metrics": ["visitors", "bounce_rate"],
  "date_range": "30d",
  "dimensions": ["visit:source"]
}
```

### Série temporal

```bash
POST https://plausible.io/api/v2/query

{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews"],
  "date_range": "30d",
  "dimensions": ["time:day"]
}
```

### Quebra por país

```bash
POST https://plausible.io/api/v2/query

{
  "site_id": "example.com",
  "metrics": ["visitors", "percentage"],
  "date_range": "30d",
  "dimensions": ["visit:country"]
}
```

### Query filtrada (página específica)

```bash
POST https://plausible.io/api/v2/query

{
  "site_id": "example.com",
  "metrics": ["visitors", "pageviews", "bounce_rate"],
  "date_range": "30d",
  "filters": [["is", "event:page", ["/pricing"]]]
}
```

### Visitors em tempo real (v1)

```bash
GET https://plausible.io/api/v1/stats/realtime/visitors?site_id=example.com
```

### Listar sites

```bash
GET https://plausible.io/api/v1/sites
```

## Métricas principais

### Métricas disponíveis
- `visitors` - Visitantes únicos
- `visits` - Total de visitas (sessions)
- `pageviews` - Total de visualizações de página
- `views_per_visit` - Páginas por sessão
- `bounce_rate` - Percentual de bounce rate
- `visit_duration` - Duração média da sessão (segundos)
- `events` - Total de eventos
- `conversion_rate` - Taxa de conversão de meta
- `time_on_page` - Tempo médio na página
- `scroll_depth` - Profundidade média de scroll
- `percentage` - Participação no total

### Dimensões disponíveis
- `event:page` - Path da página
- `event:goal` - Nome da meta
- `visit:source` - Fonte de tráfego
- `visit:referrer` - URL de referrer
- `visit:channel` - Canal de tráfego
- `visit:utm_source`, `visit:utm_medium`, `visit:utm_campaign` - UTM params
- `visit:device` - Tipo de dispositivo
- `visit:browser` - Nome do browser
- `visit:os` - Sistema operacional
- `visit:country`, `visit:region`, `visit:city` - Localização
- `visit:entry_page`, `visit:exit_page` - Páginas de entrada/saída
- `time`, `time:day`, `time:week`, `time:month` - Períodos de tempo

## Parâmetros

### Query de stats (v2)
- `site_id` (required) - Domínio registrado no Plausible
- `metrics` (required) - Array de métricas para retornar
- `date_range` (required) - Período: "day", "7d", "30d", "month", "6mo", "12mo", "year" ou custom ["2024-01-01", "2024-01-31"]
- `dimensions` - Array de dimensões para agrupar
- `filters` - Array de condições de filtro: `[operator, dimension, values]`
- `order_by` - Array de regras de ordenação: `[[metric, "desc"]]`
- `pagination` - `{ "limit": 100, "offset": 0 }`

### Operadores de filtro
- `is` / `is_not` - Correspondência exata
- `contains` / `contains_not` - Correspondência por substring
- `matches` / `matches_not` - Correspondência por wildcard

## Quando usar

- Web analytics privacy-first sem cookies
- Análise de tráfego simples e leve
- Rastreamento de performance de campanhas UTM
- Rastreamento de metas e conversões
- Quebra por geografia e dispositivo
- Alternativa de analytics ao GA4 em conformidade com GDPR/CCPA

## Limites de taxa

- 600 requests/hour per API key
- Todas as requests devem usar HTTPS

## Skills relevantes

- analytics-tracking
- content-strategy
- programmatic-seo
- page-cro
- utm-tracking
