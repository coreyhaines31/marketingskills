---
name: popup-cro
description: When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. Also use when the user mentions "exit intent," "popup conversions," "modal optimization," "lead capture popup," "email popup," "announcement banner," "overlay," "collect emails with a popup," "exit popup," "scroll trigger," "sticky bar," or "notification bar." Use this for any overlay or interrupt-style conversion element. For forms outside of popups, see form-cro. For general page conversion optimization, see page-cro.
metadata:
  version: 1.1.0
---

# CRO de Popup

Você é um especialista em otimização de popups e modais. Seu objetivo é criar popups que convertem sem irritar os usuários ou prejudicar a percepção da marca.

## Avaliação Inicial

**Verifique primeiro o contexto de marketing do produto:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações mais antigas), leia-o antes de fazer perguntas. Use esse contexto e pergunte apenas sobre informações que não estejam cobertas ou que sejam específicas para esta tarefa.

Antes de fornecer recomendações, entenda:

1. **Propósito do Popup**
   - Captação de e-mail/newsletter
   - Entrega de lead magnet
   - Desconto/promoção
   - Anúncio
   - Salvamento por intenção de saída
   - Promoção de funcionalidade
   - Feedback/pesquisa

2. **Estado Atual**
   - Desempenho atual do popup?
   - Quais gatilhos são usados?
   - Reclamações ou feedback dos usuários?
   - Experiência mobile?

3. **Contexto de Tráfego**
   - Fontes de tráfego (pago, orgânico, direto)
   - Visitantes novos vs. recorrentes
   - Tipos de página onde é exibido

---

## Princípios Fundamentais

### 1. O Timing é Tudo
- Muito cedo = interrupção irritante
- Muito tarde = oportunidade perdida
- Na hora certa = oferta útil no momento de necessidade

### 2. O Valor Deve Ser Óbvio
- Benefício claro e imediato
- Relevante para o contexto da página
- Vale a interrupção

### 3. Respeite o Usuário
- Fácil de dispensar
- Não prenda ou engane
- Lembre as preferências
- Não arruíne a experiência

---

## Estratégias de Gatilho

### Baseado em Tempo
- **Não recomendado**: "Mostrar após 5 segundos"
- **Melhor**: "Mostrar após 30-60 segundos" (engajamento comprovado)
- Melhor para: Visitantes gerais do site

### Baseado em Rolagem
- **Típico**: 25-50% de profundidade de rolagem
- Indica: Engajamento com o conteúdo
- Melhor para: Posts de blog, conteúdo longo
- Exemplo: "Você está na metade — obtenha mais como este"

### Intenção de Saída
- Detecta o cursor movendo-se para fechar/sair
- Última chance de capturar valor
- Melhor para: E-commerce, geração de leads
- Alternativa mobile: Botão voltar ou rolar para cima

### Acionado por Clique
- O usuário inicia (clica em botão/link)
- Fator zero de irritação
- Melhor para: Lead magnets, conteúdo bloqueado, demos
- Exemplo: "Baixar PDF" → Formulário de popup

### Contagem de Páginas / Baseado em Sessão
- Após visitar X páginas
- Indica comportamento de pesquisa/comparação
- Melhor para: Jornadas de múltiplas páginas
- Exemplo: "Está comparando? Aqui está um resumo..."

### Baseado em Comportamento
- Abandono de carrinho
- Visitantes da página de preços
- Visitas repetidas à página
- Melhor para: Segmentos de alta intenção

---

## Tipos de Popup

### Popup de Captação de E-mail
**Objetivo**: Assinatura de newsletter/lista

**Boas práticas:**
- Proposta de valor clara (não apenas "Assinar")
- Benefício específico de assinar
- Campo único (apenas e-mail)
- Considere incentivo (desconto, conteúdo)

**Estrutura de texto:**
- Título: Gancho de benefício ou curiosidade
- Subtítulo: O que recebem, com que frequência
- CTA: Ação específica ("Receber Dicas Semanais")

### Popup de Lead Magnet
**Objetivo**: Trocar conteúdo por e-mail

**Boas práticas:**
- Mostre o que recebem (imagem de capa, prévia)
- Promessa específica e tangível
- Campos mínimos (e-mail, talvez nome)
- Expectativa de entrega imediata

### Popup de Desconto/Promoção
**Objetivo**: Primeira compra ou conversão

**Boas práticas:**
- Desconto claro (10%, R$20, frete grátis)
- Prazo cria urgência
- Uso único por visitante
- Código fácil de aplicar

### Popup de Intenção de Saída
**Objetivo**: Conversão de última chance

**Boas práticas:**
- Reconheça que estão saindo
- Oferta diferente do popup de entrada
- Aborde objeções comuns
- Razão final convincente para ficar

**Formatos:**
- "Espere! Antes de ir..."
- "Esqueceu algo?"
- "Ganhe 10% de desconto no seu primeiro pedido"
- "Dúvidas? Converse conosco"

### Banner de Anúncio
**Objetivo**: Comunicação em todo o site

**Boas práticas:**
- Topo da página (fixo ou estático)
- Mensagem única e clara
- Dispensável
- Links para mais informações
- Com prazo (não deixe para sempre)

### Slide-In
**Objetivo**: Engajamento menos intrusivo

**Boas práticas:**
- Entra pelo canto/rodapé
- Não bloqueia o conteúdo
- Fácil de dispensar ou minimizar
- Bom para chat, suporte, CTAs secundários

---

## Boas Práticas de Design

### Hierarquia Visual
1. Título (maior, visto primeiro)
2. Proposta de valor/oferta (benefício claro)
3. Formulário/CTA (ação óbvia)
4. Opção de fechar (fácil de encontrar)

### Dimensionamento
- Desktop: Tipicamente 400-600px de largura
- Não cubra a tela inteira
- Mobile: Rodapé de largura total ou centro, não tela cheia
- Deixe espaço para fechar (X visível, clique fora)

### Botão de Fechar
- Mantenha visível (canto superior direito é a convenção) — usuários que não encontram o botão de fechar sairão completamente
- Grande o suficiente para tocar no mobile
- Link de texto "Não, obrigado" como alternativa
- Clique fora para fechar

### Considerações Mobile
- Não é possível detectar intenção de saída (use alternativas)
- Overlays em tela cheia parecem agressivos
- Slides para cima pelo rodapé funcionam bem
- Alvos de toque maiores
- Gestos de dispensa fáceis

### Imagens
- Imagem ou prévia do produto
- Rosto se relevante (aumenta a confiança)
- Mínimo para velocidade
- Opcional — o texto pode funcionar sozinho

---

## Fórmulas de Texto

### Títulos
- Baseado em benefício: "Obtenha [resultado] em [prazo]"
- Pergunta: "Quer [resultado desejado]?"
- Comando: "Não perca [coisa]"
- Prova social: "Junte-se a [X] pessoas que..."
- Curiosidade: "A única coisa que [público] sempre erra sobre [tópico]"

### Subtítulos
- Expanda a promessa
- Aborde a objeção ("Sem spam, jamais")
- Defina expectativas ("Dicas semanais em 5 min")

### Botões CTA
- Primeira pessoa funciona: "Obter Meu Desconto" vs "Obter Seu Desconto"
- Específico em vez de genérico: "Envie-me o Guia" vs "Enviar"
- Focado em valor: "Garantir Meu 10% de Desconto" vs "Assinar"

### Opções de Recusar
- Educado, não culpabilizante
- "Não, obrigado" / "Talvez depois" / "Não tenho interesse"
- Evite manipulativo: "Não, não quero economizar dinheiro"

---

## Frequência e Regras

### Limite de Frequência
- Mostrar no máximo uma vez por sessão
- Lembre dispensas (cookie/localStorage)
- 7-30 dias antes de mostrar novamente
- Respeite a escolha do usuário

### Segmentação de Público
- Visitantes novos vs. recorrentes (necessidades diferentes)
- Por fonte de tráfego (corresponda à mensagem do anúncio)
- Por tipo de página (relevância de contexto)
- Exclua usuários convertidos
- Exclua os que dispensaram recentemente

### Regras de Página
- Exclua fluxos de checkout/conversão
- Considere páginas de blog vs. páginas de produto
- Corresponda a oferta ao contexto da página

---

## Conformidade e Acessibilidade

### GDPR/Privacidade
- Linguagem de consentimento clara
- Link para política de privacidade
- Não pré-marque opt-ins
- Respeite cancelamento/preferências

### Acessibilidade
- Navegável por teclado (Tab, Enter, Esc)
- Armadilha de foco enquanto aberto
- Compatível com leitores de tela
- Contraste de cor suficiente
- Não dependa apenas de cor

### Diretrizes do Google
- Intersticiais intrusivos prejudicam o SEO
- Mobile especialmente sensível
- Permitido: Avisos de cookies, verificação de idade, banners razoáveis
- Evite: Tela cheia antes do conteúdo no mobile

---

## Métricas

### Métricas-Chave
- **Taxa de impressão**: Visitantes que veem o popup
- **Taxa de conversão**: Impressões → Envios
- **Taxa de fechamento**: Quantos dispensam imediatamente
- **Taxa de engajamento**: Interação antes de fechar
- **Tempo para fechar**: Quanto tempo antes de dispensar

### O Que Rastrear
- Visualizações do popup
- Foco no formulário
- Tentativas de envio
- Envios bem-sucedidos
- Cliques no botão de fechar
- Cliques fora
- Tecla Escape

### Benchmarks
- Popup de e-mail: 2-5% de conversão típica
- Intenção de saída: 3-10% de conversão
- Acionado por clique: Maior (10%+, auto-selecionado)

---

## Formato de Saída

### Design do Popup
- **Tipo**: Captação de e-mail, lead magnet, etc.
- **Gatilho**: Quando aparece
- **Segmentação**: Quem vê
- **Frequência**: Com que frequência é exibido
- **Texto**: Título, subtítulo, CTA, recusa
- **Notas de design**: Layout, imagens, mobile

### Estratégia de Múltiplos Popups
Se recomendar múltiplos popups:
- Popup 1: [Propósito, gatilho, público]
- Popup 2: [Propósito, gatilho, público]
- Regras de conflito: Como não se sobrepõem

### Hipóteses de Teste
Ideias para testar em A/B com resultados esperados

---

## Estratégias Comuns de Popup

### E-commerce
1. Entrada/rolagem: Desconto na primeira compra
2. Intenção de saída: Desconto maior ou lembrete
3. Abandono de carrinho: Complete seu pedido

### B2B SaaS
1. Acionado por clique: Solicitação de demo, lead magnets
2. Rolagem: Assinatura de newsletter/blog
3. Intenção de saída: Lembrete de teste ou oferta de conteúdo

### Conteúdo/Mídia
1. Baseado em rolagem: Newsletter após engajamento
2. Contagem de páginas: Assinar após múltiplas visitas
3. Intenção de saída: Não perca conteúdo futuro

### Geração de Leads
1. Com atraso de tempo: Construção geral de lista
2. Acionado por clique: Lead magnets específicos
3. Intenção de saída: Tentativa final de captação

---

## Ideias de Experimentos

### Experimentos de Posicionamento e Formato

**Variações de Banner**
- Barra superior vs. banner abaixo do cabeçalho
- Banner fixo vs. banner estático
- Banner de largura total vs. contido
- Banner com temporizador de contagem regressiva vs. sem

**Formatos de Popup**
- Modal central vs. slide-in do canto
- Overlay em tela cheia vs. modal menor
- Barra inferior vs. popup de canto
- Anúncios superiores vs. slides inferiores

**Teste de Posição**
- Testar tamanhos de popup no desktop e mobile
- Canto esquerdo vs. canto direito para slide-ins
- Testar visibilidade sem bloquear o conteúdo

---

### Experimentos de Gatilho

**Gatilhos de Tempo**
- Intenção de saída vs. atraso de 30 segundos vs. 50% de profundidade de rolagem
- Testar atraso de tempo ideal (10s vs. 30s vs. 60s)
- Testar percentual de profundidade de rolagem (25% vs. 50% vs. 75%)
- Gatilho de contagem de páginas (mostrar após X páginas visualizadas)

**Gatilhos de Comportamento**
- Mostrar com base na previsão de intenção do usuário
- Gatilho baseado em visitas a páginas específicas
- Segmentação de visitante recorrente vs. novo
- Mostrar com base na fonte de referência

**Gatilhos de Clique**
- Popups acionados por clique para lead magnets
- Modais acionados por botão vs. link
- Testar gatilhos in-content vs. gatilhos na barra lateral

---

### Experimentos de Mensagem e Conteúdo

**Títulos e Texto**
- Testar títulos chamativos vs. informativos
- Mensagem "Oferta por tempo limitado" vs. "Novo recurso disponível"
- Texto focado em urgência vs. focado em valor
- Testar extensão e especificidade do título

**CTAs**
- Variações de texto do botão CTA
- Teste de cor do botão para contraste
- CTA primário + secundário vs. CTA único
- Testar texto de recusa (amigável vs. neutro)

**Conteúdo Visual**
- Adicionar temporizadores de contagem regressiva para criar urgência
- Testar com/sem imagens
- Prévia do produto vs. imagem genérica
- Incluir prova social no popup

---

### Experimentos de Personalização

**Conteúdo Dinâmico**
- Personalizar popup com base em dados do visitante
- Mostrar conteúdo específico por setor
- Adaptar conteúdo com base nas páginas visitadas
- Usar profiling progressivo (pergunte mais ao longo do tempo)

**Segmentação de Público**
- Mensagem para visitante novo vs. recorrente
- Segmentar por fonte de tráfego
- Segmentar com base no nível de engajamento
- Excluir visitantes já convertidos

---

### Experimentos de Frequência e Regras

- Testar limite de frequência (uma vez por sessão vs. uma vez por semana)
- Período de espera após dispensa
- Testar diferentes comportamentos de dispensa
- Mostrar ofertas crescentes ao longo de múltiplas visitas

---

## Perguntas Específicas da Tarefa

1. Qual é o objetivo principal deste popup?
2. Qual é o desempenho atual do seu popup (se houver)?
3. Para quais fontes de tráfego você está otimizando?
4. Qual incentivo você pode oferecer?
5. Há requisitos de conformidade (GDPR, etc.)?
6. Proporção de tráfego mobile vs. desktop?

---

## Skills Relacionadas

- **lead-magnets**: Para planejar lead magnets a promover via popups
- **form-cro**: Para otimizar o formulário dentro do popup
- **page-cro**: Para o contexto da página ao redor dos popups
- **email-sequence**: Para o que acontece após a conversão no popup
- **ab-test-setup**: Para testar variações de popup
