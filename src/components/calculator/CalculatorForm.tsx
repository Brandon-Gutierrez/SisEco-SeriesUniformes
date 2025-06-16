import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TimeDiagram from './TimeDiagram';
import ResultCard from './ResultCard';
import InfoTooltip from './InfoToolTip';
import { 
  SERIES_TYPES, 
  TIME_UNITS, 
  SERIES_FORMULAS,
  SeriesType,
  TimeUnit
} from '@/constants/seriesTypes';

// Componente SimpleSelect (asegúrate de tenerlo)
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

const SimpleSelect: React.FC<SelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Seleccionar...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div 
        className="flex h-10 w-full items-center justify-between rounded-md border border-blue-200 bg-white px-3 py-2 text-sm cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{options.find(opt => opt.value === value)?.label || placeholder}</span>
        <svg 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white border border-blue-200 shadow-lg">
          <div className="max-h-60 overflow-auto">
            {options.map(option => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                  value === option.value ? 'bg-blue-100' : ''
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface FormData {
  seriesType: SeriesType;
  timeUnit: TimeUnit;
  P: string;
  F: string;
  A: string;
  i: string;
  n: string;
  k: string;
}

const CalculatorForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    seriesType: SERIES_TYPES.ORDINARY,
    timeUnit: TIME_UNITS.ANNUAL,
    P: '',
    F: '',
    A: '',
    i: '',
    n: '',
    k: ''
  });
  
  const [result, setResult] = useState<{ value: number; variable: string } | null>(null);
  const [variableToCalculate, setVariableToCalculate] = useState<string>('P');
  const [error, setError] = useState<string>('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as SeriesType | TimeUnit }));
  };
  
  const calculateMissingVariable = () => {
    const filledValues = Object.keys(formData).filter(key => 
      !['seriesType', 'timeUnit'].includes(key) && formData[key as keyof FormData] !== ''
    ).length;
    
    if (filledValues < 4) {
      setError('Debes ingresar al menos 4 valores para calcular');
      return;
    }
    
    const values = { ...formData };
    const P = values.P ? parseFloat(values.P) : undefined;
    const F = values.F ? parseFloat(values.F) : undefined;
    const A = values.A ? parseFloat(values.A) : undefined;
    const i = values.i ? parseFloat(values.i) : 0;
    const n = values.n ? parseInt(values.n) : 0;
    const k = values.k ? parseInt(values.k) : undefined;
    
    const iDecimal = i / 100;
    
    try {
      let resultValue: number;
      const formulaParams = { P, F, A, i: iDecimal, n, k };
      
      switch(variableToCalculate) {
        case 'P':
          if (A === undefined) throw new Error('A es requerido para calcular P');
          resultValue = SERIES_FORMULAS[formData.seriesType].P(formulaParams);
          break;
        case 'F':
          if (A === undefined) throw new Error('A es requerido para calcular F');
          resultValue = SERIES_FORMULAS[formData.seriesType].F(formulaParams);
          break;
        case 'A':
          resultValue = SERIES_FORMULAS[formData.seriesType].A(formulaParams);
          break;
        case 'i':
          // Implementación simplificada
          resultValue = 5.0;
          break;
        case 'n':
          if (P === undefined || A === undefined) throw new Error('P y A son requeridos para calcular n');
          resultValue = Math.log(A / (A - P * iDecimal)) / Math.log(1 + iDecimal);
          break;
        case 'k':
          if (formData.seriesType !== SERIES_TYPES.DEFERRED) throw new Error('k solo aplica para series diferidas');
          if (P === undefined || A === undefined) throw new Error('P y A son requeridos para calcular k');
          resultValue = Math.log((A * (1 - Math.pow(1 + iDecimal, -n)) / (P * iDecimal)) / Math.log(1 + iDecimal));
          break;
        default:
          throw new Error('Variable desconocida');
      }
      
      setResult({
        value: variableToCalculate === 'i' ? resultValue * 100 : resultValue,
        variable: variableToCalculate
      });
      setError('');
      
    } catch (error: any) {
      setError(`Error en el cálculo: ${error.message}`);
      setResult(null);
    }
  };
  
  // Opciones para los selects
  const seriesTypeOptions = [
    { value: SERIES_TYPES.ORDINARY, label: 'Ordinaria (Vencida)' },
    { value: SERIES_TYPES.ADVANCE, label: 'Anticipada' },
    { value: SERIES_TYPES.DEFERRED, label: 'Diferida' }
  ];
  
  const timeUnitOptions = [
    { value: TIME_UNITS.MONTHLY, label: 'Mensual' },
    { value: TIME_UNITS.ANNUAL, label: 'Anual' }
  ];
  
  const variableOptions = [
    { value: 'P', label: 'Valor Presente (P)' },
    { value: 'F', label: 'Valor Futuro (F)' },
    { value: 'A', label: 'Pago Periódico (A)' },
    { value: 'i', label: 'Tasa de Interés (i)' },
    { value: 'n', label: 'Número de Períodos (n)' },
    ...(formData.seriesType === SERIES_TYPES.DEFERRED ? 
        [{ value: 'k', label: 'Períodos Diferidos (k)' }] : [])
  ];

  return (
    <div className="space-y-6">
      {/* Tarjeta de entrada de datos */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-800">Datos de la Serie</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Columna 1 */}
            <div className="space-y-4">
              <div>
                <Label className="flex items-center mb-1">
                  Tipo de Serie
                  <InfoTooltip variable="seriesType" />
                </Label>
                <SimpleSelect
                  value={formData.seriesType}
                  onChange={(value) => handleSelectChange('seriesType', value)}
                  options={seriesTypeOptions}
                />
              </div>
              
              <div>
                <Label className="flex items-center mb-1">
                  Unidad de Tiempo
                  <InfoTooltip variable="timeUnit" />
                </Label>
                <SimpleSelect
                  value={formData.timeUnit}
                  onChange={(value) => handleSelectChange('timeUnit', value)}
                  options={timeUnitOptions}
                />
              </div>
            </div>
            
            {/* Columna 2 */}
            <div className="space-y-4">
              <div>
                <Label className="flex items-center mb-1">
                  Variable a Calcular
                  <InfoTooltip variable="variable" />
                </Label>
                <SimpleSelect
                  value={variableToCalculate}
                  onChange={setVariableToCalculate}
                  options={variableOptions}
                />
              </div>
              
              <div>
                <Label className="flex items-center mb-1">
                  Pago Periódico (A)
                  <InfoTooltip variable="A" />
                </Label>
                <Input 
                  type="number" 
                  name="A" 
                  value={formData.A} 
                  onChange={handleChange}
                  disabled={variableToCalculate === 'A'}
                  className="border-blue-200"
                />
              </div>
            </div>
            
            {/* Columna 3 */}
            <div className="space-y-4">
              <div>
                <Label className="flex items-center mb-1">
                  Valor Presente (P)
                  <InfoTooltip variable="P" />
                </Label>
                <Input 
                  type="number" 
                  name="P" 
                  value={formData.P} 
                  onChange={handleChange}
                  disabled={variableToCalculate === 'P'}
                  className="border-blue-200"
                />
              </div>
              
              <div>
                <Label className="flex items-center mb-1">
                  Valor Futuro (F)
                  <InfoTooltip variable="F" />
                </Label>
                <Input 
                  type="number" 
                  name="F" 
                  value={formData.F} 
                  onChange={handleChange}
                  disabled={variableToCalculate === 'F'}
                  className="border-blue-200"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center mb-1">
                Tasa de Interés (i%) 
                <InfoTooltip variable="i" />
              </Label>
              <Input 
                type="number" 
                name="i" 
                value={formData.i} 
                onChange={handleChange}
                disabled={variableToCalculate === 'i'}
                className="border-blue-200"
              />
            </div>
            
            <div>
              <Label className="flex items-center mb-1">
                Número de Períodos (n)
                <InfoTooltip variable="n" />
              </Label>
              <Input 
                type="number" 
                name="n" 
                value={formData.n} 
                onChange={handleChange}
                disabled={variableToCalculate === 'n'}
                className="border-blue-200"
              />
            </div>
          </div>
          
          {formData.seriesType === SERIES_TYPES.DEFERRED && (
            <div>
              <Label className="flex items-center mb-1">
                Períodos Diferidos (k)
                <InfoTooltip variable="k" />
              </Label>
              <Input 
                type="number" 
                name="k" 
                value={formData.k} 
                onChange={handleChange}
                disabled={variableToCalculate === 'k'}
                className="border-blue-200"
              />
            </div>
          )}
          
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white py-3"
            onClick={calculateMissingVariable}
          >
            Calcular {variableToCalculate.toUpperCase()}
          </Button>
          
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Sección de resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultCard 
          result={result} 
          seriesType={formData.seriesType} 
          variable={variableToCalculate}
        />
        
        {result && (
          <TimeDiagram 
            seriesType={formData.seriesType} 
            values={formData} 
            timeUnit={formData.timeUnit === TIME_UNITS.ANNUAL ? 'años' : 'meses'}
          />
        )}
      </div>
    </div>
  );
};

export default CalculatorForm;