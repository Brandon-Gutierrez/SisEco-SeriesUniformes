import { useCallback } from 'react'
import { SeriesMethod } from '../types/seriesTypes'
import { calculateOrdinaryAnnuity, calculateAnnuityDue, calculateDeferredAnnuity } from '../utils/calculations'

export function useSeriesCalculations() {
  const calculateResult = useCallback((methodId: string, params: Record<string, number>) => {
    switch (methodId) {
      case 'ordinary-annuity':
        return calculateOrdinaryAnnuity(params.payment, params.rate, params.periods)
      case 'annuity-due':
        return calculateAnnuityDue(params.payment, params.rate, params.periods)
      case 'deferred-annuity':
        return calculateDeferredAnnuity(params.payment, params.rate, params.periods, params.deferral)
      default:
        return null
    }
  }, [])

  return { calculateResult }
}