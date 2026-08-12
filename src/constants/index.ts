export const ANALYSIS_DEFAULTS = {
  HIGH_LIMIT: 20,
  LOW_LIMIT: 1,
} as const;

export const CONSUMPTION_RANGES = {
  NEGATIVE: '< 0',
  ZERO: '0',
  LOW_1_5: '1-5',
  MEDIUM_5_10: '5-10',
  HIGH_10_15: '10-15',
  VERY_HIGH: `15-${ANALYSIS_DEFAULTS.HIGH_LIMIT}`,
  EXCESSIVE: `> ${ANALYSIS_DEFAULTS.HIGH_LIMIT}`,
} as const;

export const STATUS_LABELS = {
  OK: 'OK',
  NEGATIVE: 'NEGATIVO',
  HIGH: 'ALTO',
  ZERO: 'ZERO',
  LOW: 'BAIXO',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

export const CSV = {
  SEPARATOR: ',',
  BOM: '\ufeff',
} as const;
