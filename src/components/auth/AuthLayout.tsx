import { Headset, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import '../../styles/auth.css'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-intro" aria-label="Apresentação">
        <div className="auth-brand">
          <span aria-hidden="true">
            <Headset size={24} />
          </span>
          <strong>Portal de Chamados</strong>
        </div>

        <div className="auth-copy">
          <span className="auth-eyebrow">SAÚDE · SÃO VICENTE</span>
          <h1>Suporte organizado para quem cuida da cidade.</h1>
          <p>
            Registre ocorrências, acompanhe cada atendimento e mantenha sua
            unidade conectada à equipe de suporte.
          </p>
        </div>

        <div className="auth-security-note">
          <ShieldCheck size={21} />
          <span>
            <strong>Acesso protegido</strong>
            <small>Sua sessão e seus dados são tratados com segurança.</small>
          </span>
        </div>
      </section>

      <section className="auth-form-area">{children}</section>
    </main>
  )
}
