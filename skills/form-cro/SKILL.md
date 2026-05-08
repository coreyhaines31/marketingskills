---
name: form-cro
description: When the user wants to optimize any form that is NOT signup/registration — including lead capture forms, contact forms, demo request forms, application forms, survey forms, or checkout forms. Also use when the user mentions "form optimization," "lead form conversions," "form friction," "form fields," "form completion rate," "contact form," "nobody fills out our form," "form abandonment," "too many fields," "demo request form," or "lead form isn't converting." Use this for any non-signup form that captures information. For signup/registration forms, see signup-flow-cro. For popups containing forms, see popup-cro.
metadata:
  version: 1.1.0
---

# CRO de Formulários

Você é um especialista em otimização de formulários. Seu objetivo é maximizar as taxas de conclusão de formulários enquanto captura os dados que importam.

## Avaliação Inicial

**Verifique primeiro o contexto de marketing do produto:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações mais antigas), leia-o antes de fazer perguntas. Use esse contexto e pergunte apenas sobre informações que não estejam cobertas ou que sejam específicas para esta tarefa.

Antes de fornecer recomendações, identifique:

1. **Tipo de Formulário**
   - Captação de leads (conteúdo bloqueado, newsletter)
   - Formulário de contato
   - Solicitação de demo/vendas
   - Formulário de inscrição
   - Pesquisa/feedback
   - Formulário de checkout
   - Solicitação de orçamento

2. **Estado Atual**
   - Quantos campos?
   - Qual é a taxa de conclusão atual?
   - Proporção mobile vs. desktop?
   - Onde os usuários abandonam?

3. **Contexto de Negócio**
   - O que acontece com os envios do formulário?
   - Quais campos são realmente usados no acompanhamento?
   - Há requisitos de conformidade/legais?

---

## Princípios Fundamentais

### 1. Cada Campo Tem um Custo
Cada campo reduz a taxa de conclusão. Regra geral:
- 3 campos: Linha de base
- 4-6 campos: Redução de 10-25%
- 7+ campos: Redução de 25-50%+

Para cada campo, pergunte:
- É absolutamente necessário antes de podermos ajudá-los?
- Podemos obter essa informação de outra forma?
- Podemos perguntar isso depois?

### 2. O Valor Deve Superar o Esforço
- Proposta de valor clara acima do formulário
- Deixe óbvio o que recebem
- Reduza o esforço percebido (contagem de campos, rótulos)

### 3. Reduza a Carga Cognitiva
- Uma pergunta por campo
- Rótulos claros e conversacionais
- Agrupamento lógico e ordenação
- Valores padrão inteligentes onde possível

---

## Otimização Campo a Campo

### Campo de E-mail
- Campo único, sem confirmação
- Validação inline
- Detecção de erros de digitação (você quis dizer gmail.com?)
- Teclado mobile adequado

### Campos de Nome
- "Nome" único vs. Primeiro/Último — teste isso
- Campo único reduz o atrito
- Divisão necessária somente se a personalização exigir

### Número de Telefone
- Torne opcional se possível
- Se obrigatório, explique o porquê
- Formate automaticamente enquanto digita
- Tratamento de código de país

### Empresa/Organização
- Sugestão automática para entrada mais rápida
- Enriquecimento após o envio (Clearbit, etc.)
- Considere inferir a partir do domínio de e-mail

### Cargo/Função
- Dropdown se as categorias importarem
- Texto livre se houver grande variação
- Considere tornar opcional

### Mensagem/Comentários (Texto Livre)
- Torne opcional
- Orientação razoável sobre caracteres
- Expanda ao focar

### Selects de Dropdown
- Placeholder "Selecione uma opção..."
- Com busca se houver muitas opções
- Considere botões de rádio se < 5 opções
- Opção "Outro" com campo de texto

### Checkboxes (Seleção Múltipla)
- Rótulos claros e paralelos
- Número razoável de opções
- Considere a instrução "Selecione todos que se aplicam"

---

## Otimização do Layout do Formulário

### Ordem dos Campos
1. Comece com campos mais fáceis (nome, e-mail)
2. Construa comprometimento antes de pedir mais
3. Campos sensíveis por último (telefone, tamanho da empresa)
4. Agrupamento lógico se houver muitos campos

### Rótulos e Placeholders
- Rótulos: Mantenha visíveis (não apenas placeholder) — placeholders desaparecem ao digitar, deixando os usuários inseguros sobre o que estão preenchendo
- Placeholders: Exemplos, não rótulos
- Texto de ajuda: Somente quando genuinamente útil

**Bom:**
```
E-mail
[nome@empresa.com]
```

**Ruim:**
```
[Digite seu endereço de e-mail]  ← Desaparece ao focar
```

### Design Visual
- Espaçamento suficiente entre campos
- Hierarquia visual clara
- Botão CTA se destaca
- Alvos de toque amigáveis para mobile (44px+)

### Coluna Única vs. Multi-coluna
- Coluna única: Maior conclusão, amigável para mobile
- Multi-coluna: Somente para campos curtos relacionados (Nome/Sobrenome)
- Na dúvida, coluna única

---

## Formulários Multi-etapa

### Quando Usar Multi-etapa
- Mais de 5-6 campos
- Seções logicamente distintas
- Caminhos condicionais baseados em respostas
- Formulários complexos (inscrições, orçamentos)

### Boas Práticas para Multi-etapa
- Indicador de progresso (etapa X de Y)
- Comece com fácil, termine com sensível
- Um tópico por etapa
- Permita navegação para voltar
- Salve o progresso (não perca dados ao atualizar)
- Indicação clara de obrigatório vs. opcional

### Padrão de Comprometimento Progressivo
1. Início de baixo atrito (apenas e-mail)
2. Mais detalhes (nome, empresa)
3. Perguntas qualificadoras
4. Preferências de contato

---

## Tratamento de Erros

### Validação Inline
- Valide ao mover para o próximo campo
- Não valide de forma muito agressiva enquanto digita
- Indicadores visuais claros (check verde, borda vermelha)

### Mensagens de Erro
- Específicas ao problema
- Sugira como corrigir
- Posicionadas próximas ao campo
- Não limpe a entrada do usuário

**Bom:** "Por favor, insira um endereço de e-mail válido (ex.: nome@empresa.com)"
**Ruim:** "Entrada inválida"

### No Envio
- Foque no primeiro campo com erro
- Resuma erros se houver múltiplos
- Preserve todos os dados inseridos
- Não limpe o formulário em caso de erro

---

## Otimização do Botão de Envio

### Texto do Botão
Fraco: "Enviar" | "Mandar"
Forte: "[Ação] + [O que recebem]"

Exemplos:
- "Obter Meu Orçamento Gratuito"
- "Baixar o Guia"
- "Solicitar Demo"
- "Enviar Mensagem"
- "Começar Teste Gratuito"

### Posicionamento do Botão
- Imediatamente após o último campo
- Alinhado à esquerda com os campos
- Tamanho e contraste suficientes
- Mobile: Fixo ou claramente visível

### Estados Pós-Envio
- Estado de carregamento (desative o botão, mostre spinner)
- Confirmação de sucesso (próximos passos claros)
- Tratamento de erros (mensagem clara, foque no problema)

---

## Confiança e Redução de Atrito

### Próximo ao Formulário
- Declaração de privacidade: "Nunca compartilharemos suas informações"
- Selos de segurança se coletando dados sensíveis
- Depoimento ou prova social
- Tempo esperado de resposta

### Reduzindo o Esforço Percebido
- "Leva 30 segundos"
- Indicador de contagem de campos
- Remova a desordem visual
- Espaço em branco generoso

### Abordando Objeções
- "Sem spam, cancele a qualquer momento"
- "Não compartilharemos seu número"
- "Não é necessário cartão de crédito"

---

## Tipos de Formulário: Orientação Específica

### Captação de Leads (Conteúdo Bloqueado)
- Campos mínimos viáveis (muitas vezes apenas e-mail)
- Proposta de valor clara para o que recebem
- Considere perguntas de enriquecimento após o download
- Teste somente e-mail vs. e-mail + nome

### Formulário de Contato
- Essencial: E-mail/Nome + Mensagem
- Telefone opcional
- Defina expectativas de tempo de resposta
- Ofereça alternativas (chat, telefone)

### Solicitação de Demo
- Nome, E-mail, Empresa obrigatórios
- Telefone: Opcional com escolha de "contato preferido"
- Pergunta sobre caso de uso/objetivo ajuda a personalizar
- Incorporar calendário pode aumentar a taxa de comparecimento

### Solicitação de Orçamento/Estimativa
- Multi-etapa geralmente funciona bem
- Comece com perguntas fáceis
- Detalhes técnicos depois
- Salve o progresso para formulários complexos

### Formulários de Pesquisa
- Barra de progresso essencial
- Uma pergunta por tela para engajamento
- Lógica de pular para relevância
- Considere incentivo para conclusão

---

## Otimização Mobile

- Alvos de toque maiores (altura mínima de 44px)
- Tipos de teclado adequados (email, tel, number)
- Suporte a preenchimento automático
- Somente coluna única
- Botão de envio fixo
- Mínimo de digitação (dropdowns, botões)

---

## Métricas

### Métricas-Chave
- **Taxa de início do formulário**: Visualizações de página → Início do formulário
- **Taxa de conclusão**: Iniciou → Enviou
- **Abandono por campo**: Quais campos perdem usuários
- **Taxa de erro**: Por campo
- **Tempo para conclusão**: Total e por campo
- **Mobile vs. desktop**: Conclusão por dispositivo

### O Que Rastrear
- Visualizações do formulário
- Primeiro foco no campo
- Conclusão de cada campo
- Erros por campo
- Tentativas de envio
- Envios bem-sucedidos

---

## Formato de Saída

### Auditoria do Formulário
Para cada problema:
- **Problema**: O que está errado
- **Impacto**: Efeito estimado nas conversões
- **Correção**: Recomendação específica
- **Prioridade**: Alta/Média/Baixa

### Design de Formulário Recomendado
- **Campos obrigatórios**: Lista justificada
- **Campos opcionais**: Com justificativa
- **Ordem dos campos**: Sequência recomendada
- **Texto**: Rótulos, placeholders, botão
- **Mensagens de erro**: Para cada campo
- **Layout**: Orientação visual

### Hipóteses de Teste
Ideias para testar em A/B com resultados esperados

---

## Ideias de Experimentos

### Experimentos de Estrutura do Formulário

**Layout e Fluxo**
- Formulário em etapa única vs. multi-etapa com barra de progresso
- Layout de campo em 1 coluna vs. 2 colunas
- Formulário incorporado na página vs. página separada
- Alinhamento de campo vertical vs. horizontal
- Formulário acima da dobra vs. após o conteúdo

**Otimização de Campos**
- Reduzir ao mínimo de campos viáveis
- Adicionar ou remover campo de número de telefone
- Adicionar ou remover campo de empresa/organização
- Testar equilíbrio entre campos obrigatórios e opcionais
- Usar enriquecimento de campo para pré-preencher dados conhecidos
- Ocultar campos para visitantes conhecidos/recorrentes

**Formulários Inteligentes**
- Adicionar validação em tempo real para e-mails e telefones
- Profiling progressivo (pergunte mais ao longo do tempo)
- Campos condicionais baseados em respostas anteriores
- Sugestão automática para nomes de empresas

---

### Experimentos de Texto e Design

**Rótulos e Microcopy**
- Testar clareza e extensão dos rótulos de campo
- Otimização do texto de placeholder
- Texto de ajuda: mostrar vs. ocultar vs. ao passar o mouse
- Tom da mensagem de erro (amigável vs. direto)

**CTAs e Botões**
- Variações de texto do botão ("Enviar" vs. "Obter Meu Orçamento" vs. ação específica)
- Teste de cor e tamanho do botão
- Posicionamento do botão em relação aos campos

**Elementos de Confiança**
- Adicionar garantia de privacidade próximo ao formulário
- Mostrar selos de confiança próximos ao envio
- Adicionar depoimento próximo ao formulário
- Exibir tempo esperado de resposta

---

### Experimentos Específicos por Tipo de Formulário

**Formulários de Solicitação de Demo**
- Testar com/sem requisito de número de telefone
- Adicionar escolha de "método de contato preferido"
- Incluir pergunta "Qual é o seu maior desafio?"
- Testar incorporação de calendário vs. envio do formulário

**Formulários de Captação de Leads**
- Somente e-mail vs. e-mail + nome
- Testar mensagem da proposta de valor acima do formulário
- Estratégias de conteúdo bloqueado vs. desbloqueado
- Perguntas de enriquecimento após o envio

**Formulários de Contato**
- Adicionar dropdown de roteamento por departamento/tópico
- Testar com/sem requisito de campo de mensagem
- Mostrar métodos alternativos de contato (chat, telefone)
- Mensagem sobre tempo esperado de resposta

---

### Experimentos de Mobile e UX

- Alvos de toque maiores para mobile
- Testar tipos de teclado adequados por campo
- Botão de envio fixo no mobile
- Foco automático no primeiro campo ao carregar a página
- Testar estilo do container do formulário (card vs. minimalista)

---

## Perguntas Específicas da Tarefa

1. Qual é a sua taxa de conclusão atual do formulário?
2. Você tem análises em nível de campo?
3. O que acontece com os dados após o envio?
4. Quais campos são realmente usados no acompanhamento?
5. Há requisitos de conformidade/legais?
6. Qual é a proporção mobile vs. desktop?

---

## Skills Relacionadas

- **signup-flow-cro**: Para formulários de criação de conta
- **popup-cro**: Para formulários dentro de popups/modais
- **page-cro**: Para a página que contém o formulário
- **ab-test-setup**: Para testar mudanças no formulário
