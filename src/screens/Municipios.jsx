// P0.2c: Vista de municipalidades — gris=sin multas, color=con multas, número.
// Los datos demo vienen de Google Sheets + Apps Script (conecta Lemus).
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'
import { cargarMultasPorPlaca } from '@/lib/data'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Fallback si el backend de Sheets no está configurado todavía
const MOCK_MUNICIPIOS = [
  { id: 'emetra', nombre: 'EMETRA', multas: 2 },
  { id: 'pnc', nombre: 'PNC', multas: 0 },
  { id: 'muniguate', nombre: 'MuniGuate', multas: 1 },
]

export default function Municipios() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [placas] = useLocalStorage('placas', [])
  const [municipios, setMunicipios] = useState(MOCK_MUNICIPIOS)

  useEffect(() => {
    let activo = true
    async function cargar() {
      const placa = placas[placas.length - 1] ?? ''
      if (!placa) return
      const multas = await cargarMultasPorPlaca(placa)
      if (!activo || multas.length === 0) return // fallback al mock

      // Agrupar por entidad y contar
      const conteo = {}
      multas.forEach((m) => {
        const id = m.entidad.toLowerCase()
        conteo[id] = (conteo[id] ?? 0) + 1
      })
      const nombres = { emetra: 'EMETRA', pnc: 'PNC', muniguate: 'MuniGuate' }
      setMunicipios(
        Object.entries(conteo).map(([id, n]) => ({
          id,
          nombre: nombres[id] ?? id,
          multas: n,
        }))
      )
    }
    cargar()
    return () => {
      activo = false
    }
  }, [placas])

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t('municipiosTitulo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {municipios.map((m) => (
            <button
              key={m.id}
              onClick={() => navigate('/form')}
              className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
                m.multas > 0
                  ? 'border-red-300 bg-red-50 hover:bg-red-100'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">{m.nombre}</span>
              {m.multas > 0 ? (
                <Badge variant="destructive">{m.multas} {t('municipiosConMultas')}</Badge>
              ) : (
                <Badge variant="secondary">{t('municipiosSinMultas')}</Badge>
              )}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}