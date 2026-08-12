import type { WaterMeterData, AnomalyResult } from '../types';

export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.sqrt(variance);
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateQuartiles(values: number[]): { q1: number; q3: number } {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const lowerHalf = sorted.slice(0, mid);
  const upperHalf = sorted.slice(sorted.length % 2 !== 0 ? mid + 1 : mid);
  return {
    q1: calculateMedian(lowerHalf),
    q3: calculateMedian(upperHalf)
  };
}

export function detectAnomalies(data: WaterMeterData[]): AnomalyResult {
  const consumptionValues = data.map(d => d.consumo);
  const mean = calculateMean(consumptionValues);
  const stdDev = calculateStdDev(consumptionValues, mean);
  const median = calculateMedian(consumptionValues);
  const { q1, q3 } = calculateQuartiles(consumptionValues);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers = data.filter(d => {
    const zScore = stdDev > 0 ? Math.abs((d.consumo - mean) / stdDev) : 0;
    return zScore > 2 || d.consumo < lowerBound || d.consumo > upperBound;
  });

  const zScores = new Map<string, number>();
  data.forEach(d => {
    const zScore = stdDev > 0 ? (d.consumo - mean) / stdDev : 0;
    zScores.set(`${d.torre}-${d.ap}`, zScore);
  });

  return {
    mean,
    stdDev,
    median,
    q1,
    q3,
    iqr,
    lowerBound,
    upperBound,
    outliers,
    zScores
  };
}

export function getZScoreColor(zScore: number): string {
  const abs = Math.abs(zScore);
  if (abs > 3) return '#ef4444';
  if (abs > 2) return '#f59e0b';
  if (abs > 1) return '#3b82f6';
  return '#10b981';
}

export function getAnomalyLabel(zScore: number): string {
  const abs = Math.abs(zScore);
  if (abs > 3) return 'Severo';
  if (abs > 2) return 'Moderado';
  if (abs > 1) return 'Leve';
  return 'Normal';
}
