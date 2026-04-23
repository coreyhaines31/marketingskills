# ActiveCampaign

Plataforma de automação de email marketing com CRM, contatos, pipeline de deals, tags, automações e gerenciamento de campanhas.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | REST API v3 para contatos, deals, automações, campanhas, tags |
| MCP | - | Não disponível |
| CLI | ✓ | [activecampaign.js](../clis/activecampaign.js) |
| SDK | ✓ | Python, PHP, Node.js, Ruby |

## Autenticação

- **Tipo**: API Token
- **Cabeçalho**: `Api-Token: {api_token}`
- **Base URL**: `https://{yourAccountName}.api-us1.com/api/3`
- **Obter chave**: Settings > aba Developer na sua conta ActiveCampaign
- **Observação**: Cada usuário tem uma API key única. A Base URL é específica da conta (encontrada em Settings > Developer).

## Operações Comuns do Agente

### Obter current user

```bash
GET https://{account}.api-us1.com/api/3/users/me
```

### Listar contacts

```bash
GET https://{account}.api-us1.com/api/3/contacts?limit=20&offset=0

# Search by email
GET https://{account}.api-us1.com/api/3/contacts?email=user@example.com

# Search by name
GET https://{account}.api-us1.com/api/3/contacts?search=Jane
```

### Criar contact

```bash
POST https://{account}.api-us1.com/api/3/contacts

{
  "contact": {
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+15551234567"
  }
}
```

### Atualizar contact

```bash
PUT https://{account}.api-us1.com/api/3/contacts/{contactId}

{
  "contact": {
    "firstName": "Updated",
    "lastName": "Name"
  }
}
```

### Sincronizar contato (criar ou atualizar)

```bash
POST https://{account}.api-us1.com/api/3/contact/sync

{
  "contact": {
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe"
  }
}
```

### Excluir contact

```bash
DELETE https://{account}.api-us1.com/api/3/contacts/{contactId}
```

### Listar todas as listas

```bash
GET https://{account}.api-us1.com/api/3/lists?limit=20&offset=0
```

### Criar lista

```bash
POST https://{account}.api-us1.com/api/3/lists

{
  "list": {
    "name": "Newsletter",
    "stringid": "newsletter",
    "sender_url": "https://example.com",
    "sender_reminder": "You signed up for our newsletter."
  }
}
```

### Inscrever contato na lista

```bash
POST https://{account}.api-us1.com/api/3/contactLists

{
  "contactList": {
    "list": "1",
    "contact": "1",
    "status": 1
  }
}
```

### Cancelar inscrição de contato na lista

```bash
POST https://{account}.api-us1.com/api/3/contactLists

{
  "contactList": {
    "list": "1",
    "contact": "1",
    "status": 2
  }
}
```

### Listar campaigns

```bash
GET https://{account}.api-us1.com/api/3/campaigns?limit=20&offset=0
```

### Listar deals

```bash
GET https://{account}.api-us1.com/api/3/deals?limit=20&offset=0

# Filter by pipeline stage
GET https://{account}.api-us1.com/api/3/deals?filters[stage]=1
```

### Criar deal

```bash
POST https://{account}.api-us1.com/api/3/deals

{
  "deal": {
    "title": "New Enterprise Deal",
    "value": 50000,
    "currency": "usd",
    "group": "1",
    "stage": "1",
    "owner": "1",
    "contact": "1"
  }
}
```

### Atualizar deal

```bash
PUT https://{account}.api-us1.com/api/3/deals/{dealId}

{
  "deal": {
    "stage": "2",
    "value": 75000
  }
}
```

### Listar automations

```bash
GET https://{account}.api-us1.com/api/3/automations?limit=20&offset=0
```

### Adicionar contato à automação

```bash
POST https://{account}.api-us1.com/api/3/contactAutomations

{
  "contactAutomation": {
    "contact": "1",
    "automation": "1"
  }
}
```

### Listar tags

```bash
GET https://{account}.api-us1.com/api/3/tags?limit=20&offset=0
```

### Criar tag

```bash
POST https://{account}.api-us1.com/api/3/tags

{
  "tag": {
    "tag": "VIP Customer",
    "tagType": "contact"
  }
}
```

### Adicionar tag ao contato

```bash
POST https://{account}.api-us1.com/api/3/contactTags

{
  "contactTag": {
    "contact": "1",
    "tag": "1"
  }
}
```

### Listar pipelines (deal groups)

```bash
GET https://{account}.api-us1.com/api/3/dealGroups?limit=20&offset=0
```

### Listar webhooks

```bash
GET https://{account}.api-us1.com/api/3/webhooks?limit=20&offset=0
```

### Criar webhook

```bash
POST https://{account}.api-us1.com/api/3/webhooks

{
  "webhook": {
    "name": "Contact Updated",
    "url": "https://example.com/webhook",
    "events": ["subscribe", "unsubscribe"],
    "sources": ["public", "admin", "api", "system"]
  }
}
```

## Padrão da API

ActiveCampaign usa REST com encapsulamento de recursos (e.g., `{ "contact": {...} }`). As respostas incluem o objeto do recurso mais metadados. Recursos relacionados são gerenciados por endpoints de junção (e.g., `/contactLists`, `/contactTags`, `/contactAutomations`). A base URL é específica da conta. A paginação usa os parâmetros `limit` e `offset`.

## Métricas Principais

### Campos de Contato
- `email` - Email address
- `firstName`, `lastName` - Name fields
- `phone` - Phone number
- `cdate` - Data de criação
- `udate` - Data da última atualização
- `deals` - Related deals count

### Campos de Deal
- `title` - Deal name
- `value` - Deal value in cents
- `currency` - Currency code
- `stage` - Pipeline stage ID
- `group` - Pipeline (deal group) ID
- `owner` - Assigned user ID
- `status` - 0 (open), 1 (won), 2 (lost)

### Métricas de Campanha
- `sends` - Total sends
- `opens` - Opens count
- `clicks` - Clicks count
- `uniqueopens` - Unique opens
- `uniquelinks` - Unique clicks

## Parâmetros

### Status da Lista de Contatos
- `1` - Subscribed (active)
- `2` - Unsubscribed

### Status do Deal
- `0` - Open
- `1` - Won
- `2` - Lost

### Tipos de Tag
- `contact` - Contact tags
- `deal` - Deal tags

### Parâmetros de Query Comuns
- `limit` - Resultados por página (padrão 20)
- `offset` - Skip N results
- `search` - Busca textual
- `email` - Filtrar contatos por email
- `filters[stage]` - Filtrar deals por estágio
- `filters[owner]` - Filtrar deals por responsável

## Quando Usar

- Automação de marketing com workflows condicionais complexos
- CRM com gerenciamento de pipeline de deals
- Gerenciamento de contatos com tagging e segmentação
- Criação e rastreamento de campanhas de email
- Disparo de automações com base em eventos externos
- Rastreamento de pipeline de vendas B2B integrado ao marketing

## Limites de Taxa

- 5 requisições por segundo por conta
- O limite de taxa se aplica a todos os usuários da API na mesma conta
- Respostas 429 incluem o header `Retry-After`

## Skills Relevantes

- email-sequence
- lifecycle-marketing
- crm-integration
- sales-pipeline
- marketing-automation
