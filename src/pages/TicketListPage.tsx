import { Filter, Inbox, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import type { Ticket, TicketStatus } from '../types'
import {
  categoryLabels,
  formatDate,
  priorityLabels,
  statusLabels,
} from '../utils/ticketLabels'
import '../styles/tickets.css'

interface TicketListPageProps {
  mode?: 'mine' | 'queue'
}

export function TicketListPage({ mode = 'mine' }: TicketListPageProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [statusFilter, setStatusFilter] = useState<'ALL' | TicketStatus>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest<{ tickets: Ticket[] }>('/api/tickets')
      .then((response) => setTickets(response.tickets))
      .catch((requestError: unknown) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Não foi possível carregar os chamados.',
        ),
      )
      .finally(() => setIsLoading(false))
  }, [])

  const visibleTickets = useMemo(
    () =>
      statusFilter === 'ALL'
        ? tickets
        : tickets.filter((ticket) => ticket.status === statusFilter),
    [statusFilter, tickets],
  )

  return (
    <section className="tickets-page">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">
            {mode === 'queue' ? 'ATENDIMENTO' : 'SOLICITAÇÕES'}
          </span>
          <h1>{mode === 'queue' ? 'Fila de atendimento' : 'Meus chamados'}</h1>
          <p>
            {mode === 'queue'
              ? 'Acompanhe as ocorrências recebidas e assuma novos atendimentos.'
              : 'Consulte os protocolos registrados e acompanhe cada atendimento.'}
          </p>
        </div>

        <Link className="primary-action" to="/chamados/novo">
          <Plus size={19} />
          Novo chamado
        </Link>
      </div>

      <div className="ticket-toolbar">
        <label>
          <Filter size={17} />
          <span>Filtrar por status</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as 'ALL' | TicketStatus)
            }
          >
            <option value="ALL">Todos</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <span>{visibleTickets.length} chamado(s)</span>
      </div>

      {isLoading && <div className="content-state">Carregando chamados...</div>}
      {error && <div className="content-state content-state--error">{error}</div>}

      {!isLoading && !error && visibleTickets.length === 0 && (
        <div className="content-state content-state--empty">
          <Inbox size={34} />
          <strong>Nenhum chamado encontrado</strong>
          <p>Os chamados aparecerão aqui depois que forem registrados.</p>
        </div>
      )}

      {!isLoading && !error && visibleTickets.length > 0 && (
        <div className="ticket-table-wrapper">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Chamado</th>
                <th>Unidade</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Atualização</th>
              </tr>
            </thead>
            <tbody>
              {visibleTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <Link className="ticket-title-link" to={`/chamados/${ticket.id}`}>
                      <small>{ticket.protocol}</small>
                      <strong>{ticket.title}</strong>
                      <span>{categoryLabels[ticket.category]}</span>
                    </Link>
                  </td>
                  <td>{ticket.unitName}</td>
                  <td>
                    <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                      {priorityLabels[ticket.priority]}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${ticket.status.toLowerCase().replaceAll('_', '-')}`}>
                      {statusLabels[ticket.status]}
                    </span>
                  </td>
                  <td>{formatDate(ticket.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
