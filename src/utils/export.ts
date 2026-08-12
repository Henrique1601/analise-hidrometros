import type { WaterMeterData, Alert } from '../types';

export function exportToCSV(data: WaterMeterData[], filename: string): void {
  const headers = ['Torre', 'Ap', 'Índice Anterior', 'Índice Atual', 'Consumo (m³)', 'Status'];
  const rows = data.map(item => [
    escapeCSV(item.torre),
    escapeCSV(item.ap),
    item.indiceAnterior.toFixed(2),
    item.indiceAtual.toFixed(2),
    item.consumo.toFixed(2),
    escapeCSV(item.status)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadCSV(csvContent, filename);
}

export function exportAlerts(alerts: Alert[], filename: string): void {
  if (alerts.length === 0) {
    alert('Nenhum alerta para exportar!');
    return;
  }

  const headers = ['Tipo', 'Torre', 'Apartamento', 'Consumo (m³)', 'Mensagem'];
  const rows = alerts.map(alert => [
    alert.type === 'negative' ? 'NEGATIVO' : 'ALTO',
    escapeCSV(alert.tower),
    escapeCSV(alert.ap),
    alert.value.toFixed(2),
    escapeCSV(alert.message)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadCSV(csvContent, filename);
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function formatConsumption(value: number): string {
  return `${value.toFixed(2)} m³`;
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}
