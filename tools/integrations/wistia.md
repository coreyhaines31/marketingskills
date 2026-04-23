# Wistia

Plataforma de hospedagem, gestão e analytics de vídeo criada para marketers com rastreamento detalhado de engajamento.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Data API (v1/modern), Stats API, Upload API |
| MCP | - | Não disponível |
| CLI | ✓ | [wistia.js](../clis/wistia.js) |
| SDK | ✓ | Ruby (oficial), wrappers da comunidade para outras linguagens |

## Autenticação

- **Tipo**: Bearer Token
- **Header**: `Authorization: Bearer {api_token}`
- **Obter chave**: Configurações da Conta > aba API em https://account.wistia.com/account/api
- **Note**: Somente Account Owners podem criar/gerenciar tokens. Tokens só podem ser copiados quando criados pela primeira vez.

## Operações Comuns do Agente

### Listar todos os projetos

```bash
GET https://api.wistia.com/v1/projects.json?page=1&per_page=25
```

### Criar um projeto

```bash
POST https://api.wistia.com/v1/projects.json

{
  "name": "Marketing Videos Q1"
}
```

### Listar todas as mídias

```bash
GET https://api.wistia.com/v1/medias.json?page=1&per_page=25
```

### Obter detalhes da mídia

```bash
GET https://api.wistia.com/v1/medias/{media_hashed_id}.json
```

### Obter métricas da mídia

```bash
GET https://api.wistia.com/v1/medias/{media_hashed_id}/stats.json
```

### Obter métricas da conta

```bash
GET https://api.wistia.com/v1/stats/account.json
```

### Obter dados de engajamento da mídia (heatmap)

```bash
GET https://api.wistia.com/v1/stats/medias/{media_id}/engagement.json
```

### Obter métricas da mídia by date

```bash
GET https://api.wistia.com/v1/stats/medias/{media_id}/by_date.json?start_date=2026-01-01&end_date=2026-01-31
```

### Listar visitantes

```bash
GET https://api.wistia.com/v1/stats/visitors.json?page=1&per_page=25
```

### Listar eventos de visualização

```bash
GET https://api.wistia.com/v1/stats/events.json?media_id={media_id}
```

### Atualizar metadados da mídia

```bash
PUT https://api.wistia.com/v1/medias/{media_hashed_id}.json

{
  "name": "Updated Video Title",
  "description": "New description"
}
```

### Listar legendas de um vídeo

```bash
GET https://api.wistia.com/v1/medias/{media_hashed_id}/captions.json
```

## Versões da API

O Wistia tem duas versões de API:
- **v1** (`/v1/`) - Legada, suportada perpetuamente, sem breaking changes
- **modern** (`/modern/`) - Current version, date-based versioning via `X-Wistia-Api-Version` header

A CLI usa a v1 para máxima estabilidade.

## Métricas Principais

### Métricas de Mídia
- `plays` - Total de reproduções de vídeo
- `visitors` - Unique visitors
- `pageLoads` - Page load count
- `averagePercentWatched` - Percentual médio assistido
- `percentOfVisitorsClickingPlay` - Play click rate

### Dados de Engajamento
- Dados de heatmap mostrando exatamente onde os viewers assistem, reassistem e abandonam
- Per-second engagement breakdown

### Métricas da Conta
- `total_medias` - Contagem total de vídeos
- `total_plays` - Reproduções em toda a conta
- `total_hours_watched` - Total de horas de vídeo assistidas

## Parâmetros

### Parâmetros de Lista de Mídia
- `page` - Page number (default: 1)
- `per_page` - Results per page (default: 25, max: 100)
- `project_id` - Filtrar por projeto
- `name` - Filtrar por nome
- `type` - Filtrar por tipo (Video, Audio, Image, etc.)

### Parâmetros de Data de Estatísticas
- `start_date` - Start date (YYYY-MM-DD)
- `end_date` - End date (YYYY-MM-DD)

## Quando Usar

- Hospedar vídeos de marketing e produto com analytics
- Rastrear engajamento de vídeo e comportamento de viewers
- Fazer testes A/B de thumbnails e CTAs de vídeo
- Incorporar vídeos com branding customizado do player
- Analyzing which parts of videos drive engagement
- Gerar leads via gates de email em vídeo

## Limites de Taxa

- 600 requests per minute per account
- Exceder retorna HTTP 429 com header `Retry-After`
- Acesso a assets (downloads de arquivos de mídia) não conta para o limite
- Dados de eventos retornam registros apenas dos últimos 2 anos

## Skills Relevantes

- video-marketing
- content-repurposing
- landing-page-optimization
- lead-generation
