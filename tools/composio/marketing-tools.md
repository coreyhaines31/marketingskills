# Composio Marketing Tools

Mapeamento detalhado dos toolkits do Composio para casos de uso de marketing. Organizado nas mesmas categorias de [REGISTRY.md](../REGISTRY.md).

## CRM

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `HUBSPOT` | OAuth 2.0 | Obter/criar contatos, listar negócios por estágio, obter dados de empresas, gerenciar listas, buscar contatos por propriedade | Deep |
| `SALESFORCE` | OAuth 2.0 | Executar consultas SOQL, obter/criar leads, listar oportunidades, obter detalhes de contas, atualizar registros | Deep |

## Email & SMS

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `ACTIVECAMPAIGN` | API Key | Obter contatos, listar automações, adicionar contatos em listas, obter estatísticas de campanha | Medium |
| `KLAVIYO` | API Key | Obter perfis, listar segmentos, obter métricas de campanha, adicionar em listas | Medium |
| `MAILCHIMP` | OAuth 2.0 | Obter audiências, listar campanhas, obter relatórios de campanha, adicionar inscritos | Deep |
| `GMAIL` | OAuth 2.0 | Enviar emails, buscar inbox, ler mensagens, gerenciar labels | Deep |

## Advertising

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `FACEBOOKADS` | OAuth 2.0 | Obter insights de campanha, listar ad sets, obter performance de anúncios, ler dados de audiência | Medium |
| `LINKEDIN` | OAuth 2.0 | Obter analytics de campanha, listar campanhas, obter estatísticas de páginas da empresa | Medium |
| `GOOGLEADS` | OAuth 2.0 | Obter performance de campanha, listar ad groups, estatísticas de palavras-chave | Medium |

## Productivity & Collaboration

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `GOOGLESHEETS` | OAuth 2.0 | Ler/escrever células, criar planilhas, formatar intervalos, adicionar linhas | Deep |
| `SLACK` | OAuth 2.0 | Enviar mensagens, ler canais, fazer upload de arquivos, buscar mensagens | Deep |
| `NOTION` | OAuth 2.0 | Ler/criar páginas, consultar databases, atualizar blocos, buscar | Deep |
| `AIRTABLE` | OAuth 2.0 | Listar/criar/atualizar registros, consultar views, gerenciar tabelas | Deep |

## Commerce

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `SHOPIFY` | OAuth 2.0 | Obter produtos, listar pedidos, obter dados de clientes, níveis de inventário | Deep |

## Analytics

| Composio Toolkit | Auth | Key Marketing Actions | Depth |
|-----------------|------|----------------------|-------|
| `GOOGLEANALYTICS` | OAuth 2.0 | Executar relatórios, obter dados em tempo real, listar propriedades | Medium |

## Coverage Depth Guide

- **Deep** — mais de 20 actions, cobre as operações mais comuns, adequado para uso diário
- **Medium** — 5 a 20 actions, cobre operações principais de leitura e algumas de escrita
- **Shallow** — menos de 5 actions, acesso básico somente leitura

## Coverage vs. Native Tools

Esta tabela mostra onde o Composio agrega valor em comparação com o que já existe no registro do MarketingSkills:

| Tool | Native MCP | Native CLI | Composio MCP | Recommendation |
|------|:----------:|:----------:|:------------:|----------------|
| HubSpot | - | ✓ | ✓ | **Use Composio** — adiciona acesso MCP |
| Salesforce | - | ✓ | ✓ | **Use Composio** — adiciona acesso MCP |
| Meta Ads | - | ✓ | ✓ | **Use Composio** — adiciona acesso MCP |
| LinkedIn Ads | - | ✓ | ✓ | **Use Composio** — adiciona acesso MCP |
| Google Sheets | - | - | ✓ | **Use Composio** — única opção MCP |
| Slack | - | - | ✓ | **Use Composio** — única opção MCP |
| Notion | - | - | ✓ | **Use Composio** — única opção MCP |
| Airtable | - | - | ✓ | **Use Composio** — única opção MCP |
| ActiveCampaign | - | ✓ | ✓ | **Use Composio** — adiciona acesso MCP |
| Klaviyo | - | ✓ | ✓ | **Use Composio** — adiciona acesso MCP |
| Shopify | - | ✓ | ✓ | **Use Composio** — adiciona acesso MCP |
| Gmail | - | - | ✓ | **Use Composio** — única opção MCP |
| GA4 | ✓ | ✓ | ✓ | **Use native** — cobertura mais profunda |
| Stripe | ✓ | ✓ | ✓ | **Use native** — cobertura mais profunda |
| Mailchimp | ✓ | ✓ | ✓ | **Use native** — cobertura mais profunda |
| Google Ads | ✓ | ✓ | ✓ | **Use native** — cobertura mais profunda |

## Toolkit Reference

Cada nome de toolkit do Composio corresponde ao identificador `TOOL_NAME` usado na plataforma Composio. Ao buscar actions disponíveis, use estes nomes exatos:

```bash
# List all actions for a toolkit
npx composio actions list --app HUBSPOT

# Search for specific actions
npx composio actions list --app FACEBOOKADS --search "insights"
```

Para o guia completo de integração, incluindo setup, preços e limitações, veja [composio.md](../integrations/composio.md).
