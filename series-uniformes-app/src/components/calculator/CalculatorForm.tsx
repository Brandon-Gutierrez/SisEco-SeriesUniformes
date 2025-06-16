import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
    const P = values.P ? parseFloat(values.P) : 0;
    const F = values.F ? parseFloat(values.F) : 0;
    const A = values.A ? parseFloat(values.A) : 0;
    const i = values.i ? parseFloat(values.i) : 0;
    const n = values.n ? parseInt(values.n) : 0;
    const k = values.k ? parseInt(values.k) : 0;
    
    const iDecimal = i / 100;
    
    try {
      let resultValue: number;
      
      switch(variableToCalculate) {
        case 'P':
          resultValue = SERIES_FORMULAS[formData.seriesType].P(A, iDecimal, n, k);
          break;
        case 'F':
          resultValue = SERIES_FORMULAS[formData.seriesType].F(A, iDecimal, n, k);
          break;
        case 'A':
          if (P > 0 || F > 0) {
            resultValue = SERIES_FORMULAS[formData.seriesType].A({
              P: P > 0 ? P : undefined,
              F: F > 0 ? F : undefined,
              i: iDecimal,
              n: n,
              k: formData.seriesType === SERIES_TYPES.DEFERRED ? k : undefined
            });
          } else {
            throw new Error('Se necesita P o F para calcular A');
          }
          break;
        case 'i':
          resultValue = 5.0; // simplificado
          break;
        case 'n':
          if (P > 0 && A > 0) {
            resultValue = Math.log(A / (A - P * iDecimal)) / Math.log(1 + iDecimal);
          } else {
            throw new Error('Datos insuficientes para calcular n');
          }
          break;
        case 'k':
          if (formData.seriesType === SERIES_TYPES.DEFERRED) {
            resultValue = Math.log((A * (1 - Math.pow(1 + iDecimal, -n)) / (P * iDecimal))) /
                          Math.log(1 + iDecimal);
          } else {
            throw new Error('k solo aplica para series diferidas');
          }
          break;
        default:
          throw new Error('Variable desconocida');
      }
      
      setResult({ value: variableToCalculate === 'i' ? resultValue * 100 : resultValue, variable: variableToCalculate });
      setError('');
      
    } catch (error: any) {
      setError(`Error en el cálculo: ${error.message}`);
    }
  };
  
  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-blue-800">Datos de la Serie</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6"> {/* Aumentado espacio vertical */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Grupo 1 */}
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center mb-2"> {/* Añadido margen inferior */}
                    Tipo de Serie
                    <InfoTooltip variable="seriesType" />
                  </Label>
                  <Select 
                    value={formData.seriesType} 
                    onValueChange={(value) => handleSelectChange('seriesType', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SERIES_TYPES.ORDINARY}>Ordinaria (Vencida)</SelectItem>
                      <SelectItem value={SERIES_TYPES.ADVANCE}>Anticipada</SelectItem>
                      <SelectItem value={SERIES_TYPES.DEFERRED}>Diferida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="flex items-center mb-2">
                    Unidad de Tiempo
                    <InfoTooltip variable="timeUnit" />
                  </Label>
                  <Select 
                    value={formData.timeUnit} 
                    onValueChange={(value) => handleSelectChange('timeUnit', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TIME_UNITS.MONTHLY}>Mensual</SelectItem>
                      <SelectItem value={TIME_UNITS.ANNUAL}>Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Grupo 2 */}
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center mb-2">
                    Variable a Calcular
                    <InfoTooltip variable="variable" />
                  </Label>
                  <Select 
                    value={variableToCalculate} 
                    onValueChange={setVariableToCalculate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona variable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P">Valor Presente (P)</SelectItem>
                      <SelectItem value="F">Valor Futuro (F)</SelectItem>
                      <SelectItem value="A">Pago Periódico (A)</SelectItem>
                      <SelectItem value="i">Tasa de Interés (i)</SelectItem>
                      <SelectItem value="n">Número de Períodos (n)</SelectItem>
                      {formData.seriesType === SERIES_TYPES.DEFERRED && (
                        <SelectItem value="k">Períodos Diferidos (k)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="flex items-center mb-2">
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
            </div>
            
            {/* Grupo 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center mb-2">
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
                <Label className="flex items-center mb-2">
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
            
            {/* Grupo 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center mb-2">
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
                <Label className="flex items-center mb-2">
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
                <Label className="flex items-center mb-2">
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
          </div>
          
          <div>
            <ResultCard 
              result={result} 
              seriesType={formData.seriesType} 
              variable={variableToCalculate}
              timeUnit={formData.timeUnit}
            />
            
            <TimeDiagram 
              seriesType={formData.seriesType} 
              values={formData} 
              timeUnit={formData.timeUnit}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorForm;