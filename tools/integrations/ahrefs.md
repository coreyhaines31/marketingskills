# Ahrefs

Conjunto de ferramentas de SEO para análise de backlinks, pesquisa de palavras-chave e pesquisa competitiva.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | REST API para Site Explorer, Keywords Explorer |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | - | Apenas API |

## Autenticação

- **Tipo**: API Token
- **Cabeçalho**: `Authorization: Bearer {api_token}`
- **Obter token**: Account Settings > API in Ahrefs dashboard

## Operações Comuns do Agente

### Domain rating

```bash
GET https://api.ahrefs.com/v3/site-explorer/domain-rating?target=example.com

Authorization: Bearer {api_token}
```

### Visão geral de backlinks

```bash
GET https://api.ahrefs.com/v3/site-explorer/backlinks-stats?target=example.com&mode=domain

Authorization: Bearer {api_token}
```

### Referring domains

```bash
GET https://api.ahrefs.com/v3/site-explorer/refdomains?target=example.com&mode=domain&limit=100

Authorization: Bearer {api_token}
```

### Lista de backlinks

```bash
GET https://api.ahrefs.com/v3/site-explorer/backlinks?target=example.com&mode=domain&limit=100

Authorization: Bearer {api_token}
```

### Organic keywords

```bash
GET https://api.ahrefs.com/v3/site-explorer/organic-keywords?target=example.com&mode=domain&country=us&limit=100

Authorization: Bearer {api_token}
```

### Top pages

```bash
GET https://api.ahrefs.com/v3/site-explorer/top-pages?target=example.com&mode=domain&country=us&limit=50

Authorization: Bearer {api_token}
```

### Visão geral de palavra-chave

```bash
GET https://api.ahrefs.com/v3/keywords-explorer/overview?keywords=keyword1,keyword2&country=us

Authorization: Bearer {api_token}
```

### Keyword suggestions

```bash
GET https://api.ahrefs.com/v3/keywords-explorer/matching-terms?keyword=seed+keyword&country=us&limit=100

Authorization: Bearer {api_token}
```

### Visão geral de SERP

```bash
GET https://api.ahrefs.com/v3/keywords-explorer/serp-overview?keyword=target+keyword&country=us

Authorization: Bearer {api_token}
```

## Métricas Principais

### Métricas de Domínio
- `domain_rating` - Domain Rating (DR)
- `ahrefs_rank` - Ahrefs Rank
- `referring_domains` - Referring domains count
- `backlinks` - Total backlinks
- `organic_traffic` - Estimated organic traffic

### Métricas de Palavra-chave
- `volume` - Volume de busca mensal
- `keyword_difficulty` - KD score (0-100)
- `cpc` - Custo por clique
- `clicks` - Estimated monthly clicks
- `global_volume` - Volume de busca global

### Campos de Backlink
- `url_from` - Source URL
- `url_to` - URL de destino
- `anchor` - Anchor text
- `domain_rating_source` - Source DR
- `first_seen` - First discovery date

## Modos

- `domain` - Entire domain
- `subdomains` - Domain + subdomains
- `prefix` - URL prefix
- `exact` - Exact URL

## Quando Usar

- Backlink analysis
- Pesquisa de link building
- Pesquisa de palavras-chave
- Competitive analysis
- Content gap analysis
- Site audits

## Limites de Taxa

- Varia por plano
- 500-5000 linhas por requisição

## Skills Relevantes

- seo-audit
- content-strategy
- competitor-alternatives
