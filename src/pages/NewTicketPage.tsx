import { ArrowLeft, Send } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import type { Ticket, TicketCategory, TicketPriority } from '../types'
import { categoryLabels, priorityLabels } from '../utils/ticketLabels'

interface UnitOption {
  id: string
  name: string
  acronym: string
  type: 'HEALTH_UNIT' | 'SUPPORT_CENTER'
}

export function NewTicketPage() {
  const navigate = useNavigate()
  const [units, setUnits] = useState<UnitOption[]>([])
  const [isLoadingUnits, setIsLoadingUnits] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest<{ units: UnitOption[] }>('/api/units')
      .then((response) => setUnits(response.units))
      .catch(() => setError('Não foi possível carregar as unidades disponíveis.'))
      .finally(() => setIsLoadingUnits(false))
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await apiRequest<{ ticket: Ticket }>('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          title: String(formData.get('title')),
          description: String(formData.get('description')),
          category: String(formData.get('category')),
          priority: String(formData.get('priority')),
          unitId: String(formData.get('unitId')),
        }),
      })

      navigate(`/chamados/${response.ticket.id}`)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível registrar o chamado.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="ticket-form-page">
      <Link className="back-link" to="/chamados">
        <ArrowLeft size={17} />
        Voltar para os chamados
      </Link>

      <div className="page-heading compact-heading">
        <span className="eyebrow">NOVA SOLICITAÇÃO</span>
        <h1>Abrir chamado</h1>
        <p>Descreva a ocorrência com detalhes para agilizar o atendimento.</p>
      </div>

      <form className="ticket-form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="form-grid form-grid--two">
          <label className="form-field">
            <span>Unidade de saúde</span>
            <select name="unitId" disabled={isLoadingUnits} required>
              <option value="">
                {isLoadingUnits ? 'Carregando unidades...' : 'Selecione a unidade'}
              </option>
              {units
                .filter((unit) => unit.type === 'HEALTH_UNIT')
                .map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
            </select>
          </label>

          <label className="form-field">
            <span>Categoria</span>
            <select name="category" defaultValue="" required>
              <option value="" disabled>Selecione uma categoria</option>
              {(Object.entries(categoryLabels) as [TicketCategory, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ),
              )}
            </select>
          </label>
        </div>

        <div className="form-grid form-grid--priority">
          <label className="form-field form-field--wide">
            <span>Título do chamado</span>
            <input
              name="title"
              type="text"
              minLength={5}
              maxLength={180}
              placeholder="Ex.: Computador da recepção não inicia"
              required
            />
          </label>

          <label className="form-field">
            <span>Prioridade</span>
            <select name="priority" defaultValue="MEDIUM" required>
              {(Object.entries(priorityLabels) as [TicketPriority, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ),
              )}
            </select>
          </label>
        </div>

        <label className="form-field">
          <span>Descrição da ocorrência</span>
          <textarea
            name="description"
            minLength={10}
            maxLength={5000}
            rows={7}
            placeholder="Informe o que aconteceu, quando começou e quais tentativas já foram realizadas."
            required
          />
        </label>

        <div className="form-actions">
          <Link className="secondary-action" to="/chamados">Cancelar</Link>
          <button className="primary-action" type="submit" disabled={isSubmitting}>
            <Send size={18} />
            {isSubmitting ? 'Registrando...' : 'Registrar chamado'}
          </button>
        </div>
      </form>
    </section>
  )
}
