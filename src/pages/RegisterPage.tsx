import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { useAuth } from '../contexts/auth-context'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password'))
    const passwordConfirmation = String(formData.get('passwordConfirmation'))

    if (password !== passwordConfirmation) {
      setError('A confirmação da senha não corresponde à senha informada.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        fullName: String(formData.get('fullName')),
        email: String(formData.get('email')),
        password,
      })
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível criar sua conta.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-card--register">
        <div className="auth-card-heading">
          <span className="auth-eyebrow">NOVO ACESSO</span>
          <h2>Crie sua conta</h2>
          <p>Cadastre seus dados para começar a utilizar o portal.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error" role="alert">{error}</div>}

          <label className="form-field">
            <span>Nome completo</span>
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              minLength={3}
              maxLength={160}
              placeholder="Digite seu nome completo"
              required
            />
          </label>

          <label className="form-field">
            <span>E-mail</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={255}
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
                autoComplete="new-password"
                minLength={10}
                maxLength={128}
                placeholder="No mínimo 10 caracteres"
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

          <label className="form-field">
            <span>Confirmar senha</span>
            <input
              name="passwordConfirmation"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={10}
              maxLength={128}
              placeholder="Digite a senha novamente"
              required
            />
          </label>

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            <UserPlus size={19} />
            {isSubmitting ? 'Criando conta...' : 'Criar minha conta'}
          </button>
        </form>

        <p className="auth-switch">
          Já possui uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
