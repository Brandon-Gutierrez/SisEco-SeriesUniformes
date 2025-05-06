import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import MethodSelector from '../components/MethodSelector'
import { SeriesMethod } from '../types/seriesTypes'
import MobileWarning from '../components/MobileWarning'
import useResponsive from '../hooks/useResponsive'

export default function HomePage() {
  const [selectedMethod, setSelectedMethod] = useState<SeriesMethod | null>(null)
  const navigate = useNavigate()
  const { isMobile } = useResponsive()

  const handleMethodSelect = (method: SeriesMethod) => {
    setSelectedMethod(method)
    navigate(`/method/${method.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isMobile && <MobileWarning />}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sistema de Análisis de Series Uniformes</CardTitle>
          <CardDescription>
            Seleccione un método para analizar series uniformes y diferidas
          </CardDescription>
        </CardHeader>
      </Card>

      <MethodSelector onSelect={handleMethodSelect} />
      
      {selectedMethod && (
        <div className="mt-4">
          <Button onClick={() => navigate(`/method/${selectedMethod.id}`)}>
            Ver detalles de {selectedMethod.name}
          </Button>
        </div>
      )}
    </div>
  )
}