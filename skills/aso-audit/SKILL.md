---
name: aso-audit
description: "When the user wants to audit or optimize an App Store or Google Play listing. Also use when the user mentions 'ASO audit,' 'app store optimization,' 'optimize my app listing,' 'improve app visibility,' 'app store ranking,' 'audit my listing,' 'why aren't people downloading my app,' 'improve my app conversion,' 'keyword optimization for app,' or 'compare my app to competitors.' Use when the user shares an App Store or Google Play URL and wants to improve it."
metadata:
  version: 1.0.0
---

# ASO Audit

Analise listagens da App Store e do Google Play com base nas melhores práticas de ASO. Busca
dados ao vivo da listagem, pontua metadados, visuais e avaliações, e produz um
plano de ação priorizado.

## Quando Usar

- O usuário compartilha uma URL da App Store ou do Google Play
- O usuário pede para auditar ou otimizar uma listagem de app
- O usuário quer comparar seu app com concorrentes
- O usuário pergunta sobre ranking, visibilidade ou conversão de downloads na loja

## Antes de Auditar

**Verifique primeiro o contexto de marketing do produto:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações mais antigas), leia antes de fazer perguntas. Use esse contexto e só pergunte informações que não estejam cobertas ou que sejam específicas a esta tarefa.

## Fase 1 — Identificar Loja e Buscar Dados

### Detectar o tipo de loja pela URL

```
Apple:  apps.apple.com/{country}/app/{name}/id{digits}
Google: play.google.com/store/apps/details?id={package}
```

Se o usuário fornecer o nome do app em vez de uma URL, pesquise na web por:
`site:apps.apple.com "{app name}"` ou `site:play.google.com "{app name}"`

### Buscar a listagem

Use WebFetch para recuperar a página da listagem. Extraia todos os campos disponíveis:

**Campos da Apple App Store:**

- Nome do app (título) — limite de 30 caracteres
- Subtítulo — limite de 30 caracteres
- Descrição (longa) — não indexada para busca, mas importante para conversão
- Texto promocional — 170 caracteres, atualizável sem nova versão
- Categoria (primária + secundária)
- Capturas de tela (quantidade, ordem, texto das legendas)
- Vídeo de pré-visualização (presença, duração)
- Avaliação (média + quantidade)
- Avaliações recentes (as visíveis)
- Preço / compras dentro do app
- Nome do desenvolvedor
- Data da última atualização
- Notas do histórico de versões
- Classificação etária
- Tamanho
- Idiomas / localizações listadas
- Eventos no app (se visíveis)

**Campos do Google Play:**

- Nome do app (título) — limite de 30 caracteres
- Descrição curta — limite de 80 caracteres
- Descrição completa — limite de 4.000 caracteres, É indexada para busca
- Categoria + tags
- Imagem de destaque (presença)
- Capturas de tela (quantidade, ordem)
- Vídeo de pré-visualização (presença)
- Avaliação (média + quantidade)
- Avaliações recentes (as visíveis)
- Preço / compras dentro do app
- Nome do desenvolvedor
- Data da última atualização
- Texto "O que há de novo"
- Faixa de downloads
- Classificação de conteúdo
- Seção de segurança de dados
- Idiomas listados

Se o WebFetch retornar dados incompletos (lojas renderizam no lado do cliente), note as lacunas e
trabalhe com o que estiver disponível. Peça ao usuário que cole os campos ausentes se forem críticos.

### Avaliação dos ativos visuais

O WebFetch não consegue extrair imagens de capturas de tela ou texto de legendas. **Tire uma captura de tela
da página da listagem** para obter dados visuais:

1. Navegue até a URL da listagem e capture uma captura de tela da página completa
2. Avalie a captura de tela quanto a: qualidade do ícone, quantidade de screenshots, texto de legenda,
   qualidade das mensagens, presença de vídeo de pré-visualização, imagem de destaque (Google Play)
3. Se as ferramentas de navegador não estiverem disponíveis, peça ao usuário que compartilhe uma captura de tela da
   página da listagem

**Texto promocional (Apple):** Este campo de 170 caracteres aparece acima da descrição
mas é frequentemente indistinguível dela no HTML raspado. Se não conseguir confirmar
sua presença, anote isso e recomende que o usuário verifique no App Store Connect.

---

## Fase 1.5 — Avaliar Maturidade da Marca

Antes de pontuar, classifique o app em um dos três níveis. Isso determina como
você interpreta desvios do "ASO ideal" — uma escolha deliberada de marca por uma
empresa conhecida não é o mesmo que uma oportunidade perdida por um app desconhecido.

### Definições de nível

| Nível           | Sinais                                                                                                                               | Exemplos                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| **Dominante**   | Marca amplamente reconhecida, 1M+ avaliações, top-10 na categoria, reconhecimento universal. Usuários buscam pela marca, não por palavras-chave genéricas. | Instagram, Uber, Spotify, WhatsApp, Netflix |
| **Estabelecido** | Bem conhecido em sua categoria, 100K+ avaliações, forte instalações orgânicas, marca reconhecida mas não universalmente.            | Strava, Notion, Duolingo, Cash App, Calm    |
| **Desafiante**  | Construindo reconhecimento, <100K avaliações, precisa de descoberta por palavras-chave e táticas de ASO. A maioria dos apps se enquadra aqui. | Seu app, a maioria dos apps indie/startup   |

### Como o nível afeta a pontuação

**Apps Dominantes** recebem pontuação ajustada nestas áreas:

- **Título:** Títulos somente com a marca ou marca em primeiro lugar são válidos (pontuação 8+ se a marca é a palavra-chave). Esses apps não precisam de descoberta por palavras-chave genéricas.
- **Descrição:** Pontue apenas na qualidade de conversão, não na presença de palavras-chave. Se o app é uma marca amplamente reconhecida, uma descrição bem elaborada supera uma repleta de palavras-chave.
- **Ativos Visuais:** Fotografia de lifestyle/marca em vez de demonstrações de UI é uma estratégia de conversão legítima. A ausência de vídeo é aceitável se o produto é difícil de demonstrar em 30s ou o reconhecimento da marca é quase universal.
- **O Que Há de Novo:** Notas de versão genéricas com cadência semanal ou mais frequente são aceitáveis (pontuação 8+). Em escala, changelogs detalhados têm ROI mínimo e podem causar reação negativa.
- **Eventos no app:** A ausência de eventos para apps utilitários com bases massivas de instalação (Uber, WhatsApp) não é uma penalidade. Esses apps não precisam de ajuda para descoberta.
- **Localização:** Pontue em relação ao mercado real, não à contagem absoluta. Um fintech focado nos EUA com 2 idiomas (inglês + espanhol) está adequadamente localizado.

**Apps Estabelecidos** recebem ajuste parcial:

- Títulos com marca em primeiro lugar são válidos, mas ainda devem incluir 1-2 palavras-chave
- Escolhas estratégicas de descrição/visuais recebem benefício da dúvida
- As outras dimensões são pontuadas normalmente

**Apps Desafiantes** são pontuados rigorosamente de acordo com as melhores práticas de ASO — cada caractere, screenshot e palavra-chave importa.

**Princípio fundamental:** Antes de descontar pontos, pergunte: "Isso é um erro ou uma escolha
deliberada de uma equipe que tem dados que eu não tenho?" Se o app tem 1M+ avaliações e uma
equipe dedicada de ASO, assuma que suas escolhas são baseadas em dados, a menos que estejam claramente erradas.

---

## Fase 2 — Pontuar Cada Dimensão

Pontue cada dimensão de 0 a 10 usando os critérios em `references/scoring-criteria.md`.
Aplique os ajustes de nível de maturidade da marca da Fase 1.5.

Arquivos de referência para especificações da plataforma e benchmarks:

- `references/apple-specs.md` — Limites oficiais de caracteres da Apple, especificações de screenshot/vídeo, regras de CPP/PPO, gatilhos de rejeição
- `references/google-play-specs.md` — Limites oficiais do Google Play, especificações de screenshot, limites do Android Vitals, políticas
- `references/benchmarks.md` — Dados de conversão, impacto de avaliações, aumento com vídeo, comportamento de screenshots, benchmarks de CPP/eventos

### Dimensões e Pesos

| #   | Dimensão             | Peso | O Que Cobre                                                               |
| --- | -------------------- | ---- | ------------------------------------------------------------------------- |
| 1   | Título e Subtítulo   | 20%  | Uso de caracteres, presença de palavras-chave, clareza, equilíbrio entre marca e palavras-chave |
| 2   | Descrição            | 15%  | Primeiras 3 linhas, densidade de palavras-chave (Google), CTA, estrutura, texto promocional |
| 3   | Ativos Visuais       | 25%  | Quantidade/qualidade/mensagem dos screenshots, vídeo, ícone, imagem de destaque |
| 4   | Avaliações e Reviews | 20%  | Média de avaliação, volume, recência, respostas do desenvolvedor          |
| 5   | Metadados e Atualidade | 10% | Escolha de categoria, recência de atualização, quantidade de localizações, segurança de dados |
| 6   | Sinais de Conversão  | 10%  | Posicionamento de preço, transparência de IAP, prova social, faixa de downloads |

**Pontuação final** = soma ponderada, de 100 pontos.

### Interpretação da pontuação

| Pontuação | Nota | Significado                                                       |
| --------- | ---- | ----------------------------------------------------------------- |
| 85-100    | A    | Bem otimizado; foque em testes A/B e iteração                     |
| 70-84     | B    | Boa base; oportunidades claras de melhoria                        |
| 50-69     | C    | Lacunas significativas; correções priorizadas terão alto impacto  |
| 30-49     | D    | Otimização importante necessária em várias dimensões              |
| 0-29      | F    | A listagem precisa de uma reformulação completa                   |

---

## Fase 3 — Comparação com Concorrentes (Opcional)

Se o usuário fornecer URLs de concorrentes ou pedir comparação:

1. Busque 2-3 principais concorrentes na mesma categoria
2. Execute a mesma pontuação em cada um
3. Crie uma tabela comparativa destacando onde o app do usuário é mais fraco/forte
4. Identifique lacunas de palavras-chave — termos pelos quais os concorrentes ranqueiam que o app do usuário não segmenta

Se nenhum concorrente for especificado, sugira que o usuário forneça 2-3 ou ofereça-se para pesquisar
os principais apps em sua categoria.

---

## Fase 4 — Gerar Relatório

Use o template em `references/report-template.md` para estruturar o resultado.

O relatório deve incluir:

1. **Tabela de pontuação** — tabela com todas as 6 dimensões, pontuações e notas
2. **Top 3 vitórias rápidas** — mudanças que levam menos de 1 hora e têm maior impacto
3. **Análise detalhada** — detalhamento por dimensão com problemas específicos e correções
4. **Sugestões de palavras-chave** — baseadas na análise de título/descrição e lacunas dos concorrentes
5. **Recomendações de ativos visuais** — melhorias específicas de screenshot/vídeo
6. **Plano de ação priorizado** — lista ordenada de mudanças por impacto vs esforço

### Regras do relatório

- Cada recomendação deve ser **específica e acionável** ("Altere o subtítulo de X para Y" e não "Melhore o subtítulo")
- Inclua contagens de caracteres para todas as recomendações de texto
- Sinalize diferenças específicas de plataforma (Apple vs Google) quando relevante
- Anote o que NÃO pode ser avaliado sem ferramentas pagas (volume de busca, rankings exatos)
- Ao sugerir mudanças de palavras-chave, explique POR QUE cada palavra-chave importa

---

## Regras Específicas por Plataforma

### Apple App Store — Fatos Principais

- Título (30 chars) + Subtítulo (30 chars) + Campo de palavras-chave (100 **bytes**, oculto) = texto indexado
- O campo de palavras-chave é em bytes, não em caracteres — árabe/CJK usam 2-3 bytes por caractere
- A descrição longa NÃO é indexada para busca — otimize apenas para conversão
- O texto promocional (170 chars) NÃO afeta a busca (confirmado pela Apple)
- Nunca repita palavras entre título/subtítulo/campo de palavras-chave (a Apple indexa cada palavra uma vez)
- Campo de palavras-chave: vírgulas, sem espaços ("photo,editor,filter" e não "photo, editor, filter")
- Screenshots: até 10 por dispositivo. Os primeiros 3 são visíveis na busca — 90% nunca passam do 3º
- Legendas de screenshots indexadas desde junho de 2025 (extração por IA)
- Eventos no app: máximo de 10 publicados ao mesmo tempo, máximo de 31 dias cada. Indexados e aparecem na busca
- Custom Product Pages (até 70) na busca orgânica desde julho de 2025. +5,9% de aumento médio na conversão
- Vídeo de pré-visualização: até 3, 15-30s cada. Reprodução automática sem som — +20-40% de aumento na conversão
- SKStoreReviewController: máximo de 3 solicitações por 365 dias
- A Apple tem curadoria editorial humana — qualidade e design importam mais
- Veja `references/apple-specs.md` para especificações completas, dimensões e gatilhos de rejeição

### Google Play — Fatos Principais

- Título (30 chars) + Descrição curta (80 chars) + Descrição completa (4.000 chars) = texto indexado
- A descrição completa É indexada — segmente 2-3% de densidade de palavras-chave naturalmente
- Sem campo de palavras-chave oculto — todas as palavras-chave devem estar no texto visível
- NLP/compreensão semântica do Google — stuffing de palavras-chave é detectado e penalizado
- Proibido no título: emojis, CAIXA ALTA, "melhor"/"#1"/"grátis", CTAs (em vigor desde 2021)
- Screenshots: mínimo 2, **máximo 8** por dispositivo (não 10 como na Apple)
- Imagem de destaque (1024x500, exata) obrigatória para posicionamentos em destaque
- O vídeo NÃO reproduz automaticamente — apenas ~6% dos usuários tocam para reproduzir (baixo ROI vs iOS)
- Android Vitals afeta diretamente o ranking: crash >1,09% ou ANR >0,47% = visibilidade reduzida
- Conteúdo Promocional: envie 14 dias antes para solicitações de destaque. Apps veem 2x mais aquisições por exploração
- Custom Store Listings: até 50 (podem segmentar usuários inativos, países específicos, campanhas de anúncios)
- Store Listing Experiments: teste até 3 variantes, execute por 7+ dias, 1 experimento por vez
- Veja `references/google-play-specs.md` para especificações completas e detalhes de políticas

### O Que a Apple Indexa vs O Que o Google Indexa

| Campo                      | Indexado pela Apple? | Indexado pelo Google?   |
| -------------------------- | -------------------- | ----------------------- |
| Título                     | Sim                  | Sim (sinal mais forte)  |
| Subtítulo / Desc. curta    | Sim                  | Sim                     |
| Campo de palavras-chave    | Sim (oculto)         | Não existe              |
| Descrição longa            | Não                  | Sim (muito)             |
| Legendas de screenshots    | Sim (desde 2025)     | Não                     |
| Eventos no app             | Sim                  | N/A (LiveOps em vez)    |
| Nome do desenvolvedor      | Não                  | Parcial                 |
| Nomes de IAP               | Sim                  | Sim                     |

---

## Lista de Verificação de Problemas Comuns

Sinalize estes se encontrados. Itens marcados _(dependente do nível)_ devem ser avaliados de acordo com
o nível de maturidade da marca do app — podem ser escolhas deliberadas para apps Dominantes.

**Sempre sinalizar (todos os níveis):**

- [ ] Avaliação abaixo de 4,0
- [ ] Última atualização há mais de 3 meses
- [ ] Descrição do Google Play sem estratégia de palavras-chave (densidade abaixo de 1%)
- [ ] Google Play sem imagem de destaque
- [ ] Campo de palavras-chave da Apple provavelmente tem palavras repetidas (inferido do título+subtítulo)
- [ ] Incompatibilidade de categoria — o app enfrentaria menos concorrência em uma categoria diferente
- [ ] Menos de 5 screenshots

**Sinalizar apenas para Desafiante/Estabelecido** _(não são erros para apps Dominantes):_

- [ ] O título desperdiça caracteres apenas com a marca (sem palavras-chave) _(Dominante: a marca É a palavra-chave)_
- [ ] Subtítulo/descrição curta duplica palavras-chave do título
- [ ] As primeiras 3 linhas da descrição são genéricas _(Dominante: pode ser escolha de voz da marca)_
- [ ] Sem vídeo de pré-visualização _(Dominante: pode ser racional se o produto é difícil de demonstrar)_
- [ ] Screenshots são apenas dumps de UI sem mensagens/legendas _(Dominante: fotos de lifestyle/marca podem converter melhor)_
- [ ] Apenas 1-2 localizações _(pontue em relação ao mercado real, não à contagem absoluta)_
- [ ] Sem eventos no app ou conteúdo promocional _(apps utilitários Dominantes podem não precisar de ajuda para descoberta)_

**Sinalizar para todos os níveis, mas notar contexto:**

- [ ] Sem respostas do desenvolvedor a avaliações negativas _(note o volume — responder a 10M+ avaliações é um desafio diferente do que a 1K)_
- [ ] Texto genérico "O Que Há de Novo" _(aceitável em cadência de lançamento semanal ou mais frequente para Estabelecido/Dominante)_

---

## Perguntas Específicas da Tarefa

1. Qual é a URL da App Store ou do Google Play?
2. Este é seu app ou de um concorrente?
3. Em qual categoria o app compete?
4. Você tem URLs de concorrentes para comparar?
5. Você está focado em visibilidade de busca, taxa de conversão, ou ambos?
6. Você tem acesso aos dados do App Store Connect ou do Google Play Console?

---

## Skills Relacionadas

- **page-cro**: Para otimizar a conversão de landing pages web que geram instalações de app
- **ad-creative**: Para criar criativos de anúncios para App Store e Google Play
- **analytics-tracking**: Para configurar atribuição de instalação e rastreamento de eventos no app
- **customer-research**: Para entender as necessidades e linguagem dos usuários e informar o texto da listagem
