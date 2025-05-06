import { SeriesMethod } from '../types/seriesTypes'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface FormulaDisplayProps {
  method: SeriesMethod
}

export default function FormulaDisplay({ method }: FormulaDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fórmula Matemática</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="formula">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="formula">Fórmula</TabsTrigger>
            <TabsTrigger value="explanation">Explicación</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formula">
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <code className="text-lg">{method.formula}</code>
            </div>
          </TabsContent>
          
          <TabsContent value="explanation">
            <div className="mt-4 space-y-2">
              <p className="text-sm">{method.description}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {method.parameters.map(param => (
                  <li key={param.id}>
                    <strong>{param.name}</strong>: {param.description}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}