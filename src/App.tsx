import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {
  ProtectedRoute,
  PublicOnlyRoute,
  RequireRole,
} from './components/auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { AuthProvider } from './contexts/AuthContext'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="cadastro" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
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
                element={<RequireRole allowedRoles={['TECHNICIAN', 'ADMIN']} />}
              >
                <Route
                  path="admin/fila"
                  element={<PlaceholderPage title="Fila de atendimento" />}
                />
              </Route>
              <Route element={<RequireRole allowedRoles={['ADMIN']} />}>
                <Route
                  path="admin/usuarios"
                  element={<PlaceholderPage title="Usuários e unidades" />}
                />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
