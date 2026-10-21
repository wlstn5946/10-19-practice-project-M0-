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

// 금액·이름은 검증을 서버가 하므로 화면은 값을 그대로 보낸다.
export type RecordInput = {
  name: string
  settlement: number | string | null
  budget: number | string | null
  feedback: string | null
  month: number
}

export type Summary = {
  settlement_total: number | null
  budget_total: number | null
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export function createRecord(input: RecordInput): Promise<BudgetRecord> {
  return request('/api/records', json('POST', input))
}

export function updateRecord(id: number, input: RecordInput): Promise<BudgetRecord> {
  return request(`/api/records/${id}`, json('PUT', input))
}

export function deleteRecord(id: number): Promise<void> {
  return request(`/api/records/${id}`, { method: 'DELETE' })
}

export function monthlySummary(month: number): Promise<Summary> {
  return request(`/api/summary/monthly?month=${month}`)
}

export function totalSummary(): Promise<Summary> {
  return request('/api/summary/total')
}
