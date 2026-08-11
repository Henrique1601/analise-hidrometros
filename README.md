# 💧 Análise de Hidrômetros - Dashboard

Sistema de análise de consumo de água para condomínios com 1444+ apartamentos. Detecta automaticamente consumo negativo e alto consumo a partir de planilhas Excel.

## 🎯 Funcionalidades

- **Carregamento de planilha Excel** - Arraste ou clique para selecionar
- **Detecção automática de anomalias**:
  - ❌ Consumo Negativo (possível erro de leitura)
  - ⚠️ Alto Consumo (possível vazamento)
- **Dashboard visual** com gráficos e estatísticas
- **Filtros** por torre e apartamento
- **Exportação** de alertas em CSV
- **Configurações ajustáveis** para limites de consumo

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar na pasta do projeto
cd analise-hidrometros-v2

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Uso

1. Acesse `http://localhost:5173` no navegador
2. Arraste sua planilha Excel (.xlsx) ou clique para selecionar
3. Ajuste os limites de consumo se necessário
4. Clique em "Analisar Dados"
5. Visualize os resultados no dashboard

## 📁 Estrutura do Projeto

```
analise-hidrometros-v2/
├── CLAUDE.md                    # Configuração do agente Claude Code
├── README.md                    # Esta documentação
├── package.json                 # Dependências e scripts
├── vite.config.ts               # Configuração Vite
├── tsconfig.json                # Configuração TypeScript
├── .claude/
│   └── skills/                  # Skills customizadas
│       ├── hidrometros-analyze.md
│       └── hidrometros-report.md
├── src/
│   ├── components/              # Componentes React
│   │   ├── Dashboard.tsx        # Componente principal
│   │   ├── FileUpload.tsx       # Upload de arquivos
│   │   ├── StatsCards.tsx       # Cards de estatísticas
│   │   ├── ConsumptionChart.tsx # Gráfico de consumo
│   │   ├── TowerChart.tsx       # Gráfico por torre
│   │   ├── AlertsList.tsx       # Lista de alertas
│   │   └── DataTable.tsx        # Tabela de dados
│   ├── hooks/                   # Custom hooks
│   │   ├── useExcelParser.ts    # Parser de Excel
│   │   └── useAnalysis.ts       # Análise de dados
│   ├── types/                   # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/                   # Utilitários
│   │   ├── analysis.ts          # Funções de análise
│   │   └── export.ts            # Exportação de dados
│   ├── __tests__/               # Testes
│   │   └── analysis.test.ts
│   ├── App.tsx                  # Componente raiz
│   ├── App.css                  # Estilos
│   └── main.tsx                 # Ponto de entrada
└── public/
    └── favicon.ico
```

## 📊 Formato da Planilha Excel

O dashboard é compatível com:

### Aba 2 (recomendada):
| Torre | Ap | Índice Anterior | Índice Atual | Consumo | Status |
|-------|----|-----------------|--------------|---------|--------|

### Aba 1 (fallback):
| Torre | Andar | Ap | Lado | Índice | Consumo |
|-------|-------|----|------|--------|---------|

## ⚙️ Configurações

- **Limite Alto Consumo**: Padrão 20m³ (ajustável)
- **Limite Baixo Consumo**: Padrão 1m³ (ajustável)

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build

# Testes
npm run test         # Roda todos os testes
npm run test:watch   # Testes em watch mode
npm run test:coverage # Coverage report

# Lint
npm run lint         # Verifica lint
```

## 🤖 Agente Claude Code

Este projeto está configurado para usar o Claude Code com skills específicas. Consulte o arquivo `CLAUDE.md` para mais detalhes.

### Skills Disponíveis

- **hidrometros-analyze** - Análise de dados de hidrômetros
- **hidrometros-report** - Geração de relatórios e gráficos
- **tdd** - Desenvolvimento orientado a testes
- **debug** - Depuração de erros
- **code-review** - Revisão de código
- **performance** - Otimização de performance
- **documentation** - Documentação do projeto

## 📊 Tecnologias

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Gráficos**: Chart.js + react-chartjs-2
- **Excel**: SheetJS (xlsx)
- **Testes**: Vitest + Testing Library
- **Lint**: OxLint

## 📝 Regras de Negócio

1. **Consumo Negativo**: Índice Atual < Índice Anterior → Possível erro de leitura
2. **Alto Consumo**: Consumo > 20m³ → Possível vazamento ou erro
3. **Consumo Zero**: Consumo = 0 → Apartamento sem medição
4. **Consumo Baixo**: Consumo < 1m³ → Possível medição incorreta

## 🔒 Segurança

- O projeto roda 100% offline
- Dados ficam apenas no navegador (não envia para servidor)
- Nenhuma informação é armazenada externamente

## 📄 Licença

MIT
