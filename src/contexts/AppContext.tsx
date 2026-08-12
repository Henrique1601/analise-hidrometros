import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { WaterMeterData, AnalysisConfig, AnalysisResult, FilterConfig } from '../types';
import { useExcelParser } from '../hooks/useExcelParser';
import { analyzeConsumption, updateItemStatus } from '../utils/analysis';

interface AppContextType {
  data: WaterMeterData[];
  loading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  filteredData: WaterMeterData[];
  config: AnalysisConfig;
  filter: FilterConfig;
  hasData: boolean;
  parseFile: (file: File) => Promise<void>;
  setConfig: (config: Partial<AnalysisConfig>) => void;
  setFilter: (filter: Partial<FilterConfig>) => void;
  analyze: () => void;
  reanalyze: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'hidrometros-config';

function loadConfig(): AnalysisConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        highLimit: typeof parsed.highLimit === 'number' ? parsed.highLimit : 20,
        lowLimit: typeof parsed.lowLimit === 'number' ? parsed.lowLimit : 1,
      };
    }
  } catch { /* ignore */ }
  return { highLimit: 20, lowLimit: 1 };
}

const defaultFilter: FilterConfig = {
  tower: '',
  apartment: '',
  status: 'all',
  consumptionMin: '',
  consumptionMax: ''
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { data: rawData, loading, error, parseFile } = useExcelParser();
  const [data, setData] = useState<WaterMeterData[]>([]);
  const [config, setConfigState] = useState<AnalysisConfig>(loadConfig);
  const [filter, setFilterState] = useState<FilterConfig>(defaultFilter);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

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
      else if (filter.status === 'zero') matchStatus = item.status === 'ZERO';
      else if (filter.status === 'low') matchStatus = item.status === 'BAIXO';
      else if (filter.status === 'ok') matchStatus = item.statusClass === 'ok' && item.status === 'OK';

      const matchMin = !filter.consumptionMin || item.consumo >= Number(filter.consumptionMin);
      const matchMax = !filter.consumptionMax || item.consumo <= Number(filter.consumptionMax);

      return matchTower && matchAp && matchStatus && matchMin && matchMax;
    });
  }, [data, filter]);

  const analyze = useCallback(() => {
    if (rawData.length > 0) {
      const updatedData = rawData.map(item => updateItemStatus(item, config));
      setData(updatedData);
    }
  }, [rawData, config]);

  const reanalyze = useCallback(() => {
    if (rawData.length > 0) {
      const updatedData = rawData.map(item => updateItemStatus(item, config));
      setData(updatedData);
    }
  }, [rawData, config]);

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

  const value: AppContextType = {
    data,
    loading,
    error,
    result,
    filteredData,
    config,
    filter,
    hasData: rawData.length > 0,
    parseFile,
    setConfig,
    setFilter,
    analyze,
    reanalyze,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
