export type SeriesMethod = {
    id: string
    name: string
    description: string
    formula: string
    parameters: {
      id: string
      name: string
      description: string
      type: 'number' | 'percentage' | 'integer'
      min?: number
      max?: number
    }[]
  }
  
  export const seriesMethods: SeriesMethod[] = [
    {
      id: 'ordinary-annuity',
      name: 'Anualidad Ordinaria',
      description: 'Serie uniforme donde los pagos ocurren al final de cada período',
      formula: 'P = A * [(1 - (1 + r)^-n) / r]',
      parameters: [
        {
          id: 'payment',
          name: 'Pago (A)',
          description: 'Valor de cada pago uniforme',
          type: 'number',
          min: 0
        },
        {
          id: 'rate',
          name: 'Tasa de interés (r)',
          description: 'Tasa de interés por período (en decimal)',
          type: 'percentage',
          min: 0,
          max: 1
        },
        {
          id: 'periods',
          name: 'Períodos (n)',
          description: 'Número total de períodos',
          type: 'integer',
          min: 1
        }
      ]
    },
    {
      id: 'annuity-due',
      name: 'Anualidad Anticipada',
      description: 'Serie uniforme donde los pagos ocurren al inicio de cada período',
      formula: 'P = A * [(1 - (1 + r)^-n) / r] * (1 + r)',
      parameters: [
        {
          id: 'payment',
          name: 'Pago (A)',
          description: 'Valor de cada pago uniforme',
          type: 'number',
          min: 0
        },
        {
          id: 'rate',
          name: 'Tasa de interés (r)',
          description: 'Tasa de interés por período (en decimal)',
          type: 'percentage',
          min: 0,
          max: 1
        },
        {
          id: 'periods',
          name: 'Períodos (n)',
          description: 'Número total de períodos',
          type: 'integer',
          min: 1
        }
      ]
    },
    {
      id: 'deferred-annuity',
      name: 'Anualidad Diferida',
      description: 'Serie uniforme que comienza después de un período de gracia',
      formula: 'P = A * [(1 - (1 + r)^-n) / r] / (1 + r)^k',
      parameters: [
        {
          id: 'payment',
          name: 'Pago (A)',
          description: 'Valor de cada pago uniforme',
          type: 'number',
          min: 0
        },
        {
          id: 'rate',
          name: 'Tasa de interés (r)',
          description: 'Tasa de interés por período (en decimal)',
          type: 'percentage',
          min: 0,
          max: 1
        },
        {
          id: 'periods',
          name: 'Períodos de pago (n)',
          description: 'Número total de períodos de pago',
          type: 'integer',
          min: 1
        },
        {
          id: 'deferral',
          name: 'Períodos diferidos (k)',
          description: 'Número de períodos antes de que comience la anualidad',
          type: 'integer',
          min: 0
        }
      ]
    }
  ]