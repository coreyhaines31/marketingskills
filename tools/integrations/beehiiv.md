# Beehiiv

Plataforma de newsletter com gerenciamento de assinantes, publicação de posts, automações e programas de indicação.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | REST API v2 para publications, subscriptions, posts, segments |
| MCP | - | Não disponível |
| CLI | ✓ | [beehiiv.js](../clis/beehiiv.js) |
| SDK | - | Sem SDK oficial; OpenAPI spec disponível para codegen |

## Autenticação

- **Tipo**: Bearer Token
- **Cabeçalho**: `Authorization: Bearer {api_key}`
- **Obter chave**: Settings > API under Workspace Settings at https://app.beehiiv.com
- **Observação**: A API key é exibida apenas uma vez na criação; copie e armazene imediatamente

## Operações Comuns do Agente

### Listar publications

```bash
GET https://api.beehiiv.com/v2/publications
```

### Obter publication details

```bash
GET https://api.beehiiv.com/v2/publications/{publicationId}
```

### Listar subscriptions

```bash
GET https://api.beehiiv.com/v2/publications/{publicationId}/subscriptions?limit=10&status=active

# Filter by email
GET https://api.beehiiv.com/v2/publications/{publicationId}/subscriptions?email=user@example.com
```

### Criar subscription

```bash
POST https://api.beehiiv.com/v2/publications/{publicationId}/subscriptions

{
  "email": "user@example.com",
  "reactivate_existing": false,
  "send_welcome_email": true,
  "utm_source": "api",
  "tier": "free"
}
```

### Atualizar subscription

```bash
PUT https://api.beehiiv.com/v2/publications/{publicationId}/subscriptions/{subscriptionId}

{
  "tier": "premium"
}
```

### Excluir subscription

```bash
DELETE https://api.beehiiv.com/v2/publications/{publicationId}/subscriptions/{subscriptionId}
```

### Listar posts

```bash
GET https://api.beehiiv.com/v2/publications/{publicationId}/posts?limit=10&status=confirmed
```

### Criar post (somente Enterprise)

```bash
POST https://api.beehiiv.com/v2/publications/{publicationId}/posts

{
  "title": "Weekly Update",
  "subtitle": "What happened this week",
  "content": "<p>Hello subscribers...</p>",
  "status": "draft"
}
```

### Listar segments

```bash
GET https://api.beehiiv.com/v2/publications/{publicationId}/segments
```

### Listar automations

```bash
GET https://api.beehiiv.com/v2/publications/{publicationId}/automations
```

### Obter referral program

```bash
GET https://api.beehiiv.com/v2/publications/{publicationId}/referral_program
```

## Padrão da API

Todos os endpoints são escopados a uma publication. O ID da publication é um parâmetro de path obrigatório para a maioria das operações. As respostas usam paginação baseada em cursor com o parâmetro `cursor` para buscar páginas subsequentes.

## Métricas Principais

### Campos de Assinatura
- `status` - validating, invalid, pending, active, inactive
- `tier` - free or premium
- `created` - Timestamp de criação da assinatura
- `utm_source`, `utm_medium`, `utm_campaign` - Rastreamento de aquisição
- `referral_code` - Código de indicação único do assinante

### Campos de Post
- `status` - draft, confirmed (scheduled), archived
- `publish_date` - Quando o post foi/será publicado
- `stats` - Taxa de abertura, taxa de clique, contagem de assinantes (com expand)

## Parâmetros

### Parâmetros de Query Comuns
- `limit` - Resultados por página (1-100, padrão 10)
- `cursor` - Cursor para a próxima página de resultados
- `expand[]` - Incluir dados adicionais: stats, custom_fields, referrals
- `status` - Filtrar por status da assinatura/post
- `tier` - Filtrar por tier da assinatura (free, premium)

## Quando Usar

- Managing newsletter subscribers programmatically
- Sincronização de assinantes de formulários de signup externos ou landing pages
- Criação de integrações de programa de indicação
- Automação de workflows de criação e publicação de posts
- Rastreamento de crescimento de assinantes e métricas de engajamento

## Limites de Taxa

- Os limites de taxa da API se aplicam por API key
- Use paginação baseada em cursor para recuperação eficiente de dados
- Operações em lote não disponíveis; itere com requisições individuais

## Skills Relevantes

- email-sequence
- newsletter-growth
- referral-program
- content-strategy
