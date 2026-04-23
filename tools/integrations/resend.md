# Resend

Serviço de email transacional developer-friendly com API moderna.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Simple REST API for sending emails |
| MCP | ✓ | Available via Resend MCP server |
| CLI | ✓ | Official Resend CLI |
| SDK | ✓ | Official SDKs for Node.js, Python, Go, etc. |

## Autenticação

- **Type**: API Key
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: API Keys section in Resend dashboard

## CLI

### Instalação

```bash
npm install -g resend-cli
```

### Setup

```bash
resend login
# or set env var: RESEND_API_KEY=re_xxx
```

### Comandos comuns

```bash
# Send a test email
resend emails send --from hello@example.com --to user@example.com --subject "Test" --text "Hello"

# List recent emails
resend emails list

# Get email status
resend emails get <email_id>

# List domains
resend domains list

# Add a domain
resend domains create --name example.com

# Verify a domain
resend domains verify <domain_id>

# List API keys
resend api-keys list

# Create an API key
resend api-keys create --name "Production"
```

## Operações comuns do agente

### Enviar email

```bash
POST https://api.resend.com/emails

{
  "from": "hello@example.com",
  "to": ["user@example.com"],
  "subject": "Welcome!",
  "html": "<h1>Welcome to our app!</h1>"
}
```

### Enviar com template React

```bash
POST https://api.resend.com/emails

{
  "from": "hello@example.com",
  "to": ["user@example.com"],
  "subject": "Welcome!",
  "react": "WelcomeEmail",
  "props": {
    "name": "John"
  }
}
```

### Obter status de email

```bash
GET https://api.resend.com/emails/{email_id}
```

### Listar emails

```bash
GET https://api.resend.com/emails
```

### Enviar emails em batch

```bash
POST https://api.resend.com/emails/batch

[
  {
    "from": "hello@example.com",
    "to": ["user1@example.com"],
    "subject": "Welcome User 1"
  },
  {
    "from": "hello@example.com",
    "to": ["user2@example.com"],
    "subject": "Welcome User 2"
  }
]
```

### Listar domains

```bash
GET https://api.resend.com/domains
```

### Verificar domain

```bash
POST https://api.resend.com/domains/{domain_id}/verify
```

## Node.js SDK

### Instalação

```bash
npm install resend
```

### Uso

```typescript
import { Resend } from 'resend';

const resend = new Resend('re_xxx');

await resend.emails.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome!</h1>'
});
```

### Com React Email

```typescript
import { WelcomeEmail } from './emails/welcome';

await resend.emails.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  react: WelcomeEmail({ name: 'John' })
});
```

## Status de email

- `queued` - Email enfileirado para entrega
- `sent` - Email enviado ao servidor do recipient
- `delivered` - Email entregue
- `opened` - Email aberto (se tracking habilitado)
- `clicked` - Link clicado (se tracking habilitado)
- `bounced` - Email com bounce
- `complained` - Marcado como spam

## Eventos de webhook

| Event | When |
|-------|------|
| `email.sent` | Email enviado |
| `email.delivered` | Email entregue |
| `email.opened` | Email aberto |
| `email.clicked` | Link clicado |
| `email.bounced` | Email com bounce |
| `email.complained` | Reclamação de spam |

## Quando usar

- Enviar emails transacionais
- Welcome emails e password resets
- Emails de recibo e notification
- Integração de email developer-friendly
- Templates de email baseados em React
- Testes rápidos de fluxo de email via CLI sem escrever código

## Limites de taxa

- Free: 100 emails/day, 3,000/month
- Pro: 100 emails/second
- Limites maiores nos planos scale

## Skills relevantes

- email-sequence
- onboarding-cro
