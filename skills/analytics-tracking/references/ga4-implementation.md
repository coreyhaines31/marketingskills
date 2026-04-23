# Referência de Implementação do GA4

Guia de implementação detalhado para Google Analytics 4.

## Índice
- Configuração (data streams, eventos de enhanced measurement, eventos recomendados)
- Eventos Personalizados (implementação gtag.js, Google Tag Manager)
- Configuração de Conversões (criando conversões, valores de conversão)
- Dimensões e Métricas Personalizadas (quando usar, etapas de configuração, exemplos)
- Audiências (criando audiências, exemplos de audiências)
- Depuração (DebugView, relatórios em tempo real, problemas comuns)
- Qualidade dos Dados (filtros, rastreamento entre domínios, configurações de sessão)
- Integração com Google Ads (vinculação, exportação de audiências)

## Configuração

### Data Streams

- Um stream por plataforma (web, iOS, Android)
- Habilitar enhanced measurement para rastreamento automático
- Configurar retenção de dados (2 meses padrão, 14 meses máximo)
- Habilitar Google Signals (para cross-device, se houver consentimento)

### Eventos de Enhanced Measurement (Automáticos)

| Evento | Descrição | Configuração |
|-------|-------------|---------------|
| page_view | Carregamento de página | Automático |
| scroll | 90% de profundidade de rolagem | Ativar/desativar |
| outbound_click | Clique para domínio externo | Automático |
| site_search | Consulta de busca utilizada | Configurar parâmetro |
| video_engagement | Reprodução de vídeo do YouTube | Ativar/desativar |
| file_download | PDF, documentos, etc. | Extensões configuráveis |

### Eventos Recomendados

Use os eventos predefinidos do Google quando possível para relatórios aprimorados:

**Todas as propriedades:**
- login, sign_up
- share
- search

**E-commerce:**
- view_item, view_item_list
- add_to_cart, remove_from_cart
- begin_checkout
- add_payment_info
- purchase, refund

**Jogos:**
- level_up, unlock_achievement
- post_score, spend_virtual_currency

Referência: https://support.google.com/analytics/answer/9267735

---

## Eventos Personalizados

### Implementação gtag.js

```javascript
// Basic event
gtag('event', 'signup_completed', {
  'method': 'email',
  'plan': 'free'
});

// Event with value
gtag('event', 'purchase', {
  'transaction_id': 'T12345',
  'value': 99.99,
  'currency': 'USD',
  'items': [{
    'item_id': 'SKU123',
    'item_name': 'Product Name',
    'price': 99.99
  }]
});

// User properties
gtag('set', 'user_properties', {
  'user_type': 'premium',
  'plan_name': 'pro'
});

// User ID (for logged-in users)
gtag('config', 'GA_MEASUREMENT_ID', {
  'user_id': 'USER_ID'
});
```

### Google Tag Manager (dataLayer)

```javascript
// Custom event
dataLayer.push({
  'event': 'signup_completed',
  'method': 'email',
  'plan': 'free'
});

// Set user properties
dataLayer.push({
  'user_id': '12345',
  'user_type': 'premium'
});

// E-commerce purchase
dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'T12345',
    'value': 99.99,
    'currency': 'USD',
    'items': [{
      'item_id': 'SKU123',
      'item_name': 'Product Name',
      'price': 99.99,
      'quantity': 1
    }]
  }
});

// Clear ecommerce before sending (best practice)
dataLayer.push({ ecommerce: null });
dataLayer.push({
  'event': 'view_item',
  'ecommerce': {
    // ...
  }
});
```

---

## Configuração de Conversões

### Criando Conversões

1. **Colete o evento** — Garanta que o evento esteja disparando no GA4
2. **Marque como conversão** — Admin > Events > Mark as conversion
3. **Defina o método de contagem**:
   - Uma vez por sessão (leads, cadastros)
   - Cada evento (compras)
4. **Importe para o Google Ads** — Para lances otimizados por conversão

### Valores de Conversão

```javascript
// Event with conversion value
gtag('event', 'purchase', {
  'value': 99.99,
  'currency': 'USD'
});
```

Ou defina o valor padrão no GA4 Admin ao marcar a conversão.

---

## Dimensões e Métricas Personalizadas

### Quando Usar

**Dimensões personalizadas:**
- Propriedades pelas quais você deseja segmentar/filtrar
- Atributos do usuário (tipo de plano, setor)
- Atributos de conteúdo (autor, categoria)

**Métricas personalizadas:**
- Valores numéricos para agregar
- Pontuações, contagens, durações

### Etapas de Configuração

1. Admin > Data display > Custom definitions
2. Criar dimensão ou métrica
3. Escolher o escopo:
   - **Event**: Por evento (content_type)
   - **User**: Por usuário (account_type)
   - **Item**: Por produto (product_category)
4. Inserir nome do parâmetro (deve corresponder ao parâmetro do evento)

### Exemplos

| Dimensão | Escopo | Parâmetro | Descrição |
|-----------|-------|-----------|-------------|
| User Type | User | user_type | Free, trial, paid |
| Content Author | Event | author | Autor do post do blog |
| Product Category | Item | item_category | Categoria de e-commerce |

---

## Audiências

### Criando Audiências

Admin > Data display > Audiences

**Casos de uso:**
- Audiências de remarketing (exportar para Ads)
- Análise de segmentos
- Eventos baseados em trigger

### Exemplos de Audiências

**Visitantes de alta intenção:**
- Visualizou página de preços
- Não converteu
- Nos últimos 7 dias

**Usuários engajados:**
- 3+ sessões
- Ou 5+ minutos de engajamento total

**Compradores:**
- Evento de compra
- Para exclusão ou lookalike

---

## Depuração

### DebugView

Habilitar com:
- Parâmetro de URL: `?debug_mode=true`
- Extensão do Chrome: GA Debugger
- gtag: `'debug_mode': true` na configuração

Visualizar em: Reports > Configure > DebugView

### Relatórios em Tempo Real

Verifique eventos nos últimos 30 minutos:
Reports > Real-time

### Problemas Comuns

**Eventos não aparecendo:**
- Verifique o DebugView primeiro
- Confirme o disparo do gtag/GTM
- Verifique exclusões de filtro

**Valores de parâmetros ausentes:**
- Dimensão personalizada não criada
- Nome do parâmetro não corresponde
- Dados ainda sendo processados (24-48 h)

**Conversões não registrando:**
- Evento não marcado como conversão
- Nome do evento não corresponde
- Método de contagem (uma vez vs. cada)

---

## Qualidade dos Dados

### Filtros

Admin > Data streams > [Stream] > Configure tag settings > Define internal traffic

**Excluir:**
- Endereços IP internos
- Tráfego de desenvolvedores
- Ambientes de teste

### Rastreamento Entre Domínios

Para múltiplos domínios compartilhando analytics:

1. Admin > Data streams > [Stream] > Configure tag settings
2. Configure seus domínios
3. Liste todos os domínios que devem compartilhar sessões

### Configurações de Sessão

Admin > Data streams > [Stream] > Configure tag settings

- Timeout de sessão (padrão 30 min)
- Duração de sessão engajada (padrão 10 seg)

---

## Integração com Google Ads

### Vinculação

1. Admin > Product links > Google Ads links
2. Habilitar auto-tagging no Google Ads
3. Importar conversões no Google Ads

### Exportação de Audiências

Audiências criadas no GA4 podem ser usadas no Google Ads para:
- Campanhas de remarketing
- Customer match
- Similar audiences
