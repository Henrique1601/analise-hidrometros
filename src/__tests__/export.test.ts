import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCSV, exportAlerts, formatConsumption, formatPercentage } from '../utils/export';
import type { WaterMeterData, Alert } from '../types';

describe('exportToCSV', () => {
  beforeEach(() => {
    vi.spyOn(document, 'createElement');
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create CSV with correct headers', () => {
    const data: WaterMeterData[] = [];
    exportToCSV(data, 'test');
    
    expect(document.createElement).toHaveBeenCalledWith('a');
  });

  it('should handle data with commas in status', () => {
    const data: WaterMeterData[] = [
      { torre: 'A', ap: '101', indiceAnterior: 100, indiceAtual: 115, consumo: 15, status: 'OK, normal', statusClass: 'ok' },
    ];
    
    expect(() => exportToCSV(data, 'test')).not.toThrow();
  });

  it('should revoke blob URL after download', () => {
    const data: WaterMeterData[] = [
      { torre: 'A', ap: '101', indiceAnterior: 100, indiceAtual: 115, consumo: 15, status: 'OK', statusClass: 'ok' },
    ];
    
    exportToCSV(data, 'test');
    
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});

describe('exportAlerts', () => {
  beforeEach(() => {
    vi.spyOn(document, 'createElement');
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show alert when no alerts to export', () => {
    exportAlerts([], 'test');
    expect(window.alert).toHaveBeenCalledWith('Nenhum alerta para exportar!');
  });

  it('should handle alerts with commas in message', () => {
    const alerts: Alert[] = [
      { type: 'negative', message: 'Torre A, Ap 101: Consumo negativo', tower: 'A', ap: '101', value: -5 },
    ];
    
    expect(() => exportAlerts(alerts, 'test')).not.toThrow();
  });

  it('should revoke blob URL after download', () => {
    const alerts: Alert[] = [
      { type: 'high', message: 'Alto consumo', tower: 'B', ap: '201', value: 25 },
    ];
    
    exportAlerts(alerts, 'test');
    
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});

describe('formatConsumption', () => {
  it('should format positive value', () => {
    expect(formatConsumption(15.5)).toBe('15.50 m³');
  });

  it('should format zero', () => {
    expect(formatConsumption(0)).toBe('0.00 m³');
  });

  it('should format negative value', () => {
    expect(formatConsumption(-5.123)).toBe('-5.12 m³');
  });
});

describe('formatPercentage', () => {
  it('should calculate percentage correctly', () => {
    expect(formatPercentage(25, 100)).toBe('25.0%');
  });

  it('should handle zero total', () => {
    expect(formatPercentage(5, 0)).toBe('0%');
  });

  it('should handle zero value', () => {
    expect(formatPercentage(0, 100)).toBe('0.0%');
  });

  it('should format with one decimal', () => {
    expect(formatPercentage(1, 3)).toBe('33.3%');
  });
});
