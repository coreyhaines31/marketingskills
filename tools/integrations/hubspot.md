# HubSpot

Plataforma de CRM para marketing, vendas e atendimento ao cliente.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API para CRM, Marketing e Sales |
| MCP | - | Não disponível |
| CLI | ✓ | `hs` CLI para desenvolvimento local |
| SDK | ✓ | Client libraries oficiais |

## Autenticação

- **Tipo**: Private App Token ou OAuth 2.0
- **Header**: `Authorization: Bearer {access_token}`
- **Obter token**: Settings > Integrations > Private Apps

## Operações comuns de agent

### Buscar contatos

```bash
GET https://api.hubapi.com/crm/v3/objects/contacts?limit=10

Authorization: Bearer {access_token}
```

### Pesquisar contatos

```bash
POST https://api.hubapi.com/crm/v3/objects/contacts/search

{
  "filterGroups": [{
    "filters": [{
      "propertyName": "email",
      "operator": "EQ",
      "value": "user@example.com"
    }]
  }]
}
```

### Criar contato

```bash
POST https://api.hubapi.com/crm/v3/objects/contacts

{
  "properties": {
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "company": "Example Inc"
  }
}
```

### Atualizar contato

```bash
PATCH https://api.hubapi.com/crm/v3/objects/contacts/{contact_id}

{
  "properties": {
    "lifecyclestage": "customer"
  }
}
```

### Buscar deals

```bash
GET https://api.hubapi.com/crm/v3/objects/deals?limit=10&properties=dealname,amount,dealstage

Authorization: Bearer {access_token}
```

### Criar deal

```bash
POST https://api.hubapi.com/crm/v3/objects/deals

{
  "properties": {
    "dealname": "New Deal",
    "amount": "10000",
    "dealstage": "appointmentscheduled",
    "pipeline": "default"
  }
}
```

### Associar contato a deal

```bash
PUT https://api.hubapi.com/crm/v3/objects/deals/{deal_id}/associations/contacts/{contact_id}/deal_to_contact
```

### Buscar envios de formulário

```bash
GET https://api.hubapi.com/form-integrations/v1/submissions/forms/{form_guid}

Authorization: Bearer {access_token}
```

### Buscar emails de marketing

```bash
GET https://api.hubapi.com/marketing/v3/emails?limit=10

Authorization: Bearer {access_token}
```

## Comandos de CLI

```bash
# Install
npm install -g @hubspot/cli

# Initialize project
hs init

# Upload files
hs upload src dest

# Watch for changes
hs watch src dest

# List portals
hs accounts list
```

## Objetos principais

- **Contacts** - Pessoas no CRM
- **Companies** - Organizações
- **Deals** - Oportunidades de vendas
- **Tickets** - Tickets de suporte
- **Products** - Itens à venda
- **Line Items** - Itens de linha de deals

## Propriedades comuns

### Propriedades de contato
- `email` - Endereço de email
- `firstname`, `lastname` - Nome
- `lifecyclestage` - Estágio do funil
- `hs_lead_status` - Status do lead

### Propriedades de deal
- `dealname` - Nome do deal
- `amount` - Valor do deal
- `dealstage` - Estágio do pipeline
- `closedate` - Fechamento esperado

## Quando usar

- Gerenciar contatos e leads
- Acompanhar deals de vendas
- Automação de marketing
- Envios de formulários
- Campanhas de email marketing
- Tickets de atendimento ao cliente

## Limites de taxa

- 100 requisições por 10 segundos
- Limites maiores em planos enterprise

## Habilidades relevantes

- email-sequence
- analytics-tracking
- referral-program
