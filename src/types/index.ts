export interface WaterMeterData {
  torre: string;
  ap: string;
  indiceAnterior: number;
  indiceAtual: number;
  consumo: number;
  status: string;
  statusClass: 'ok' | 'negative' | 'high';
}

export interface AnalysisConfig {
  highLimit: number;
  lowLimit: number;
}

export interface AnalysisResult {
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

export interface Alert {
  type: 'negative' | 'high';
  message: string;
  tower: string;
  ap: string;
  value: number;
}

export type TowerData = Record<string, {
  total: number;
  count: number;
  average: number;
}>;

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderRadius?: number;
  }[];
}

export interface FilterConfig {
  tower: string;
  apartment: string;
  status: 'all' | 'negative' | 'high' | 'zero' | 'low' | 'ok';
  consumptionMin: string;
  consumptionMax: string;
}
