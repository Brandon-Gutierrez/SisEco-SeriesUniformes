import React from 'react';

interface ResultCardProps {
  result: {
    value: number;
    variable: string;
  } | null;
  seriesType: string;
  variable: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  seriesType, 
  variable
}) => {
  // Mapa de interpretaciones teóricas
  const theoryExplanations = {
    ordinaria: {
      P: "El Valor Presente (P) representa el valor actual de una serie de pagos iguales realizados al final de cada período. Es equivalente al valor que tendría hoy una serie de flujos futuros.",
      F: "El Valor Futuro (F) representa el valor acumulado al final de una serie de pagos iguales realizados al final de cada período. Es la suma total de todos los pagos más los intereses generados.",
      A: "El Pago Periódico (A) es el valor constante que se debe pagar o recibir al final de cada período para alcanzar un valor presente o futuro específico, considerando una tasa de interés dada.",
      i: "La Tasa de Interés (i) es el porcentaje que se aplica periódicamente al saldo pendiente. Determina el costo del dinero en el tiempo para la serie de pagos.",
      n: "El Número de Períodos (n) es la cantidad total de pagos iguales que componen la serie uniforme ordinaria.",
      k: "No aplica para series ordinarias"
    },
    anticipada: {
      P: "El Valor Presente (P) representa el valor actual de una serie de pagos iguales realizados al inicio de cada período. Es equivalente al valor que tendría hoy una serie de flujos futuros anticipados.",
      F: "El Valor Futuro (F) representa el valor acumulado al final de una serie de pagos iguales realizados al inicio de cada período. Los pagos anticipados generan más intereses que los ordinarios.",
      A: "El Pago Periódico (A) es el valor constante que se debe pagar o recibir al inicio de cada período para alcanzar un valor presente o futuro específico.",
      i: "La Tasa de Interés (i) aplicada a pagos anticipados produce un mayor rendimiento o costo debido a que los pagos se realizan al comienzo del período.",
      n: "El Número de Períodos (n) es la cantidad total de pagos iguales anticipados que componen la serie.",
      k: "No aplica para series anticipadas"
    },
    diferida: {
      P: "El Valor Presente (P) representa el valor actual de una serie de pagos iguales que comienzan después de un período de gracia. Considera el diferimiento inicial de los pagos.",
      F: "El Valor Futuro (F) representa el valor acumulado al final de una serie de pagos iguales que comenzaron después de un período de gracia. Incluye los intereses generados durante todo el plazo.",
      A: "El Pago Periódico (A) es el valor constante que se debe pagar o recibir en cada período, después del período de gracia inicial.",
      i: "La Tasa de Interés (i) se aplica durante todo el plazo, incluyendo el período de gracia donde no se realizan pagos.",
      n: "El Número de Períodos (n) es la cantidad de pagos iguales que se realizan después del período de gracia.",
      k: "Los Períodos Diferidos (k) representan el tiempo de gracia antes de que comiencen los pagos. Durante este período no se realizan pagos pero sí se acumulan intereses."
    }
  };

  // Obtener la explicación específica
  const getTheoryExplanation = () => {
    if (!result) return "";
    
    const seriesKey = seriesType as keyof typeof theoryExplanations;
    const variableKey = variable as keyof (typeof theoryExplanations)['ordinaria'];
    
    return theoryExplanations[seriesKey]?.[variableKey] || "Explicación no disponible para esta variable.";
  };

  // Obtener descripción general de la serie
  const getSeriesDescription = () => {
    const descriptions = {
      ordinaria: "Serie Ordinaria (Vencida): Pagos al final de cada período. Común en préstamos, hipotecas e inversiones estándar.",
      anticipada: "Serie Anticipada: Pagos al inicio de cada período. Usada en arrendamientos, seguros y aportes iniciales.",
      diferida: "Serie Diferida: Período de gracia antes de iniciar pagos. Aplicable en financiamientos con carencia."
    };
    
    return descriptions[seriesType as keyof typeof descriptions] || "";
  };

  return (
    <div className="p-5 bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-xl shadow h-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-blue-800">Resultado Calculado</h3>
          {result ? (
            <div className="mt-2">
              <p className="text-2xl font-bold text-gray-800">
                {variable.toUpperCase()} = {result.value.toFixed(2)}
                <span className="text-lg ml-1">{variable === 'i' ? '%' : ''}</span>
              </p>
            </div>
          ) : (
            <div className="mt-4 text-gray-500 italic">
              Complete los datos y haga clic en "Calcular"
            </div>
          )}
        </div>
        {result && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {seriesType.toUpperCase()}
          </span>
        )}
      </div>
      
      {result ? (
        <>
          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-700 mb-2">Interpretación Teórica:</h4>
            <p className="text-gray-700">{getTheoryExplanation()}</p>
          </div>
          
          <div className="mt-3 p-3 bg-white rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-700 mb-2">Descripción de la Serie:</h4>
            <p className="text-gray-700">{getSeriesDescription()}</p>
          </div>
        </>
      ) : (
        <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-700 mb-2">Información:</h4>
          <p className="text-gray-700">
            Esta calculadora le permite resolver problemas de series uniformes ordinarias, 
            anticipadas y diferidas. Complete al menos 4 valores y haga clic en "Calcular"
            para obtener resultados.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultCard;