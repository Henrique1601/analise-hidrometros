import type { WaterMeterData, AnalysisConfig, AnalysisResult, Alert, TowerData } from '../types';

export function analyzeConsumption(
  data: WaterMeterData[],
  config: AnalysisConfig = { highLimit: 20, lowLimit: 1 }
): AnalysisResult {
  const { highLimit, lowLimit } = config;
  
  let totalConsumption = 0;
  let negativeCount = 0;
  let highCount = 0;
  let zeroCount = 0;
  let lowCount = 0;
  let okCount = 0;
  
  const alerts: Alert[] = [];
  const towerData: TowerData = {};

  data.forEach(item => {
    const consumo = item.consumo;
    totalConsumption += consumo;

    if (!towerData[item.torre]) {
      towerData[item.torre] = { total: 0, count: 0, average: 0 };
    }
    towerData[item.torre].total += consumo;
    towerData[item.torre].count++;

    if (consumo < 0) {
      negativeCount++;
      alerts.push({
        type: 'negative',
        message: `Torre ${item.torre} - Ap ${item.ap}: Consumo NEGATIVO (${consumo.toFixed(2)} m³)`,
        tower: item.torre,
        ap: item.ap,
        value: consumo
      });
    } else if (consumo > highLimit) {
      highCount++;
      alerts.push({
        type: 'high',
        message: `Torre ${item.torre} - Ap ${item.ap}: Alto consumo (${consumo.toFixed(2)} m³)`,
        tower: item.torre,
        ap: item.ap,
        value: consumo
      });
    } else if (consumo === 0) {
      zeroCount++;
    } else if (consumo < lowLimit) {
      lowCount++;
    } else {
      okCount++;
    }
  });

  Object.keys(towerData).forEach(torre => {
    towerData[torre].average = towerData[torre].total / towerData[torre].count;
  });

  return {
    totalApartments: data.length,
    negativeCount,
    highCount,
    zeroCount,
    lowCount,
    okCount,
    averageConsumption: data.length > 0 ? totalConsumption / data.length : 0,
    totalConsumption,
    alerts,
    towerData
  };
}

export function updateItemStatus(
  item: WaterMeterData,
  config: AnalysisConfig
): WaterMeterData {
  const { highLimit, lowLimit } = config;
  const consumo = item.consumo;

  let statusClass: WaterMeterData['statusClass'] = 'ok';
  let status = 'OK';

  if (consumo < 0) {
    statusClass = 'negative';
    status = 'NEGATIVO';
  } else if (consumo > highLimit) {
    statusClass = 'high';
    status = 'ALTO';
  } else if (consumo === 0) {
    status = 'ZERO';
  } else if (consumo < lowLimit) {
    status = 'BAIXO';
  }

  return { ...item, statusClass, status };
}
