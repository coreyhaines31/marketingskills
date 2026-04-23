# ZoomInfo

Base de dados de contatos B2B e plataforma de dados de intent com mais de 100 milhões de contatos comerciais e inteligência de empresas para times de vendas e marketing.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Busca de Contatos, Busca de Empresas, Enriquecimento, Dados de Intent, Scoops |
| MCP | ✓ | [Claude connector](https://claude.com/connectors/zoominfo) |
| CLI | ✓ | [zoominfo.js](../clis/zoominfo.js) |
| SDK | - | Apenas API REST |

## Autenticação

- **Tipo**: JWT Token (Bearer)
- **Fluxo**: POST `/authenticate` com username + password, recebe JWT token
- **Header**: `Authorization: Bearer {jwt_token}`
- **Env vars**: `ZOOMINFO_USERNAME` + `ZOOMINFO_PRIVATE_KEY` or `ZOOMINFO_ACCESS_TOKEN`
- **Obter credenciais**: Contate vendas da ZoomInfo ou o portal admin em https://app.zoominfo.com

## Operações Comuns do Agente

### Autenticar

```bash
POST https://api.zoominfo.com/authenticate

{
  "username": "user@company.com",
  "password": "private-key-here"
}
```

### Busca de Contatos

```bash
POST https://api.zoominfo.com/search/contact

{
  "jobTitle": ["VP Marketing"],
  "companyName": ["Acme Corp"],
  "managementLevel": ["VP"],
  "rpp": 25,
  "page": 1
}
```

### Enriquecimento de Contatos

```bash
POST https://api.zoominfo.com/enrich/contact

{
  "matchEmail": ["jane@acme.com"]
}
```

### Busca de Empresas

```bash
POST https://api.zoominfo.com/search/company

{
  "companyName": ["Acme"],
  "industry": ["Software"],
  "employeeCountMin": 50,
  "revenueMin": 10000000,
  "rpp": 25,
  "page": 1
}
```

### Enriquecimento de Empresas

```bash
POST https://api.zoominfo.com/enrich/company

{
  "matchCompanyWebsite": ["acme.com"]
}
```

### Dados de Intent Lookup

```bash
POST https://api.zoominfo.com/lookup/intent

{
  "topicId": ["marketing-automation"],
  "companyId": ["123456"]
}
```

### Consulta de Scoops

```bash
POST https://api.zoominfo.com/lookup/scoops

{
  "companyId": ["123456"],
  "rpp": 25,
  "page": 1
}
```

## Métricas Principais

### Dados de Contato
- `firstName`, `lastName` - Name
- `jobTitle` - Job title
- `email` - Verified email
- `phone` - Direct phone
- `linkedinUrl` - LinkedIn profile
- `companyName` - Company name
- `managementLevel` - Seniority level
- `department` - Department

### Dados da Empresa
- `companyName` - Company name
- `website` - URL do site
- `employeeCount` - Employee count
- `industry` - Industry
- `revenue` - Annual revenue
- `techStack` - Tecnologias usadas
- `fundingAmount` - Financiamento total
- `companyCity`, `companyState`, `companyCountry` - Location

### Dados de Intent
- `topicName` - Intent topic
- `signalScore` - Signal strength
- `audienceStrength` - Nível de engajamento da audiência
- `firstSeenDate`, `lastSeenDate` - Signal timeframe

## Parâmetros

### Busca de Contatos
- `jobTitle` - Array of job titles
- `companyName` - Array of company names
- `managementLevel` - Array: C-Level, VP, Director, Manager, Staff
- `department` - Array: Marketing, Sales, Engineering, Finance, etc.
- `personLocationCity` - Array of cities
- `personLocationState` - Array of states
- `personLocationCountry` - Array of countries
- `rpp` - Results per page (default: 25, max: 100)
- `page` - Page number (default: 1)

### Enriquecimento de Contatos
- `matchEmail` - Array of email addresses
- `personId` - Array of ZoomInfo person IDs
- `matchFirstName` + `matchLastName` + `matchCompanyName` - Alternative lookup

### Busca de Empresas
- `companyName` - Array of company names
- `industry` - Array of industries
- `employeeCountMin` / `employeeCountMax` - Employee count range
- `revenueMin` / `revenueMax` - Revenue range
- `companyLocationCity` - Array of cities
- `rpp` - Results per page
- `page` - Page number

### Enriquecimento de Empresas
- `matchCompanyWebsite` - Array of domains
- `companyId` - Array of ZoomInfo company IDs

### Dados de Intent
- `topicId` - Array of intent topic IDs
- `companyId` - Array of company IDs

## Quando Usar

- Identificar contas in-market com sinais de intent
- Construir listas de contatos segmentadas por função, senioridade e empresa
- Enriquecer leads com dados de contato verificados e firmográficos
- Encontrar decisores em contas-alvo para ABM
- Rastrear notícias da empresa e mudanças de liderança via scoops
- Prioritizing outreach based on buyer intent signals

## Limites de Taxa

- Limites de taxa variam por plano e endpoint
- Standard: ~200 requests/minute
- Bulk endpoints: batched requests recommended
- Authentication tokens expire after ~12 hours

## Skills Relevantes

- cold-email
- revops
- sales-enablement
- competitor-alternatives
