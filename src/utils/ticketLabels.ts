import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '../types'

export const statusLabels: Record<TicketStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em atendimento',
  WAITING_USER: 'Aguardando usuário',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
  CANCELED: 'Cancelado',
}

export const priorityLabels: Record<TicketPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
}

export const categoryLabels: Record<TicketCategory, string> = {
  SYSTEMS_AND_ACCESS: 'Sistemas e acessos',
  EQUIPMENT: 'Equipamentos',
  NETWORK: 'Rede e internet',
  PRINTING: 'Impressão',
  TELEPHONY: 'Telefonia',
  OTHER: 'Outro',
}

export const nextStatusOptions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ['IN_PROGRESS', 'CANCELED'],
  IN_PROGRESS: ['WAITING_USER', 'RESOLVED', 'CANCELED'],
  WAITING_USER: ['IN_PROGRESS', 'RESOLVED', 'CANCELED'],
  RESOLVED: ['IN_PROGRESS', 'CLOSED'],
  CLOSED: [],
  CANCELED: [],
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date))
}
