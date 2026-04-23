# Clearbit (HubSpot Breeze Intelligence)

API de enriquecimento de dados de empresa e pessoa para converter leads com mais de 100 atributos firmográficos e tecnográficos.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Person, Company, Combined Enrichment, Reveal, Name to Domain, Prospector |
| MCP | - | Não disponível |
| CLI | ✓ | [clearbit.js](../clis/clearbit.js) |
| SDK | ✓ | Node, Ruby, Python, PHP |

## Autenticação

- **Tipo**: Bearer Token (ou Basic Auth com API key como username)
- **Cabeçalho**: `Authorization: Bearer {api_key}`
- **Obter chave**: https://dashboard.clearbit.com/api

## Operações Comuns do Agente

### Person Enrichment (by email)

```bash
GET https://person.clearbit.com/v2/people/find?email=alex@clearbit.com
```

Retorna 100+ attributes: name, title, company, location, social profiles, employment history.

### Company Enrichment (by domain)

```bash
GET https://company.clearbit.com/v2/companies/find?domain=clearbit.com
```

Retorna firmographics: industry, size, revenue, tech stack, location, funding.

### Combined Enrichment (person + company)

```bash
GET https://person.clearbit.com/v2/combined/find?email=alex@clearbit.com
```

Retorna dados de pessoa e empresa em uma única requisição.

### Reveal (IP para empresa)

```bash
GET https://reveal.clearbit.com/v1/companies/find?ip=104.132.0.0
```

Identifica a empresa por trás de um visitante do site por endereço IP.

### Name to Domain

```bash
GET https://company.clearbit.com/v1/domains/find?name=Clearbit
```

Converte o nome de uma empresa para seu domínio.

### Prospector (find employees)

```bash
GET https://prospector.clearbit.com/v1/people/search?domain=clearbit.com&role=sales&seniority=executive
```

Encontra funcionários de uma empresa filtrados por função, senioridade e cargo.

## Padrão da API

Clearbit usa subdomínios separados por API:
- `person.clearbit.com` - Dados de pessoa
- `company.clearbit.com` - Dados de empresa, Name to Domain
- `person-stream.clearbit.com` - Busca de pessoa em streaming (bloqueante, até 60s)
- `company-stream.clearbit.com` - Busca de empresa em streaming (bloqueante, até 60s)
- `reveal.clearbit.com` - IP para empresa
- `prospector.clearbit.com` - Busca de funcionários

Endpoints padrão retornam `202 Accepted` se os dados estiverem sendo processados (use webhooks). Endpoints de stream bloqueiam até os dados estarem prontos.

## Métricas Principais

### Atributos de Pessoa
- `name.fullName` - Full name
- `title` - Job title
- `role` - Job role (sales, engineering, etc.)
- `seniority` - Seniority level
- `employment.name` - Company name
- `linkedin.handle` - LinkedIn profile

### Atributos de Empresa
- `name` - Company name
- `domain` - Website domain
- `category.industry` - Industry
- `metrics.employees` - Employee count
- `metrics.estimatedAnnualRevenue` - Revenue range
- `tech` - Technology stack array
- `metrics.raised` - Total funding raised

## Parâmetros

### Enriquecimento de Pessoa
- `email` (required) - Endereço de email para consultar
- `webhook_url` - URL para resultados assíncronos
- `subscribe` - Inscrever para mudanças futuras

### Enriquecimento de Empresa
- `domain` (required) - Domínio da empresa para consultar
- `webhook_url` - URL para resultados assíncronos

### Prospector
- `domain` (required) - Domínio da empresa
- `role` - Filtro de função (sales, engineering, marketing, etc.)
- `seniority` - Filtro de senioridade (executive, director, manager, etc.)
- `title` - Filtro de cargo exato
- `page` - Número da página (padrão: 1)
- `page_size` - Resultados por página (default: 5, max: 20)

## Quando Usar

- Lead scoring e qualificação com base em dados firmográficos
- Enriquecimento de contatos do CRM com dados de empresa e pessoa
- Desanonimização de visitantes do site com Reveal
- Criação de listas de prospects com Prospector
- Personalização de marketing com base em atributos da empresa
- Roteamento de leads com base em tamanho da empresa, setor ou tech stack

## Limites de Taxa

- Enriquecimento: 600 requisições/minuto
- Prospector: 100 requisições/minuto
- Reveal: 600 requisições/minuto
- As respostas incluem os headers `X-RateLimit-Limit` e `X-RateLimit-Remaining`

## Skills Relevantes

- lead-scoring
- personalization
- abm-strategy
- lead-enrichment
- competitor-alternatives
