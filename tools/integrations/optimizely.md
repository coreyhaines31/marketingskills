# Optimizely

Plataforma de A/B testing e experimentação com REST API para gerenciar projetos, experimentos, campanhas e resultados.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Projects, Experiments, Campaigns, Audiences, Results |
| MCP | - | Not available |
| CLI | ✓ | [optimizely.js](../clis/optimizely.js) |
| SDK | ✓ | JavaScript, Python, Ruby, Java, Go, C#, PHP, React, Swift, Android |

## Autenticação

- **Type**: Bearer Token (Personal Access Token or OAuth 2.0)
- **Header**: `Authorization: Bearer {personal_token}`
- **Get token**: https://app.optimizely.com/v2/profile/api > Generate New Token

## Operações comuns do agente

### Listar projetos

```bash
GET https://api.optimizely.com/v2/projects
```

### Obter projeto

```bash
GET https://api.optimizely.com/v2/projects/{project_id}
```

### Listar experimentos

```bash
GET https://api.optimizely.com/v2/experiments?project_id={project_id}
```

### Obter experimento

```bash
GET https://api.optimizely.com/v2/experiments/{experiment_id}
```

### Obter resultados do experimento

```bash
GET https://api.optimizely.com/v2/experiments/{experiment_id}/results
```

### Criar experimento

```bash
POST https://api.optimizely.com/v2/experiments

{
  "project_id": 12345,
  "name": "Homepage CTA Test",
  "type": "a/b",
  "variations": [
    { "name": "Control", "weight": 5000 },
    { "name": "Variation 1", "weight": 5000 }
  ],
  "metrics": [{ "event_id": 67890 }],
  "status": "not_started"
}
```

### Atualizar experimento

```bash
PATCH https://api.optimizely.com/v2/experiments/{experiment_id}

{
  "status": "running"
}
```

### Listar campanhas

```bash
GET https://api.optimizely.com/v2/campaigns?project_id={project_id}
```

### Obter resultados da campanha

```bash
GET https://api.optimizely.com/v2/campaigns/{campaign_id}/results
```

### Listar audiences

```bash
GET https://api.optimizely.com/v2/audiences?project_id={project_id}
```

### Listar eventos

```bash
GET https://api.optimizely.com/v2/events?project_id={project_id}
```

### Listar páginas

```bash
GET https://api.optimizely.com/v2/pages?project_id={project_id}
```

## Métricas principais

### Resultados do experimento
- `variation_id` - Identificador da variação
- `variation_name` - Nome de exibição da variação
- `visitors` - Visitantes únicos por variação
- `conversions` - Quantidade de conversões
- `conversion_rate` - Taxa em decimal
- `improvement` - Percentual de melhoria vs. controle
- `statistical_significance` - Nível de confiança
- `is_baseline` - Se esta é a variação de controle

### Propriedades do experimento
- `name` - Nome do experimento
- `status` - not_started, running, paused, archived
- `type` - a/b, multivariate, personalization
- `traffic_allocation` - Percentual de tráfego (0-10000 = 0-100%)
- `variations` - Array de variações com pesos

## Parâmetros

### Listar experimentos
- `project_id` (required) - Projeto para listar os experimentos
- `page` - Número da página
- `per_page` - Resultados por página (default: 25)
- `status` - Filtro por status

### Obter resultados
- `start_time` - Horário inicial dos resultados (ISO 8601)
- `end_time` - Horário final dos resultados (ISO 8601)

### Criar experimento
- `project_id` (required) - Projeto pai
- `name` (required) - Nome do experimento
- `type` - Tipo de experimento (default: a/b)
- `variations` (required) - Array de variações com nome e peso
- `metrics` - Array de configurações de metric/event
- `audience_conditions` - Condições de segmentação
- `traffic_allocation` - Percentual de tráfego (0-10000)

## Quando usar

- Rodar A/B tests em páginas web e funcionalidades
- Gerenciar programas de experimentação em escala
- Buscar resultados de experimentos para análise
- Automatizar criação e monitoramento de experimentos
- Gerenciamento de feature flags
- Campanhas de personalização

## Limites de taxa

- 50 requests/second per personal token
- Pagination via `page` and `per_page` parameters
- OpenAPI spec available at https://api.optimizely.com/v2/swagger.json

## Skills relevantes

- ab-test-setup
- page-cro
- landing-page
- personalization
- analytics-tracking
