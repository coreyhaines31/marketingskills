# Referência de Especificações de Plataforma

Limites de caracteres completos, requisitos de formato e melhores práticas para cada plataforma de anúncios.

---

## Google Ads

### Responsive Search Ads (RSAs)

| Elemento | Limite de Caracteres | Obrigatório | Observações |
|---------|----------------|----------|-------|
| Título | 30 chars | 3 mínimo, 15 máx. | Quaisquer 3 podem ser exibidos juntos |
| Descrição | 90 chars | 2 mínimo, 4 máx. | Quaisquer 2 podem ser exibidos juntos |
| Caminho de exibição 1 | 15 chars | Opcional | Aparece após o domínio na URL |
| Caminho de exibição 2 | 15 chars | Opcional | Aparece após o caminho 1 |
| URL final | Sem limite | Obrigatório | URL da landing page |

**Regras de combinação:**
- Google seleciona até 3 títulos e 2 descrições para exibir
- Os títulos aparecem separados por " | " ou empilhados
- Qualquer título pode aparecer em qualquer posição, a menos que fixado
- Fixar reduz a capacidade do Google de otimizar — use com moderação

**Estratégia de fixação:**
- Fixe o nome da marca na posição 1 se as diretrizes da marca exigirem
- Fixe o CTA mais forte na posição 2 ou 3
- Deixe a maioria dos títulos sem fixação para o machine learning

**Recomendação de mix de títulos (15 títulos):**
- 3-4 focados em palavras-chave (correspondem à intenção de busca)
- 3-4 focados em benefícios (o que o usuário ganha)
- 2-3 de prova social (números, prêmios, clientes)
- 2-3 focados em CTA (ação a tomar)
- 1-2 diferenciais (por que você e não a concorrência)
- 1 título com o nome da marca

**Recomendação de mix de descrições (4 descrições):**
- 1 benefício + ponto de prova
- 1 funcionalidade + resultado
- 1 prova social + CTA
- 1 urgência/oferta + CTA (se aplicável)

### Performance Max

| Elemento | Limite de Caracteres | Observações |
|---------|----------------|-------|
| Título | 30 chars (5 obrigatórios) | Títulos curtos para vários posicionamentos |
| Título longo | 90 chars (5 obrigatórios) | Usado em display, vídeo, discover |
| Descrição | 90 chars (1 obrigatório, 5 máx.) | Acompanha vários formatos de anúncio |
| Nome da empresa | 25 chars | Obrigatório |

### Display Ads

| Elemento | Limite de Caracteres |
|---------|----------------|
| Título | 30 chars |
| Título longo | 90 chars |
| Descrição | 90 chars |
| Nome da empresa | 25 chars |

---

## Meta Ads (Facebook & Instagram)

### Imagem Única / Vídeo / Carrossel

| Elemento | Recomendado | Máximo | Observações |
|---------|-------------|---------|-------|
| Texto principal | 125 chars | 2.200 chars | Texto acima da imagem; truncado após ~125 |
| Título | 40 chars | 255 chars | Abaixo da imagem; truncado após ~40 |
| Descrição | 30 chars | 255 chars | Abaixo do título; pode não aparecer |
| Link de exibição da URL | 40 chars | N/A | URL de exibição personalizada opcional |

**Notas específicas por posicionamento:**
- **Feed**: Todos os elementos aparecem; texto principal mais visível
- **Stories/Reels**: Texto principal sobreposto; mantenha abaixo de 72 chars
- **Coluna direita**: Apenas o título visível; ignore a descrição
- **Audience Network**: Varia conforme o editor

**Melhores práticas:**
- Coloque o gancho no início do texto principal (primeiros 125 chars)
- Use quebras de linha para melhor leitura em textos mais longos
- Emojis: teste, mas não exagere — máx. 1-2 por anúncio
- Perguntas no texto principal aumentam o engajamento
- O título deve ser um CTA claro ou uma declaração de valor

### Lead Ads (Instant Form)

| Elemento | Limite |
|---------|-------|
| Título de saudação | 60 chars |
| Descrição de saudação | 360 chars |
| Texto de política de privacidade | 200 chars |

---

## LinkedIn Ads

### Anúncio de Imagem Única

| Elemento | Recomendado | Máximo | Observações |
|---------|-------------|---------|-------|
| Texto de introdução | 150 chars | 600 chars | Acima da imagem; truncado após ~150 |
| Título | 70 chars | 200 chars | Abaixo da imagem |
| Descrição | 100 chars | 300 chars | Aparece apenas no Audience Network |

### Anúncio de Carrossel

| Elemento | Limite |
|---------|-------|
| Texto de introdução | 255 chars |
| Título do card | 45 chars |
| Quantidade de cards | 2-10 cards |

### Message Ad (InMail)

| Elemento | Limite |
|---------|-------|
| Linha de assunto | 60 chars |
| Corpo da mensagem | 1.500 chars |
| Botão CTA | 20 chars |

### Text Ad

| Elemento | Limite |
|---------|-------|
| Título | 25 chars |
| Descrição | 75 chars |

**Diretrizes específicas do LinkedIn:**
- Tom profissional, mas não entediante
- Use linguagem específica do cargo que o público reconhece
- Estatísticas e dados têm bom desempenho
- Evite hype estilo consumer ("Incrível!" "Extraordinário!")
- Depoimentos em primeira pessoa de pares ressoam bem

---

## TikTok Ads

### Anúncios In-Feed

| Elemento | Recomendado | Máximo | Observações |
|---------|-------------|---------|-------|
| Texto do anúncio | 80 chars | 100 chars | Acima do vídeo |
| Nome de exibição | N/A | 40 chars | Nome da marca |
| Botão CTA | Opções da plataforma | Predefinido | Selecione entre as opções do TikTok |

### Spark Ads (Orgânico Impulsionado)

| Elemento | Observações |
|---------|-------|
| Legenda | Usa a legenda original da publicação |
| Botão CTA | Adicionado pelo anunciante |
| Nome de exibição | Handle original do criador |

**Diretrizes específicas do TikTok:**
- Conteúdo nativo supera anúncios polidos
- Os primeiros 2 segundos determinam se o usuário assiste
- Use sons e formatos em alta
- Texto sobreposto é essencial (a maioria assiste sem som)
- Apenas vídeo vertical (9:16)

---

## Twitter/X Ads

### Promoted Tweets

| Elemento | Limite | Observações |
|---------|-------|-------|
| Texto do tweet | 280 chars | Tweet completo com imagem/vídeo |
| Título do card | 70 chars | Website card |
| Descrição do card | 200 chars | Website card |

### Website Cards

| Elemento | Limite |
|---------|-------|
| Título | 70 chars |
| Descrição | 200 chars |

**Diretrizes específicas do Twitter/X:**
- Tom conversacional e casual
- Frases curtas funcionam melhor
- Uma mensagem clara por tweet
- Hashtags: máx. 1-2 (0 frequentemente é melhor para anúncios)
- Threads podem funcionar para conteúdo em fase de consideração

---

## Dicas para Contagem de Caracteres

- **Espaços contam** como caracteres em todas as plataformas
- **Emojis** contam como 1-2 caracteres dependendo da plataforma
- **Caracteres especiais** (|, &, etc.) contam como 1 caractere
- **URLs** no corpo do texto contam contra os limites
- **Dynamic keyword insertion** (`{KeyWord:default}`) pode exceder os limites — defina padrões seguros
- Sempre verifique na pré-visualização de anúncio da plataforma antes de lançar

---

## Adaptação de Criativos para Múltiplas Plataformas

Ao criar para múltiplas plataformas simultaneamente, comece pelo formato mais restritivo:

1. **Títulos de busca do Google** (30 chars) — força a mensagem mais concisa
2. **Expanda para títulos Meta** (40 chars) — adicione uma ou duas palavras
3. **Expanda para texto de introdução do LinkedIn** (150 chars) — adicione contexto e prova
4. **Expanda para texto principal Meta** (125+ chars) — gancho completo e proposta de valor

Esta abordagem em cascata garante que sua mensagem central funcione em todos os lugares e seja enriquecida para plataformas que permitem mais espaço.
