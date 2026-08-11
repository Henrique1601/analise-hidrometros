import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import type { WaterMeterData } from '../types';

interface UseExcelParserReturn {
  data: WaterMeterData[];
  loading: boolean;
  error: string | null;
  parseFile: (file: File) => Promise<void>;
  reset: () => void;
}

export function useExcelParser(): UseExcelParserReturn {
  const [data, setData] = useState<WaterMeterData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      let parsedData: WaterMeterData[] = [];

      // Tenta ler da aba 2 (com Índice Anterior e Atual)
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

      // Se não encontrou dados na aba 2, tenta na aba 1
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

      setData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData([]);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, parseFile, reset };
}
