import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  MessageSquare,
  Send,
  UserCheck,
} from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/auth-context'
import { apiRequest } from '../services/api'
import type { Ticket, TicketMessage, TicketStatus } from '../types'
import {
  categoryLabels,
  formatDate,
  nextStatusOptions,
  priorityLabels,
  statusLabels,
} from '../utils/ticketLabels'

const roleLabels = {
  REQUESTER: 'Solicitante',
  TECHNICIAN: 'Técnico',
  ADMIN: 'Administrador',
}

export function TicketDetailPage() {
  const { ticketId } = useParams()
  const { user } = useAuth()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const isStaff = user?.role === 'TECHNICIAN' || user?.role === 'ADMIN'

  const loadTicket = useCallback(async () => {
    if (!ticketId) return

    try {
      const response = await apiRequest<{
        ticket: Ticket
        messages: TicketMessage[]
      }>(`/api/tickets/${ticketId}`)
      setTicket(response.ticket)
      setMessages(response.messages)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar o chamado.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [ticketId])

  useEffect(() => {
    void loadTicket()
  }, [loadTicket])

  async function handleReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ticketId) return

    const form = event.currentTarget
    const formData = new FormData(form)
    setError('')
    setIsSending(true)

    try {
      const response = await apiRequest<{ message: TicketMessage }>(
        `/api/tickets/${ticketId}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: String(formData.get('content')),
            internal: formData.get('internal') === 'on',
          }),
        },
      )
      setMessages((current) => [...current, response.message])
      form.reset()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível enviar a resposta.',
      )
    } finally {
      setIsSending(false)
    }
  }

  async function handleStatusChange(nextStatus: TicketStatus) {
    if (!ticketId || !nextStatus) return

    setIsUpdating(true)
    setError('')

    try {
      const response = await apiRequest<{ ticket: Ticket }>(
        `/api/tickets/${ticketId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: nextStatus }),
        },
      )
      setTicket(response.ticket)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível atualizar o status.',
      )
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleAssign() {
    if (!ticketId) return

    setIsUpdating(true)
    setError('')

    try {
      const response = await apiRequest<{ ticket: Ticket }>(
        `/api/tickets/${ticketId}/assign`,
        { method: 'PATCH' },
      )
      setTicket(response.ticket)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível assumir o chamado.',
      )
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return <div className="content-state">Carregando chamado...</div>
  }

  if (!ticket) {
    return <div className="content-state content-state--error">{error}</div>
  }

  const isFinished = ticket.status === 'CLOSED' || ticket.status === 'CANCELED'
  const nextStatuses = nextStatusOptions[ticket.status]

  return (
    <section className="ticket-detail-page">
      <Link className="back-link" to={isStaff ? '/admin/fila' : '/chamados'}>
        <ArrowLeft size={17} />
        Voltar para a lista
      </Link>

      {error && <div className="form-error page-error" role="alert">{error}</div>}

      <div className="ticket-detail-heading">
        <div>
          <span className="eyebrow">{ticket.protocol}</span>
          <h1>{ticket.title}</h1>
          <div className="ticket-badges">
            <span className={`status-badge status-${ticket.status.toLowerCase().replaceAll('_', '-')}`}>
              {statusLabels[ticket.status]}
            </span>
            <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
              {priorityLabels[ticket.priority]}
            </span>
          </div>
        </div>

        {isStaff && (
          <div className="ticket-staff-actions">
            {ticket.assignedTechnicianId !== user?.id && !isFinished && (
              <button
                className="secondary-action"
                type="button"
                disabled={isUpdating}
                onClick={() => void handleAssign()}
              >
                <UserCheck size={18} />
                Assumir chamado
              </button>
            )}

            {nextStatuses.length > 0 && (
              <label className="status-action">
                <span>Alterar status</span>
                <select
                  defaultValue=""
                  disabled={isUpdating}
                  onChange={(event) =>
                    void handleStatusChange(event.target.value as TicketStatus)
                  }
                >
                  <option value="" disabled>Selecione</option>
                  {nextStatuses.map((status) => (
                    <option key={status} value={status}>{statusLabels[status]}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}
      </div>

      <div className="ticket-detail-grid">
        <div className="ticket-conversation">
          <article className="ticket-description-card">
            <div className="message-heading">
              <span className="message-avatar">{ticket.requesterName.charAt(0)}</span>
              <span>
                <strong>{ticket.requesterName}</strong>
                <small>Relato inicial · {formatDate(ticket.createdAt)}</small>
              </span>
            </div>
            <p>{ticket.description}</p>
          </article>

          <div className="conversation-heading">
            <MessageSquare size={19} />
            <h2>Histórico da conversa</h2>
            <span>{messages.length}</span>
          </div>

          <div className="message-list">
            {messages.length === 0 && (
              <div className="empty-conversation">Ainda não há respostas neste chamado.</div>
            )}

            {messages.map((message) => (
              <article
                key={message.id}
                className={`message-card${message.authorId === user?.id ? ' message-card--own' : ''}${message.internal ? ' message-card--internal' : ''}`}
              >
                <div className="message-heading">
                  <span className="message-avatar">{message.authorName.charAt(0)}</span>
                  <span>
                    <strong>{message.authorName}</strong>
                    <small>
                      {roleLabels[message.authorRole]} · {formatDate(message.createdAt)}
                    </small>
                  </span>
                  {message.internal && <em>Nota interna</em>}
                </div>
                <p>{message.content}</p>
              </article>
            ))}
          </div>

          {!isFinished && (
            <form className="reply-card" onSubmit={handleReply}>
              <label className="form-field">
                <span>Adicionar resposta</span>
                <textarea
                  name="content"
                  rows={5}
                  maxLength={4000}
                  placeholder="Escreva uma atualização para este chamado..."
                  required
                />
              </label>

              <div className="reply-actions">
                {isStaff && (
                  <label className="internal-checkbox">
                    <input name="internal" type="checkbox" />
                    Nota visível apenas para a equipe
                  </label>
                )}
                <button className="primary-action" type="submit" disabled={isSending}>
                  <Send size={17} />
                  {isSending ? 'Enviando...' : 'Enviar resposta'}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="ticket-info-card">
          <h2>Informações</h2>
          <dl>
            <div>
              <dt>Unidade</dt>
              <dd>{ticket.unitName}</dd>
            </div>
            <div>
              <dt>Categoria</dt>
              <dd>{categoryLabels[ticket.category]}</dd>
            </div>
            <div>
              <dt>Solicitante</dt>
              <dd>{ticket.requesterName}</dd>
            </div>
            <div>
              <dt>Responsável</dt>
              <dd>{ticket.assignedTechnicianName ?? 'Não atribuído'}</dd>
            </div>
          </dl>
          <div className="ticket-time">
            <CalendarClock size={18} />
            <span>
              <small>Última atualização</small>
              <strong>{formatDate(ticket.updatedAt)}</strong>
            </span>
          </div>
          {ticket.status === 'RESOLVED' && (
            <div className="resolved-note">
              <CheckCircle2 size={18} />
              Chamado marcado como resolvido.
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
