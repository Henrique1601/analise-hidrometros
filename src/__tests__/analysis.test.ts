import { describe, it, expect } from 'vitest';
import { analyzeConsumption, updateItemStatus } from '../utils/analysis';
import type { WaterMeterData, AnalysisConfig } from '../types';

describe('analyzeConsumption', () => {
  const defaultConfig: AnalysisConfig = {
    highLimit: 20,
    lowLimit: 1
  };

  const createTestData = (): WaterMeterData[] => [
    { torre: 'A', ap: '101', indiceAnterior: 100, indiceAtual: 115, consumo: 15, status: '', statusClass: 'ok' },
    { torre: 'A', ap: '102', indiceAnterior: 200, indiceAtual: 195, consumo: -5, status: '', statusClass: 'ok' },
    { torre: 'B', ap: '201', indiceAnterior: 150, indiceAtual: 175, consumo: 25, status: '', statusClass: 'ok' },
    { torre: 'B', ap: '202', indiceAnterior: 180, indiceAtual: 180, consumo: 0, status: '', statusClass: 'ok' },
    { torre: 'C', ap: '301', indiceAnterior: 120, indiceAtual: 120.5, consumo: 0.5, status: '', statusClass: 'ok' },
  ];

  it('should count total apartments correctly', () => {
    const data = createTestData();
    const result = analyzeConsumption(data, defaultConfig);
    expect(result.totalApartments).toBe(5);
  });

  it('should detect negative consumption', () => {
    const data = createTestData();
    const result = analyzeConsumption(data, defaultConfig);
    expect(result.negativeCount).toBe(1);
    expect(result.alerts.some(a => a.type === 'negative')).toBe(true);
  });

  it('should detect high consumption', () => {
    const data = createTestData();
    const result = analyzeConsumption(data, defaultConfig);
    expect(result.highCount).toBe(1);
    expect(result.alerts.some(a => a.type === 'high')).toBe(true);
  });

  it('should count zero consumption', () => {
    const data = createTestData();
    const result = analyzeConsumption(data, defaultConfig);
    expect(result.zeroCount).toBe(1);
  });

  it('should count low consumption', () => {
    const data = createTestData();
    const result = analyzeConsumption(data, defaultConfig);
    expect(result.lowCount).toBe(1);
  });

  it('should calculate average consumption correctly', () => {
    const data = createTestData();
    const result = analyzeConsumption(data, defaultConfig);
    const expectedAverage = (15 + (-5) + 25 + 0 + 0.5) / 5;
    expect(result.averageConsumption).toBeCloseTo(expectedAverage, 2);
  });

  it('should group data by tower', () => {
    const data = createTestData();
    const result = analyzeConsumption(data, defaultConfig);
    expect(result.towerData['A']).toBeDefined();
    expect(result.towerData['B']).toBeDefined();
    expect(result.towerData['C']).toBeDefined();
    expect(result.towerData['A'].count).toBe(2);
    expect(result.towerData['B'].count).toBe(2);
    expect(result.towerData['C'].count).toBe(1);
  });

  it('should handle empty data', () => {
    const result = analyzeConsumption([], defaultConfig);
    expect(result.totalApartments).toBe(0);
    expect(result.averageConsumption).toBe(0);
    expect(result.alerts).toHaveLength(0);
  });

  it('should use custom limits', () => {
    const data = createTestData();
    const customConfig: AnalysisConfig = { highLimit: 10, lowLimit: 2 };
    const result = analyzeConsumption(data, customConfig);
    expect(result.highCount).toBe(2); // 15 and 25 are > 10
    expect(result.lowCount).toBe(1); // 0.5 is < 2
  });
});

describe('updateItemStatus', () => {
  const defaultConfig: AnalysisConfig = {
    highLimit: 20,
    lowLimit: 1
  };

  it('should mark negative consumption', () => {
    const item: WaterMeterData = {
      torre: 'A', ap: '101', indiceAnterior: 100, indiceAtual: 95,
      consumo: -5, status: '', statusClass: 'ok'
    };
    const updated = updateItemStatus(item, defaultConfig);
    expect(updated.statusClass).toBe('negative');
    expect(updated.status).toBe('NEGATIVO');
  });

  it('should mark high consumption', () => {
    const item: WaterMeterData = {
      torre: 'A', ap: '101', indiceAnterior: 100, indiceAtual: 125,
      consumo: 25, status: '', statusClass: 'ok'
    };
    const updated = updateItemStatus(item, defaultConfig);
    expect(updated.statusClass).toBe('high');
    expect(updated.status).toBe('ALTO');
  });

  it('should mark zero consumption', () => {
    const item: WaterMeterData = {
      torre: 'A', ap: '101', indiceAnterior: 100, indiceAtual: 100,
      consumo: 0, status: '', statusClass: 'ok'
    };
    const updated = updateItemStatus(item, defaultConfig);
    expect(updated.statusClass).toBe('ok');
    expect(updated.status).toBe('ZERO');
  });

  it('should mark low consumption', () => {
    const item: WaterMeterData = {
      torre: 'A', ap: '101', indiceAnterior: 100, indiceAtual: 100.5,
      consumo: 0.5, status: '', statusClass: 'ok'
    };
    const updated = updateItemStatus(item, defaultConfig);
    expect(updated.statusClass).toBe('ok');
    expect(updated.status).toBe('BAIXO');
  });

  it('should mark normal consumption', () => {
    const item: WaterMeterData = {
      torre: 'A', ap: '101', indiceAnterior: 100, indiceAtual: 115,
      consumo: 15, status: '', statusClass: 'ok'
    };
    const updated = updateItemStatus(item, defaultConfig);
    expect(updated.statusClass).toBe('ok');
    expect(updated.status).toBe('OK');
  });
});
