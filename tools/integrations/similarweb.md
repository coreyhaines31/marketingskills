# Similarweb

Plataforma de inteligência de tráfego competitivo que fornece analytics de sites, fontes de tráfego, dados de palavras-chave e insights de concorrentes.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Tráfego, Busca, Referências, Concorrentes, Geografia |
| MCP | - | Não disponível |
| CLI | ✓ | [similarweb.js](../clis/similarweb.js) |
| SDK | - | Apenas API REST |

## Autenticação

- **Tipo**: API Key
- **Query param**: `?api_key={key}`
- **Obter chave**: Configurações da Conta > API em https://account.similarweb.com

## Operações Comuns do Agente

### Visitas Totais

```bash
GET https://api.similarweb.com/v1/website/example.com/total-traffic-and-engagement/visits?api_key={key}&start_date=2024-01&end_date=2024-03&country=us&granularity=monthly
```

### Pages Per Visit

```bash
GET https://api.similarweb.com/v1/website/example.com/total-traffic-and-engagement/pages-per-visit?api_key={key}&start_date=2024-01&end_date=2024-03
```

### Duração Média da Visita

```bash
GET https://api.similarweb.com/v1/website/example.com/total-traffic-and-engagement/average-visit-duration?api_key={key}&start_date=2024-01&end_date=2024-03
```

### Bounce Rate

```bash
GET https://api.similarweb.com/v1/website/example.com/total-traffic-and-engagement/bounce-rate?api_key={key}&start_date=2024-01&end_date=2024-03
```

### Fontes de Tráfego Breakdown

```bash
GET https://api.similarweb.com/v1/website/example.com/traffic-sources/overview?api_key={key}&start_date=2024-01&end_date=2024-03
```

### Top Referral Sites

```bash
GET https://api.similarweb.com/v1/website/example.com/traffic-sources/referrals?api_key={key}&start_date=2024-01&end_date=2024-03
```

### Organic Keywords

```bash
GET https://api.similarweb.com/v1/website/example.com/search/organic-search-keywords?api_key={key}&start_date=2024-01&end_date=2024-03
```

### Paid Keywords

```bash
GET https://api.similarweb.com/v1/website/example.com/search/paid-search-keywords?api_key={key}&start_date=2024-01&end_date=2024-03
```

### Similar Sites / Competitors

```bash
GET https://api.similarweb.com/v1/website/example.com/similar-sites/similarsites?api_key={key}
```

### Category Ranking

```bash
GET https://api.similarweb.com/v1/website/example.com/category-rank/category-rank?api_key={key}
```

### Tráfego por País

```bash
GET https://api.similarweb.com/v1/website/example.com/geo/traffic-by-country?api_key={key}&start_date=2024-01&end_date=2024-03
```

## Métricas Principais

### Tráfego e Engajamento
- `visits` - Total de visitas no período
- `pages_per_visit` - Média de páginas visualizadas por visita
- `average_visit_duration` - Duração média da sessão em segundos
- `bounce_rate` - Percentage of single-page visits

### Fontes de Tráfego
- `search` - Percentual de busca orgânica + paga
- `social` - Percentual de tráfego de mídia social
- `direct` - Percentual de tráfego direto
- `referrals` - Percentual de tráfego de referência
- `mail` - Percentual de tráfego de email
- `display_ads` - Display advertising percentage

### Palavras-chave de Busca
- `search_term` - Keyword text
- `share` - Percentual de participação de tráfego
- `volume` - Volume de busca
- `cpc` - Cost per click
- `position` - Posição média no ranking

### Geography
- `country` - Country code
- `share` - Participação de tráfego desse país

## Parâmetros

### Parâmetros Comuns
- `start_date` - Start month (YYYY-MM format)
- `end_date` - End month (YYYY-MM format)
- `country` - Two-letter country code (e.g., us, gb, de)
- `granularity` - Granularidade dos dados: mensal, semanal, diário

### Parâmetros de Busca
- `limit` - Number of keywords to return
- `country` - Filtrar por país

## Quando Usar

- Analisar tráfego de sites concorrentes e métricas de engajamento
- Comparar seu site com concorrentes
- Identificar as principais fontes de tráfego de qualquer site
- Descobrir palavras-chave orgânicas e pagas dos concorrentes
- Encontrar sites similares e o cenário competitivo
- Entender a distribuição geográfica do tráfego
- Auditing SEO performance relative to competitors
- Pesquisar market share por volume de tráfego

## Limites de Taxa

- Rate limits vary by plan tier
- Standard: 10 requests/second
- Disponibilidade de dados depende do plano (de 3 a 36 meses de histórico)
- Some endpoints require Premium or Enterprise plans

## Skills Relevantes

- seo-audit
- competitor-alternatives
- paid-ads
- content-strategy
