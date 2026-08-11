# Skill: Análise de Hidrômetros

## Descrição
Analisa planilhas Excel de hidrômetros para detectar consumo negativo, alto consumo e outras anomalias.

## Quando Usar
- Quando o usuário carregar uma planilha Excel
- Quando precisar recalcular consumo
- Quando precisar detectar anomalias
- Quando precisar filtrar dados por torre ou apartamento

## Workflow

### 1. Carregar Dados
```typescript
// Usar hook useExcelParser para ler planilha
const { data, loading, error } = useExcelParser(file);
```

### 2. Analisar Consumo
```typescript
// Usar função analysis.ts
const result = analyzeConsumption(data, {
  highLimit: 20,
  lowLimit: 1
});
```

### 3. Detectar Anomalias
```typescript
// Função retorna alertas
result.alerts.forEach(alert => {
  if (alert.type === 'negative') {
    // Consumo negativo - possível erro
  } else if (alert.type === 'high') {
    // Alto consumo - possível vazamento
  }
});
```

### 4. Gerar Relatório
```typescript
// Usar função export.ts
exportToCSV(result.alerts, 'alertas.csv');
```

## Tipos de Dados

```typescript
interface AnalysisConfig {
  highLimit: number;  // Padrão: 20m³
  lowLimit: number;   // Padrão: 1m³
}

interface AnalysisResult {
  totalApartments: number;
  negativeCount: number;
  highCount: number;
  zeroCount: number;
  lowCount: number;
  okCount: number;
  averageConsumption: number;
  alerts: Alert[];
  towerData: TowerData;
}

type TowerData = Record<string, {
  total: number;
  count: number;
  average: number;
}>;
```

## Regras de Negócio

1. **Consumo Negativo**: `consumo < 0` → statusClass: 'negative'
2. **Alto Consumo**: `consumo > highLimit` → statusClass: 'high'
3. **Consumo Zero**: `consumo === 0` → statusClass: 'ok'
4. **Consumo Baixo**: `consumo < lowLimit` → statusClass: 'ok'
5. **Normal**: `lowLimit <= consumo <= highLimit` → statusClass: 'ok'

## Comandos Úteis

```bash
# Executar testes de análise
npm run test -- --testPathPattern=analysis

# Verificar tipos
npm run typecheck
```

## Exemplo de Uso

```typescript
import { analyzeConsumption } from './utils/analysis';
import { parseExcelFile } from './hooks/useExcelParser';

// Ler planilha
const data = await parseExcelFile(file);

// Analisar
const result = analyzeConsumption(data, {
  highLimit: 20,
  lowLimit: 1
});

// Resultado
console.log(`Total: ${result.totalApartments}`);
console.log(`Negativos: ${result.negativeCount}`);
console.log(`Altos: ${result.highCount}`);
console.log(`Média: ${result.averageConsumption} m³`);
```
