import React from 'react';
import { SERIES_TYPES } from '@/constants/seriesTypes';

interface TimeDiagramProps {
  seriesType: string;
  values: {
    P: string;
    F: string;
    A: string;
    n: string;
    k?: string;
  };
  timeUnit: string;
}

const TimeDiagram: React.FC<TimeDiagramProps> = ({ 
  seriesType, 
  values, 
  timeUnit 
}) => {
  // Función para parsear valores numéricos de manera segura
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
  
  // Determinar el período de inicio de pagos
  const startPeriod = isDeferred ? k : 0;
  
  // Determinar en qué períodos hay pagos
  const paymentPeriods = Array(safePeriods + 1).fill(false);
  if (A > 0) {
    for (let idx = 0; idx <= safePeriods; idx++) {
      if (isAdvance && idx < n) paymentPeriods[idx] = true;
      if ((isOrdinary || isDeferred) && idx > startPeriod && idx <= startPeriod + n) {
        paymentPeriods[idx] = true;
      }
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm h-full">
      <h3 className="font-semibold text-blue-800 mb-4">Diagrama de Flujo de Caja</h3>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max justify-center">
          {[...Array(safePeriods + 1)].map((_, idx) => (
            <div key={idx} className="flex flex-col items-center relative mx-2 min-w-[80px]">
              {/* Línea vertical del período */}
              <div className="w-0.5 h-16 bg-gray-200 absolute top-0"></div>
              
              {/* Punto en la línea de tiempo */}
              <div className={`w-6 h-6 rounded-full z-10 flex items-center justify-center ${
                idx === 0 ? 'bg-blue-600' : 
                (isDeferred && idx === k) ? 'bg-green-600' : 
                'bg-gray-400'
              }`}>
                <span className="text-white text-xs font-bold">{idx}</span>
              </div>
              
              {/* Etiquetas principales */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-full text-center">
                {idx === 0 && P > 0 && (
                  <div className="text-blue-600 font-medium text-xs whitespace-nowrap bg-white px-1 rounded">
                    P = {P.toFixed(2)}
                  </div>
                )}
                
                {idx === safePeriods && F > 0 && (
                  <div className="text-red-600 font-medium text-xs whitespace-nowrap bg-white px-1 rounded">
                    F = {F.toFixed(2)}
                  </div>
                )}
                
                {isDeferred && idx === k && (
                  <div className="text-green-600 font-medium text-xs whitespace-nowrap bg-white px-1 rounded">
                    Inicio pagos
                  </div>
                )}
              </div>
              
              {/* Flechas de pagos */}
              {paymentPeriods[idx] && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex flex-col items-center">
                    <div className="text-red-500 font-bold text-xl">↓</div>
                    <span className="text-red-600 text-xs whitespace-nowrap bg-white px-1 rounded">
                      A = {A.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Etiqueta del período */}
              <div className="absolute top-20 text-xs text-gray-500 whitespace-nowrap bg-white px-1 rounded text-center">
                {idx === 0 ? 'Hoy' : `Período ${idx}`}
                <div className="font-semibold">
                  {idx === 0 ? '0' : `${idx}${timeUnit === 'años' ? 'a' : 'm'}`}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Línea horizontal del tiempo */}
        <div className="h-0.5 bg-gray-300 w-full mt-8"></div>
        
        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 mt-20 text-sm justify-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span>Valor Presente (P)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
            <span>Valor Futuro (F)</span>
          </div>
          <div className="flex items-center">
            <div className="text-red-500 font-bold text-xl mr-2">↓</div>
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
      
      {/* Descripción del diagrama */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm">
        {isDeferred ? (
          <p>
            <strong>Diagrama Diferido:</strong> 
            {k > 0 ? ` ${k} ${timeUnit === 'años' ? 'años' : 'meses'} de gracia, ` : ' '}
            luego {n} pagos de {A.toFixed(2)} cada {timeUnit === 'años' ? 'año' : 'mes'}.
          </p>
        ) : isAdvance ? (
          <p>
            <strong>Diagrama Anticipado:</strong> 
            {n} pagos de {A.toFixed(2)} al inicio de cada {timeUnit === 'años' ? 'año' : 'mes'}.
          </p>
        ) : (
          <p>
            <strong>Diagrama Ordinario:</strong> 
            {n} pagos de {A.toFixed(2)} al final de cada {timeUnit === 'años' ? 'año' : 'mes'}.
          </p>
        )}
      </div>
    </div>
  );
};

export default TimeDiagram;