import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { WaterMeterData, AnalysisConfig, AnalysisResult, FilterConfig, PeriodData } from '../types';
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
  periods: PeriodData[];
  parseFile: (file: File, periodName?: string) => Promise<void>;
  setConfig: (config: Partial<AnalysisConfig>) => void;
  setFilter: (filter: Partial<FilterConfig>) => void;
  analyze: () => void;
  reanalyze: () => void;
  addPeriod: (file: File, name: string) => Promise<void>;
  removePeriod: (id: string) => void;
  clearPeriods: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'hidrometros-config';
const PERIODS_KEY = 'hidrometros-periods';

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

async function parseExcelFile(file: File): Promise<WaterMeterData[]> {
  const buffer = await file.arrayBuffer();
  const XLSX = await import('xlsx');
  const workbook = XLSX.read(buffer, { type: 'array' });

  let parsedData: WaterMeterData[] = [];

  const sheet2Name = workbook.SheetNames[1];
  if (sheet2Name) {
    const sheet2 = workbook.Sheets[sheet2Name];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet2);

    parsedData = jsonData.map(row => {
      const torre = String(row['Torre'] || '');
      const ap = String(row['Ap'] || '');
      const idxAnterior = parseFloat(String(row['Índice Anterior'])) || 0;
      const idxAtual = parseFloat(String(row['Índice Atual'])) || 0;
      const consumoCalculado = idxAtual - idxAnterior;

      return {
        torre,
        ap,
        indiceAnterior: idxAnterior,
        indiceAtual: idxAtual,
        consumo: row['Consumo'] !== undefined ? parseFloat(String(row['Consumo'])) : consumoCalculado,
        status: String(row['Status'] || ''),
        statusClass: 'ok' as const
      };
    });
  }

  if (parsedData.length === 0 && workbook.SheetNames.length > 0) {
    const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet1);

    parsedData = jsonData.map(row => {
      const torre = String(row['Torre'] || '');
      const ap = String(row['Ap'] || '');
      const consumo = parseFloat(String(row['Consumo'])) || 0;

      return {
        torre,
        ap,
        indiceAnterior: 0,
        indiceAtual: parseFloat(String(row['Índice'])) || 0,
        consumo,
        status: '',
        statusClass: 'ok' as const
      };
    });
  }

  return parsedData;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { data: rawData, loading, error, parseFile: parseFileRaw } = useExcelParser();
  const [data, setData] = useState<WaterMeterData[]>([]);
  const [config, setConfigState] = useState<AnalysisConfig>(loadConfig);
  const [filter, setFilterState] = useState<FilterConfig>(defaultFilter);
  const [periods, setPeriods] = useState<PeriodData[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PERIODS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const restored = parsed.map((p: PeriodData) => ({
          ...p,
          date: new Date(p.date),
          result: analyzeConsumption(p.data, config)
        }));
        setPeriods(restored);
      }
    } catch { /* ignore */ }
  }, [config]);

  useEffect(() => {
    if (periods.length > 0) {
      const toSave = periods.map(p => ({
        ...p,
        date: p.date.toISOString()
      }));
      localStorage.setItem(PERIODS_KEY, JSON.stringify(toSave));
    }
  }, [periods]);

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

  const addPeriod = useCallback(async (file: File, name: string) => {
    const parsedData = await parseExcelFile(file);
    const updatedData = parsedData.map(item => updateItemStatus(item, config));
    const result = analyzeConsumption(updatedData, config);

    const newPeriod: PeriodData = {
      id: Date.now().toString(),
      name,
      fileName: file.name,
      date: new Date(),
      data: updatedData,
      result
    };

    setPeriods(prev => [...prev, newPeriod]);
  }, [config]);

  const parseFile = useCallback(async (file: File, periodName?: string) => {
    await parseFileRaw(file);
    if (periodName) {
      await addPeriod(file, periodName);
    }
  }, [parseFileRaw, addPeriod]);

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

  const removePeriod = useCallback((id: string) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearPeriods = useCallback(() => {
    setPeriods([]);
    localStorage.removeItem(PERIODS_KEY);
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
    periods,
    parseFile,
    setConfig,
    setFilter,
    analyze,
    reanalyze,
    addPeriod,
    removePeriod,
    clearPeriods,
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
