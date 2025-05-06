import { useState, useEffect } from 'react'
import { SeriesMethod } from '../types/seriesTypes'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useSeriesCalculations } from '../hooks/useSeriesCalculations'

interface GraphVisualizationProps {
  method: SeriesMethod
}

export default function GraphVisualization({ method }: GraphVisualizationProps) {
  const [data, setData] = useState<any[]>([])
  const { calculateResult } = useSeriesCalculations()
  
  useEffect(() => {
    // Generar datos para el gráfico
    const generateData = () => {
      const baseParams = method.parameters.reduce((acc, param) => {
        acc[param.id] = param.min || 1
        return acc
      }, {} as Record<string, number>)
      
      const newData = []
      const maxPeriods = method.id === 'deferred-annuity' ? 
        baseParams['periods'] + baseParams['deferral'] : 
        baseParams['periods']
      
      for (let i = 1; i <= maxPeriods; i++) {
        let params = { ...baseParams }
        
        if (method.id === 'deferred-annuity') {
          if (i <= params['deferral']) {
            newData.push({ period: i, value: 0 })
            continue
          } else {
            params['periods'] = i - params['deferral']
          }
        } else {
          params['periods'] = i
        }
        
        const value = calculateResult(method.id, params)
        newData.push({ period: i, value })
      }
      
      return newData
    }
    
    setData(generateData())
  }, [method, calculateResult])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualización Gráfica</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" label={{ value: 'Período', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Valor', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Valor']} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Valor Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}