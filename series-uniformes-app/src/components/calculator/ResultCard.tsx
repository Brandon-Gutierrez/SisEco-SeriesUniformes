import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SERIES_TYPES } from '@/constants/seriesTypes';

interface ResultCardProps {
  result: {
    value: number;
    variable: string;
  } | null;
  seriesType: string;
  variable: string;
  timeUnit: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  seriesType, 
  variable,
  timeUnit 
}) => {
  const getInterpretation = () => {
    if (!result) return '';
    
    const { value, variable: varName } = result;
    const typeMap: Record<string, string> = {
      [SERIES_TYPES.ORDINARY]: 'ordinaria (vencida)',
      [SERIES_TYPES.ADVANCE]: 'anticipada',
      [SERIES_TYPES.DEFERRED]: 'diferida'
    };
    
    const varMap: Record<string, string> = {
      P: 'Valor Presente',
      F: 'Valor Futuro',
      A: 'Pago Periódico',
      i: 'Tasa de Interés',
      n: 'Número de Períodos',
      k: 'Períodos Diferidos'
    };
    
    return `El ${varMap[varName]} en una serie ${typeMap[seriesType]} es ${value.toFixed(2)} ${varName === 'i' ? '%' : ''}`;
  };
  
  const getTheoryExplanation = () => {
    const explanations: Record<string, string> = {
      [SERIES_TYPES.ORDINARY]: "Serie con pagos al final de cada período. Usada en préstamos, hipotecas e inversiones estándar.",
      [SERIES_TYPES.ADVANCE]: "Serie con pagos al inicio de cada período. Común en arriendos, primas de seguros y aportes iniciales.",
      [SERIES_TYPES.DEFERRED]: "Serie con período de gracia antes de iniciar los pagos. Aplicable en financiamientos con período de carencia."
    };
    
    return explanations[seriesType] || "";
  };
  
  return (
    <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-xl shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-blue-800">Resultado Calculado</h3>
          {result && (
            <div className="mt-2">
              <p className="text-2xl font-bold text-gray-800">
                {variable.toUpperCase()} = {result.value.toFixed(2)}
                <span className="text-lg ml-1">{variable === 'i' ? '%' : ''}</span>
              </p>
              <p className="mt-1 text-gray-600">{getInterpretation()}</p>
            </div>
          )}
        </div>
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          {seriesType.toUpperCase()}
        </Badge>
      </div>
      
      <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-700 mb-2">Interpretación Teórica:</h4>
        <p className="text-gray-700">{getTheoryExplanation()}</p>
      </div>
    </div>
  );
};

export default ResultCard;