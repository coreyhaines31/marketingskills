# Contributing

Obrigado pelo interesse em contribuir com o Marketing Skills! Este guia vai ajudá-lo a adicionar novas skills ou melhorar as existentes.

## Solicitando uma Skill

Você também pode sugerir novas skills [abrindo uma solicitação de skill](https://github.com/coreyhaines31/marketingskills/issues/new?template=skill-request.yml).

## Adicionando uma Nova Skill

### 1. Crie o diretório da skill

```bash
mkdir -p skills/your-skill-name
```

### 2. Crie o arquivo SKILL.md

Toda skill precisa de um arquivo `SKILL.md` com frontmatter YAML:

```yaml
---
name: your-skill-name
description: When to use this skill. Include trigger phrases and keywords that help agents identify relevant tasks.
---

# Your Skill Name

Instructions for the agent go here...
```

Campos opcionais do frontmatter: `license` (padrão: MIT), `metadata` (autor, versão, etc.)

### 3. Siga as convenções de nomenclatura

- **Nome do diretório**: minúsculas, apenas hífens (ex.: `email-sequence`)
- **Campo name**: deve corresponder exatamente ao nome do diretório
- **Description**: 1-1024 caracteres, inclua frases de gatilho

### 4. Estruture sua skill

```
skills/your-skill-name/
├── SKILL.md           # Obrigatório - instruções principais
├── references/        # Opcional - documentação adicional
│   └── guide.md
├── scripts/           # Opcional - código executável
│   └── helper.py
└── assets/            # Opcional - templates, imagens, dados
    └── template.json
```

### 5. Escreva instruções eficazes

- Mantenha o `SKILL.md` com menos de 500 linhas
- Mova material de referência detalhado para `references/`
- Inclua instruções passo a passo
- Adicione exemplos de entradas e saídas
- Cubra casos extremos comuns

## Melhorando Skills Existentes

1. Leia a skill existente com atenção
2. Teste suas alterações localmente
3. Mantenha as mudanças focadas e mínimas
4. Atualize a versão nos metadados ao fazer alterações significativas

## Enviando Sua Contribuição

1. Faça um fork do repositório
2. Crie um branch de funcionalidade (`git checkout -b feature/new-skill-name`)
3. Faça suas alterações
4. Teste localmente com um agente de IA
5. Envie um pull request usando o template adequado:
   - [New Skill](?template=new-skill.md)
   - [Skill Update](?template=skill-update.md)
   - [Documentation](?template=documentation.md)

## Checklist de Qualidade da Skill

- [ ] `name` corresponde ao nome do diretório
- [ ] `description` explica claramente quando usar a skill
- [ ] Instruções são claras e práticas
- [ ] Nenhum dado sensível ou credencial
- [ ] Segue os padrões de skill existentes no repositório

## Dúvidas?

Abra uma issue se tiver dúvidas ou precisar de ajuda com sua contribuição.
