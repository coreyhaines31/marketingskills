# Shopify

Plataforma de e-commerce para lojas online e varejo.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST Admin API, Storefront API, GraphQL |
| MCP | - | Não disponível |
| CLI | ✓ | Shopify CLI para temas e apps |
| SDK | ✓ | Bibliotecas oficiais para múltiplas linguagens |

## Autenticação

- **Tipo**: Access Token (Custom App or OAuth)
- **Header**: `X-Shopify-Access-Token: {access_token}`
- **Base URL**: `https://{shop}.myshopify.com/admin/api/2024-01/`

## Operações Comuns do Agente

### Obter informações da loja

```bash
GET https://{shop}.myshopify.com/admin/api/2024-01/shop.json

X-Shopify-Access-Token: {access_token}
```

### Listar produtos

```bash
GET https://{shop}.myshopify.com/admin/api/2024-01/products.json?limit=50

X-Shopify-Access-Token: {access_token}
```

### Obter produto

```bash
GET https://{shop}.myshopify.com/admin/api/2024-01/products/{product_id}.json

X-Shopify-Access-Token: {access_token}
```

### Criar produto

```bash
POST https://{shop}.myshopify.com/admin/api/2024-01/products.json

X-Shopify-Access-Token: {access_token}

{
  "product": {
    "title": "Product Name",
    "body_html": "<p>Description</p>",
    "vendor": "Brand",
    "product_type": "Category",
    "variants": [{
      "price": "99.00",
      "sku": "SKU-001"
    }]
  }
}
```

### Listar pedidos

```bash
GET https://{shop}.myshopify.com/admin/api/2024-01/orders.json?status=any&limit=50

X-Shopify-Access-Token: {access_token}
```

### Obter pedido

```bash
GET https://{shop}.myshopify.com/admin/api/2024-01/orders/{order_id}.json

X-Shopify-Access-Token: {access_token}
```

### Listar clientes

```bash
GET https://{shop}.myshopify.com/admin/api/2024-01/customers.json?limit=50

X-Shopify-Access-Token: {access_token}
```

### Buscar clientes

```bash
GET https://{shop}.myshopify.com/admin/api/2024-01/customers/search.json?query=email:user@example.com

X-Shopify-Access-Token: {access_token}
```

### Obter analytics

```bash
GET https://{shop}.myshopify.com/admin/api/2024-01/reports.json

X-Shopify-Access-Token: {access_token}
```

## API GraphQL

```graphql
{
  products(first: 10) {
    edges {
      node {
        id
        title
        totalInventory
        priceRangeV2 {
          minVariantPrice {
            amount
          }
        }
      }
    }
  }
}
```

## Comandos CLI

```bash
# Login
shopify login --store={shop}

# Create theme
shopify theme init

# Push theme
shopify theme push

# Preview theme
shopify theme dev

# Create app
shopify app create node
```

## Webhook Topics

| Tópico | Quando |
|-------|------|
| `orders/create` | New order |
| `orders/paid` | Order paid |
| `orders/fulfilled` | Order shipped |
| `customers/create` | New customer |
| `products/update` | Product changed |
| `checkouts/create` | Checkout started |

## Quando Usar

- E-commerce store management
- Product catalog operations
- Order processing
- Customer data management
- Inventory tracking

## Limites de Taxa

- REST: 2 requests/second
- GraphQL: 50 points/second
- Bulk operations available

## Skills Relevantes

- analytics-tracking
- email-sequence
- referral-program
