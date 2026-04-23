# Intercom

API da plataforma de mensagens e suporte ao cliente para gerenciar contatos, conversas, mensagens, empresas, artigos e tags.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API v2.11+ - contacts, conversations, messages, companies, articles, tags |
| MCP | - | Não disponível |
| CLI | ✓ | [intercom.js](../clis/intercom.js) |
| SDK | ✓ | Node.js, Ruby, Python, PHP, Go |

## Autenticação

- **Tipo**: Bearer Token (Access Token ou OAuth 2.0)
- **Header**: `Authorization: Bearer {token}`
- **Version Header**: `Intercom-Version: 2.11`
- **Obter chave**: Developer Hub em https://app.intercom.com/a/apps/_/developer-hub

## Operações comuns de agent

### Listar contatos

```bash
GET https://api.intercom.io/contacts
```

### Buscar um contato

```bash
GET https://api.intercom.io/contacts/{id}
```

### Criar um contato

```bash
POST https://api.intercom.io/contacts

{
  "role": "user",
  "email": "user@example.com",
  "name": "Jane Doe",
  "custom_attributes": {
    "plan": "pro"
  }
}
```

### Atualizar um contato

```bash
PUT https://api.intercom.io/contacts/{id}

{
  "name": "Jane Smith",
  "custom_attributes": {
    "plan": "enterprise"
  }
}
```

### Pesquisar contatos

```bash
POST https://api.intercom.io/contacts/search

{
  "query": {
    "field": "email",
    "operator": "=",
    "value": "user@example.com"
  }
}
```

### Excluir um contato

```bash
DELETE https://api.intercom.io/contacts/{id}
```

### Listar conversas

```bash
GET https://api.intercom.io/conversations
```

### Buscar uma conversa

```bash
GET https://api.intercom.io/conversations/{id}
```

### Pesquisar conversas

```bash
POST https://api.intercom.io/conversations/search

{
  "query": {
    "field": "open",
    "operator": "=",
    "value": true
  }
}
```

### Responder a uma conversa

```bash
POST https://api.intercom.io/conversations/{id}/reply

{
  "message_type": "comment",
  "type": "admin",
  "admin_id": "{admin_id}",
  "body": "Thanks for reaching out!"
}
```

### Criar uma mensagem

```bash
POST https://api.intercom.io/messages

{
  "message_type": "inapp",
  "body": "Welcome to our platform!",
  "from": {
    "type": "admin",
    "id": "{admin_id}"
  },
  "to": {
    "type": "user",
    "id": "{user_id}"
  }
}
```

### Listar empresas

```bash
GET https://api.intercom.io/companies
```

### Criar ou atualizar uma empresa

```bash
POST https://api.intercom.io/companies

{
  "company_id": "company_123",
  "name": "Acme Corp",
  "plan": "enterprise",
  "custom_attributes": {
    "industry": "Technology"
  }
}
```

### Listar tags

```bash
GET https://api.intercom.io/tags
```

### Criar uma tag

```bash
POST https://api.intercom.io/tags

{
  "name": "VIP Customer"
}
```

### Adicionar tag a um contato

```bash
POST https://api.intercom.io/contacts/{contact_id}/tags

{
  "id": "{tag_id}"
}
```

### Listar artigos

```bash
GET https://api.intercom.io/articles
```

### Criar um artigo

```bash
POST https://api.intercom.io/articles

{
  "title": "Getting Started Guide",
  "body": "<p>Welcome to our platform...</p>",
  "author_id": "{admin_id}",
  "state": "published"
}
```

### Listar admins

```bash
GET https://api.intercom.io/admins
```

### Enviar eventos

```bash
POST https://api.intercom.io/events

{
  "event_name": "purchased-item",
  "created_at": 1706140800,
  "user_id": "user_123",
  "metadata": {
    "item_name": "Pro Plan",
    "price": 99.00
  }
}
```

## Métricas principais

### Dados de contato
- `id` - Identificador único do contato
- `role` - user ou lead
- `email` - Email do contato
- `name` - Nome do contato
- `created_at` / `updated_at` - Timestamps
- `last_seen_at` - Última atividade
- `custom_attributes` - Campos de dados customizados
- `tags` - Tags aplicadas
- `companies` - Empresas associadas

### Dados de conversa
- `id` - Identificador da conversa
- `state` - open, closed, snoozed
- `open` - Status aberto em boolean
- `read` - Status de leitura
- `priority` - Nível de prioridade
- `statistics` - Tempos de resposta, contagens
- `conversation_parts` - Histórico de mensagens

## Parâmetros

### Listar contatos
- `per_page` - Resultados por página (padrão 50, máx 150)
- `starting_after` - Cursor de paginação

### Listar conversas
- `per_page` - Resultados por página (padrão 20, máx 150)
- `starting_after` - Cursor de paginação

### Busca (Contacts & Conversations)
- `query.field` - Campo para busca
- `query.operator` - Comparison operator (=, !=, >, <, ~, IN, NIN)
- `query.value` - Valor de busca
- `pagination.per_page` - Resultados por página
- `pagination.starting_after` - Cursor da próxima página
- `sort.field` / `sort.order` - Configuração de ordenação

## Quando usar

- Gerenciar registros e segmentos de contatos de clientes
- Automatizar mensagens e onboarding de clientes
- Monitorar e responder conversas de suporte
- Rastrear eventos e comportamento de clientes
- Criar workflows de suporte customizados
- Sincronizar dados de clientes entre plataformas

## Limites de taxa

- **Padrão**: 10.000 chamadas de API por minuto por app
- **Por workspace**: 25.000 chamadas de API por minuto
- Distribuído em janelas de 10 segundos (reinicia a cada 10 segundos)
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- HTTP 429 retornado quando o limite é excedido

## Habilidades relevantes

- customer-onboarding
- customer-retention
- lead-generation
- customer-support
- in-app-messaging
