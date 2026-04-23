# SendGrid

Plataforma de entrega de email para emails transacionais e de marketing.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Mail Send API, Marketing API |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | ✓ | Official libraries for most languages |

## Autenticação

- **Type**: API Key
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: Settings > API Keys in SendGrid dashboard

## Operações comuns do agente

### Enviar email

```bash
POST https://api.sendgrid.com/v3/mail/send

Authorization: Bearer {api_key}

{
  "personalizations": [{
    "to": [{"email": "user@example.com"}]
  }],
  "from": {"email": "hello@example.com"},
  "subject": "Welcome!",
  "content": [{
    "type": "text/html",
    "value": "<h1>Welcome!</h1>"
  }]
}
```

### Enviar com template

```bash
POST https://api.sendgrid.com/v3/mail/send

{
  "personalizations": [{
    "to": [{"email": "user@example.com"}],
    "dynamic_template_data": {
      "name": "John",
      "order_id": "12345"
    }
  }],
  "from": {"email": "hello@example.com"},
  "template_id": "d-xxx"
}
```

### Adicionar contato à lista

```bash
PUT https://api.sendgrid.com/v3/marketing/contacts

{
  "list_ids": ["list-id"],
  "contacts": [{
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }]
}
```

### Buscar contatos

```bash
POST https://api.sendgrid.com/v3/marketing/contacts/search

{
  "query": "email LIKE 'user@%'"
}
```

### Obter estatísticas de email

```bash
GET https://api.sendgrid.com/v3/stats?start_date=2024-01-01&end_date=2024-01-31

Authorization: Bearer {api_key}
```

### Obter bounces

```bash
GET https://api.sendgrid.com/v3/suppression/bounces

Authorization: Bearer {api_key}
```

### Obter relatórios de spam

```bash
GET https://api.sendgrid.com/v3/suppression/spam_reports

Authorization: Bearer {api_key}
```

### Validar email

```bash
POST https://api.sendgrid.com/v3/validations/email

{
  "email": "user@example.com"
}
```

## Eventos de webhook

| Event | Description |
|-------|-------------|
| `processed` | Email aceito |
| `delivered` | Email entregue |
| `open` | Email aberto |
| `click` | Link clicado |
| `bounce` | Hard/soft bounce |
| `dropped` | Email descartado |
| `spamreport` | Marcado como spam |
| `unsubscribe` | Cancelou inscrição |

## Node.js SDK

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('SG.xxx');

await sgMail.send({
  to: 'user@example.com',
  from: 'hello@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome!</h1>'
});
```

## Quando usar

- Email transacional em escala
- Campanhas de email marketing
- Validação de email
- Gestão de deliverability

## Limites de taxa

- Free: 100 emails/day
- Pago: varia por plano (até milhões/mês)

## Skills relevantes

- email-sequence
- analytics-tracking
