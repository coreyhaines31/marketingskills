# Pendo

Plataforma de product analytics e in-app guidance para rastrear comportamento do usuário, medir adoção de funcionalidades e entregar mensagens in-app segmentadas.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Features, Pages, Guides, Visitors, Accounts, Reports, Metadata |
| MCP | - | Not available |
| CLI | ✓ | [pendo.js](../clis/pendo.js) |
| SDK | - | REST API only |

## Autenticação

- **Type**: Integration Key
- **Header**: `x-pendo-integration-key: {key}`
- **Get key**: Settings > Integrations at https://app.pendo.io

## Operações comuns do agente

### Listar features

```bash
GET https://app.pendo.io/api/v1/feature
```

### Obter detalhes da feature

```bash
GET https://app.pendo.io/api/v1/feature/{featureId}
```

### Listar páginas

```bash
GET https://app.pendo.io/api/v1/page
```

### Obter detalhes da página

```bash
GET https://app.pendo.io/api/v1/page/{pageId}
```

### Listar guides

```bash
GET https://app.pendo.io/api/v1/guide?state=public
```

### Obter detalhes do guide

```bash
GET https://app.pendo.io/api/v1/guide/{guideId}
```

### Obter dados de visitor

```bash
GET https://app.pendo.io/api/v1/visitor/{visitorId}
```

### Buscar visitors

```bash
POST https://app.pendo.io/api/v1/aggregation

{
  "response": { "mimeType": "application/json" },
  "request": {
    "pipeline": [
      { "source": { "visitors": null } },
      { "filter": "lastVisitedAt > 1700000000000" }
    ]
  }
}
```

### Obter dados de account

```bash
GET https://app.pendo.io/api/v1/account/{accountId}
```

### Buscar accounts

```bash
POST https://app.pendo.io/api/v1/aggregation

{
  "response": { "mimeType": "application/json" },
  "request": {
    "pipeline": [
      { "source": { "accounts": null } },
      { "filter": "metadata.auto.lastupdated > 1700000000000" }
    ]
  }
}
```

### Executar relatório de funnel

```bash
POST https://app.pendo.io/api/v1/aggregation

{
  "response": { "mimeType": "application/json" },
  "request": {
    "pipeline": [
      { "source": { "visitors": null, "timeSeries": { "period": "dayRange", "first": 1700000000000, "last": 1700600000000 } } },
      { "identified": "visitorId" },
      { "filter": "pageId == \"page-id-1\"" },
      { "filter": "pageId == \"page-id-2\"" }
    ]
  }
}
```

### Listar campos de metadata

```bash
GET https://app.pendo.io/api/v1/metadata/schema/visitor
GET https://app.pendo.io/api/v1/metadata/schema/account
GET https://app.pendo.io/api/v1/metadata/schema/parentAccount
```

## Métricas principais

### Dados de feature
- `id` - ID da feature
- `name` - Nome da feature
- `kind` - Tipo de feature
- `elementPath` - Seletor CSS do elemento rastreado
- `pageId` - ID da página associada
- `numEvents` - Quantidade de eventos
- `numVisitors` - Quantidade de visitors únicos

### Dados de página
- `id` - ID da página
- `name` - Nome da página
- `rules` - Regras de correspondência de URL
- `numEvents` - Quantidade de pageviews
- `numVisitors` - Quantidade de visitors únicos

### Dados de guide
- `id` - ID do guide
- `name` - Nome do guide
- `state` - Estado do guide (draft, staged, public, disabled)
- `launchMethod` - Como o guide é acionado
- `steps` - Definições de steps do guide
- `numSteps` - Número de steps
- `numViews` - Total de visualizações
- `numVisitors` - Visitors únicos que viram o guide

### Dados de visitor
- `visitorId` - Identificador único de visitor
- `lastVisitedAt` - Timestamp da última visita
- `firstVisit` - Timestamp da primeira visita
- `numEvents` - Quantidade total de eventos
- `metadata` - Metadata custom de visitor

### Dados de account
- `accountId` - Identificador único da account
- `lastVisitedAt` - Última visita de qualquer membro da account
- `numVisitors` - Número de visitors na account
- `metadata` - Metadata custom da account

## Parâmetros

### Filtro de guide
- `state` - Filtrar por estado: draft, staged, public, disabled

### Queries de agregação
- `source` - Fonte de dados: visitors, accounts, features, pages, guides
- `filter` - Filtro baseado em expressão
- `sort` - Ordenação de resultados
- `limit` - Máximo de resultados retornados
- `timeSeries` - Intervalo de tempo com period, first, last

### Tipos de metadata
- `visitor` - Schema de metadata de visitor
- `account` - Schema de metadata de account
- `parentAccount` - Schema de metadata de parent account

## Quando usar

- Rastrear adoção de features e padrões de uso
- Criar e gerenciar guides de onboarding in-app
- Analisar comportamento do usuário entre páginas e features
- Segmentar usuários por nível de engajamento
- Rodar análise de funnel em jornadas de usuário
- Identificar accounts em risco com base em queda de uso
- Fazer A/B testing de mensagens in-app e tooltips

## Limites de taxa

- Limites de taxa variam por plano
- Standard: 500 requests por minuto
- Queries de agregação: podem levar mais tempo em datasets grandes
- Use paginação para conjuntos grandes de resultados

## Skills relevantes

- analytics-tracking
- onboarding-cro
- churn-prevention
- ab-test-setup
