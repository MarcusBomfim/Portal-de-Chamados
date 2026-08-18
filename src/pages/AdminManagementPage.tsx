import { Building2, Plus, Save, UsersRound } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { apiRequest } from '../services/api'
import type { UserRole } from '../types'
import '../styles/admin.css'

interface AdminUser {
  id: string
  fullName: string
  email: string
  role: UserRole
  unitId: string | null
  unitName: string | null
  active: boolean
  createdAt: string
}

interface AdminUnit {
  id: string
  name: string
  acronym: string
  type: 'HEALTH_UNIT' | 'SUPPORT_CENTER'
  address: string
  active: boolean
  createdAt: string
}

type AdminTab = 'users' | 'units'

export function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [units, setUnits] = useState<AdminUnit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    Promise.all([
      apiRequest<{ users: AdminUser[] }>('/api/admin/users'),
      apiRequest<{ units: AdminUnit[] }>('/api/admin/units'),
    ])
      .then(([userResponse, unitResponse]) => {
        setUsers(userResponse.users)
        setUnits(unitResponse.units)
      })
      .catch((requestError: unknown) =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Não foi possível carregar a administração.',
        ),
      )
      .finally(() => setIsLoading(false))
  }, [])

  async function handleUserUpdate(
    userId: string,
    input: { role: UserRole; unitId: string | null; active: boolean },
  ) {
    setError('')
    setSuccess('')

    try {
      const response = await apiRequest<{ user: AdminUser }>(
        `/api/admin/users/${userId}`,
        { method: 'PATCH', body: JSON.stringify(input) },
      )
      setUsers((current) =>
        current.map((user) => (user.id === userId ? response.user : user)),
      )
      setSuccess('Usuário atualizado com sucesso.')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível atualizar o usuário.',
      )
      throw requestError
    }
  }

  async function handleCreateUnit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setError('')
    setSuccess('')

    try {
      const response = await apiRequest<{ unit: AdminUnit }>('/api/admin/units', {
        method: 'POST',
        body: JSON.stringify({
          name: String(formData.get('name')),
          acronym: String(formData.get('acronym')),
          type: String(formData.get('type')),
          address: String(formData.get('address')),
        }),
      })
      setUnits((current) => [...current, response.unit].sort((a, b) => a.name.localeCompare(b.name)))
      form.reset()
      setSuccess('Unidade cadastrada com sucesso.')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível cadastrar a unidade.',
      )
    }
  }

  async function handleUnitStatus(unit: AdminUnit) {
    setError('')
    setSuccess('')

    try {
      const response = await apiRequest<{ unit: AdminUnit }>(
        `/api/admin/units/${unit.id}`,
        { method: 'PATCH', body: JSON.stringify({ active: !unit.active }) },
      )
      setUnits((current) =>
        current.map((item) => (item.id === unit.id ? response.unit : item)),
      )
      setSuccess(
        response.unit.active ? 'Unidade reativada com sucesso.' : 'Unidade desativada.',
      )
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível atualizar a unidade.',
      )
    }
  }

  return (
    <section className="admin-page">
      <div className="page-heading compact-heading">
        <span className="eyebrow">ADMINISTRAÇÃO</span>
        <h1>Usuários e unidades</h1>
        <p>Controle os acessos ao portal e mantenha as unidades disponíveis.</p>
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Áreas administrativas">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          type="button"
          role="tab"
          aria-selected={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
        >
          <UsersRound size={18} />
          Usuários
          <span>{users.length}</span>
        </button>
        <button
          className={activeTab === 'units' ? 'active' : ''}
          type="button"
          role="tab"
          aria-selected={activeTab === 'units'}
          onClick={() => setActiveTab('units')}
        >
          <Building2 size={18} />
          Unidades
          <span>{units.length}</span>
        </button>
      </div>

      {error && <div className="form-error admin-feedback" role="alert">{error}</div>}
      {success && <div className="admin-success admin-feedback" role="status">{success}</div>}
      {isLoading && <div className="content-state">Carregando informações...</div>}

      {!isLoading && activeTab === 'users' && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Perfil</th>
                <th>Unidade</th>
                <th>Situação</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <AdminUserRow
                  key={user.id}
                  user={user}
                  units={units.filter((unit) => unit.active)}
                  onSave={handleUserUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && activeTab === 'units' && (
        <div className="units-admin-grid">
          <form className="unit-create-card" onSubmit={handleCreateUnit}>
            <div>
              <span className="eyebrow">NOVA UNIDADE</span>
              <h2>Cadastrar unidade</h2>
            </div>
            <label className="form-field">
              <span>Nome</span>
              <input name="name" minLength={3} maxLength={160} required />
            </label>
            <div className="admin-form-row">
              <label className="form-field">
                <span>Sigla</span>
                <input name="acronym" minLength={2} maxLength={30} required />
              </label>
              <label className="form-field">
                <span>Tipo</span>
                <select name="type" defaultValue="HEALTH_UNIT">
                  <option value="HEALTH_UNIT">Unidade de saúde</option>
                  <option value="SUPPORT_CENTER">Central de suporte</option>
                </select>
              </label>
            </div>
            <label className="form-field">
              <span>Endereço ou região</span>
              <input name="address" minLength={3} maxLength={255} required />
            </label>
            <button className="primary-action" type="submit">
              <Plus size={17} />
              Cadastrar unidade
            </button>
          </form>

          <div className="unit-list-card">
            <h2>Unidades cadastradas</h2>
            <div className="admin-unit-list">
              {units.map((unit) => (
                <article key={unit.id} className={!unit.active ? 'inactive' : ''}>
                  <span className="unit-icon"><Building2 size={19} /></span>
                  <span>
                    <strong>{unit.name}</strong>
                    <small>{unit.acronym} · {unit.address}</small>
                  </span>
                  <button type="button" onClick={() => void handleUnitStatus(unit)}>
                    {unit.active ? 'Desativar' : 'Reativar'}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function AdminUserRow({
  user,
  units,
  onSave,
}: {
  user: AdminUser
  units: AdminUnit[]
  onSave: (
    userId: string,
    input: { role: UserRole; unitId: string | null; active: boolean },
  ) => Promise<void>
}) {
  const [role, setRole] = useState(user.role)
  const [unitId, setUnitId] = useState(user.unitId ?? '')
  const [active, setActive] = useState(user.active)
  const [isSaving, setIsSaving] = useState(false)

  async function save() {
    setIsSaving(true)
    try {
      await onSave(user.id, { role, unitId: unitId || null, active })
    } catch {
      // A mensagem de erro é exibida pelo componente principal.
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <tr className={!user.active ? 'inactive' : ''}>
      <td>
        <span className="admin-user-name">
          <strong>{user.fullName}</strong>
          <small>{user.email}</small>
        </span>
      </td>
      <td>
        <select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          <option value="REQUESTER">Solicitante</option>
          <option value="TECHNICIAN">Técnico</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </td>
      <td>
        <select value={unitId} onChange={(event) => setUnitId(event.target.value)}>
          <option value="">Sem unidade</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>{unit.name}</option>
          ))}
        </select>
      </td>
      <td>
        <label className="active-toggle">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
          />
          {active ? 'Ativo' : 'Inativo'}
        </label>
      </td>
      <td>
        <button className="save-user-button" type="button" disabled={isSaving} onClick={() => void save()}>
          <Save size={15} />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </td>
    </tr>
  )
}
