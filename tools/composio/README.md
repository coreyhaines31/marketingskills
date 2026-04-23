# Composio Quick Start

Obtenha acesso MCP a mais de 500 ferramentas de marketing por meio de uma única integração.

## Pré-requisitos

- Node.js 18+
- Claude Code instalado

## Instalação

```bash
npx @composio/mcp@latest setup
```

Verifique executando `/mcp` no Claude Code — `composio` deve aparecer na lista de servidores.

## Conectar uma Ferramenta

Quando você pedir ao agente para usar uma ferramenta do Composio pela primeira vez, ele fornecerá um link de conexão. Abra o link no navegador, autorize o aplicativo e pronto. A conexão persiste entre sessões.

```
You: "Get my top HubSpot contacts"
Agent: "Please connect HubSpot first: https://app.composio.dev/connect/..."
# Click the link → authorize → return to Claude Code
Agent: "Here are your top contacts: ..."
```

## Exemplos de Uso

### Buscar contatos do CRM

```
"Show me my 10 most recent HubSpot contacts with their deal stages"
```

### Obter performance de anúncios

```
"What's my Meta Ads spend and ROAS for the last 7 days?"
```

### Escrever em uma planilha

```
"Add a row to my 'Campaign Tracker' Google Sheet with today's LinkedIn Ads metrics"
```

### Fluxo de trabalho entre ferramentas

```
"Find Salesforce leads from this week and post a summary in Slack #new-leads"
```

## Ferramentas de Marketing Disponíveis

Veja [marketing-tools.md](marketing-tools.md) para a lista completa de toolkits do Composio mapeados para casos de uso de marketing.

Principais ferramentas com novo acesso MCP (sem servidor MCP nativo neste repositório):
- **HubSpot** — contatos, negócios, empresas, listas
- **Salesforce** — consultas SOQL, leads, oportunidades
- **Meta Ads** — campanhas, conjuntos de anúncios, insights
- **LinkedIn Ads** — campanhas, analytics
- **Google Sheets** — leitura, escrita, criação de planilhas
- **Slack** — mensagens, canais
- **Notion** — páginas, bancos de dados
- **Klaviyo** — perfis, listas, campanhas
- **ActiveCampaign** — contatos, automações

## Solução de Problemas

### Erro "Tool not found"

A ferramenta pode ainda não estar conectada. Peça ao agente para conectá-la, ou execute:

```bash
npx composio apps list
```

### Autenticação expirada

Tokens OAuth expiram. Se uma ferramenta parar de funcionar, faça nova autenticação:

```bash
npx composio connections list    # Encontre a conexão
npx composio connections remove {id}  # Remova-a
# Depois peça ao agente para usar a ferramenta novamente para disparar a re-autenticação
```

### Erros de limite de taxa

O Composio tem seus próprios limites de taxa (gratuito: 20K chamadas/mês, 10 req/s). Se você atingir o limite:
- Reduza a frequência das requisições
- Faça upgrade do seu plano no Composio
- Use CLIs nativos para operações de alto volume

### Servidor MCP não aparecendo

Execute novamente o comando de configuração:

```bash
npx @composio/mcp@latest setup
```

Depois reinicie o Claude Code.
