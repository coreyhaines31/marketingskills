# Crossbeam

Plataforma de ecossistema de parceiros (agora parte da Reveal) para compartilhar dados de contas com parceiros e identificar oportunidades de co-sell, clientes sobrepostos e pipeline gerado por parceiros.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Partners, Populations, Overlaps, Reports, Threads |
| MCP | ✓ | [Claude connector](https://claude.com/connectors/crossbeam) |
| CLI | ✓ | [crossbeam.js](../clis/crossbeam.js) |
| SDK | - | Apenas REST API |

## Autenticação

- **Tipo**: API Key
- **Cabeçalho**: `Authorization: Bearer {api_key}`
- **Obter chave**: Settings > API at https://app.crossbeam.com

## Operações Comuns do Agente

### Listar Partners

```bash
GET https://api.crossbeam.com/v1/partners
Authorization: Bearer {api_key}
```

### Obter Partner Details

```bash
GET https://api.crossbeam.com/v1/partners/{id}
Authorization: Bearer {api_key}
```

### Listar Populations

```bash
GET https://api.crossbeam.com/v1/populations
Authorization: Bearer {api_key}
```

### Listar Overlaps

```bash
GET https://api.crossbeam.com/v1/overlaps?partner_id={partner_id}&population_id={population_id}
Authorization: Bearer {api_key}
```

### Obter Overlap Details

```bash
GET https://api.crossbeam.com/v1/overlaps/{id}
Authorization: Bearer {api_key}
```

### Buscar Accounts

```bash
GET https://api.crossbeam.com/v1/accounts/search?domain={domain}
Authorization: Bearer {api_key}
```

### Listar Reports

```bash
GET https://api.crossbeam.com/v1/reports
Authorization: Bearer {api_key}
```

### Listar Collaboration Threads

```bash
GET https://api.crossbeam.com/v1/threads
Authorization: Bearer {api_key}
```

## Métricas Principais

### Dados de Parceiro
- `id` - Partner ID
- `name` - Partner company name
- `status` - Partnership status (active, pending, etc.)
- `created_at` - Quando a parceria foi estabelecida
- `populations_shared` - Number of shared populations

### Dados de Population
- `id` - Population ID
- `name` - Population name (e.g., "Customers", "Open Opportunities")
- `record_count` - Number of records in population
- `partner_visibility` - O que os parceiros podem ver

### Dados de Overlap
- `id` - Overlap ID
- `partner_id` - Partner involved
- `population_id` - Population matched
- `account_name` - Overlapping account name
- `overlap_type` - Type of overlap (customer, prospect, etc.)
- `match_confidence` - Match confidence score

### Dados de Relatório
- `id` - Report ID
- `name` - Report name
- `type` - Report type
- `created_at` - Data de criação
- `results` - Dados de resultados do relatório

## Parâmetros

### Lista de Overlaps
- `partner_id` - Filtrar por parceiro específico
- `population_id` - Filtrar por population específica

### Busca de Contas
- `domain` - Domínio da empresa para buscar

## Quando Usar

- Identificação de oportunidades de co-sell com parceiros de canal
- Identificação de clientes e prospects sobrepostos em ecossistemas de parceiros
- Construção de pipeline originado por parceiros por meio de matching de contas
- Rastreamento da influência de parceiros em deals
- Criação de relatórios de account mapping para reuniões com parceiros
- Priorização de parceiros para engajamento com base em dados de overlap

## Limites de Taxa

- Os limites de taxa variam por plano
- Padrão: 100 requests/minute
- Paginação suportada nos endpoints de listagem

## Skills Relevantes

- revops
- sales-enablement
- referral-program
- competitor-alternatives
