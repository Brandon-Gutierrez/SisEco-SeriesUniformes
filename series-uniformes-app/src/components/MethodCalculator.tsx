import { useState, useEffect } from 'react'
import { SeriesMethod } from '../types/seriesTypes'
import { useSeriesCalculations } from '../hooks/useSeriesCalculations'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Slider } from './ui/slider'

interface MethodCalculatorProps {
  method: SeriesMethod
}

export default function MethodCalculator({ method }: MethodCalculatorProps) {
  // Inicialización más segura de los parámetros
  const [params, setParams] = useState<Record<string, number>>(() => {
    return method.parameters.reduce((acc, param) => {
      acc[param.id] = param.min || 0
      return acc
    }, {} as Record<string, number>)
  })

  const { calculateResult } = useSeriesCalculations()
  const [result, setResult] = useState<number | null>(null)

  // Actualizar resultado cuando cambian los parámetros
  useEffect(() => {
    setResult(calculateResult(method.id, params))
  }, [params, method.id, calculateResult])

  const handleParamChange = (paramId: string, value: number) => {
    const paramConfig = method.parameters.find(p => p.id === paramId)
    if (!paramConfig) return

    // Validación de valores
    let validatedValue = value
    if (paramConfig.min !== undefined && value < paramConfig.min) {
      validatedValue = paramConfig.min
    }
    if (paramConfig.max !== undefined && value > paramConfig.max) {
      validatedValue = paramConfig.max
    }

    setParams(prev => ({
      ...prev,
      [paramId]: validatedValue
    }))
  }

  const handleInputChange = (paramId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numValue = value === '' ? 0 : parseFloat(value)
    
    if (!isNaN(numValue)) {
      handleParamChange(paramId, numValue)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de {method.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {method.parameters.map(param => (
            <div key={param.id} className="space-y-2">
              <Label htmlFor={param.id}>{param.name}</Label>
              <div className="flex gap-4">
                <Input
                  id={param.id}
                  type="number"
                  value={params[param.id]}
                  onChange={(e) => handleInputChange(param.id, e)}
                  min={param.min}
                  max={param.max}
                  step={param.type === 'integer' ? 1 : 0.01}
                />
                {param.type === 'percentage' && (
                  <span className="self-center">%</span>
                )}
              </div>
              <Slider
                value={[params[param.id]]}
                onValueChange={([value]) => handleParamChange(param.id, value)}
                min={param.min}
                max={param.max || 100}
                step={param.type === 'integer' ? 1 : 0.01}
              />
              <p className="text-sm text-muted-foreground">{param.description}</p>
            </div>
          ))}
          
          <div className="pt-4">
            <h3 className="text-lg font-semibold">Resultado:</h3>
            <p className="text-2xl font-bold mt-2">
              {result !== null ? result.toFixed(2) : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}