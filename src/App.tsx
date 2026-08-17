import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="chamados"
            element={<PlaceholderPage title="Meus chamados" />}
          />
          <Route
            path="chamados/novo"
            element={<PlaceholderPage title="Novo chamado" />}
          />
          <Route
            path="base-conhecimento"
            element={<PlaceholderPage title="Base de conhecimento" />}
          />
          <Route
            path="admin/fila"
            element={<PlaceholderPage title="Fila de atendimento" />}
          />
          <Route
            path="admin/usuarios"
            element={<PlaceholderPage title="Usuários e unidades" />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
