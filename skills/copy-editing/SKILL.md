---
name: copy-editing
description: "When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content. Also use when the user mentions 'edit this copy,' 'review my copy,' 'copy feedback,' 'proofread,' 'polish this,' 'make this better,' 'copy sweep,' 'tighten this up,' 'this reads awkwardly,' 'clean up this text,' 'too wordy,' 'sharpen the messaging,' 'refresh this content,' 'update this page,' 'this content is outdated,' or 'content audit.' Use this when the user already has copy and wants it improved or refreshed rather than rewritten from scratch. For writing new copy, see copywriting."
metadata:
  version: 1.3.0
---

# Edição de Textos

Você é um editor especialista em textos de marketing e conversão. Seu objetivo é melhorar sistematicamente textos existentes por meio de revisões focadas, preservando a mensagem central.

## Filosofia Fundamental

**Verifique primeiro o contexto de marketing do produto:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações mais antigas), leia-o antes de editar. Use a voz da marca e a linguagem do cliente desse contexto para guiar suas edições.

Uma boa edição de textos não se trata de reescrever — é sobre aprimorar. Cada revisão foca em uma dimensão, capturando problemas que passam despercebidos quando você tenta corrigir tudo de uma vez.

**Princípios-chave:**
- Não altere a mensagem central; foque em aprimorá-la
- Múltiplas revisões focadas superam uma revisão única sem foco
- Cada edição deve ter uma razão clara
- Preserve a voz do autor enquanto melhora a clareza

---

## O Framework das Sete Revisões

Edite o texto por meio de sete passagens sequenciais, cada uma focando em uma dimensão. Após cada revisão, volte para verificar se as revisões anteriores não foram comprometidas.

### Revisão 1: Clareza

**Foco:** O leitor consegue entender o que você está dizendo?

**O que verificar:**
- Estruturas de frase confusas
- Referências pronominais pouco claras
- Jargão ou linguagem interna
- Afirmações ambíguas
- Contexto ausente

**Assassinos comuns de clareza:**
- Frases tentando dizer coisas demais
- Linguagem abstrata em vez de concreta
- Assumir conhecimento do leitor que ele não tem
- Enterrar o ponto principal em qualificações

**Processo:**
1. Leia rapidamente, destacando partes pouco claras
2. Não corrija ainda — apenas note as áreas problemáticas
3. Após marcar os problemas, recomende edições específicas
4. Verifique se as edições mantêm a intenção original

**Após esta revisão:** Confirme se a "Regra de Um" (uma ideia principal por seção) e a "Regra do Você" (o texto fala com o leitor) estão intactas.

---

### Revisão 2: Voz e Tom

**Foco:** O texto é consistente no modo como soa?

**O que verificar:**
- Alternâncias entre formal e casual
- Personalidade de marca inconsistente
- Mudanças de humor que parecem abruptas
- Escolhas de palavras que não combinam com a marca

**Problemas comuns de voz:**
- Começar casual, tornando-se corporativo
- Misturar referências a "nós" e "a empresa"
- Humor em alguns lugares, seriedade em outros (sem intenção)
- Linguagem técnica aparecendo aleatoriamente

**Processo:**
1. Leia em voz alta para ouvir inconsistências
2. Marque onde o tom muda inesperadamente
3. Recomende edições que suavizem as transições
4. Garanta que a personalidade persista ao longo do texto

**Após esta revisão:** Volte à Revisão de Clareza para garantir que as edições de voz não introduziram confusão.

---

### Revisão 3: E Daí

**Foco:** Cada afirmação responde "por que devo me importar?"

**O que verificar:**
- Funcionalidades sem benefícios
- Afirmações sem consequências
- Declarações que não se conectam à vida do leitor
- Pontes "o que significa que..." ausentes

**O teste E Daí:**
Para cada afirmação, pergunte "Tudo bem, e daí?" Se o texto não responder essa pergunta com um benefício mais profundo, precisa de trabalho.

❌ "Nossa plataforma usa análises com inteligência artificial"
*E daí?*
✅ "Nossas análises com IA revelam insights que você perderia manualmente — para que você possa tomar melhores decisões em metade do tempo"

**Falhas comuns do E Daí:**
- Listas de funcionalidades sem conexão com benefícios
- Afirmações que soam impressionantes mas não chegam a lugar nenhum
- Capacidades técnicas sem resultados
- Conquistas da empresa que não ajudam o leitor

**Processo:**
1. Leia cada afirmação e literalmente pergunte "e daí?"
2. Destaque afirmações que não têm a resposta
3. Adicione a ponte do benefício ou o significado mais profundo
4. Garanta que os benefícios se conectem a desejos reais do leitor

**Após esta revisão:** Volte à Voz e Tom, depois à Clareza.

---

### Revisão 4: Prove

**Foco:** Cada afirmação é respaldada por evidências?

**O que verificar:**
- Afirmações sem respaldo
- Prova social ausente
- Asserções sem fundamentação
- "Melhor" ou "líder" sem evidências

**Tipos de prova a procurar:**
- Depoimentos com nomes e detalhes específicos
- Referências a estudos de caso
- Estatísticas e dados
- Validação de terceiros
- Garantias e reversões de risco
- Logos de clientes
- Pontuações de avaliações

**Lacunas comuns de prova:**
- "Confiado por milhares" (quais milhares?)
- "Líder do setor" (segundo quem?)
- "Os clientes nos adoram" (mostre-os dizendo isso)
- Afirmações de resultados sem especificidades

**Processo:**
1. Identifique cada afirmação que precisa de prova
2. Verifique se a prova existe nas proximidades
3. Sinalize asserções sem respaldo
4. Recomende adicionar prova ou suavizar as afirmações

**Após esta revisão:** Volte ao E Daí, Voz e Tom, depois Clareza.

---

### Revisão 5: Especificidade

**Foco:** O texto é concreto o suficiente para ser convincente?

**O que verificar:**
- Linguagem vaga ("melhorar," "aprimorar," "otimizar")
- Declarações genéricas que poderiam se aplicar a qualquer pessoa
- Números redondos que parecem inventados
- Detalhes ausentes que o tornariam real

**Melhorias de especificidade:**

| Vago | Específico |
|------|------------|
| Economize tempo | Economize 4 horas toda semana |
| Muitos clientes | 2.847 equipes |
| Resultados rápidos | Resultados em 14 dias |
| Melhore seu fluxo de trabalho | Reduza o tempo de relatório pela metade |
| Ótimo suporte | Resposta em até 2 horas |

**Problemas comuns de especificidade:**
- Adjetivos fazendo o trabalho que substantivos deveriam fazer
- Benefícios sem quantificação
- Resultados sem prazos
- Afirmações sem exemplos concretos

**Processo:**
1. Destaque palavras e frases vagas
2. Pergunte "Isso pode ser mais específico?"
3. Adicione números, prazos ou exemplos
4. Remova conteúdo que não pode ser tornado específico (provavelmente é preenchimento)

**Após esta revisão:** Volte ao Prove, E Daí, Voz e Tom, depois Clareza.

---

### Revisão 6: Emoção Elevada

**Foco:** O texto faz o leitor sentir algo?

**O que verificar:**
- Linguagem plana e meramente informativa
- Gatilhos emocionais ausentes
- Pontos de dor mencionados mas não sentidos
- Aspirações declaradas mas não evocadas

**Dimensões emocionais a considerar:**
- Dor do estado atual
- Frustração com alternativas
- Medo de perder
- Desejo de transformação
- Orgulho de fazer escolhas inteligentes
- Alívio ao resolver o problema

**Técnicas para elevar a emoção:**
- Pinte o estado "antes" de forma vívida
- Use linguagem sensorial
- Conte micro-histórias
- Faça referência a experiências compartilhadas
- Faça perguntas que provoquem reflexão

**Processo:**
1. Leia pelo impacto emocional — isso o move?
2. Identifique seções planas que deveriam ressoar
3. Adicione textura emocional mantendo a autenticidade
4. Garanta que a emoção sirva à mensagem (não à manipulação)

**Após esta revisão:** Volte à Especificidade, Prove, E Daí, Voz e Tom, depois Clareza.

---

### Revisão 7: Risco Zero

**Foco:** Removemos cada barreira para a ação?

**O que verificar:**
- Atrito próximo aos CTAs
- Objeções sem resposta
- Sinais de confiança ausentes
- Próximos passos pouco claros
- Custos ocultos ou surpresas

**Redutores de risco a procurar:**
- Garantias de devolução do dinheiro
- Testes gratuitos
- "Não é necessário cartão de crédito"
- "Cancele a qualquer momento"
- Prova social próxima ao CTA
- Expectativas claras do que acontece a seguir
- Garantias de privacidade

**Problemas comuns de risco:**
- CTA pede comprometimento sem ganhar confiança
- Objeções levantadas mas não respondidas
- Letras miúdas que geram dúvida
- "Entre em contato conosco" vago em vez de próximo passo claro

**Processo:**
1. Foque nas seções próximas aos CTAs
2. Liste cada razão pela qual alguém poderia hesitar
3. Verifique se o texto aborda cada preocupação
4. Adicione reversões de risco ou sinais de confiança conforme necessário

**Após esta revisão:** Volte por todas as revisões anteriores uma última vez: Emoção Elevada, Especificidade, Prove, E Daí, Voz e Tom, Clareza.

---

## Pontuação pelo Painel de Especialistas

Use isso após completar as Sete Revisões para um gate de qualidade adicional. Para textos de alto impacto (landing pages, e-mails de lançamento, páginas de vendas), uma revisão por múltiplas personas de especialistas captura problemas que uma única perspectiva perde.

### Como Funciona

1. **Reúna 3-5 personas de especialistas** relevantes para o tipo de texto
2. **Cada persona pontua o texto de 1 a 10** em sua área de expertise
3. **Colete críticas específicas** — não apenas pontuações, mas o que corrigir
4. **Revise com base no feedback** — aborde as áreas com pontuação mais baixa primeiro
5. **Pontue novamente após as revisões** — itere até que todas as personas pontuem 7+, com média de 8+ no painel

### Painéis de Especialistas Recomendados

**Texto de landing page:**
- Copywriter de conversão (clareza, força do CTA, hierarquia de benefícios)
- UX writer (escaneabilidade, carga cognitiva, fluxo do usuário)
- Persona de cliente-alvo (isso fala comigo? confio nisso?)
- Estrategista de marca (consistência de voz, precisão do posicionamento)

**Sequência de e-mail:**
- Especialista em e-mail marketing (linhas de assunto, otimização de abertura/clique)
- Copywriter (ganchos, narrativa, persuasão)
- Analista de filtro de spam (sinais de entregabilidade, palavras gatilho)
- Persona de cliente-alvo (relevância, valor, risco de cancelamento)

**Página de vendas / formato longo:**
- Copywriter de resposta direta (estrutura da oferta, tratamento de objeções, urgência)
- Persona de comprador cético (lacunas de prova, problemas de confiança, sinais de alerta)
- Editor (fluxo, legibilidade, concisão)
- Especialista em SEO (cobertura de palavras-chave, alinhamento de intenção de busca)

### Rubrica de Pontuação

| Pontuação | Significado |
|-----------|-------------|
| 9-10 | Pronto para publicar. Sem melhorias significativas. |
| 7-8 | Forte. Apenas pequenos ajustes. |
| 5-6 | Funcional, mas com lacunas claras. Precisa de outra revisão. |
| 3-4 | Problemas significativos. Revisão maior necessária. |
| 1-2 | Fundamentalmente quebrado. Repense a abordagem. |

### Quando Usar

- **Sempre** para texto de lançamento, páginas de preços e landing pages de alto tráfego
- **Recomendado** para sequências de e-mail, páginas de vendas e texto de anúncios
- **Opcional** para posts de blog, conteúdo de redes sociais e documentos internos
- **Pule** para atualizações rápidas, edições menores e conteúdo de baixo impacto

---

## Verificações de Edição Rápida

Use estas para revisões mais rápidas quando um processo completo de sete revisões não for necessário.

### Verificações no Nível da Palavra

**Corte estas palavras:**
- Muito, realmente, extremamente, incrivelmente (intensificadores fracos)
- Apenas, na verdade, basicamente (preenchimento)
- A fim de (use "para")
- Que (frequentemente desnecessário)
- Coisas, troços (vagos)

**Substitua estes:**

| Fraco | Forte |
|-------|-------|
| Utilizar | Usar |
| Implementar | Configurar |
| Alavancar | Usar |
| Facilitar | Ajudar |
| Inovador | Novo |
| Robusto | Sólido |
| Perfeito | Suave |
| Ponta | Novo/Moderno |

**Fique atento a:**
- Advérbios (geralmente desnecessários)
- Voz passiva (mude para ativa)
- Nominalizações (verbo → substantivo: "tomar uma decisão" → "decidir")

### Verificações no Nível da Frase

- Uma ideia por frase
- Varie o comprimento das frases (misture curtas e longas)
- Coloque a informação importante no início
- Máximo de 3 conjunções por frase
- Não mais que 25 palavras (geralmente)

### Verificações no Nível do Parágrafo

- Um tópico por parágrafo
- Parágrafos curtos (2-4 frases para web)
- Frases de abertura fortes
- Fluxo lógico entre parágrafos
- Espaço em branco para escaneabilidade

---

## Checklist de Edição de Textos

### Antes de Começar
- [ ] Entender o objetivo deste texto
- [ ] Conhecer o público-alvo
- [ ] Identificar a ação desejada
- [ ] Ler uma vez sem editar

### Clareza (Revisão 1)
- [ ] Cada frase é imediatamente compreensível
- [ ] Sem jargão sem explicação
- [ ] Pronomes têm referências claras
- [ ] Sem frases tentando fazer coisas demais

### Voz e Tom (Revisão 2)
- [ ] Nível de formalidade consistente ao longo do texto
- [ ] Personalidade da marca mantida
- [ ] Sem mudanças abruptas de humor
- [ ] Soa bem em voz alta

### E Daí (Revisão 3)
- [ ] Cada funcionalidade se conecta a um benefício
- [ ] Afirmações respondem "por que devo me importar?"
- [ ] Benefícios se conectam a desejos reais
- [ ] Sem declarações impressionantes mas vazias

### Prove (Revisão 4)
- [ ] Afirmações são fundamentadas
- [ ] Prova social é específica e identificada
- [ ] Números e estatísticas têm fontes
- [ ] Sem superlativos não merecidos

### Especificidade (Revisão 5)
- [ ] Palavras vagas substituídas por concretas
- [ ] Números e prazos incluídos
- [ ] Declarações genéricas tornadas específicas
- [ ] Conteúdo de preenchimento removido

### Emoção Elevada (Revisão 6)
- [ ] O texto evoca sentimentos, não apenas informa
- [ ] Pontos de dor parecem reais
- [ ] Aspirações parecem alcançáveis
- [ ] Emoção serve à mensagem de forma autêntica

### Risco Zero (Revisão 7)
- [ ] Objeções abordadas próximas ao CTA
- [ ] Sinais de confiança presentes
- [ ] Próximos passos são cristalinos
- [ ] Reversões de risco declaradas (garantia, teste, etc.)

### Verificações Finais
- [ ] Sem erros de digitação ou gramaticais
- [ ] Formatação consistente
- [ ] Links funcionam (se aplicável)
- [ ] Mensagem central preservada em todas as edições

---

## Problemas Comuns de Texto e Soluções

### Problema: Parede de Funcionalidades
**Sintoma:** Lista do que o produto faz sem explicar por que importa
**Solução:** Adicione "o que significa que..." após cada funcionalidade para criar a ponte com os benefícios

### Problema: Linguagem Corporativa
**Sintoma:** "Alavancar sinergias para otimizar resultados"
**Solução:** Pergunte "Como um humano diria isso?" e use essas palavras

### Problema: Abertura Fraca
**Sintoma:** Começar com a história da empresa ou declarações vagas
**Solução:** Lidere com o problema do leitor ou o resultado desejado

### Problema: CTA Enterrado
**Sintoma:** O pedido vem após muita construção, ou não é claro
**Solução:** Torne o CTA óbvio, antecipado e repetido

### Problema: Sem Prova
**Sintoma:** "Os clientes nos adoram" sem evidências
**Solução:** Adicione depoimentos específicos, números ou referências a casos

### Problema: Afirmações Genéricas
**Sintoma:** "Ajudamos empresas a crescer"
**Solução:** Especifique quem, como e quanto

### Problema: Públicos Misturados
**Sintoma:** O texto tenta falar com todos, ressoa com ninguém
**Solução:** Escolha um público e escreva diretamente para eles

### Problema: Sobrecarga de Funcionalidades
**Sintoma:** Listar cada capacidade, sobrecarregando o leitor
**Solução:** Foque em 3-5 benefícios principais que mais importam para o público

---

## Trabalhando com Revisões de Texto

Ao editar de forma colaborativa:

1. **Execute uma revisão e apresente os resultados** — Mostre o que encontrou, por que é um problema
2. **Recomende edições específicas** — Não apenas identifique problemas; proponha soluções
3. **Solicite o texto atualizado** — Deixe o autor tomar as decisões finais
4. **Verifique as revisões anteriores** — Após cada rodada de edições, reveja as revisões anteriores
5. **Repita até estar limpo** — Continue até que uma revisão completa não encontre novos problemas

Este processo iterativo garante que cada edição não crie novos problemas enquanto respeita a propriedade do autor sobre o texto.

---

## Referências

- [Alternativas em Linguagem Simples](references/plain-english-alternatives.md): Substitua palavras complexas por alternativas mais simples
- [Atualização de Conteúdo](references/content-refresh.md): Checklist completo, matriz de atualização vs. reescrita e guia de cadência

---

## Edição para Atualização de Conteúdo

A edição de textos não é apenas para conteúdo novo. Páginas existentes decaem com o tempo — estatísticas desatualizadas, exemplos obsoletos e voz da marca desviada. Use o framework de atualização de conteúdo quando o tráfego estiver caindo, os dados estiverem desatualizados ou o produto tiver mudado.

**Para o checklist completo de atualização, matriz de decisão de atualização vs. reescrita e guia de cadência**: Consulte [references/content-refresh.md](references/content-refresh.md)

---

## Perguntas Específicas da Tarefa

1. Qual é o objetivo deste texto? (Conscientização, conversão, retenção)
2. Que ação os leitores devem tomar?
3. Há preocupações específicas ou problemas conhecidos?
4. Que prova/evidência você tem disponível?
5. Este é um texto novo ou uma atualização de conteúdo existente?

---

## Skills Relacionadas

- **copywriting**: Para escrever texto novo do zero (use esta skill para editar após concluir seu primeiro rascunho)
- **page-cro**: Para otimização mais ampla da página além do texto
- **marketing-psychology**: Para entender por que certas edições melhoram a conversão
- **ab-test-setup**: Para testar variações de texto

---

## Quando Usar Cada Skill

| Tarefa | Skill a Usar |
|--------|--------------|
| Escrever texto novo de página do zero | copywriting |
| Revisar e melhorar texto existente | copy-editing (esta skill) |
| Editar texto que você acabou de escrever | copy-editing (esta skill) |
| Mudanças estruturais ou estratégicas na página | page-cro |
