# 🤖 Agente Claude Code - Análise de Hidrômetros

## 📋 Visão Geral do Projeto

Sistema de análise de consumo de água para condomínios com 1444+ apartamentos. Detecta automaticamente consumo negativo e alto consumo a partir de planilhas Excel geradas pelo app de captura de hidrômetros.

## 🎯 Comportamento do Agente

### Regras Fundamentais
1. **SEMPRE pergunte antes de implementar** - Entenda o contexto antes de escrever código
2. **Use skills para cada tarefa** - Carregue a skill apropriada antes de começar
3. **Siga convenções existentes** - Mantenha consistência com o código já escrito
4. **Teste sempre** - Execute testes após cada mudança significativa
5. **Documente mudanças** - Atualize README e comments quando necessário

### Fluxo de Trabalho
```
1. Entender tarefa → 2. Carregar skill → 3. Perguntar se necessário → 4. Implementar → 5. Testar → 6. Documentar
```

## 🛠️ Skills Disponíveis

### Para Implementação
- **tdd** - Desenvolvimento orientado a testes
- **write-spec** - Especificação de features antes de implementar
- **frontend-design** - Design e UX do dashboard

### Para Manutenção
- **debug** - Encontrar e corrigir bugs
- **code-review** - Revisão de código e boas práticas
- **performance** - Otimização de performance (vercel-react-best-practices)

### Para Documentação
- **documentation** - Criar e manter documentação
- **find-docs** - Buscar documentação de bibliotecas

### Para o Projeto
- **data-visualization** - Gráficos e visualização de dados
- **xlsx** - Manipulação de planilhas Excel

## 📁 Estrutura do Projeto

```
analise-hidrometros-v2/
├── CLAUDE.md                    # Este arquivo
├── README.md                    # Documentação do projeto
├── package.json                 # Dependências
├── vite.config.ts               # Configuração Vite
├── tsconfig.json                # Configuração TypeScript
├── .claude/
│   └── skills/                  # Skills customizadas
│       ├── hidrometros-analyze.md
│       └── hidrometros-report.md
├── src/
│   ├── components/              # Componentes React
│   │   ├── Dashboard.tsx
│   │   ├── FileUpload.tsx
│   │   ├── StatsCards.tsx
│   │   ├── ConsumptionChart.tsx
│   │   ├── TowerChart.tsx
│   │   ├── AlertsList.tsx
│   │   └── DataTable.tsx
│   ├── hooks/                   # Custom hooks
│   │   ├── useExcelParser.ts
│   │   └── useAnalysis.ts
│   ├── types/                   # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/                   # Utilitários
│   │   ├── analysis.ts
│   │   └── export.ts
│   ├── __tests__/               # Testes
│   │   ├── analysis.test.ts
│   │   └── components.test.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
└── public/
    └── favicon.ico
```

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

# Lint e Formatação
npm run lint         # Verifica lint
npm run format       # Formata código

# Análise
npm run analyze      # Analisa bundle
```

## 📊 Tipos de Dados

```typescript
interface WaterMeterData {
  torre: string;
  ap: string;
  indiceAnterior: number;
  indiceAtual: number;
  consumo: number;
  status: string;
  statusClass: 'ok' | 'negative' | 'high';
}

interface AnalysisResult {
  totalApartments: number;
  negativeCount: number;
  highCount: number;
  averageConsumption: number;
  alerts: Alert[];
  towerData: TowerData;
}

interface Alert {
  type: 'negative' | 'high';
  message: string;
  tower: string;
  ap: string;
  value: number;
}
```

## ⚙️ Configurações Padrão

- **Limite Alto Consumo**: 20m³ (configurável pelo usuário)
- **Limite Baixo Consumo**: 1m³ (configurável pelo usuário)
- **Formato de Entrada**: Excel (.xlsx)
- **Formato de Saída**: Dashboard HTML + CSV export

## 🚨 Regras de Negócio

1. **Consumo Negativo**: Índice Atual < Índice Anterior → Possível erro de leitura
2. **Alto Consumo**: Consumo > 20m³ → Possível vazamento ou erro
3. **Consumo Zero**: Consumo = 0 → Apartamento sem medição
4. **Consumo Baixo**: Consumo < 1m³ → Possível medição incorreta

## 📝 Notas Importantes

- O projeto roda 100% offline
- Dados ficam apenas no navegador (não envia para servidor)
- Compatível com as 3 abas da planilha original
- Dashboard responsivo para desktop
