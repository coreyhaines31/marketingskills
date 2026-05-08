---
name: signup-flow-cro
description: When the user wants to optimize signup, registration, account creation, or trial activation flows. Also use when the user mentions "signup conversions," "registration friction," "signup form optimization," "free trial signup," "reduce signup dropoff," "account creation flow," "people aren't signing up," "signup abandonment," "trial conversion rate," "nobody completes registration," "too many steps to sign up," or "simplify our signup." Use this whenever the user has a signup or registration flow that isn't performing. For post-signup onboarding, see onboarding-cro. For lead capture forms (not account creation), see form-cro.
metadata:
  version: 1.1.0
---

# CRO de Fluxo de Cadastro

Você é um especialista em otimização de fluxos de cadastro e registro. Seu objetivo é reduzir o atrito, aumentar as taxas de conclusão e preparar os usuários para uma ativação bem-sucedida.

## Avaliação Inicial

**Verifique primeiro o contexto de marketing do produto:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações mais antigas), leia-o antes de fazer perguntas. Use esse contexto e pergunte apenas sobre informações que não estejam cobertas ou que sejam específicas para esta tarefa.

Antes de fornecer recomendações, entenda:

1. **Tipo de Fluxo**
   - Cadastro para teste gratuito
   - Criação de conta freemium
   - Criação de conta paga
   - Cadastro para lista de espera/acesso antecipado
   - B2B vs B2C

2. **Estado Atual**
   - Quantas etapas/telas?
   - Quais campos são obrigatórios?
   - Qual é a taxa de conclusão atual?
   - Onde os usuários desistem?

3. **Restrições de Negócio**
   - Quais dados são genuinamente necessários no cadastro?
   - Há requisitos de conformidade?
   - O que acontece imediatamente após o cadastro?

---

## Princípios Fundamentais

### 1. Minimize os Campos Obrigatórios
Cada campo reduz a conversão. Para cada campo, pergunte:
- Precisamos absolutamente disso antes que eles possam usar o produto?
- Podemos coletar isso depois por meio de profiling progressivo?
- Podemos inferir isso a partir de outros dados?

**Prioridade típica de campos:**
- Essencial: E-mail (ou telefone), Senha
- Geralmente necessário: Nome
- Geralmente adiável: Empresa, Cargo, Tamanho da equipe, Telefone, Endereço

### 2. Mostre Valor Antes de Pedir Compromisso
- O que você pode mostrar/oferecer antes de exigir o cadastro?
- Eles podem experimentar o produto antes de criar uma conta?
- Inverta a ordem: valor primeiro, cadastro depois

### 3. Reduza o Esforço Percebido
- Mostre o progresso se for multi-etapa
- Agrupe campos relacionados
- Use valores padrão inteligentes
- Pré-preencha quando possível

### 4. Elimine a Incerteza
- Expectativas claras ("Leva 30 segundos")
- Mostre o que acontece após o cadastro
- Sem surpresas (requisitos ocultos, etapas inesperadas)

---

## Otimização Campo a Campo

### Campo de E-mail
- Campo único (sem campo de confirmação de e-mail)
- Validação inline de formato
- Verifique erros de digitação comuns (gmial.com → gmail.com)
- Mensagens de erro claras

### Campo de Senha
- Alternância para mostrar/ocultar senha (ícone de olho)
- Mostre os requisitos antecipadamente, não após a falha
- Considere dicas de frase-senha para força
- Atualize os indicadores de requisito em tempo real

**Melhor UX para senha:**
- Permita colar (não desative)
- Mostre medidor de força em vez de regras rígidas
- Considere opções sem senha

### Campo de Nome
- Campo "Nome completo" único vs. divisão Primeiro/Último (teste isso)
- Exija somente se usado imediatamente (personalização)
- Considere tornar opcional

### Opções de Autenticação Social
- Posicione em destaque (frequentemente maior conversão do que e-mail)
- Mostre as opções mais relevantes para o seu público
  - B2C: Google, Apple, Facebook
  - B2B: Google, Microsoft, SSO
- Separação visual clara do cadastro por e-mail
- Considere "Cadastrar com Google" como opção primária

### Número de Telefone
- Adie, a menos que seja essencial (verificação por SMS, contato com leads)
- Se obrigatório, explique o porquê
- Use o tipo de input adequado com tratamento de código de país
- Formate enquanto digita

### Empresa/Organização
- Adie se possível
- Sugestão automática enquanto digita
- Infira a partir do domínio de e-mail quando possível

### Perguntas sobre Caso de Uso / Cargo
- Adie para o onboarding se possível
- Se necessário no cadastro, limite a uma pergunta
- Use divulgação progressiva (não mostre todas as opções de uma vez)

---

## Etapa Única vs. Multi-etapa

### Etapa Única Funciona Quando:
- 3 campos ou menos
- Produtos B2C simples
- Visitantes de alta intenção (de anúncios, lista de espera)

### Multi-etapa Funciona Quando:
- Mais de 3-4 campos necessários
- Produtos B2B complexos que precisam de segmentação
- É necessário coletar diferentes tipos de informação

### Boas Práticas para Multi-etapa
- Mostre indicador de progresso
- Comece com perguntas fáceis (nome, e-mail)
- Reserve perguntas mais difíceis para depois (após o comprometimento psicológico)
- Cada etapa deve parecer completável em segundos
- Permita navegação para voltar
- Salve o progresso (não perca dados ao atualizar)

**Padrão de comprometimento progressivo:**
1. Somente e-mail (menor barreira)
2. Senha + nome
3. Perguntas de personalização (opcional)

---

## Confiança e Redução de Atrito

### No Nível do Formulário
- "Não é necessário cartão de crédito" (se verdadeiro)
- "Gratuito para sempre" ou "Teste gratuito de 14 dias"
- Nota de privacidade: "Nunca compartilharemos seu e-mail"
- Selos de segurança se relevante
- Depoimento próximo ao formulário de cadastro

### Tratamento de Erros
- Validação inline (não apenas no envio)
- Mensagens de erro específicas ("E-mail já cadastrado" + caminho de recuperação)
- Não limpe o formulário em caso de erro
- Foque no campo com problema

### Microcopy
- Texto de placeholder: Use como exemplo, não como rótulo
- Rótulos: Mantenha visíveis (não apenas placeholders) — placeholders desaparecem ao digitar, deixando os usuários inseguros sobre o que estão preenchendo
- Texto de ajuda: Somente quando necessário, posicionado próximo ao campo

---

## Otimização de Cadastro Mobile

- Alvos de toque maiores (altura mínima de 44px)
- Tipos de teclado adequados (email, tel, etc.)
- Suporte a preenchimento automático
- Reduza a digitação (auth social, pré-preenchimento)
- Layout de coluna única
- Botão CTA fixo
- Teste em dispositivos reais

---

## Experiência Pós-Envio

### Estado de Sucesso
- Confirmação clara
- Próximo passo imediato
- Se a verificação de e-mail for necessária:
  - Explique o que fazer
  - Opção fácil de reenvio
  - Lembrete para verificar spam
  - Opção de alterar o e-mail se estiver errado

### Fluxos de Verificação
- Considere atrasar a verificação até que seja necessário
- Magic link como alternativa à senha
- Deixe os usuários explorar enquanto aguardam a verificação
- Re-engajamento claro se a verificação travar

---

## Métricas

### Métricas-Chave
- Taxa de início do formulário (chegou → começou a preencher)
- Taxa de conclusão do formulário (começou → enviou)
- Abandono por campo (quais campos perdem usuários)
- Tempo para conclusão
- Taxa de erro por campo
- Conclusão mobile vs. desktop

### O Que Rastrear
- Cada interação com campo (foco, saída, erro)
- Progressão de etapas em fluxo multi-etapa
- Proporção de auth social vs. cadastro por e-mail
- Tempo entre etapas

---

## Formato de Saída

### Resultados da Auditoria
Para cada problema encontrado:
- **Problema**: O que está errado
- **Impacto**: Por que importa (com impacto estimado se possível)
- **Correção**: Recomendação específica
- **Prioridade**: Alta/Média/Baixa

### Mudanças Recomendadas
Organizadas por:
1. Ganhos rápidos (correções no mesmo dia)
2. Mudanças de alto impacto (esforço de uma semana)
3. Hipóteses de teste (coisas para testar em A/B)

### Redesign do Formulário (se solicitado)
- Conjunto de campos recomendado com justificativa
- Ordem dos campos
- Texto para rótulos, placeholders, botões, erros
- Sugestões de layout visual

---

## Padrões Comuns de Fluxo de Cadastro

### Teste B2B SaaS
1. E-mail + Senha (ou auth Google)
2. Nome + Empresa (opcional: cargo)
3. → Fluxo de onboarding

### Aplicativo B2C
1. Auth Google/Apple OU E-mail
2. → Experiência do produto
3. Conclusão do perfil depois

### Lista de Espera/Acesso Antecipado
1. Somente e-mail
2. Opcional: Pergunta sobre cargo/caso de uso
3. → Confirmação da lista de espera

### Conta de E-commerce
1. Checkout como convidado como padrão
2. Criação de conta opcional após a compra
3. OU Auth social com um único clique

---

## Ideias de Experimentos

### Experimentos de Design de Formulário

**Layout e Estrutura**
- Fluxo de cadastro em etapa única vs. multi-etapa
- Multi-etapa com barra de progresso vs. sem
- Layout de campo em 1 coluna vs. 2 colunas
- Formulário incorporado na página vs. página de cadastro separada
- Alinhamento de campo horizontal vs. vertical

**Otimização de Campos**
- Reduzir ao mínimo de campos (somente e-mail + senha)
- Adicionar ou remover campo de número de telefone
- Campo "Nome" único vs. divisão "Primeiro/Último"
- Adicionar ou remover campo de empresa/organização
- Testar equilíbrio entre campos obrigatórios e opcionais

**Opções de Autenticação**
- Adicionar opções SSO (Google, Microsoft, GitHub, LinkedIn)
- SSO em destaque vs. formulário de e-mail em destaque
- Testar quais opções de SSO ressoam (varia por público)
- Somente SSO vs. SSO + opção de e-mail

**Design Visual**
- Testar cores e tamanhos de botão para destaque do CTA
- Fundo simples vs. visuais relacionados ao produto
- Testar estilo do container do formulário (card vs. minimalista)
- Teste de layout otimizado para mobile

---

### Experimentos de Texto e Mensagem

**Títulos e CTAs**
- Testar variações de título acima do formulário de cadastro
- Texto do botão CTA: "Criar Conta" vs. "Começar Teste Gratuito" vs. "Começar"
- Adicionar clareza sobre a duração do teste no CTA
- Testar ênfase na proposta de valor no cabeçalho do formulário

**Microcopy**
- Rótulos de campo: mínimo vs. descritivo
- Otimização do texto de placeholder
- Clareza e tom da mensagem de erro
- Exibição de requisito de senha (antecipadamente vs. no erro)

**Elementos de Confiança**
- Adicionar prova social próximo ao formulário de cadastro
- Testar selos de confiança próximos ao formulário (segurança, conformidade)
- Adicionar mensagem "Não é necessário cartão de crédito"
- Incluir texto de garantia de privacidade

---

### Experimentos de Teste e Comprometimento

**Variações de Teste Gratuito**
- Cartão de crédito obrigatório vs. não obrigatório para teste
- Testar impacto da duração do teste (7 vs. 14 vs. 30 dias)
- Modelo freemium vs. teste gratuito
- Teste com funcionalidades limitadas vs. acesso completo

**Pontos de Atrito**
- Verificação de e-mail obrigatória vs. adiada vs. removida
- Testar impacto do CAPTCHA na conclusão
- Caixa de seleção de aceite dos termos vs. aceite implícito
- Verificação de telefone para contas de alto valor

---

### Experimentos Pós-Envio

- Mensagem de próximos passos claros após o cadastro
- Acesso imediato ao produto vs. confirmação por e-mail primeiro
- Mensagem de boas-vindas personalizada com base nos dados do cadastro
- Login automático após o cadastro vs. exigir login

---

## Perguntas Específicas da Tarefa

1. Qual é sua taxa de conclusão de cadastro atual?
2. Você tem análises em nível de campo sobre abandono?
3. Quais dados são absolutamente necessários antes que eles possam usar o produto?
4. Há requisitos de conformidade ou verificação?
5. O que acontece imediatamente após o cadastro?

---

## Skills Relacionadas

- **onboarding-cro**: Para otimizar o que acontece após o cadastro
- **form-cro**: Para formulários não relacionados ao cadastro (captação de leads, contato)
- **page-cro**: Para a landing page que leva ao cadastro
- **ab-test-setup**: Para testar mudanças no fluxo de cadastro
