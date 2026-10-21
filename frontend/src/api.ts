export type BudgetRecord = {
  id: number
  name: string
  settlement: number
  budget: number | null
  feedback: string | null
  month: number
}

export type FieldError = { field: string; message: string }

// status 0 은 API 에 연결하지 못한 경우다.
export class ApiError extends Error {
  status: number
  fields: FieldError[]

  constructor(status: number, message: string, fields: FieldError[] = []) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, init)
  } catch {
    throw new ApiError(0, 'API 에 연결하지 못했습니다.')
  }
  if (!res.ok) {
    let message = `요청에 실패했습니다. (${res.status})`
    let fields: FieldError[] = []
    try {
      const body = (await res.json()) as { detail?: string | FieldError[] }
      if (typeof body.detail === 'string') message = body.detail
      else if (Array.isArray(body.detail)) fields = body.detail
    } catch {
      // 본문이 JSON 이 아니면 기본 문구를 쓴다.
    }
    throw new ApiError(res.status, message, fields)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export function listRecords(month: number): Promise<BudgetRecord[]> {
  return request(`/api/records?month=${month}`)
}
