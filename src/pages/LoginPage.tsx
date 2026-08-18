import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { useAuth } from '../contexts/auth-context'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? '/'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      await login({
        email: String(formData.get('email')),
        password: String(formData.get('password')),
      })
      navigate(redirectTo, { replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível entrar no portal.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-card-heading">
          <span className="auth-eyebrow">ACESSO À PLATAFORMA</span>
          <h2>Entre na sua conta</h2>
          <p>Utilize o e-mail cadastrado para acessar o atendimento.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error" role="alert">{error}</div>}

          <label className="form-field">
            <span>E-mail</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu.email@saovicente.sp.gov.br"
              required
            />
          </label>

          <label className="form-field">
            <span>Senha</span>
            <span className="password-field">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </span>
          </label>

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            <LogIn size={19} />
            {isSubmitting ? 'Entrando...' : 'Entrar no portal'}
          </button>
        </form>

        <p className="auth-switch">
          Ainda não possui acesso? <Link to="/cadastro">Criar conta</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
