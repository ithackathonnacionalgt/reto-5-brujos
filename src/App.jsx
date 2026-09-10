// Router principal (vistas).
import { HashRouter, Route, Routes } from 'react-router-dom'
import { I18nProvider } from '@/lib/i18n'
import Home from '@/screens/Home'
import Placas from '@/screens/Placas'
import Municipios from '@/screens/Municipios'
import Form from '@/screens/Form'
import Explicador from '@/screens/Explicador'
import Semaforo from '@/screens/Semaforo'
import QueHago from '@/screens/QueHago'
import Accion from '@/screens/Accion'

function App() {
  return (
    <I18nProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/placas" element={<Placas />} />
          <Route path="/municipios" element={<Municipios />} />
          <Route path="/form" element={<Form />} />
          <Route path="/explicador" element={<Explicador />} />
          <Route path="/semaforo" element={<Semaforo />} />
          <Route path="/que-hago" element={<QueHago />} />
          <Route path="/accion" element={<Accion />} />
        </Routes>
      </HashRouter>
    </I18nProvider>
  )
}

export default App