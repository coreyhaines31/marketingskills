# AirOps

Plataforma de conteúdo com IA para criar conteúdo que performa em busca por IA. Construa e execute workflows de IA (flows) para geração de conteúdo SEO, enriquecimento de dados e automação.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Flows, Workflows, Runs |
| MCP | - | Não disponível |
| CLI | ✓ | [airops.js](../clis/airops.js) |
| SDK | - | Apenas REST API |

## Autenticação

- **Tipo**: API Key + Workspace ID
- **Cabeçalho**: `Authorization: Bearer {api_key}`
- **Variáveis de ambiente**: `AIROPS_API_KEY`, `AIROPS_WORKSPACE_ID`
- **Obter chave**: Settings > API Keys at https://app.airops.com

## Operações Comuns do Agente

### Listar Flows

```bash
GET https://api.airops.com/public_api/v1/workspaces/{workspace_id}/flows
```

### Obter Flow Details

```bash
GET https://api.airops.com/public_api/v1/workspaces/{workspace_id}/flows/{flow_id}
```

### Executar a Flow

```bash
POST https://api.airops.com/public_api/v1/workspaces/{workspace_id}/flows/{flow_id}/execute

{
  "inputs": {
    "keyword": "best project management tools",
    "target_audience": "startup founders"
  }
}
```

### Listar Runs de um Flow

```bash
GET https://api.airops.com/public_api/v1/workspaces/{workspace_id}/flows/{flow_id}/runs
```

### Obter Run Status

```bash
GET https://api.airops.com/public_api/v1/workspaces/{workspace_id}/runs/{run_id}
```

### Listar Workflows

```bash
GET https://api.airops.com/public_api/v1/workspaces/{workspace_id}/workflows
```

### Executar a Workflow

```bash
POST https://api.airops.com/public_api/v1/workspaces/{workspace_id}/workflows/{workflow_id}/execute

{
  "inputs": {
    "topic": "email marketing best practices",
    "content_type": "blog_post"
  }
}
```

## Métricas Principais

### Dados de Flow
- `id` - Flow identifier
- `name` - Flow name
- `description` - Flow description
- `status` - Active/inactive status
- `created_at` - Timestamp de criação
- `updated_at` - Timestamp da última modificação

### Dados de Run
- `id` - Run identifier
- `flow_id` - Parent flow ID
- `status` - pending, running, completed, failed
- `inputs` - Input parameters used
- `outputs` - Resultados gerados
- `started_at` - Run start time
- `completed_at` - Run completion time

## Parâmetros

### Execução de Flow
- `inputs` - Objeto JSON de pares chave-valor que correspondem aos inputs esperados do flow
- As chaves de input variam por flow (e.g., `keyword`, `topic`, `url`, `target_audience`)

### Execução de Workflow
- `inputs` - Objeto JSON de pares chave-valor que correspondem aos inputs esperados do workflow

## Quando Usar

- Geração em massa de conteúdo para SEO em escala
- Criação de artigos otimizados para SEO com workflows de IA
- Pipelines de enriquecimento de dados para listas de marketing
- Pesquisa de palavras-chave automation
- Otimização e reescrita de conteúdo
- Programmatic SEO page generation
- Briefings e outlines de conteúdo com IA

## Limites de Taxa

- Os limites de taxa variam por plano
- Limites de execução concorrente dependem do tier do workspace
- Verifique o dashboard do AirOps para uso e limites atuais

## Skills Relevantes

- ai-seo
- content-strategy
- programmatic-seo
- copywriting
