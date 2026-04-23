# Webflow

Plataforma visual de web design e CMS para sites de marketing.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | API REST para sites, CMS e formulários |
| MCP | - | Não disponível |
| CLI | ✓ | Webflow CLI para devlink e apps |
| SDK | ✓ | SDK oficial para Node.js |

## Autenticação

- **Tipo**: API Token (Site token ou OAuth)
- **Header**: `Authorization: Bearer {api_token}`
- **Get token**: Configurações do Site > Integrations > API Access

## Operações Comuns do Agente

### Listar sites

```bash
GET https://api.webflow.com/v2/sites

Authorization: Bearer {api_token}
```

### Obter site

```bash
GET https://api.webflow.com/v2/sites/{site_id}

Authorization: Bearer {api_token}
```

### Listar coleções

```bash
GET https://api.webflow.com/v2/sites/{site_id}/collections

Authorization: Bearer {api_token}
```

### Listar itens da coleção

```bash
GET https://api.webflow.com/v2/collections/{collection_id}/items

Authorization: Bearer {api_token}
```

### Obter item da coleção

```bash
GET https://api.webflow.com/v2/collections/{collection_id}/items/{item_id}

Authorization: Bearer {api_token}
```

### Criar item da coleção

```bash
POST https://api.webflow.com/v2/collections/{collection_id}/items

Authorization: Bearer {api_token}

{
  "fieldData": {
    "name": "Item Name",
    "slug": "item-name",
    "custom-field": "value"
  }
}
```

### Atualizar item da coleção

```bash
PATCH https://api.webflow.com/v2/collections/{collection_id}/items/{item_id}

Authorization: Bearer {api_token}

{
  "fieldData": {
    "custom-field": "new value"
  }
}
```

### Publicar itens da coleção

```bash
POST https://api.webflow.com/v2/collections/{collection_id}/items/publish

Authorization: Bearer {api_token}

{
  "itemIds": ["item_id_1", "item_id_2"]
}
```

### Listar envios de formulário

```bash
GET https://api.webflow.com/v2/sites/{site_id}/forms/{form_id}/submissions

Authorization: Bearer {api_token}
```

### Publicar site

```bash
POST https://api.webflow.com/v2/sites/{site_id}/publish

Authorization: Bearer {api_token}

{
  "publishToWebflowSubdomain": true,
  "publishToCustomDomains": true
}
```

## SDK Node.js

```javascript
const Webflow = require('webflow-api');

const webflow = new Webflow({ token: 'api_token' });

// List sites
const sites = await webflow.sites.list();

// Get collection items
const items = await webflow.collections.items.listItems(collectionId);

// Create item
const item = await webflow.collections.items.createItem(collectionId, {
  fieldData: {
    name: 'New Item',
    slug: 'new-item'
  }
});
```

## Comandos CLI

```bash
# Install
npm install -g @webflow/webflow-cli

# Login
webflow login

# Initialize devlink
webflow devlink init

# Sync components
webflow devlink sync
```

## Estrutura do CMS

- **Collections** - Tipos de conteúdo (como posts de blog e membros de time)
- **Items** - Individual entries in a collection
- **Fields** - Campos de dados nos itens

## Tipos de Campo Comuns

- `PlainText` - Simple text
- `RichText` - Conteúdo formatado
- `Image` - Image upload
- `Link` - URL or page reference
- `Reference` - Link to another collection
- `Multi-Reference` - Multiple collection links
- `Switch` - Boolean toggle
- `Number` - Numeric value
- `Date` - Date/time

## Quando Usar

- Gestão de CMS de site de marketing
- Publicação de blog/conteúdo
- Form submission handling
- Atualizações automáticas de conteúdo
- Programmatic SEO pages

## Limites de Taxa

- 60 requests/minute (general)
- 10 requests/minute (publishing)

## Skills Relevantes

- programmatic-seo
- content-strategy
- page-cro
