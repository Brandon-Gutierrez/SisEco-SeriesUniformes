export function calculateOrdinaryAnnuity(payment: number, rate: number, periods: number): number {
    if (rate === 0) return payment * periods
    return payment * (1 - Math.pow(1 + rate, -periods)) / rate
  }
  
  export function calculateAnnuityDue(payment: number, rate: number, periods: number): number {
    if (rate === 0) return payment * periods
    return payment * (1 - Math.pow(1 + rate, -periods)) / rate * (1 + rate)
  }
  
  export function calculateDeferredAnnuity(
    payment: number, 
    rate: number, 
    periods: number, 
    deferral: number
  ): number {
    if (rate === 0) return payment * periods
    const ordinary = calculateOrdinaryAnnuity(payment, rate, periods)
    return ordinary / Math.pow(1 + rate, deferral)
  }