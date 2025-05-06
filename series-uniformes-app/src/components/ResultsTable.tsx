import { SeriesMethod } from '../types/seriesTypes'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table'
import { useSeriesCalculations } from '../hooks/useSeriesCalculations'
import { useState, useEffect } from 'react'

interface ResultsTableProps {
  method: SeriesMethod
}

export default function ResultsTable({ method }: ResultsTableProps) {
  const [tableData, setTableData] = useState<any[]>([])
  const { calculateResult } = useSeriesCalculations()
  
  useEffect(() => {
    const generateTableData = () => {
      const baseParams = method.parameters.reduce((acc, param) => {
        acc[param.id] = param.min || 1
        return acc
      }, {} as Record<string, number>)
      
      const data = []
      const steps = 5
      
      for (let i = 1; i <= steps; i++) {
        const params = { ...baseParams }
        
        // Variar un parámetro a la vez para mostrar en la tabla
        const variedParam = method.parameters[0].id
        params[variedParam] = (params[variedParam] || 1) * i
        
        const result = calculateResult(method.id, params)
        
        data.push({
          ...params,
          result
        })
      }
      
      return data
    }
    
    setTableData(generateTableData())
  }, [method, calculateResult])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Comparativos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {method.parameters.map(param => (
                <TableHead key={param.id}>{param.name}</TableHead>
              ))}
              <TableHead className="text-right">Resultado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, idx) => (
              <TableRow key={idx}>
                {method.parameters.map(param => (
                  <TableCell key={param.id}>
                    {param.type === 'percentage' ? `${(row[param.id] * 100).toFixed(2)}%` : row[param.id]}
                  </TableCell>
                ))}
                <TableCell className="text-right font-medium">
                  ${row.result.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}