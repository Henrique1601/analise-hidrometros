import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { AnalysisResult, PeriodData } from '../types';

export async function generatePDF(
  result: AnalysisResult,
  _data: unknown,
  config: { highLimit: number; lowLimit: number }
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFontSize(20);
  pdf.setTextColor(139, 92, 246);
  pdf.text('Relatorio de Analise de Hidrometros', pageWidth / 2, 20, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 28, { align: 'center' });

  let y = 40;

  pdf.setFontSize(14);
  pdf.setTextColor(51);
  pdf.text('Resumo Geral', 15, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(80);

  const stats = [
    `Total de Apartamentos: ${result.totalApartments}`,
    `Consumo Negativo: ${result.negativeCount}`,
    `Alto Consumo: ${result.highCount}`,
    `Consumo Zero: ${result.zeroCount}`,
    `Consumo Baixo: ${result.lowCount}`,
    `Dentro do Normal: ${result.okCount}`,
    `Media de Consumo: ${result.averageConsumption.toFixed(2)} m3`,
    `Consumo Total: ${result.totalConsumption.toFixed(2)} m3`,
    `Limite Alto: ${config.highLimit} m3`,
    `Limite Baixo: ${config.lowLimit} m3`,
  ];

  stats.forEach(stat => {
    pdf.text(stat, 20, y);
    y += 6;
  });

  y += 10;
  pdf.setFontSize(14);
  pdf.setTextColor(51);
  pdf.text('Dados por Torre', 15, y);
  y += 10;

  pdf.setFontSize(9);
  pdf.setTextColor(80);

  Object.entries(result.towerData)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([torre, info]) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(
        `Torre ${torre}: ${info.count} aptos | Media: ${info.average.toFixed(2)} m3 | Total: ${info.total.toFixed(2)} m3`,
        20, y
      );
      y += 5;
    });

  if (result.alerts.length > 0) {
    y += 10;
    if (y > 250) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(51);
    pdf.text(`Alertas (${result.alerts.length})`, 15, y);
    y += 10;

    pdf.setFontSize(8);
    result.alerts.slice(0, 50).forEach(alert => {
      if (y > 275) {
        pdf.addPage();
        y = 20;
      }
      if (alert.type === 'negative') {
        pdf.setTextColor(239, 68, 68);
      } else {
        pdf.setTextColor(245, 158, 11);
      }
      pdf.text(`${alert.message}`, 20, y);
      y += 4;
    });

    if (result.alerts.length > 50) {
      pdf.setTextColor(100);
      pdf.text(`... e mais ${result.alerts.length - 50} alertas`, 20, y);
    }
  }

  pdf.save('relatorio_hidrometros.pdf');
}

export async function generatePeriodComparisonPDF(
  periods: PeriodData[]
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFontSize(20);
  pdf.setTextColor(139, 92, 246);
  pdf.text('Comparativo entre Periodos', pageWidth / 2, 20, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 28, { align: 'center' });

  let y = 40;

  pdf.setFontSize(14);
  pdf.setTextColor(51);
  pdf.text('Resumo por Periodo', 15, y);
  y += 10;

  periods.forEach(period => {
    if (y > 250) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(12);
    pdf.setTextColor(139, 92, 246);
    pdf.text(period.name, 20, y);
    y += 6;

    pdf.setFontSize(9);
    pdf.setTextColor(80);
    pdf.text(`Arquivo: ${period.fileName}`, 25, y);
    y += 5;
    pdf.text(`Data: ${period.date.toLocaleDateString('pt-BR')}`, 25, y);
    y += 5;
    pdf.text(`Apartamentos: ${period.result.totalApartments}`, 25, y);
    y += 5;
    pdf.text(`Media Consumo: ${period.result.averageConsumption.toFixed(2)} m3`, 25, y);
    y += 5;
    pdf.text(`Negativos: ${period.result.negativeCount} | Altos: ${period.result.highCount}`, 25, y);
    y += 8;
  });

  if (periods.length >= 2) {
    y += 5;
    if (y > 240) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(51);
    pdf.text('Comparacao', 15, y);
    y += 10;

    pdf.setFontSize(9);
    pdf.setTextColor(80);

    const p1 = periods[0];
    const p2 = periods[1];

    const avgDiff = p2.result.averageConsumption - p1.result.averageConsumption;
    const totalDiff = p2.result.totalConsumption - p1.result.totalConsumption;
    const negativeDiff = p2.result.negativeCount - p1.result.negativeCount;
    const highDiff = p2.result.highCount - p1.result.highCount;

    pdf.text(`Variacao Media Consumo: ${avgDiff >= 0 ? '+' : ''}${avgDiff.toFixed(2)} m3`, 20, y);
    y += 5;
    pdf.text(`Variacao Consumo Total: ${totalDiff >= 0 ? '+' : ''}${totalDiff.toFixed(2)} m3`, 20, y);
    y += 5;
    pdf.text(`Variacao Negativos: ${negativeDiff >= 0 ? '+' : ''}${negativeDiff}`, 20, y);
    y += 5;
    pdf.text(`Variacao Altos: ${highDiff >= 0 ? '+' : ''}${highDiff}`, 20, y);
  }

  pdf.save('comparativo_periodos.pdf');
}

export async function captureElementAsImage(element: HTMLElement): Promise<string> {
  const canvas = await html2canvas(element);
  return canvas.toDataURL('image/png');
}
