# Nitrosend

Plataforma de email AI-native que combina email transacional e de marketing em uma única stack, totalmente controlada por assistentes de AI via MCP. Não é necessário dashboard tradicional — crie sequências, campanhas e automações por prompt.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API available |
| MCP | ✓ | Suporte completo a MCP — principal método de integração |
| CLI | - | Not available |
| SDK | - | Use MCP ou API diretamente |

## Autenticação

- **Type**: API Key
- **MCP Setup**: Adicione o server MCP da Nitrosend à configuração do Claude Code / assistente de AI
- **BYO Infrastructure**: Opcionalmente use suas próprias chaves SendGrid, Postmark, SES ou Resend
- **Get access**: Cadastre-se em nitrosend.com — o plano gratuito inclui 8K emails inicialmente, depois 500/mês

## Preços

| Plan | Cost | Volume |
|------|------|--------|
| Free | $0 | 8K initially, then 500/mo |
| Hobby | $20/mo | 25,000/mo |
| Pro | $100/mo | 150,000/mo |
| Scale | $300/mo | 500,000/mo |
| BYO | $60/mo | Unlimited (your infrastructure) |

Contatos ilimitados em todos os planos — você paga por email enviado, não por subscriber.

## O que torna a Nitrosend diferente

- **AI-first**: Projetada para ser controlada por Claude, ChatGPT, Codex, Cursor, Gemini, Windsurf — não por uma pessoa clicando em um dashboard
- **Unified transactional + marketing**: Plataforma única para ambos, em infraestrutura separada
- **Automatic optimization**: Testa continuamente subject lines, horários de envio e conteúdo com base em engajamento
- **Auto-configured deliverability**: DKIM, SPF, DMARC e warmup de IP dedicado gerenciados automaticamente
- **Migration-friendly**: Importação de Mailchimp, Klaviyo, ActiveCampaign e HubSpot

## Operações comuns do agente (via MCP)

### Criar uma sequência de email

```
"Create a 5-email onboarding sequence for new SaaS trial users.
Email 1: Welcome + what to do first (send immediately)
Email 2: Key feature highlight (day 2)
Email 3: Use case / success story (day 4)
Email 4: Check-in + support offer (day 7)
Email 5: Upgrade prompt (day 12)"
```

A Nitrosend cria a sequência, timing e envios — sem setup manual em dashboard.

### Enviar um email transacional

```
"Send a password reset email to user@example.com with a reset link valid for 1 hour."
```

### Criar uma campanha

```
"Create a re-engagement campaign for subscribers who haven't opened in 90 days.
Subject line variants: [A] 'We miss you', [B] 'Still interested in [topic]?'
Test both, send winner to remaining list after 4 hours."
```

### Verificar performance da sequência

```
"Show me open rates, click rates, and unsubscribes for the onboarding sequence."
```

### Importar uma lista

```
"Import this CSV of 2,000 subscribers from our Mailchimp export."
```

## Setup de deliverability

A Nitrosend faz isso automaticamente no signup:
- DKIM signing
- Configuração de registro SPF
- DMARC policy
- Provisionamento de IP dedicado (Pro+)
- Agenda de warmup de IP

Para usuários do plano BYO: use sua própria conta SendGrid, Postmark, SES ou Resend, e a Nitrosend roteia pela sua infraestrutura.

## Quando usar

- Criar sequências de email via AI sem mexer em dashboard
- Times que já usam Claude Code ou outras ferramentas de AI coding como fluxo principal
- Combinar transacional (password resets, receipts) e marketing (nurture, campaigns) em um só lugar
- Prototipação rápida de sequência — descreva a sequência e receba pronta
- Migrar de Mailchimp/Klaviyo e ter controle por AI daqui para frente

## Quando usar outra ferramenta

- **Customer.io** — se você precisa de lógica complexa de branching por eventos e triggers comportamentais
- **Klaviyo** — se você está em e-commerce e precisa de integração profunda com Shopify
- **Resend** — se você precisa apenas de transacional e prefere uma abordagem pura de API/código
- **Kit** — se você é creator ou newsletter-first

## Skills relevantes

- email-sequence
- onboarding-cro
- churn-prevention
- lead-magnets
