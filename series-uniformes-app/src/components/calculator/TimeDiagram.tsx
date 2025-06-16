import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { SERIES_TYPES, TIME_UNITS } from '@/constants/seriesTypes';
import type { SeriesType, TimeUnit } from '@/constants/seriesTypes';

interface TimeDiagramProps {
  seriesType: SeriesType;
  values: {
    P: string;
    F: string;
    A: string;
    n: string;
    k?: string;
  };
  timeUnit: TimeUnit;
}

const TimeDiagram: React.FC<TimeDiagramProps> = ({ 
  seriesType, 
  values, 
  timeUnit 
}) => {
  const parseNumber = (value: string, defaultValue = 0): number => {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  };

  const P = parseNumber(values.P);
  const F = parseNumber(values.F);
  const A = parseNumber(values.A);
  const n = parseNumber(values.n);
  const k = values.k ? parseNumber(values.k) : 0;
  
  const isDeferred = seriesType === SERIES_TYPES.DEFERRED;
  const isAdvance = seriesType === SERIES_TYPES.ADVANCE;
  const isOrdinary = seriesType === SERIES_TYPES.ORDINARY;
  
  // Calcular períodos totales con validación
  let totalPeriods = n;
  if (isDeferred) {
    totalPeriods = Math.max(0, k) + Math.max(0, n);
  }
  
  // Limitar a un máximo razonable para evitar problemas de rendimiento
  const safePeriods = Math.min(totalPeriods, 12);
  
  // Determinar en qué períodos hay pagos
  const paymentPeriods = Array(safePeriods + 1).fill(false);
  if (A > 0) {
    for (let idx = 0; idx <= safePeriods; idx++) {
      if (isAdvance && idx < n) paymentPeriods[idx] = true;
      if (isOrdinary && idx > 0 && idx <= n) paymentPeriods[idx] = true;
      if (isDeferred && idx > k && idx <= k + n) paymentPeriods[idx] = true;
    }
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
      <h3 className="font-semibold text-blue-800 mb-4">Diagrama de Flujo de Caja</h3>
      
      <div className="relative overflow-x-auto pb-8">
        {/* Línea de tiempo */}
        <div className="flex items-start">
          {[...Array(safePeriods + 1)].map((_, idx) => (
            <div key={idx} className="flex flex-col items-center relative min-w-[80px]">
              {/* Punto en la línea de tiempo */}
              <div className={`w-4 h-4 rounded-full ${
                idx === 0 ? 'bg-blue-600' : 
                (isDeferred && idx === k) ? 'bg-green-600' : 
                'bg-gray-400'
              }`}></div>
              
              {/* Etiquetas principales */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-full text-center">
                {idx === 0 && P > 0 && (
                  <div className="text-blue-600 font-medium text-sm whitespace-nowrap bg-white px-1 rounded">
                    P = {P.toFixed(2)}
                  </div>
                )}
                
                {idx === safePeriods && F > 0 && (
                  <div className="text-red-600 font-medium text-sm whitespace-nowrap bg-white px-1 rounded">
                    F = {F.toFixed(2)}
                  </div>
                )}
                
                {isDeferred && idx === k && (
                  <div className="text-green-600 font-medium text-sm whitespace-nowrap bg-white px-1 rounded">
                    Inicio pagos
                  </div>
                )}
              </div>
              
              {/* Flechas de pagos */}
              {paymentPeriods[idx] && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <div className="flex flex-col items-center">
                    <ArrowDown className="text-red-500" size={18} />
                    <span className="text-red-600 text-xs whitespace-nowrap bg-white px-1 rounded">
                      A = {A.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Línea horizontal */}
              {idx < safePeriods && (
                <div className="w-full h-0.5 bg-gray-300 relative mt-2">
                  <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              )}
              
              {/* Etiqueta del período */}
              <div className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap bg-white px-1 rounded">
                {idx === 0 ? '0' : `${idx}${timeUnit === TIME_UNITS.ANNUAL ? 'a' : 'm'}`}
              </div>
            </div>
          ))}
        </div>
        
        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 mt-12 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span>Valor Presente (P)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
            <span>Valor Futuro (F)</span>
          </div>
          <div className="flex items-center">
            <ArrowDown className="text-red-500 mr-2" />
            <span>Pago (A)</span>
          </div>
          {isDeferred && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
              <span>Inicio Pagos</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeDiagram;