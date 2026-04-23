# Referência de Biblioteca de Eventos

Lista abrangente de eventos para rastrear por tipo de negócio e contexto.

## Índice
- Eventos do Site de Marketing (navegação e engajamento, interações com CTA e formulário, eventos de conversão)
- Eventos de Produto/App (onboarding, uso principal, erros e suporte)
- Eventos de Monetização (precificação e checkout, gerenciamento de assinatura)
- Eventos de E-commerce (navegação, carrinho, checkout, pós-compra)
- Eventos Específicos de B2B / SaaS (equipe e colaboração, eventos de integração, eventos de conta)
- Propriedades de Eventos (Parâmetros)
- Sequências de Eventos de Funil

## Eventos do Site de Marketing

### Navegação e Engajamento

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| page_view | Página carregada (aprimorado) | page_title, page_location, content_group |
| scroll_depth | Usuário rolou até o limite | depth (25, 50, 75, 100) |
| outbound_link_clicked | Clique para site externo | link_url, link_text |
| internal_link_clicked | Clique dentro do site | link_url, link_text, location |
| video_played | Vídeo iniciado | video_id, video_title, duration |
| video_completed | Vídeo concluído | video_id, video_title, duration |

### Interações com CTA e Formulário

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| cta_clicked | Call to action clicado | button_text, cta_location, page |
| form_started | Usuário iniciou formulário | form_name, form_location |
| form_field_completed | Campo preenchido | form_name, field_name |
| form_submitted | Formulário enviado com sucesso | form_name, form_location |
| form_error | Validação do formulário falhou | form_name, error_type |
| resource_downloaded | Recurso baixado | resource_name, resource_type |

### Eventos de Conversão

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| signup_started | Cadastro iniciado | source, page |
| signup_completed | Cadastro concluído | method, plan, source |
| demo_requested | Formulário de demo enviado | company_size, industry |
| contact_submitted | Formulário de contato enviado | inquiry_type |
| newsletter_subscribed | Inscrição na lista de e-mail | source, list_name |
| trial_started | Período de teste gratuito iniciado | plan, source |

---

## Eventos de Produto/App

### Onboarding

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| signup_completed | Conta criada | method, referral_source |
| onboarding_started | Onboarding iniciado | - |
| onboarding_step_completed | Etapa concluída | step_number, step_name |
| onboarding_completed | Todas as etapas concluídas | steps_completed, time_to_complete |
| onboarding_skipped | Usuário pulou o onboarding | step_skipped_at |
| first_key_action_completed | Momento "aha" alcançado | action_type |

### Uso Principal

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| session_started | Sessão do app iniciada | session_number |
| feature_used | Interação com funcionalidade | feature_name, feature_category |
| action_completed | Ação principal concluída | action_type, count |
| content_created | Usuário criou conteúdo | content_type |
| content_edited | Usuário modificou conteúdo | content_type |
| content_deleted | Usuário removeu conteúdo | content_type |
| search_performed | Busca no app | query, results_count |
| settings_changed | Configurações modificadas | setting_name, new_value |
| invite_sent | Usuário convidou outros | invite_type, count |

### Erros e Suporte

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| error_occurred | Erro ocorrido | error_type, error_message, page |
| help_opened | Ajuda acessada | help_type, page |
| support_contacted | Solicitação de suporte feita | contact_method, issue_type |
| feedback_submitted | Feedback do usuário enviado | feedback_type, rating |

---

## Eventos de Monetização

### Precificação e Checkout

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| pricing_viewed | Página de preços visualizada | source |
| plan_selected | Plano escolhido | plan_name, billing_cycle |
| checkout_started | Checkout iniciado | plan, value |
| payment_info_entered | Pagamento enviado | payment_method |
| purchase_completed | Compra realizada com sucesso | plan, value, currency, transaction_id |
| purchase_failed | Compra falhou | error_reason, plan |

### Gerenciamento de Assinatura

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| trial_started | Período de teste iniciado | plan, trial_length |
| trial_ended | Período de teste expirado | plan, converted (bool) |
| subscription_upgraded | Plano atualizado (upgrade) | from_plan, to_plan, value |
| subscription_downgraded | Plano rebaixado (downgrade) | from_plan, to_plan |
| subscription_cancelled | Cancelado | plan, reason, tenure |
| subscription_renewed | Renovado | plan, value |
| billing_updated | Método de pagamento alterado | - |

---

## Eventos de E-commerce

### Navegação

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| product_viewed | Página do produto visualizada | product_id, product_name, category, price |
| product_list_viewed | Categoria/lista visualizada | list_name, products[] |
| product_searched | Busca realizada | query, results_count |
| product_filtered | Filtros aplicados | filter_type, filter_value |
| product_sorted | Ordenação aplicada | sort_by, sort_order |

### Carrinho

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| product_added_to_cart | Item adicionado | product_id, product_name, price, quantity |
| product_removed_from_cart | Item removido | product_id, product_name, price, quantity |
| cart_viewed | Página do carrinho visualizada | cart_value, items_count |

### Checkout

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| checkout_started | Checkout iniciado | cart_value, items_count |
| checkout_step_completed | Etapa concluída | step_number, step_name |
| shipping_info_entered | Endereço inserido | shipping_method |
| payment_info_entered | Pagamento inserido | payment_method |
| coupon_applied | Cupom utilizado | coupon_code, discount_value |
| purchase_completed | Pedido realizado | transaction_id, value, currency, items[] |

### Pós-Compra

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| order_confirmed | Confirmação visualizada | transaction_id |
| refund_requested | Reembolso solicitado | transaction_id, reason |
| refund_completed | Reembolso processado | transaction_id, value |
| review_submitted | Produto avaliado | product_id, rating |

---

## Eventos Específicos de B2B / SaaS

### Equipe e Colaboração

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| team_created | Nova equipe/organização criada | team_size, plan |
| team_member_invited | Convite enviado | role, invite_method |
| team_member_joined | Membro aceitou | role |
| team_member_removed | Membro removido | role |
| role_changed | Permissões atualizadas | user_id, old_role, new_role |

### Eventos de Integração

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| integration_viewed | Página de integração visualizada | integration_name |
| integration_started | Configuração iniciada | integration_name |
| integration_connected | Conectado com sucesso | integration_name |
| integration_disconnected | Integração removida | integration_name, reason |

### Eventos de Conta

| Event Name | Descrição | Properties |
|------------|-------------|------------|
| account_created | Nova conta | source, plan |
| account_upgraded | Upgrade de plano | from_plan, to_plan |
| account_churned | Conta encerrada | reason, tenure, mrr_lost |
| account_reactivated | Cliente retornou | previous_tenure, new_plan |

---

## Propriedades de Eventos (Parâmetros)

### Propriedades Padrão a Incluir

**Contexto do Usuário:**
```
user_id: "12345"
user_type: "free" | "trial" | "paid"
account_id: "acct_123"
plan_type: "starter" | "pro" | "enterprise"
```

**Contexto da Sessão:**
```
session_id: "sess_abc"
session_number: 5
page: "/pricing"
referrer: "https://google.com"
```

**Contexto de Campanha:**
```
source: "google"
medium: "cpc"
campaign: "spring_sale"
content: "hero_cta"
```

**Contexto de Produto (E-commerce):**
```
product_id: "SKU123"
product_name: "Product Name"
category: "Category"
price: 99.99
quantity: 1
currency: "USD"
```

**Temporização:**
```
timestamp: "2024-01-15T10:30:00Z"
time_on_page: 45
session_duration: 300
```

---

## Sequências de Eventos de Funil

### Funil de Cadastro
1. signup_started
2. signup_step_completed (email)
3. signup_step_completed (password)
4. signup_completed
5. onboarding_started

### Funil de Compra
1. pricing_viewed
2. plan_selected
3. checkout_started
4. payment_info_entered
5. purchase_completed

### Funil de E-commerce
1. product_viewed
2. product_added_to_cart
3. cart_viewed
4. checkout_started
5. shipping_info_entered
6. payment_info_entered
7. purchase_completed
