# Tipoform

API de plataforma de formulários e pesquisas para criar typeforms, recuperar respostas, gerenciar webhooks, temas, imagens e workspaces.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | APIs de criação, respostas e webhooks |
| MCP | - | Não disponível |
| CLI | ✓ | [typeform.js](../clis/typeform.js) |
| SDK | ✓ | JavaScript (@typeform/js-api-client), Embed SDK |

## Autenticação

- **Tipo**: Bearer Token (Personal Access Token ou OAuth 2.0)
- **Header**: `Authorization: Bearer {token}`
- **Obter chave**: https://admin.typeform.com/account#/section/tokens

## Operações Comuns do Agente

### Listar formulários

```bash
GET https://api.typeform.com/forms
```

### Obter um formulário

```bash
GET https://api.typeform.com/forms/{form_id}
```

### Criar um formulário

```bash
POST https://api.typeform.com/forms

{
  "title": "Customer Feedback Survey",
  "fields": [
    {
      "type": "short_text",
      "title": "What is your name?"
    },
    {
      "type": "rating",
      "title": "How would you rate our service?",
      "properties": {
        "steps": 5
      }
    }
  ]
}
```

### Atualizar um formulário

```bash
PUT https://api.typeform.com/forms/{form_id}

{
  "title": "Updated Survey Title"
}
```

### Excluir um formulário

```bash
DELETE https://api.typeform.com/forms/{form_id}
```

### Recuperar respostas

```bash
GET https://api.typeform.com/forms/{form_id}/responses?page_size=25&since=2024-01-01T00:00:00Z
```

### Excluir respostas

```bash
DELETE https://api.typeform.com/forms/{form_id}/responses?included_response_ids={id1},{id2}
```

### Listar webhooks

```bash
GET https://api.typeform.com/forms/{form_id}/webhooks
```

### Criar ou atualizar webhook

```bash
PUT https://api.typeform.com/forms/{form_id}/webhooks/{tag}

{
  "url": "https://example.com/webhook",
  "enabled": true
}
```

### Excluir webhook

```bash
DELETE https://api.typeform.com/forms/{form_id}/webhooks/{tag}
```

### Listar temas

```bash
GET https://api.typeform.com/themes
```

### Listar imagens

```bash
GET https://api.typeform.com/images
```

### Listar workspaces

```bash
GET https://api.typeform.com/workspaces
```

### Obter um workspace

```bash
GET https://api.typeform.com/workspaces/{workspace_id}
```

## Métricas Principais

### Dados de Resposta
- `response_id` - Unique response identifier
- `landed_at` / `submitted_at` - Timestamps
- `answers` - Array of field answers
- `variables` - Calculated variables
- `hidden` - Hidden field values
- `calculated` - Score calculations

### Dados do Formulário
- `id` - ID do formulário (da URL)
- `title` - Form title
- `fields` - Array of form fields
- `logic` - Logic jumps
- `settings` - Form settings (notifications, meta, etc.)
- `_links` - URLs de exibição e respostas

## Parâmetros

### Recuperar Respostas
- `page_size` - Results per page (default 25, max 1000)
- `since` / `until` - Filtro de intervalo de data (ISO 8601 ou Unix timestamp)
- `after` / `before` - Pagination tokens
- `response_type` - Filtro: started, partial, completed (padrão: completed)
- `query` - Busca de texto nas respostas
- `fields` - Mostrar apenas campos específicos nas respostas
- `sort` - Sort order: `{fieldID},{asc|desc}`
- `included_response_ids` / `excluded_response_ids` - Filtrar respostas específicas
- `answered_fields` - Apenas respostas contendo os campos especificados

### Listar Formulários
- `page` - Page number
- `page_size` - Results per page (default 10, max 200)
- `workspace_id` - Filtrar por workspace
- `search` - Buscar por título do formulário

## Quando Usar

- Coletar informações de leads e dados de pesquisa
- Construir experiências de formulário customizadas de forma programática
- Automatizar criação de pesquisas para campanhas
- Analisar dados de resposta de formulários em escala
- Setting up real-time response webhooks
- Gerenciar temas e branding de formulários

## Limites de Taxa

- **Create & Responses APIs**: 2 requests per second per account
- **Webhooks & Embed**: No rate limits (push-based)
- Monitorar respostas HTTP 429

## Skills Relevantes

- lead-generation
- customer-research
- page-cro
- signup-flow-cro
- customer-feedback
