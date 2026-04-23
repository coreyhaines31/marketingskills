# Kit (formerly ConvertKit)

Plataforma de email marketing para creators e negócios de newsletter.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API para subscribers, forms e sequences |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | ✓ | JavaScript e Ruby gems disponíveis |

## Autenticação

- **Tipo**: API Key ou API Secret
- **Parâmetro**: `api_key={key}` ou `api_secret={secret}` em query/body
- **Obter chave**: Settings > Advanced no dashboard do Kit

## Operações comuns de agent

### Listar subscribers

```bash
GET https://api.convertkit.com/v3/subscribers?api_secret={api_secret}&page=1

```

### Buscar subscriber

```bash
GET https://api.convertkit.com/v3/subscribers/{subscriber_id}?api_secret={api_secret}
```

### Adicionar subscriber a um form

```bash
POST https://api.convertkit.com/v3/forms/{form_id}/subscribe

{
  "api_key": "{api_key}",
  "email": "user@example.com",
  "first_name": "John",
  "fields": {
    "company": "Example Inc"
  }
}
```

### Adicionar subscriber a uma sequence

```bash
POST https://api.convertkit.com/v3/sequences/{sequence_id}/subscribe

{
  "api_key": "{api_key}",
  "email": "user@example.com"
}
```

### Adicionar tag em subscriber

```bash
POST https://api.convertkit.com/v3/tags/{tag_id}/subscribe

{
  "api_key": "{api_key}",
  "email": "user@example.com"
}
```

### Remover tag de subscriber

```bash
DELETE https://api.convertkit.com/v3/subscribers/{subscriber_id}/tags/{tag_id}?api_secret={api_secret}
```

### Atualizar subscriber

```bash
PUT https://api.convertkit.com/v3/subscribers/{subscriber_id}

{
  "api_secret": "{api_secret}",
  "first_name": "Jane",
  "fields": {
    "plan": "pro"
  }
}
```

### Cancelar inscrição

```bash
PUT https://api.convertkit.com/v3/unsubscribe

{
  "api_secret": "{api_secret}",
  "email": "user@example.com"
}
```

### Listar forms

```bash
GET https://api.convertkit.com/v3/forms?api_key={api_key}
```

### Listar sequences

```bash
GET https://api.convertkit.com/v3/sequences?api_key={api_key}
```

### Listar tags

```bash
GET https://api.convertkit.com/v3/tags?api_key={api_key}
```

### Criar broadcast

```bash
POST https://api.convertkit.com/v3/broadcasts

{
  "api_secret": "{api_secret}",
  "subject": "Newsletter Subject",
  "content": "<p>Email content here</p>",
  "email_layout_template": "default"
}
```

## Conceitos principais

- **Subscribers** - Contatos de email
- **Forms** - Formulários de inscrição
- **Sequences** - Séries de emails automatizadas
- **Tags** - Rótulos de subscribers
- **Broadcasts** - Envios pontuais
- **Custom Fields** - Atributos de subscribers

## Estados do subscriber

- `active` - Pode receber emails
- `unsubscribed` - Cancelou inscrição
- `bounced` - Email retornou
- `complained` - Marcado como spam
- `inactive` - Subscriber frio

## Quando usar

- Negócios de creators/newsletter
- Automação simples de email
- Construção de lista via formulários
- Tagueamento e segmentação
- Sequências de email para cursos

## Limites de taxa

- 120 requisições por minuto
- Endpoints em lote disponíveis

## Habilidades relevantes

- email-sequence
- content-strategy
