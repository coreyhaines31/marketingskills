# Google Search Console

Ferramenta gratuita para monitorar performance de busca e indexação de sites.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Search Analytics API, URL Inspection API |
| MCP | - | Não disponível |
| CLI | - | Use gcloud ou scripts de API |
| SDK | ✓ | Google API client libraries |

## Autenticação

- **Tipo**: OAuth 2.0 ou Service Account
- **Scopes**: `https://www.googleapis.com/auth/webmasters.readonly`
- **Setup**: Crie credenciais no Google Cloud Console

## Operações comuns de agent

### Buscar analytics de pesquisa

```bash
POST https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/searchAnalytics/query

{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "dimensions": ["query"],
  "rowLimit": 100
}
```

### Buscar performance por página

```bash
POST https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/searchAnalytics/query

{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "dimensions": ["page"],
  "rowLimit": 50
}
```

### Buscar performance por país

```bash
POST https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/searchAnalytics/query

{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "dimensions": ["country", "query"],
  "rowLimit": 100
}
```

### Inspecionar URL

```bash
POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect

{
  "inspectionUrl": "https://example.com/page",
  "siteUrl": "https://example.com/"
}
```

### Listar sitemaps

```bash
GET https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/sitemaps

Authorization: Bearer {access_token}
```

### Enviar sitemap

```bash
PUT https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/sitemaps/{sitemap_url}

Authorization: Bearer {access_token}
```

### Solicitar indexação

```bash
POST https://indexing.googleapis.com/v3/urlNotifications:publish

{
  "url": "https://example.com/new-page",
  "type": "URL_UPDATED"
}
```

## Dimensões

- `query` - Consulta de busca
- `page` - URL da página
- `country` - Código do país
- `device` - Tipo de dispositivo (MOBILE, DESKTOP, TABLET)
- `date` - Data
- `searchAppearance` - Tipo de resultado de busca

## Métricas

- `clicks` - Cliques vindos da busca
- `impressions` - Impressões na busca
- `ctr` - Taxa de cliques
- `position` - Posição média

## Filtros

```json
{
  "dimensionFilterGroups": [{
    "filters": [{
      "dimension": "query",
      "operator": "contains",
      "expression": "keyword"
    }]
  }]
}
```

## Quando usar

- Analisar performance de busca
- Encontrar oportunidades de keywords
- Monitorar status de indexação
- Enviar novas páginas para indexação
- Identificar problemas de crawl
- Acompanhar mudanças de posição

## Limites de taxa

- 200 consultas por minuto
- 1.200 requisições por minuto

## Habilidades relevantes

- seo-audit
- programmatic-seo
- analytics-tracking
