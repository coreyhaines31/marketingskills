# Referência de Implementação do Google Tag Manager

Guia detalhado para implementação de rastreamento via Google Tag Manager.

## Índice
- Estrutura do Container (tags, triggers, variables)
- Convenções de Nomenclatura
- Padrões de Data Layer
- Configurações Comuns de Tags (tag de configuração GA4, tag de evento GA4, Facebook pixel)
- Preview e Debug
- Workspaces e Versionamento
- Gerenciamento de Consentimento
- Padrões Avançados (sequenciamento de tags, tratamento de exceções, variáveis JavaScript personalizadas)

## Estrutura do Container

### Tags

Tags são trechos de código que executam quando disparados.

**Tipos comuns de tags:**
- GA4 Configuration (configuração base)
- GA4 Event (eventos personalizados)
- Google Ads Conversion
- Facebook Pixel
- LinkedIn Insight Tag
- Custom HTML (para outros pixels)

### Triggers

Triggers definem quando as tags disparam.

**Triggers integrados:**
- Page View: All Pages, DOM Ready, Window Loaded
- Click: All Elements, Just Links
- Form Submission
- Scroll Depth
- Timer
- Element Visibility

**Triggers personalizados:**
- Custom Event (do dataLayer)
- Trigger Groups (múltiplas condições)

### Variables

Variables capturam valores dinâmicos.

**Integradas (habilitar conforme necessário):**
- Click Text, Click URL, Click ID, Click Classes
- Page Path, Page URL, Page Hostname
- Referrer
- Form Element, Form ID

**Definidas pelo usuário:**
- Variables de Data Layer
- Variables JavaScript
- Lookup tables
- Tabelas RegEx
- Constantes

---

## Convenções de Nomenclatura

### Formato Recomendado

```
[Type] - [Description] - [Detail]

Tags:
GA4 - Event - Signup Completed
GA4 - Config - Base Configuration
FB - Pixel - Page View
HTML - LiveChat Widget

Triggers:
Click - CTA Button
Submit - Contact Form
View - Pricing Page
Custom - signup_completed

Variables:
DL - user_id
JS - Current Timestamp
LT - Campaign Source Map
```

---

## Padrões de Data Layer

### Estrutura Básica

```javascript
// Initialize (in <head> before GTM)
window.dataLayer = window.dataLayer || [];

// Push event
dataLayer.push({
  'event': 'event_name',
  'property1': 'value1',
  'property2': 'value2'
});
```

### Dados no Carregamento da Página

```javascript
// Set on page load (before GTM container)
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'pageType': 'product',
  'contentGroup': 'products',
  'user': {
    'loggedIn': true,
    'userId': '12345',
    'userType': 'premium'
  }
});
```

### Envio de Formulário

```javascript
document.querySelector('#contact-form').addEventListener('submit', function() {
  dataLayer.push({
    'event': 'form_submitted',
    'formName': 'contact',
    'formLocation': 'footer'
  });
});
```

### Clique em Botão

```javascript
document.querySelector('.cta-button').addEventListener('click', function() {
  dataLayer.push({
    'event': 'cta_clicked',
    'ctaText': this.innerText,
    'ctaLocation': 'hero'
  });
});
```

### Eventos de E-commerce

```javascript
// Product view
dataLayer.push({ ecommerce: null }); // Clear previous
dataLayer.push({
  'event': 'view_item',
  'ecommerce': {
    'items': [{
      'item_id': 'SKU123',
      'item_name': 'Product Name',
      'price': 99.99,
      'item_category': 'Category',
      'quantity': 1
    }]
  }
});

// Add to cart
dataLayer.push({ ecommerce: null });
dataLayer.push({
  'event': 'add_to_cart',
  'ecommerce': {
    'items': [{
      'item_id': 'SKU123',
      'item_name': 'Product Name',
      'price': 99.99,
      'quantity': 1
    }]
  }
});

// Purchase
dataLayer.push({ ecommerce: null });
dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'T12345',
    'value': 99.99,
    'currency': 'USD',
    'tax': 5.00,
    'shipping': 10.00,
    'items': [{
      'item_id': 'SKU123',
      'item_name': 'Product Name',
      'price': 99.99,
      'quantity': 1
    }]
  }
});
```

---

## Configurações Comuns de Tags

### Tag de Configuração GA4

**Tipo de Tag:** Google Analytics: GA4 Configuration

**Configurações:**
- Measurement ID: G-XXXXXXXX
- Send page view: Marcado (para pageviews)
- User Properties: Adicione dimensões de nível de usuário

**Trigger:** All Pages

### Tag de Evento GA4

**Tipo de Tag:** Google Analytics: GA4 Event

**Configurações:**
- Configuration Tag: Selecione sua tag de configuração
- Event Name: {{DL - event_name}} ou valor fixo
- Event Parameters: Adicione parâmetros do dataLayer

**Trigger:** Custom Event com correspondência de nome do evento

### Facebook Pixel - Base

**Tipo de Tag:** Custom HTML

```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

**Trigger:** All Pages

### Facebook Pixel - Evento

**Tipo de Tag:** Custom HTML

```html
<script>
  fbq('track', 'Lead', {
    content_name: '{{DL - form_name}}'
  });
</script>
```

**Trigger:** Custom Event - form_submitted

---

## Preview e Debug

### Modo de Preview

1. Clique em "Preview" no GTM
2. Insira a URL do site
3. O painel de debug do GTM abre na parte inferior

**O que verificar:**
- Tags disparadas neste evento
- Tags não disparadas (e por quê)
- Variables e seus valores
- Conteúdo do data layer

### Dicas de Debug

**Tag não disparando:**
- Verifique as condições do trigger
- Confirme o push no data layer
- Verifique o sequenciamento de tags

**Valor incorreto na variable:**
- Verifique a estrutura do data layer
- Confirme o caminho da variable (objetos aninhados)
- Verifique o timing (os dados podem ainda não existir)

**Disparos múltiplos:**
- Verifique a unicidade do trigger
- Procure tags duplicadas
- Verifique as opções de disparo da tag

---

## Workspaces e Versionamento

### Workspaces

Use workspaces para colaboração em equipe:
- Workspace padrão para produção
- Workspaces separados para grandes mudanças
- Mescle quando estiver pronto

### Gerenciamento de Versões

**Boas práticas:**
- Nomeie cada versão de forma descritiva
- Adicione notas explicando as alterações
- Revise as mudanças antes de publicar
- Mantenha a versão de produção registrada

**Exemplo de notas de versão:**
```
v15: Added purchase conversion tracking
- New tag: GA4 - Event - Purchase
- New trigger: Custom Event - purchase
- New variables: DL - transaction_id, DL - value
- Tested: Chrome, Safari, Mobile
```

---

## Gerenciamento de Consentimento

### Integração com Consent Mode

```javascript
// Default state (before consent)
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied'
});

// Update on consent
function grantConsent() {
  gtag('consent', 'update', {
    'analytics_storage': 'granted',
    'ad_storage': 'granted'
  });
}
```

### Visão Geral do Consentimento no GTM

1. Habilitar Consent Overview no Admin
2. Configurar o consentimento para cada tag
3. As tags respeitam automaticamente o estado do consentimento

---

## Padrões Avançados

### Sequenciamento de Tags

**Configure tags para disparar em ordem:**
Tag Configuration > Advanced Settings > Tag Sequencing

**Casos de uso:**
- Tag de configuração antes das tags de evento
- Inicialização de pixel antes do rastreamento
- Limpeza após conversão

### Tratamento de Exceções

**Exceções de trigger** — Impedem que a tag dispare:
- Excluir determinadas páginas
- Excluir tráfego interno
- Excluir durante testes

### Variables JavaScript Personalizadas

```javascript
// Get URL parameter
function() {
  var params = new URLSearchParams(window.location.search);
  return params.get('campaign') || '(not set)';
}

// Get cookie value
function() {
  var match = document.cookie.match('(^|;) ?user_id=([^;]*)(;|$)');
  return match ? match[2] : null;
}

// Get data from page
function() {
  var el = document.querySelector('.product-price');
  return el ? parseFloat(el.textContent.replace('$', '')) : 0;
}
```
