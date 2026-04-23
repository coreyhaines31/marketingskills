# Snov.io

Plataforma de busca e verificação de email e campanhas de drip para outreach.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | API REST para busca de emails, verificação, prospects e campanhas de drip |
| MCP | - | Não disponível |
| CLI | [✓](../clis/snov.js) | Zero-dependency Node.js CLI |
| SDK | - | Somente API |

## Autenticação

- **Tipo**: OAuth2 client credentials
- **Fluxo**: POST para `/oauth/access_token` com client_id + client_secret
- **Env vars**: `SNOV_CLIENT_ID`, `SNOV_CLIENT_SECRET`
- **Obter chaves**: [Snov.io > Integration > API](https://app.snov.io/integration/api)

A CLI gerencia automaticamente a obtenção de token.

## Operações Comuns do Agente

### Buscar emails por domínio

```bash
node tools/clis/snov.js domain search --domain example.com --type all --limit 10
```

### Encontrar o email de uma pessoa específica

```bash
node tools/clis/snov.js email find --domain example.com --first-name John --last-name Doe
```

### Verificar um email

```bash
node tools/clis/snov.js email verify --email john@example.com
```

### Encontrar prospect por email

```bash
node tools/clis/snov.js prospect find --email john@example.com
```

### Adicionar prospect a uma lista

```bash
node tools/clis/snov.js prospect add --email john@example.com --first-name John --last-name Doe --list-id 12345
```

### Gerenciar listas de prospects

```bash
# List all lists
node tools/clis/snov.js lists list

# Get prospects in a list
node tools/clis/snov.js lists prospects --id 12345 --page 1 --per-page 50
```

### Verificar stack de tecnologia do domínio

```bash
node tools/clis/snov.js technology check --domain example.com
```

### Gerenciar campanhas de drip

```bash
# List campaigns
node tools/clis/snov.js drips list

# Get campaign details
node tools/clis/snov.js drips get --id 12345

# Add prospect to drip campaign
node tools/clis/snov.js drips add-prospect --id 12345 --email john@example.com
```

## Limites de Taxa

- Rate limits vary by plan
- OAuth tokens expire after a set period; CLI handles refresh automatically

## Casos de Uso

- **Link building**: Encontrar contatos e executar outreach automatizado com drip
- **Prospecting**: Construir e gerenciar listas de prospects
- **Technology research**: Check what tech stack a target domain uses
- **Email verification**: Clean lists before sending
