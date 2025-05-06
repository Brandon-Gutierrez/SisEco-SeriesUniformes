import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import { Smartphone } from 'lucide-react'

export default function MobileWarning() {
  return (
    <Alert variant="destructive" className="mb-4">
      <Smartphone className="h-4 w-4" />
      <AlertTitle>Advertencia</AlertTitle>
      <AlertDescription>
        Para una mejor experiencia, se recomienda usar este sitio en un dispositivo con pantalla más grande.
      </AlertDescription>
    </Alert>
  )
}