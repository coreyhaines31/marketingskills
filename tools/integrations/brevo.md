# Brevo

Plataforma de marketing all-in-one (anteriormente Sendinblue) para email, SMS e WhatsApp com contatos, campanhas e mensagens transacionais.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | REST API v3 para contatos, campanhas, email/SMS transacional |
| MCP | - | Não disponível |
| CLI | ✓ | [brevo.js](../clis/brevo.js) |
| SDK | ✓ | Node.js, Python, PHP, Ruby, Java, C#, Go |

## Autenticação

- **Tipo**: API Key
- **Cabeçalho**: `api-key: {api_key}`
- **Obter chave**: SMTP & API settings at https://app.brevo.com/settings/keys/api
- **Observação**: A API key é exibida apenas uma vez na criação; armazene com segurança. Formerly used `api.sendinblue.com` base URL.

## Operações Comuns do Agente

### Obter account info

```bash
GET https://api.brevo.com/v3/account
```

### Listar contacts

```bash
GET https://api.brevo.com/v3/contacts?limit=50&offset=0
```

### Obter contato por email

```bash
GET https://api.brevo.com/v3/contacts/user@example.com
```

### Criar contact

```bash
POST https://api.brevo.com/v3/contacts

{
  "email": "user@example.com",
  "attributes": {
    "FIRSTNAME": "Jane",
    "LASTNAME": "Doe"
  },
  "listIds": [1, 2]
}
```

### Atualizar contact

```bash
PUT https://api.brevo.com/v3/contacts/user@example.com

{
  "attributes": {
    "FIRSTNAME": "Updated"
  },
  "listIds": [3]
}
```

### Excluir contact

```bash
DELETE https://api.brevo.com/v3/contacts/user@example.com
```

### Importar contacts

```bash
POST https://api.brevo.com/v3/contacts/import

{
  "jsonBody": [
    { "email": "user1@example.com" },
    { "email": "user2@example.com" }
  ],
  "listIds": [1]
}
```

### Listar contact lists

```bash
GET https://api.brevo.com/v3/contacts/lists?limit=50&offset=0
```

### Criar lista

```bash
POST https://api.brevo.com/v3/contacts/lists

{
  "name": "Newsletter Subscribers",
  "folderId": 1
}
```

### Adicionar contatos à lista

```bash
POST https://api.brevo.com/v3/contacts/lists/{listId}/contacts/add

{
  "emails": ["user1@example.com", "user2@example.com"]
}
```

### Remover contatos da lista

```bash
POST https://api.brevo.com/v3/contacts/lists/{listId}/contacts/remove

{
  "emails": ["user1@example.com"]
}
```

### Enviar transactional email

```bash
POST https://api.brevo.com/v3/smtp/email

{
  "sender": {
    "name": "My App",
    "email": "noreply@example.com"
  },
  "to": [
    { "email": "user@example.com", "name": "Jane Doe" }
  ],
  "subject": "Order Confirmation",
  "htmlContent": "<html><body><p>Your order is confirmed.</p></body></html>"
}
```

### Listar email campaigns

```bash
GET https://api.brevo.com/v3/emailCampaigns?limit=50&offset=0&type=classic&status=sent
```

### Criar email campaign

```bash
POST https://api.brevo.com/v3/emailCampaigns

{
  "name": "January Newsletter",
  "subject": "Monthly Update",
  "sender": { "name": "My Brand", "email": "news@example.com" },
  "htmlContent": "<html><body><p>Newsletter content</p></body></html>",
  "recipients": { "listIds": [1, 2] }
}
```

### Enviar campaign immediately

```bash
POST https://api.brevo.com/v3/emailCampaigns/{campaignId}/sendNow
```

### Enviar email de teste para a campanha

```bash
POST https://api.brevo.com/v3/emailCampaigns/{campaignId}/sendTest

{
  "emailTo": ["test@example.com"]
}
```

### Enviar transactional SMS

```bash
POST https://api.brevo.com/v3/transactionalSMS/sms

{
  "sender": "MyApp",
  "recipient": "+15551234567",
  "content": "Your verification code is 123456",
  "type": "transactional"
}
```

### Listar SMS campaigns

```bash
GET https://api.brevo.com/v3/smsCampaigns?limit=50&offset=0
```

### Listar senders

```bash
GET https://api.brevo.com/v3/senders
```

## Padrão da API

Brevo usa REST padrão com paginação baseada em offset (parâmetros `limit` e `offset`). Os atributos de contato usam nomes de campo em maiúsculas (FIRSTNAME, LASTNAME). As listas são aninhadas sob o path do recurso contacts. Email transacional usa o endpoint `/smtp/email` apesar de ser baseado em REST.

## Métricas Principais

### Campos de Contato
- `email` - Email address
- `attributes` - Custom attributes (FIRSTNAME, LASTNAME, SMS, etc.)
- `listIds` - IDs de listas associadas
- `emailBlacklisted` - Email opt-out status
- `smsBlacklisted` - SMS opt-out status
- `statistics` - Engagement stats (with expand)

### Métricas de Campanha
- `sent` - Total sends
- `delivered` - Successful deliveries
- `openRate` - Percentual de abertura
- `clickRate` - Percentual de cliques
- `unsubscribed` - Unsubscribe count
- `hardBounces`, `softBounces` - Bounce counts

### Resposta de Email Transacional
- `messageId` - Identificador único da mensagem para rastreamento

## Parâmetros

### Parâmetros de Contato
- `email` - Contact email address
- `attributes` - Key-value object of custom attributes
- `listIds` - Array de IDs de lista para inscrição
- `unlinkListIds` - Array de IDs de lista para cancelamento de inscrição

### Parâmetros de Campanha
- `name` - Campaign name
- `subject` - Email subject line
- `sender` - Objeto com `name` e `email`
- `htmlContent` / `textContent` - Email body
- `recipients` - Objeto com array `listIds`
- `type` - classic or trigger

## Quando Usar

- Multi-channel marketing (email + SMS + WhatsApp)
- Envio de email transacional com rastreamento
- Gerenciamento de contatos e listas segmentadas
- Criação e agendamento de campanhas de email
- Notificações e marketing por SMS
- Affordable all-in-one marketing automation

## Limites de Taxa

- Os limites de taxa da API dependem do plano (free tier: envios limitados/dia)
- Email transacional: varia por plano
- Importações de contatos: processamento em lote com status assíncrono
- Headers de limite de taxa retornados nas respostas

## Skills Relevantes

- email-sequence
- sms-marketing
- transactional-email
- lifecycle-marketing
- contact-management
