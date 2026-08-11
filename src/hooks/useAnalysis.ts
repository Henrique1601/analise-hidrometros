import { useState, useCallback, useMemo } from 'react';
import type { WaterMeterData, AnalysisConfig, AnalysisResult, FilterConfig } from '../types';
import { analyzeConsumption, updateItemStatus } from '../utils/analysis';

interface UseAnalysisReturn {
  result: AnalysisResult | null;
  filteredData: WaterMeterData[];
  config: AnalysisConfig;
  filter: FilterConfig;
  setConfig: (config: Partial<AnalysisConfig>) => void;
  setFilter: (filter: Partial<FilterConfig>) => void;
  analyze: (data: WaterMeterData[]) => void;
}

const defaultConfig: AnalysisConfig = {
  highLimit: 20,
  lowLimit: 1
};

const defaultFilter: FilterConfig = {
  tower: '',
  apartment: '',
  status: 'all'
};

export function useAnalysis(): UseAnalysisReturn {
  const [data, setData] = useState<WaterMeterData[]>([]);
  const [config, setConfigState] = useState<AnalysisConfig>(defaultConfig);
  const [filter, setFilterState] = useState<FilterConfig>(defaultFilter);

  const result = useMemo(() => {
    if (data.length === 0) return null;
    return analyzeConsumption(data, config);
  }, [data, config]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchTower = !filter.tower || item.torre === filter.tower;
      const matchAp = !filter.apartment || item.ap.includes(filter.apartment);
      
      let matchStatus = true;
      if (filter.status === 'negative') matchStatus = item.statusClass === 'negative';
      else if (filter.status === 'high') matchStatus = item.statusClass === 'high';
      else if (filter.status === 'ok') matchStatus = item.statusClass === 'ok';
      
      return matchTower && matchAp && matchStatus;
    });
  }, [data, filter]);

  const analyze = useCallback((newData: WaterMeterData[]) => {
    const updatedData = newData.map(item => updateItemStatus(item, config));
    setData(updatedData);
  }, [config]);

  const setConfig = useCallback((partial: Partial<AnalysisConfig>) => {
    setConfigState(prev => {
      const newConfig = { ...prev, ...partial };
      setData(current => current.map(item => updateItemStatus(item, newConfig)));
      return newConfig;
    });
  }, []);

  const setFilter = useCallback((partial: Partial<FilterConfig>) => {
    setFilterState(prev => ({ ...prev, ...partial }));
  }, []);

  return {
    result,
    filteredData,
    config,
    filter,
    setConfig,
    setFilter,
    analyze
  };
}
