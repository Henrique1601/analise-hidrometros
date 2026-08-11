import type { AnalysisResult } from '../types';

interface StatsCardsProps {
  result: AnalysisResult;
}

export function StatsCards({ result }: StatsCardsProps) {
  const normalCount = result.okCount + result.zeroCount + result.lowCount;

  return (
    <div className="stats-grid">
      <div className="stat-card info">
        <div className="stat-value">{result.totalApartments}</div>
        <div className="stat-label">Total de Apartamentos</div>
      </div>
      <div className="stat-card danger">
        <div className="stat-value">{result.negativeCount}</div>
        <div className="stat-label">Consumo Negativo ❌</div>
      </div>
      <div className="stat-card warning">
        <div className="stat-value">{result.highCount}</div>
        <div className="stat-label">Alto Consumo ⚠️</div>
      </div>
      <div className="stat-card success">
        <div className="stat-value">{normalCount}</div>
        <div className="stat-label">Dentro do Normal ✅</div>
      </div>
      <div className="stat-card info">
        <div className="stat-value">{result.averageConsumption.toFixed(2)} m³</div>
        <div className="stat-label">Média de Consumo</div>
      </div>
    </div>
  );
}
