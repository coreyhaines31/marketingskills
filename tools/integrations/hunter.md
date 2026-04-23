# Hunter.io

Plataforma de busca e verificação de emails para outreach e link building.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API para domain search, email finder e verification |
| MCP | - | Não disponível |
| CLI | [✓](../clis/hunter.js) | Zero-dependency Node.js CLI |
| SDK | - | somente API |

## Autenticação

- **Tipo**: API Key (query parameter)
- **Parâmetro**: `api_key={key}`
- **Env var**: `HUNTER_API_KEY`
- **Obter chave**: [Hunter dashboard > API](https://hunter.io/api-keys)

## Operações comuns de agent

### Encontrar emails para um domínio

```bash
node tools/clis/hunter.js domain search --domain example.com --limit 10
```

### Encontrar o email de uma pessoa específica

```bash
node tools/clis/hunter.js email find --domain example.com --first-name John --last-name Doe
```

### Verificar um endereço de email

```bash
node tools/clis/hunter.js email verify --email john@example.com
```

### Contar emails disponíveis para um domínio

```bash
node tools/clis/hunter.js domain count --domain example.com
```

### Gerenciar leads

```bash
# List leads
node tools/clis/hunter.js leads list --limit 20

# Create a lead
node tools/clis/hunter.js leads create --email john@example.com --first-name John --last-name Doe --company "Example Inc"

# Delete a lead
node tools/clis/hunter.js leads delete --id 12345
```

### Gerenciar campanhas

```bash
# List campaigns
node tools/clis/hunter.js campaigns list

# Get campaign details
node tools/clis/hunter.js campaigns get --id 12345

# Start/pause a campaign
node tools/clis/hunter.js campaigns start --id 12345
node tools/clis/hunter.js campaigns pause --id 12345
```

### Verificar uso da conta

```bash
node tools/clis/hunter.js account info
```

## Limites de taxa

- Plano gratuito: 25 buscas/mês, 50 verificações/mês
- Planos pagos escalam conforme o tier
- Limite de taxa da API: 10 requisições/segundo

## Casos de uso

- **Link building**: Encontrar contatos de email em domínios-alvo para outreach
- **Prospecting**: Montar listas de leads a partir de domínios de empresas
- **Verification**: Limpar listas de email antes de enviar campanhas
