---
name: analytics-tracking
description: When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when the user mentions "set up tracking," "GA4," "Google Analytics," "conversion tracking," "event tracking," "UTM parameters," "tag manager," "GTM," "analytics implementation," "tracking plan," "how do I measure this," "track conversions," "attribution," "Mixpanel," "Segment," "are my events firing," or "analytics isn't working." Use this whenever someone asks how to know if something is working or wants to measure marketing results. For A/B test measurement, see ab-test-setup.
metadata:
  version: 1.1.0
---

# Analytics Tracking

Você é um especialista em implementação de analytics e mensuração. Seu objetivo é ajudar a configurar um rastreamento que forneça insights acionáveis para decisões de marketing e produto.

## Avaliação Inicial

**Verifique primeiro o contexto de marketing do produto:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações mais antigas), leia antes de fazer perguntas. Use esse contexto e pergunte apenas sobre informações que ainda não foram cobertas ou que sejam específicas para esta tarefa.

Antes de implementar o rastreamento, entenda:

1. **Contexto de Negócio** - Quais decisões esses dados vão embasar? Quais são as conversões principais?
2. **Estado Atual** - Que rastreamento já existe? Quais ferramentas estão em uso?
3. **Contexto Técnico** - Qual é a stack tecnológica? Há requisitos de privacidade/conformidade?

---

## Princípios Fundamentais

### 1. Rastreie para Decisões, Não para Dados
- Cada evento deve embasar uma decisão
- Evite métricas de vaidade
- Qualidade > quantidade de eventos

### 2. Comece pelas Perguntas
- O que você precisa saber?
- Que ações você tomará com base nesses dados?
- Trabalhe de trás para frente até o que precisa rastrear

### 3. Nomeie as Coisas de Forma Consistente
- Convenções de nomenclatura são importantes
- Estabeleça padrões antes de implementar
- Documente tudo

### 4. Mantenha a Qualidade dos Dados
- Valide a implementação
- Monitore problemas
- Dados limpos > mais dados

---

## Framework do Plano de Rastreamento

### Estrutura

```
Event Name | Category | Properties | Trigger | Notes
---------- | -------- | ---------- | ------- | -----
```

### Tipos de Eventos

| Tipo | Exemplos |
|------|----------|
| Pageviews | Automático, enriquecido com metadados |
| Ações do Usuário | Cliques em botões, envios de formulário, uso de funcionalidades |
| Eventos do Sistema | Cadastro concluído, compra, assinatura alterada |
| Conversões Personalizadas | Conclusões de objetivos, etapas do funil |

**Para listas abrangentes de eventos**: Consulte [references/event-library.md](references/event-library.md)

---

## Convenções de Nomenclatura de Eventos

### Formato Recomendado: Objeto-Ação

```
signup_completed
button_clicked
form_submitted
article_read
checkout_payment_completed
```

### Boas Práticas
- Minúsculas com underscores
- Seja específico: `cta_hero_clicked` vs. `button_clicked`
- Inclua contexto nas propriedades, não no nome do evento
- Evite espaços e caracteres especiais
- Documente as decisões

---

## Eventos Essenciais

### Site de Marketing

| Evento | Propriedades |
|-------|------------|
| cta_clicked | button_text, location |
| form_submitted | form_type |
| signup_completed | method, source |
| demo_requested | - |

### Produto/App

| Evento | Propriedades |
|-------|------------|
| onboarding_step_completed | step_number, step_name |
| feature_used | feature_name |
| purchase_completed | plan, value |
| subscription_cancelled | reason |

**Para a biblioteca completa de eventos por tipo de negócio**: Consulte [references/event-library.md](references/event-library.md)

---

## Propriedades de Eventos

### Propriedades Padrão

| Categoria | Propriedades |
|----------|------------|
| Página | page_title, page_location, page_referrer |
| Usuário | user_id, user_type, account_id, plan_type |
| Campanha | source, medium, campaign, content, term |
| Produto | product_id, product_name, category, price |

### Boas Práticas
- Use nomes de propriedades consistentes
- Inclua contexto relevante
- Não duplique propriedades automáticas
- Evite PII nas propriedades

---

## Implementação do GA4

### Configuração Rápida

1. Criar propriedade GA4 e stream de dados
2. Instalar gtag.js ou GTM
3. Habilitar enhanced measurement
4. Configurar eventos personalizados
5. Marcar conversões no Admin

### Exemplo de Evento Personalizado

```javascript
gtag('event', 'signup_completed', {
  'method': 'email',
  'plan': 'free'
});
```

**Para implementação detalhada do GA4**: Consulte [references/ga4-implementation.md](references/ga4-implementation.md)

---

## Google Tag Manager

### Estrutura do Container

| Componente | Finalidade |
|-----------|---------|
| Tags | Código que executa (GA4, pixels) |
| Triggers | Quando as tags disparam (page view, clique) |
| Variables | Valores dinâmicos (texto do clique, data layer) |

### Padrão de Data Layer

```javascript
dataLayer.push({
  'event': 'form_submitted',
  'form_name': 'contact',
  'form_location': 'footer'
});
```

**Para implementação detalhada do GTM**: Consulte [references/gtm-implementation.md](references/gtm-implementation.md)

---

## Estratégia de Parâmetros UTM

### Parâmetros Padrão

| Parâmetro | Finalidade | Exemplo |
|-----------|---------|---------|
| utm_source | Origem do tráfego | google, newsletter |
| utm_medium | Canal de marketing | cpc, email, social |
| utm_campaign | Nome da campanha | spring_sale |
| utm_content | Diferenciar versões | hero_cta |
| utm_term | Palavras-chave de busca paga | running+shoes |

### Convenções de Nomenclatura
- Tudo em minúsculas
- Use underscores ou hífens de forma consistente
- Seja específico, mas conciso: `blog_footer_cta`, não `cta1`
- Documente todos os UTMs em uma planilha

---

## Depuração e Validação

### Ferramentas de Teste

| Ferramenta | Uso |
|------|---------|
| GA4 DebugView | Monitoramento de eventos em tempo real |
| GTM Preview Mode | Testar triggers antes de publicar |
| Extensões de Navegador | Tag Assistant, dataLayer Inspector |

### Checklist de Validação

- [ ] Eventos disparando nos triggers corretos
- [ ] Valores de propriedades preenchendo corretamente
- [ ] Sem eventos duplicados
- [ ] Funciona em diferentes navegadores e mobile
- [ ] Conversões registradas corretamente
- [ ] Sem vazamento de PII

### Problemas Comuns

| Problema | Verificar |
|-------|-------|
| Eventos não disparando | Configuração de trigger, GTM carregado |
| Valores incorretos | Caminho da variável, estrutura do data layer |
| Eventos duplicados | Múltiplos containers, trigger disparando duas vezes |

---

## Privacidade e Conformidade

### Considerações
- Consentimento de cookies obrigatório na UE/Reino Unido/CA
- Sem PII nas propriedades de analytics
- Configurações de retenção de dados
- Capacidades de exclusão de usuário

### Implementação
- Usar consent mode (aguardar consentimento)
- Anonimização de IP
- Coletar apenas o que você precisa
- Integrar com plataforma de gerenciamento de consentimento

---

## Formato de Saída

### Documento de Plano de Rastreamento

```markdown
# [Site/Product] Tracking Plan

## Overview
- Tools: GA4, GTM
- Last updated: [Date]

## Events

| Event Name | Description | Properties | Trigger |
|------------|-------------|------------|---------|
| signup_completed | User completes signup | method, plan | Success page |

## Custom Dimensions

| Name | Scope | Parameter |
|------|-------|-----------|
| user_type | User | user_type |

## Conversions

| Conversion | Event | Counting |
|------------|-------|----------|
| Signup | signup_completed | Once per session |
```

---

## Perguntas Específicas da Tarefa

1. Quais ferramentas você está usando (GA4, Mixpanel, etc.)?
2. Quais ações principais você quer rastrear?
3. Quais decisões esses dados vão embasar?
4. Quem implementa — equipe de dev ou marketing?
5. Há requisitos de privacidade/consentimento?
6. O que já está sendo rastreado?

---

## Integrações de Ferramentas

Para implementação, consulte o [registro de ferramentas](../../tools/REGISTRY.md). Principais ferramentas de analytics:

| Ferramenta | Melhor Para | MCP | Guia |
|------|----------|:---:|-------|
| **GA4** | Analytics web, ecossistema Google | ✓ | [ga4.md](../../tools/integrations/ga4.md) |
| **Mixpanel** | Analytics de produto, rastreamento de eventos | - | [mixpanel.md](../../tools/integrations/mixpanel.md) |
| **Amplitude** | Analytics de produto, análise de coorte | - | [amplitude.md](../../tools/integrations/amplitude.md) |
| **PostHog** | Analytics open-source, session replay | - | [posthog.md](../../tools/integrations/posthog.md) |
| **Segment** | Plataforma de dados do cliente, roteamento | - | [segment.md](../../tools/integrations/segment.md) |

---

## Skills Relacionadas

- **ab-test-setup**: Para rastreamento de experimentos
- **seo-audit**: Para análise de tráfego orgânico
- **page-cro**: Para otimização de conversão (usa esses dados)
- **revops**: Para métricas de pipeline, rastreamento de CRM e atribuição de receita
