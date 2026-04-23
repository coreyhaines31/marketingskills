# Dub.co

Plataforma de gestão de links e atribuição para equipes de marketing modernas.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API para links, analytics e domínios |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | ✓ | TypeScript SDK disponível |

## Autenticação

- **Tipo**: API Key
- **Header**: `Authorization: Bearer {api_key}`
- **Obter chave**: Settings > API Keys no dashboard do Dub

## Operações comuns de agent

### Criar link curto

```bash
POST https://api.dub.co/links

{
  "url": "https://example.com/landing-page",
  "domain": "link.example.com",
  "key": "summer-sale",
  "tags": ["campaign:summer", "channel:email"]
}
```

### Buscar link por key

```bash
GET https://api.dub.co/links?domain=link.example.com&key=summer-sale
```

### Listar links

```bash
GET https://api.dub.co/links?domain=link.example.com&page=1
```

### Buscar analytics do link

```bash
GET https://api.dub.co/analytics?domain=link.example.com&key=summer-sale&interval=30d
```

### Buscar cliques por localização

```bash
GET https://api.dub.co/analytics/country?domain=link.example.com&key=summer-sale
```

### Buscar cliques por dispositivo

```bash
GET https://api.dub.co/analytics/device?domain=link.example.com&key=summer-sale
```

### Atualizar link

```bash
PATCH https://api.dub.co/links/{link_id}

{
  "url": "https://example.com/new-landing-page",
  "tags": ["campaign:summer", "channel:social"]
}
```

### Excluir link

```bash
DELETE https://api.dub.co/links/{link_id}
```

### Criar links em massa

```bash
POST https://api.dub.co/links/bulk

[
  {"url": "https://example.com/page1", "key": "page1"},
  {"url": "https://example.com/page2", "key": "page2"}
]
```

## SDK TypeScript

### Instalar

```bash
npm install dub
```

### Uso

```typescript
import { Dub } from "dub";

const dub = new Dub({ token: "YOUR_API_KEY" });

// Create link
const link = await dub.links.create({
  url: "https://example.com",
  domain: "link.example.com"
});

// Get analytics
const analytics = await dub.analytics.retrieve({
  domain: "link.example.com",
  key: "summer-sale"
});
```

## Recursos principais

- **Domínios customizados** - Use os seus próprios domínios de marca
- **Análises de links** - Cliques, localizações, dispositivos, referrers
- **Tags** - Organize links por campanha, canal etc.
- **QR codes** - Gerados automaticamente para cada link
- **Password protection** - Proteja links sensíveis
- **Expiration** - Links com prazo de expiração
- **Geo-targeting** - Redirecionamento com base em localização

## Dimensões de analytics

- `clicks` - Total de cliques
- `country` - Cliques por país
- `city` - Cliques por cidade
- `device` - Cliques por tipo de dispositivo
- `browser` - Cliques por navegador
- `os` - Cliques por sistema operacional
- `referer` - Cliques por origem (referrer)

## Quando usar

- Criar links de marketing rastreáveis
- Construir sistemas de links de indicação
- Rastrear atribuição de campanhas
- Fazer A/B testing de landing pages via links
- Gerar URLs curtas com marca
- Analisar performance de links

## Limites de taxa

- Gratuito: 1,000 links, 5 API requests/second
- Pro: links ilimitados, 50 API requests/second
- Enterprise: Limites personalizados

## Habilidades relevantes

- referral-program
- analytics-tracking
- paid-ads
