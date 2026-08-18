interface ApiErrorBody {
  message?: string
  errors?: Record<string, string[] | undefined>
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[] | undefined>

  constructor(status: number, body: ApiErrorBody) {
    super(body.message ?? 'Não foi possível concluir a solicitação.')
    this.name = 'ApiError'
    this.status = status
    this.errors = body.errors
  }
}

export async function apiRequest<T>(path: string, options?: RequestInit) {
  const isFormData = options?.body instanceof FormData
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const body = (await response.json().catch(() => ({}))) as ApiErrorBody

  if (!response.ok) {
    throw new ApiError(response.status, body)
  }

  return body as T
}
