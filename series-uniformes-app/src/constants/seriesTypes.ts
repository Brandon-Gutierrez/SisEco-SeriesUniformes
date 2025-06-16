export const SERIES_TYPES = {
  ORDINARY: 'ordinaria',
  ADVANCE: 'anticipada',
  DEFERRED: 'diferida'
} as const;

export type SeriesType = typeof SERIES_TYPES[keyof typeof SERIES_TYPES];

export const TIME_UNITS = {
  MONTHLY: 'meses',
  ANNUAL: 'años'
} as const;

export type TimeUnit = typeof TIME_UNITS[keyof typeof TIME_UNITS];

export const VARIABLE_DESCRIPTIONS: Record<string, string> = {
  P: 'Valor presente o principal (valor actual de la serie)',
  F: 'Valor futuro (valor acumulado al final de la serie)',
  A: 'Valor del pago periódico uniforme',
  i: 'Tasa de interés por período (en porcentaje)',
  n: 'Número de períodos de la serie',
  k: 'Períodos de gracia (solo para series diferidas)'
};

export type FormulaFunction = (...args: number[]) => number;

interface SeriesFormulas {
  [key: string]: {
    P: FormulaFunction;
    F: FormulaFunction;
    A: (params: { 
      P?: number; 
      F?: number; 
      i: number; 
      n: number; 
      k?: number 
    }) => number;
  };
}

export const SERIES_FORMULAS: SeriesFormulas = {
  [SERIES_TYPES.ORDINARY]: {
    P: (A, i, n) => A * (1 - Math.pow(1 + i, -n)) / i,
    F: (A, i, n) => A * (Math.pow(1 + i, n) - 1) / i,
    A: ({ P, F, i, n }) => {
      if (P !== undefined) {
        return (P * i) / (1 - Math.pow(1 + i, -n));
      } else if (F !== undefined) {
        return (F * i) / (Math.pow(1 + i, n) - 1);
      }
      throw new Error('Se necesita P o F para calcular A');
    }
  },
  [SERIES_TYPES.ADVANCE]: {
    P: (A, i, n) => A * (1 + i) * (1 - Math.pow(1 + i, -n)) / i,
    F: (A, i, n) => A * (1 + i) * (Math.pow(1 + i, n) - 1) / i,
    A: ({ P, F, i, n }) => {
      if (P !== undefined) {
        return (P * i) / ((1 + i) * (1 - Math.pow(1 + i, -n)));
      } else if (F !== undefined) {
        return (F * i) / ((1 + i) * (Math.pow(1 + i, n) - 1));
      }
      throw new Error('Se necesita P o F para calcular A');
    }
  },
  [SERIES_TYPES.DEFERRED]: {
    P: (A, i, n, k) => A * (1 - Math.pow(1 + i, -n)) / (i * Math.pow(1 + i, k)),
    F: (A, i, n) => A * (Math.pow(1 + i, n) - 1) / i,
    A: ({ P, F, i, n, k = 0 }) => {
      if (P !== undefined) {
        return (P * i * Math.pow(1 + i, k)) / (1 - Math.pow(1 + i, -n));
      } else if (F !== undefined) {
        return (F * i) / (Math.pow(1 + i, n) - 1);
      }
      throw new Error('Se necesita P o F para calcular A');
    }
  }
};