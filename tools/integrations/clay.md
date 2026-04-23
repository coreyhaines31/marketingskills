# Clay

Plataforma de enriquecimento de dados e automação outbound para criar listas de leads com waterfall enrichment em mais de 75 provedores de dados.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Tables, People Enrichment, Company Enrichment |
| MCP | ✓ | [Claude connector](https://claude.com/connectors/clay) |
| CLI | ✓ | [clay.js](../clis/clay.js) |
| SDK | - | Apenas REST API |

## Autenticação

- **Tipo**: API Key (Bearer token)
- **Cabeçalho**: `Authorization: Bearer {api_key}`
- **Obter chave**: Settings > API at https://app.clay.com

## Operações Comuns do Agente

### Listar Tables

```bash
GET https://api.clay.com/v3/tables

Authorization: Bearer {api_key}
```

### Obter Table Details

```bash
GET https://api.clay.com/v3/tables/{table_id}

Authorization: Bearer {api_key}
```

### Obter Table Rows

```bash
GET https://api.clay.com/v3/tables/{table_id}/rows?page=1&per_page=25

Authorization: Bearer {api_key}
```

### Adicionar linha à tabela

```bash
POST https://api.clay.com/v3/tables/{table_id}/rows

{
  "first_name": "Jane",
  "last_name": "Doe",
  "company": "Acme Inc",
  "email": "jane@acme.com"
}
```

### People Enrichment

```bash
POST https://api.clay.com/v3/people/enrich

{
  "email": "jane@acme.com"
}
```

### Enriquecimento de Empresa

```bash
POST https://api.clay.com/v3/companies/enrich

{
  "domain": "acme.com"
}
```

## Métricas Principais

### Dados de Pessoa
- `first_name`, `last_name` - Name
- `email` - Email address
- `title` - Job title
- `linkedin_url` - LinkedIn profile
- `company` - Company name
- `location` - Location
- `seniority` - Seniority level

### Dados de Empresa
- `name` - Company name
- `domain` - Website domain
- `industry` - Industry
- `employee_count` - Number of employees
- `revenue` - Estimated revenue
- `location` - Headquarters location
- `technologies` - Tech stack
- `description` - Company description

### Dados de Tabela
- `id` - Table ID
- `name` - Table name
- `row_count` - Number of rows
- `columns` - Column definitions
- `created_at` - Timestamp de criação
- `updated_at` - Timestamp da última atualização

## Parâmetros

### Tabelas
- `page` - Número da página (padrão: 1)
- `per_page` - Resultados por página (default: 25)

### People Enrichment
- `email` - Email address
- `linkedin_url` - LinkedIn profile URL
- `first_name` + `last_name` - Busca baseada em nome

### Enriquecimento de Empresa
- `domain` - Domínio da empresa (e.g., "acme.com")

### Adicionar Linha
- Os campos são dinâmicos e correspondem às definições de coluna da tabela
- Passe dados como pares chave-valor correspondentes aos nomes das colunas

## Quando Usar

- Criação de listas de prospects enriquecidas com waterfall enrichment em múltiplos provedores
- Enriquecimento de leads com dados de pessoa e empresa de mais de 75 fontes
- Automação de workflows outbound com dados enriquecidos
- Finding verified contact info (emails, phone numbers, social profiles)
- Pesquisa de empresas e análise firmográfica
- Triggering enrichment workflows via webhooks
- Sincronização de dados enriquecidos de volta ao CRM ou ferramentas outbound

## Limites de Taxa

- Os limites de taxa variam por plano
- Padrão: 100 requests/minute
- Planos Enterprise têm limites maiores
- Créditos de enriquecimento consumidos por busca variam por provedor de dados
- Endpoints de webhook aceitam dados continuamente

## Skills Relevantes

- cold-email
- revops
- sales-enablement
- competitor-alternatives
