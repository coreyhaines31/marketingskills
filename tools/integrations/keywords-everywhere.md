# Keywords Everywhere

API de pesquisa de palavras-chave para volume de busca, CPC, concorrência, keywords relacionadas e dados de tráfego.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API para dados de keywords, keywords relacionadas e tráfego |
| MCP | - | MCP server da comunidade disponível |
| CLI | ✓ | [keywords-everywhere.js](../clis/keywords-everywhere.js) |
| SDK | - | somente API |

## Autenticação

- **Tipo**: API Key (Bearer token)
- **Header**: `Authorization: Bearer {api_key}`
- **Obter chave**: https://keywordseverywhere.com/first-install-addon.html
- **Limit**: 100 keywords por requisição

## Operações comuns de agent

### Buscar dados de keyword (volume, CPC, concorrência)

```bash
POST https://api.keywordseverywhere.com/v1/get_keyword_data

Authorization: Bearer {api_key}

{
  "country": "us",
  "currency": "USD",
  "dataSource": "gkp",
  "kw": ["email marketing", "marketing automation", "crm software"]
}
```

### Buscar keywords relacionadas

```bash
POST https://api.keywordseverywhere.com/v1/get_related_keywords

Authorization: Bearer {api_key}

{
  "country": "us",
  "currency": "USD",
  "dataSource": "gkp",
  "kw": ["email marketing"]
}
```

### Buscar keywords de "People Also Search For"

```bash
POST https://api.keywordseverywhere.com/v1/get_pasf_keywords

Authorization: Bearer {api_key}

{
  "country": "us",
  "currency": "USD",
  "dataSource": "gkp",
  "kw": ["email marketing"]
}
```

### Buscar keywords de domínio (para quais keywords um domínio ranqueia)

```bash
POST https://api.keywordseverywhere.com/v1/get_domain_keywords

Authorization: Bearer {api_key}

{
  "country": "us",
  "currency": "USD",
  "domain": "example.com"
}
```

### Buscar keywords de URL (para quais keywords uma URL específica ranqueia)

```bash
POST https://api.keywordseverywhere.com/v1/get_url_keywords

Authorization: Bearer {api_key}

{
  "country": "us",
  "currency": "USD",
  "url": "https://example.com/page"
}
```

### Buscar tráfego de domínio

```bash
POST https://api.keywordseverywhere.com/v1/get_domain_traffic

Authorization: Bearer {api_key}

{
  "country": "us",
  "domain": "example.com"
}
```

### Buscar tráfego de URL

```bash
POST https://api.keywordseverywhere.com/v1/get_url_traffic

Authorization: Bearer {api_key}

{
  "country": "us",
  "url": "https://example.com/page"
}
```

### Buscar backlinks de domínio

```bash
POST https://api.keywordseverywhere.com/v1/get_domain_backlinks

Authorization: Bearer {api_key}

{
  "domain": "example.com"
}
```

### Buscar backlinks de página

```bash
POST https://api.keywordseverywhere.com/v1/get_page_backlinks

Authorization: Bearer {api_key}

{
  "url": "https://example.com/page"
}
```

### Verificar créditos

```bash
GET https://api.keywordseverywhere.com/v1/get_credits

Authorization: Bearer {api_key}
```

### Buscar países suportados

```bash
GET https://api.keywordseverywhere.com/v1/get_countries

Authorization: Bearer {api_key}
```

### Buscar moedas suportadas

```bash
GET https://api.keywordseverywhere.com/v1/get_currencies

Authorization: Bearer {api_key}
```

## Métricas principais

### Dados de keyword
- `vol` - Volume de busca mensal
- `cpc.value` - Custo por clique
- `competition` - Score de concorrência
- `trend` - Dados de tendência de 12 meses

### Dados de tráfego
- `estimated_traffic` - Tráfego mensal estimado
- `keywords_count` - Número de keywords ranqueadas

## Parâmetros

- `country` - Código do país (us, uk, de, fr etc.)
- `currency` - Código da moeda (USD, GBP, EUR etc.)
- `dataSource` - Fonte de dados, padrão `gkp` (Google Keyword Planner)
- `kw` - Array de keywords (máx. 100 por requisição)

## Quando usar

- Pesquisa rápida de keywords com volume e CPC
- Encontrar keywords relacionadas e sugestões de PASF
- Analisar rankings de keywords por domínio/URL
- Estimar tráfego para domínios e páginas
- Descobrir backlinks

## Limites de taxa

- 100 keywords por requisição
- Preço baseado em créditos (1 crédito por keyword)

## Habilidades relevantes

- seo-audit
- content-strategy
- programmatic-seo
- competitor-alternatives
