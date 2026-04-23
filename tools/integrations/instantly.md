# Instantly.ai

Plataforma de cold email com warmup de email embutido e gestão de campanhas em escala.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API para campaigns, leads, accounts e analytics |
| MCP | - | Não disponível |
| CLI | [✓](../clis/instantly.js) | Zero-dependency Node.js CLI |
| SDK | - | somente API |

## Autenticação

- **Tipo**: API Key (query parameter)
- **Parâmetro**: `api_key={key}`
- **Env var**: `INSTANTLY_API_KEY`
- **Obter chave**: [Instantly Settings > Integrations > API](https://app.instantly.ai/app/settings/integrations)

## Operações comuns de agent

### Gerenciar campanhas

```bash
# List campaigns
node tools/clis/instantly.js campaigns list --limit 20

# Get campaign details
node tools/clis/instantly.js campaigns get --id cam_abc123

# Check campaign status
node tools/clis/instantly.js campaigns status --id cam_abc123

# Launch a campaign
node tools/clis/instantly.js campaigns launch --id cam_abc123

# Pause a campaign
node tools/clis/instantly.js campaigns pause --id cam_abc123
```

### Gerenciar leads

```bash
# List leads in a campaign
node tools/clis/instantly.js leads list --campaign-id cam_abc123 --limit 50

# Add a lead
node tools/clis/instantly.js leads add --campaign-id cam_abc123 --email john@example.com --first-name John --last-name Doe --company "Example Inc"

# Delete a lead
node tools/clis/instantly.js leads delete --campaign-id cam_abc123 --email john@example.com

# Check lead status
node tools/clis/instantly.js leads status --campaign-id cam_abc123 --email john@example.com
```

### Gerenciar contas de email

```bash
# List connected accounts
node tools/clis/instantly.js accounts list --limit 20

# Check account status
node tools/clis/instantly.js accounts status --account-id me@example.com

# Check warmup status
node tools/clis/instantly.js accounts warmup-status --account-id me@example.com
```

### Visualizar analytics

```bash
# Campaign analytics
node tools/clis/instantly.js analytics campaign --campaign-id cam_abc123 --start 2024-01-01 --end 2024-01-31

# Step-by-step analytics
node tools/clis/instantly.js analytics steps --campaign-id cam_abc123

# Account-level analytics
node tools/clis/instantly.js analytics account --start 2024-01-01 --end 2024-01-31
```

### Gerenciar blocklist

```bash
# List blocked emails/domains
node tools/clis/instantly.js blocklist list

# Add to blocklist
node tools/clis/instantly.js blocklist add --entries "competitor.com,spam@example.com"
```

## Limites de taxa

- Limites de taxa da API variam por plano
- Recomendado: manter abaixo de 10 requisições/segundo

## Casos de uso

- **Link building em escala**: Executar campanhas de prospecção de grande volume com warmup embutido
- **Gestão de campanhas**: Iniciar, pausar e monitorar campanhas de cold email
- **Saúde da conta**: Monitorar warmup e deliverability das contas de email
- **Análises**: Acompanhar taxas de abertura, resposta e performance de campanha
