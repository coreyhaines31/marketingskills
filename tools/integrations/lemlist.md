# Lemlist

Plataforma de outreach por cold email com personalização e gestão de campanhas.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API para campaigns, leads, activities e webhooks |
| MCP | - | Não disponível |
| CLI | [✓](../clis/lemlist.js) | Zero-dependency Node.js CLI |
| SDK | - | somente API |

## Autenticação

- **Tipo**: Basic Auth (empty username, API key as password)
- **Header**: `Authorization: Basic base64(:api_key)`
- **Env var**: `LEMLIST_API_KEY`
- **Obter chave**: [Lemlist Settings > Integrations](https://app.lemlist.com/settings/integrations)

## Operações comuns de agent

### Listar campanhas

```bash
node tools/clis/lemlist.js campaigns list --offset 0 --limit 20
```

### Buscar detalhes e estatísticas da campanha

```bash
# Get campaign
node tools/clis/lemlist.js campaigns get --id cam_abc123

# Get campaign stats
node tools/clis/lemlist.js campaigns stats --id cam_abc123

# Export campaign data
node tools/clis/lemlist.js campaigns export --id cam_abc123
```

### Gerenciar leads em uma campanha

```bash
# List leads
node tools/clis/lemlist.js leads list --campaign-id cam_abc123

# Add a lead
node tools/clis/lemlist.js leads add --campaign-id cam_abc123 --email john@example.com --first-name John --last-name Doe --company "Example Inc"

# Get lead details
node tools/clis/lemlist.js leads get --campaign-id cam_abc123 --email john@example.com

# Remove a lead
node tools/clis/lemlist.js leads delete --campaign-id cam_abc123 --email john@example.com
```

### Gerenciar unsubscribes

```bash
# List unsubscribed emails
node tools/clis/lemlist.js unsubscribes list

# Add to unsubscribe list
node tools/clis/lemlist.js unsubscribes add --email john@example.com

# Remove from unsubscribe list
node tools/clis/lemlist.js unsubscribes delete --email john@example.com
```

### Visualizar atividades

```bash
# All activities
node tools/clis/lemlist.js activities list

# Filter by campaign and type
node tools/clis/lemlist.js activities list --campaign-id cam_abc123 --type emailsOpened
```

### Gerenciar webhooks

```bash
# List hooks
node tools/clis/lemlist.js hooks list

# Create a webhook
node tools/clis/lemlist.js hooks create --target-url https://example.com/webhook --event emailsOpened

# Delete a webhook
node tools/clis/lemlist.js hooks delete --id hook_123
```

### Informações da equipe

```bash
node tools/clis/lemlist.js team info
```

## Limites de taxa

- Limites de taxa da API variam por plano
- Recomendado: manter abaixo de 10 requisições/segundo

## Casos de uso

- **Link building outreach**: Adicionar prospects a campanhas para pedidos de backlink
- **Gestão de campanhas**: Monitorar taxas de abertura/resposta entre campanhas de prospecção
- **Lead management**: Adicionar, remover e rastrear leads em campanhas
- **Integração de webhook**: Receber notificações em tempo real de eventos de email
