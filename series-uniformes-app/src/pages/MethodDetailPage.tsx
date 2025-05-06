import { useParams } from "react-router-dom"
import { seriesMethods } from "../types/seriesTypes"
import MethodCalculator from "../components/MethodCalculator"
import { Button } from "../components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function MethodDetailPage() {
  const { methodId } = useParams()
  const navigate = useNavigate()
  
  const method = seriesMethods.find(m => m.id === methodId)
  
  if (!method) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Método no encontrado</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Volver al inicio
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">{method.name}</h1>
      
      <MethodCalculator method={method} />
    </div>
  )
}