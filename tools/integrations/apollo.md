# Apollo.io

Plataforma de prospecção B2B e enriquecimento de dados com 210M+ contatos e 35M+ empresas para sales intelligence.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Busca de Pessoas, Busca de Empresas, Enriquecimento, Sequences |
| MCP | - | Não disponível |
| CLI | ✓ | [apollo.js](../clis/apollo.js) |
| SDK | - | Apenas REST API |

## Autenticação

- **Tipo**: API Key
- **Cabeçalho**: `x-api-key: {api_key}` or `Authorization: Bearer {token}`
- **Obter chave**: Settings > Integrations > API at https://app.apollo.io

## Operações Comuns do Agente

### Busca de Pessoas

```bash
POST https://api.apollo.io/api/v1/mixed_people/api_search

{
  "person_titles": ["Sales Manager"],
  "person_locations": ["United States"],
  "organization_num_employees_ranges": ["1,100"],
  "page": 1
}
```

### Enriquecimento de Pessoa

```bash
POST https://api.apollo.io/api/v1/people/match

{
  "first_name": "Tim",
  "last_name": "Zheng",
  "domain": "apollo.io"
}
```

### Enriquecimento em Lote de Pessoas

```bash
POST https://api.apollo.io/api/v1/people/bulk_match

{
  "details": [
    { "email": "tim@apollo.io" },
    { "first_name": "Jane", "last_name": "Doe", "domain": "example.com" }
  ]
}
```

### Busca de Organizações

```bash
POST https://api.apollo.io/api/v1/mixed_companies/search

{
  "organization_locations": ["United States"],
  "organization_num_employees_ranges": ["1,100"],
  "page": 1
}
```

### Enriquecimento de Organização

```bash
POST https://api.apollo.io/api/v1/organizations/enrich

{
  "domain": "apollo.io"
}
```

## Métricas Principais

### Dados de Pessoa
- `first_name`, `last_name` - Name
- `title` - Job title
- `email` - Verified email
- `linkedin_url` - LinkedIn profile
- `organization` - Company details
- `seniority` - Seniority level
- `departments` - Lista de departamentos

### Dados de Organização
- `name` - Company name
- `website_url` - Website
- `estimated_num_employees` - Employee count
- `industry` - Industry
- `annual_revenue` - Revenue
- `technologies` - Tech stack
- `funding_total` - Total funding

## Parâmetros

### Busca de Pessoas
- `person_titles` - Array of job titles
- `person_locations` - Array of locations
- `person_seniorities` - Array: owner, founder, c_suite, partner, vp, head, director, manager, senior, entry
- `organization_num_employees_ranges` - Array of ranges (e.g., "1,100")
- `organization_ids` - Filtrar por IDs de org da Apollo
- `page` - Número da página (padrão: 1)
- `per_page` - Resultados por página (padrão: 25, máx: 100)

### Enriquecimento de Pessoa
- `email` - Email address
- `first_name` + `last_name` + `domain` - Alternative lookup
- `linkedin_url` - LinkedIn URL
- `reveal_personal_emails` - Include personal emails
- `reveal_phone_number` - Include phone numbers

### Busca de Organizações
- `organization_locations` - Array of locations
- `organization_num_employees_ranges` - Employee count ranges
- `organization_ids` - Specific org IDs
- `page` - Page number

## Quando Usar

- Criação de listas de prospects segmentadas por cargo, senioridade e tamanho da empresa
- Enriquecimento de leads com informações de contato verificadas
- Encontrar tomadores de decisão em contas-alvo
- Pesquisa de empresas e análise firmográfica
- ABM campaign targeting
- Sales intelligence e prospecção outbound

## Limites de Taxa

- Os limites de taxa variam por plano
- Padrão: 100 requisições/minuto para a maioria dos endpoints
- Enriquecimento em lote: até 10 pessoas por requisição
- Busca: máx. 50.000 registros (100 por página, 500 páginas)

## Skills Relevantes

- abm-strategy
- lead-enrichment
- lead-scoring
- cold-email
- competitor-alternatives
