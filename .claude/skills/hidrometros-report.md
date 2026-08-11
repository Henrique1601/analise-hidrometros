# Skill: Relatórios de Hidrômetros

## Descrição
Gera relatórios e visualizações dos dados de consumo de água.

## Quando Usar
- Quando precisar criar gráficos de consumo
- Quando precisar exportar dados
- Quando precisar gerar relatórios em CSV
- Quando precisar filtrar e ordenar dados

## Workflow

### 1. Gerar Gráficos
```typescript
// Usar componentes de gráfico
import { ConsumptionChart } from './components/ConsumptionChart';
import { TowerChart } from './components/TowerChart';

// Dados para gráfico de distribuição
const distributionData = {
  labels: ['< 0', '0', '1-5', '5-10', '10-15', '15-20', '> 20'],
  datasets: [{
    data: [countNeg, countZero, countLow, countMid, countHigh1, countHigh2, countVeryHigh]
  }]
};
```

### 2. Exportar Dados
```typescript
import { exportToCSV, exportAlerts } from './utils/export';

// Exportar todos os dados
exportToCSV(allData, 'consumo_completo.csv');

// Exportar apenas alertas
exportAlerts(alerts, 'alertas.csv');
```

### 3. Filtrar Dados
```typescript
// Filtrar por torre
const filteredByTower = data.filter(d => d.torre === 'A');

// Filtrar por status
const negatives = data.filter(d => d.statusClass === 'negative');
const highs = data.filter(d => d.statusClass === 'high');

// Filtrar por apartamento
const filteredByAp = data.filter(d => d.ap.includes('101'));
```

### 4. Ordenar Dados
```typescript
// Ordenar por consumo (maior para menor)
const sortedByConsumption = [...data].sort((a, b) => b.consumo - a.consumo);

// Ordenar por torre e apartamento
const sortedByLocation = [...data].sort((a, b) => 
  a.torre.localeCompare(b.torre) || a.ap.localeCompare(b.ap)
);
```

## Componentes de UI

### StatsCards
Mostra estatísticas gerais:
- Total de apartamentos
- Consumo negativo
- Alto consumo
- Média de consumo

### ConsumptionChart
Gráfico de barras com distribuição de consumo:
- Eixo X: Faixas de consumo
- Eixo Y: Quantidade de apartamentos

### TowerChart
Gráfico de barras com consumo médio por torre:
- Eixo X: Torres
- Eixo Y: Consumo médio (m³)

### AlertsList
Lista de alertas com ícones:
- ❌ Consumo negativo
- ⚠️ Alto consumo

### DataTable
Tabela com filtros:
- Filtro por torre
- Filtro por apartamento
- Abas: Todos / Negativos / Alto Consumo / OK

## Formato de Exportação CSV

```csv
Torre,Ap,Índice Anterior,Índice Atual,Consumo (m³),Status
A,101,150.00,165.50,15.50,OK
A,102,200.00,195.00,-5.00,NEGATIVO
B,201,180.00,205.00,25.00,ALTO
```

## Configurações de Visualização

```typescript
interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: { display: boolean };
    tooltip: { enabled: boolean };
  };
  scales: {
    y: { beginAtZero: boolean };
  };
}
```

## Comandos Úteis

```bash
# Executar testes de componentes
npm run test -- --testPathPattern=components

# Build de produção
npm run build

# Preview do build
npm run preview
```
