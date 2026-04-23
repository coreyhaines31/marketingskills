# DataForSEO

API abrangente de dados de SEO para resultados de SERP, pesquisa de palavras-chave, backlinks e análise on-page.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | SERP, Keywords Data, Backlinks, On-Page, Labs |
| MCP | - | Não disponível |
| CLI | ✓ | [dataforseo.js](../clis/dataforseo.js) |
| SDK | ✓ | Python, TypeScript, PHP, Java, C# |

## Autenticação

- **Tipo**: Basic Auth
- **Cabeçalho**: `Authorization: Basic {base64(login:password)}`
- **Obter credenciais**: aba API Access em https://app.dataforseo.com/api-access
- **Observação**: A senha da API é gerada automaticamente, diferente da senha da conta

## Operações Comuns do Agente

### SERP - Google organic (live)

```bash
POST https://api.dataforseo.com/v3/serp/google/organic/live/regular

[{
  "keyword": "marketing automation",
  "location_name": "United States",
  "language_name": "English"
}]
```

### Keywords - Volume de busca (live)

```bash
POST https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live

[{
  "keywords": ["email marketing", "marketing automation", "crm software"],
  "location_code": 2840,
  "language_code": "en"
}]
```

### Keywords - Keywords para site (live)

```bash
POST https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_site/live

[{
  "target": "example.com",
  "location_code": 2840,
  "language_code": "en"
}]
```

### Backlinks - Summary

```bash
POST https://api.dataforseo.com/v3/backlinks/summary/live

[{
  "target": "example.com",
  "internal_list_limit": 10,
  "backlinks_status_type": "live"
}]
```

### Backlinks - Lista

```bash
POST https://api.dataforseo.com/v3/backlinks/backlinks/live

[{
  "target": "example.com",
  "mode": "as_is",
  "limit": 100,
  "backlinks_status_type": "live"
}]
```

### Backlinks - Referring domains

```bash
POST https://api.dataforseo.com/v3/backlinks/referring_domains/live

[{
  "target": "example.com",
  "limit": 100
}]
```

### Backlinks - Index (database stats)

```bash
GET https://api.dataforseo.com/v3/backlinks/index
```

### On-Page - Instant pages audit

```bash
POST https://api.dataforseo.com/v3/on_page/instant_pages

[{
  "url": "https://example.com/page",
  "enable_javascript": true
}]
```

### SERP - Lista de locais

```bash
GET https://api.dataforseo.com/v3/serp/google/locations
```

### SERP - Lista de idiomas

```bash
GET https://api.dataforseo.com/v3/serp/google/languages
```

## Padrão da API

DataForSEO usa dois métodos para a maioria dos endpoints:
- **Live** (`/live`) - Síncrono, resultados na mesma resposta
- **Task-based** (`/task_post` + `/task_get/$id`) - Assíncrono para requisições grandes

Os corpos das requisições são sempre arrays JSON (mesmo para requisições únicas).

## Métricas Principais

### Métricas de Palavra-chave
- `search_volume` - Volume de busca mensal
- `competition` - Competition level (0-1)
- `cpc` - Custo por clique
- `monthly_searches` - Array com detalhamento mensal

### Métricas de Backlink
- `total_backlinks` - Total backlink count
- `referring_domains` - Unique referring domains
- `domain_rank` - Domain authority score
- `backlinks_spam_score` - Spam score

## Quando Usar

- Rastreamento programático de SERP em escala
- Pesquisa de palavras-chave com dados de volume de busca
- Análise e monitoramento de backlinks
- On-page SEO audits
- Competitor analysis

## Limites de Taxa

- Headers de limite de taxa: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- Backlinks API: 2000 requisições/minuto, 30 simultâneas
- Varia por endpoint e plano

## Skills Relevantes

- seo-audit
- programmatic-seo
- content-strategy
- competitor-alternatives
