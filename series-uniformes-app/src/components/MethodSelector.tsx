import { useNavigate } from "react-router-dom"
import { SeriesMethod, seriesMethods } from "../types/seriesTypes"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

interface MethodSelectorProps {
  onSelect?: (method: SeriesMethod) => void
}

export default function MethodSelector({ onSelect }: MethodSelectorProps) {
  const navigate = useNavigate()

  const handleSelect = (method: SeriesMethod) => {
    if (onSelect) {
      onSelect(method)
    }
    navigate(`/method/${method.id}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {seriesMethods.map((method) => (
        <Card key={method.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{method.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {method.description}
            </p>
            <Button 
              onClick={() => handleSelect(method)} 
              className="w-full"
            >
              Seleccionar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}