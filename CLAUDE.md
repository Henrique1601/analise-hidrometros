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

## 🏗️ Estrutura de Software

### Princípios de Organização
- **Separação por responsabilidade** - Cada arquivo tem UMA responsabilidade clara
- **Separação por pastas** - Código agrupado por domínio funcional
- **Nomes descritivos** - Arquivos e funções com nomes que explicam o que fazem
- **Barreiras claras** - Componentes, hooks, contexts, utils e types nunca se misturam

### Estrutura de Pastas
```
src/
├── components/          # Componentes React (UI reutilizável)
│   ├── Layout.tsx       # Layout com sidebar + Outlet
│   ├── Sidebar.tsx      # Navegação lateral (NavLink)
│   ├── FileUpload.tsx   # Upload de arquivos
│   ├── StatCard.tsx     # Card de estatísticas reutilizável
│   ├── ConsumptionChart.tsx  # Gráfico de consumo
│   ├── TowerChart.tsx   # Gráfico por torre
│   ├── AlertsList.tsx   # Lista de alertas
│   ├── DataTable.tsx    # Tabela com paginação e ordenação
│   └── Button.tsx       # Botão reutilizável
├── pages/               # Páginas (rotas)
│   ├── DashboardPage.tsx    # Visão geral com stats
│   ├── UploadPage.tsx       # Upload + configurações
│   ├── AnalysisPage.tsx     # Gráficos
│   ├── AlertsPage.tsx       # Lista de alertas
│   ├── ReportsPage.tsx      # Tabela detalhada
│   └── SettingsPage.tsx     # Configurações
├── contexts/            # React Context (estado compartilhado)
│   └── AppContext.tsx    # Estado global da aplicação
├── hooks/               # Custom hooks
│   └── useExcelParser.ts    # Parser de Excel
├── types/               # Tipos TypeScript (contratos)
│   └── index.ts
├── constants/           # Constantes compartilhadas
│   └── index.ts
├── utils/               # Funções puras (sem estado)
│   ├── analysis.ts
│   └── export.ts
├── __tests__/           # Testes
│   ├── analysis.test.ts
│   └── export.test.ts
├── App.tsx              # Router + Providers
└── main.tsx             # Ponto de entrada
```

### Regras de Separação
1. **Components** → Só UI reutilizável. Recebem props, renderizam JSX.
2. **Pages** → Uma por rota. Usa context para acessar estado.
3. **Contexts** → Estado compartilhado entre páginas.
4. **Hooks** → Lógica reutilizável (parser, etc).
5. **Utils** → Funções puras. Input → Output.
6. **Types** → Contratos. Definem a forma dos dados.
7. **Constants** → Valores fixos.

### Rotas
| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | DashboardPage | Visão geral com cards de estatísticas |
| `/upload` | UploadPage | Upload de planilha + configurações |
| `/analysis` | AnalysisPage | Gráficos de consumo e torre |
| `/alerts` | AlertsPage | Lista de alertas detectados |
| `/reports` | ReportsPage | Tabela detalhada com filtros |
| `/settings` | SettingsPage | Configurações e zona de perigo |

### Quando criar um novo arquivo
- **Nova página** → `src/pages/NomeDaPagina.tsx` + adicionar rota em `App.tsx`
- **Novo componente** → `src/components/NomeDoComponente.tsx`
- **Novo hook** → `src/hooks/useNomeDoHook.ts`
- **Novo context** → `src/contexts/NomeDoContext.tsx`
- **Nova função util** → `src/utils/nomeDaFuncao.ts`
- **Novo tipo** → Adicionar em `src/types/index.ts`
- **Nova constante** → Adicionar em `src/constants/index.ts`
- **Novo teste** → `src/__tests__/nomeDoModulo.test.ts`

## 🛠️ Skills Disponíveis

### Para Implementação
- **tdd** - Desenvolvimento orientado a testes
- **write-spec** - Especificação de features antes de implementar
- **frontend-design** - Design e UX do dashboard

### Para Manutenção
- **debug** - Encontrar e corrigir bugs
- **code-review** - Revisão de código e boas práticas
- **performance** - Otimização de performance

### Para Documentação
- **documentation** - Criar e manter documentação
- **find-docs** - Buscar documentação de bibliotecas

### Para o Projeto
- **data-visualization** - Gráficos e visualização de dados
- **xlsx** - Manipulação de planilhas Excel

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
  zeroCount: number;
  lowCount: number;
  okCount: number;
  averageConsumption: number;
  totalConsumption: number;
  alerts: Alert[];
  towerData: TowerData;
}

interface FilterConfig {
  tower: string;
  apartment: string;
  status: 'all' | 'negative' | 'high' | 'zero' | 'low' | 'ok';
  consumptionMin: string;
  consumptionMax: string;
}
```

## ⚙️ Configurações Padrão

- **Limite Alto Consumo**: 20m³ (configurável, salvo no localStorage)
- **Limite Baixo Consumo**: 1m³ (configurável, salvo no localStorage)
- **Formato de Entrada**: Excel (.xlsx)
- **Formato de Saída**: Dashboard HTML + CSV export
- **Paginação**: 25 itens por padrão (configurável)

## 🚨 Regras de Negócio

1. **Consumo Negativo**: Índice Atual < Índice Anterior → Possível erro de leitura
2. **Alto Consumo**: Consumo > limite configurável → Possível vazamento ou erro
3. **Consumo Zero**: Consumo = 0 → Apartamento sem medição
4. **Consumo Baixo**: Consumo < limite configurável → Possível medição incorreta

## 📝 Notas Importantes

- O projeto roda 100% offline
- Dados ficam apenas no navegador (não envia para servidor)
- Compatível com as 3 abas da planilha original
- Dashboard responsivo para desktop
- Configurações salvas automaticamente no localStorage
