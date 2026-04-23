# Introw PRM

Plataforma de Partner Relationship Management para gerenciar parceiros de canal, rastrear deals originados por parceiros, comissões, tarefas e engajamento — com geração de business review embutida.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | - | Não disponível |
| MCP | ✓ | Leitura/escrita completa via conector do Claude |
| CLI | - | Não disponível |
| SDK | - | Não disponível |

## Autenticação

- **Tipo**: OAuth2 (via MCP connector)
- **Configuração**: Conecte via Claude MCP connector — não é necessário gerenciar API key
- **Scope**: Todos os dados são limitados à organização autenticada

## Operações comuns de agent

Todas as operações são realizadas via ferramentas MCP. A seguir estão as principais chamadas disponíveis.

### Pesquisar parceiros

```
search_partners
  dateRange: { field: "CREATED_AT" | "LAST_ACTIVITY_AT", from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
```

Retorna: nome/ID do parceiro, informações de contato, tier, estágio de lifecycle, categorias, país, data da última atividade.

### Pesquisar objetos de CRM (Deals, Tickets, Leads, Companies, Contacts)

```
search_crm_objects
  objectType: "DEAL" | "TICKET" | "LEAD" | "COMPANY" | "CONTACT"
  stage: "OPEN" | "WON" | "LOST"
  view: "ALL" | "DUE" | "OVERDUE" | "INACTIVE"
  rollingDateFilter: { field: "CLOSED_AT", value: "THIS_QUARTER" }
  sortBy: { property: "AMOUNT", direction: "DESC" }
  limit: 10
```

Mapeamento de sinônimos: Opportunity/Forecast → `DEAL`, Account → `COMPANY`, Case → `TICKET`.

### Pesquisar tarefas

```
search_tasks
  status: "TODO" | "IN_PROGRESS" | "PENDING" | "COMPLETED" | "DONE"
  partnerId: "{partner_id}"
```

### Pesquisar comissões

```
search_commissions
  partnerId: "{partner_id}"
```

Retorna: valores de comissão, moeda, status de pagamento, parceiro e deals associados.

### Gerar Business Review (QBR/MBR/WBR)

```
generate_business_review
  duration: "QUARTERLY" | "MONTHLY" | "WEEKLY"
  partnerId: "{partner_id}"
```

Retorna: análise de pipeline e forecast, visão geral de envios de formulário, plano de ação mútuo, acompanhamento de metas, agenda com tempo e próximos passos.

### Pesquisar engajamento de parceiros

```
search_partner_engagement
  partnerId: "{partner_id}"
  type: "ROOM_VISIT" | "OBJECT_SHARE" | "COMMENT" | "FORM_SUBMIT" | "TASK_CREATED" | ...
  dateRange: { from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
```

Retorna: comentários, atualizações de deals, visualizações de assets, eventos de tarefas, visitas ao portal, envios de formulário, anúncios e cotações.

### Adicionar comentário a Deal/Object

```
add_comment
  comment: "Comment text"
  objectId: "{crm_object_id}"
  objectType: "DEAL" | "TICKET" | "LEAD" | "COMPANY" | "CONTACT"
```

### Criar ou atualizar tarefas

```
add_task
  name: "Task title"
  dueDate: "2025-02-20"
  assignedTo: "PARTNER" | "ORGANISATION"
  partnerId: "{partner_id}"

update_task
  taskId: 123
  status: "TODO" | "IN_PROGRESS" | "DONE"
```

### Atualizar propriedades de objeto de CRM

```
update_crm_object
  objectId: "{crm_object_id}"
  objectType: "DEAL"
  propertiesToUpdate: { "amount": 50000, "stage": "Negotiation" }
```

### Compartilhar lead ou registrar deal

Fluxo em duas etapas:
1. **Discovery**: forneça `objectType` e `callToAction` para obter campos do formulário
2. **Submit**: forneça `formId` e `userProvidedData` para enviar

```
share_lead_or_register_deal
  objectType: "Deal"
  callToAction: "Register Deal"
  partnerId: "{partner_id}"
```

## Métricas principais

### Dados de parceiro
- `id` - ID do parceiro
- `name` - Nome da empresa parceira
- `championEmail` - Email do contato principal
- `tier` - Nível de tier atual
- `lifecycleStage` - Estágio de lifecycle do parceiro
- `categories` - Categorias do parceiro
- `country` - País do parceiro
- `lastActivityAt` - Data da última atividade

### Dados de objeto de CRM
- `objectId` - ID externo no CRM
- `objectType` - DEAL, TICKET, LEAD, COMPANY, CONTACT
- `stage` - OPEN, WON, LOST
- `amount` - Valor do deal
- `closeDate` - Data prevista de fechamento

### Dados de comissão
- `amount` - Valor da comissão
- `currency` - Moeda de pagamento
- `paymentStatus` - Status atual do pagamento
- `partnerId` - Parceiro associado
- `dealId` - Deal associado

### Dados de engajamento
- `type` - Tipo de atividade (ROOM_VISIT, COMMENT, FORM_SUBMIT etc.)
- `partnerId` - Parceiro envolvido
- `crmObjectId` - Objeto de CRM relacionado
- `createdAt` - Timestamp da atividade

## Quando usar

- Gerenciar relacionamento com parceiros de canal e rastrear atividade dos parceiros
- Revisar pipeline originado por parceiros (deals, leads, opportunities)
- Preparar reuniões QBR/MBR/WBR com geração automatizada de business review
- Acompanhar comissões e pagamentos de parceiros
- Gerenciar planos de ação mútuos via tarefas atribuídas a parceiros ou times internos
- Processar registros de deals e compartilhamento de leads de parceiros
- Monitorar engajamento no portal de parceiros e visualizações de assets de conteúdo

## Limites de taxa

- Limites de taxa gerenciados pelo MCP connector
- Todos os dados limitados à organização autenticada

## Habilidades relevantes

- revops
- sales-enablement
- referral-program
- competitor-alternatives
