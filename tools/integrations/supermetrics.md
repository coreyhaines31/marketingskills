# Supermetrics

Pipeline de dados de marketing que conecta mais de 200 plataformas de marketing. Puxa dados de plataformas de anúncios, analytics, social, SEO, email e mais em uma única interface de consulta.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Consultar qualquer fonte de dados conectada, gerenciar contas |
| MCP | ✓ | [Claude connector](https://claude.com/connectors/supermetrics) |
| CLI | ✓ | [supermetrics.js](../clis/supermetrics.js) |
| SDK | - | Apenas API REST |

## Autenticação

- **Tipo**: API Key
- **Query param**: `api_key={api_key}` or **Header**: `x-api-key: {api_key}`
- **Obter chave**: Supermetrics Hub > API settings at https://hub.supermetrics.com

## Operações Comuns do Agente

### Consultar uma Fonte de Dados

```bash
POST https://api.supermetrics.com/enterprise/v2/query/data/json

{
  "ds_id": "GA4",
  "ds_accounts": "123456789",
  "date_range_type": "last_28_days",
  "fields": [
    { "name": "sessions" },
    { "name": "pageviews" },
    { "name": "date" }
  ]
}
```

### Consultar com Filtros

```bash
POST https://api.supermetrics.com/enterprise/v2/query/data/json

{
  "ds_id": "AW",
  "ds_accounts": "123-456-7890",
  "date_range_type": "last_month",
  "fields": [
    { "name": "campaign_name" },
    { "name": "clicks" },
    { "name": "impressions" },
    { "name": "cost" }
  ],
  "max_rows": 100
}
```

### Listar Fontes de Dados Disponíveis

```bash
GET https://api.supermetrics.com/enterprise/v2/datasources
```

### Listar Contas Conectadas

```bash
GET https://api.supermetrics.com/enterprise/v2/datasources/accounts?ds_id=GA4
```

### Listar Times

```bash
GET https://api.supermetrics.com/enterprise/v2/teams
```

### Listar Usuários

```bash
GET https://api.supermetrics.com/enterprise/v2/users
```

## Métricas Principais

### IDs de Fonte de Dados
- `GA4` - Google Analytics 4
- `GA4_PAID` - Google Analytics (paid)
- `AW` - Google Ads
- `FB` - Facebook Ads
- `LI` - LinkedIn Ads
- `TW_ADS` - Twitter Ads
- `IG_IA` - Instagram
- `FB_IA` - Facebook Pages
- `GSC` - Google Search Console
- `SE` - Semrush
- `MC` - Mailchimp
- `HubSpot` - HubSpot

### Valores de Intervalo de Datas
- `last_28_days` - Last 28 days
- `last_month` - Previous calendar month
- `this_month` - Current month to date
- `custom` - Intervalo customizado (requer `start_date` e `end_date`)

## Parâmetros

### Query
- `ds_id` - Identificador da fonte de dados (obrigatório)
- `ds_accounts` - ID da conta para a fonte de dados (obrigatório)
- `date_range_type` - Date range preset or "custom" (required)
- `fields` - Array de objetos de campo com propriedade `name` (obrigatório)
- `filter` - Expressão de filtro para restringir resultados
- `max_rows` - Maximum number of rows to return
- `start_date` - Data inicial para intervalo customizado (YYYY-MM-DD)
- `end_date` - Data final para intervalo customizado (YYYY-MM-DD)

### Common Fields by Source
- **GA4**: `sessions`, `pageviews`, `users`, `bounce_rate`, `date`, `source`, `medium`, `page_path`
- **Google Ads**: `campaign_name`, `clicks`, `impressions`, `cost`, `conversions`, `ctr`, `cpc`
- **Facebook Ads**: `campaign_name`, `impressions`, `clicks`, `spend`, `reach`, `cpm`, `cpc`
- **LinkedIn Ads**: `campaign_name`, `impressions`, `clicks`, `cost`, `conversions`
- **GSC**: `query`, `clicks`, `impressions`, `ctr`, `position`, `page`

## Quando Usar

- Consolidar dados de marketing multiplataforma em um único relatório
- Comparing performance across ad platforms (Google, Meta, LinkedIn, TikTok)
- Agregar dados de analytics de múltiplas fontes
- Automating marketing reporting workflows
- Construir dashboards unificados entre canais de marketing
- Extrair dados de SEO junto com métricas de mídia paga

## Limites de Taxa

- Rate limits vary by plan
- Enterprise API: typically 100 requests/minute
- Resultados de consulta podem ser paginados para datasets grandes
- Recomendado: usar `max_rows` para controlar o tamanho da resposta

## Skills Relevantes

- analytics-tracking
- paid-ads
- seo-audit
- content-strategy
- social-content
