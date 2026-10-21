import { useState, type FormEvent } from 'react'
import {
  ApiError,
  createRecord,
  deleteRecord,
  updateRecord,
  type BudgetRecord,
  type FieldError,
  type RecordInput,
} from '../api'
import ConfirmDelete from './ConfirmDelete'

type Props = {
  month: number
  // 있으면 수정, 없으면 새 기록
  record?: BudgetRecord
  onClose: () => void
  // 저장·삭제가 끝났을 때, 또는 목록이 달라졌을 수 있을 때(404) 목록과 합계를 새로 불러온다.
  onChanged: () => void
}

// 빈 칸은 null, 정수 모양이면 숫자. 그 밖의 값은 그대로 보내 서버가 거절하게 한다.
function toAmount(text: string): number | string | null {
  const t = text.trim()
  if (t === '') return null
  return /^-?\d+$/.test(t) ? Number(t) : t
}

export default function RecordModal({ month, record, onClose, onChanged }: Props) {
  const [name, setName] = useState(record?.name ?? '')
  const [settlement, setSettlement] = useState(record ? String(record.settlement) : '')
  const [budget, setBudget] = useState(record?.budget != null ? String(record.budget) : '')
  const [feedback, setFeedback] = useState(record?.feedback ?? '')
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const fail = (e: unknown) => {
    if (e instanceof ApiError) {
      setFieldErrors(e.fields)
      setError(e.fields.length > 0 ? '입력을 확인하세요.' : e.message)
      if (e.status === 404) onChanged()
    } else {
      setError('요청에 실패했습니다.')
    }
  }

  const save = async (ev: FormEvent) => {
    ev.preventDefault()
    setBusy(true)
    setError(null)
    setFieldErrors([])
    const input: RecordInput = {
      name,
      settlement: toAmount(settlement),
      budget: toAmount(budget),
      feedback: feedback === '' ? null : feedback,
      month: record?.month ?? month,
    }
    try {
      if (record) await updateRecord(record.id, input)
      else await createRecord(input)
      onChanged()
      onClose()
    } catch (e) {
      fail(e)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!record) return
    setBusy(true)
    setError(null)
    try {
      await deleteRecord(record.id)
      onChanged()
      onClose()
    } catch (e) {
      setConfirming(false)
      fail(e)
    } finally {
      setBusy(false)
    }
  }

  const fieldError = (field: string) =>
    fieldErrors
      .filter((f) => f.field === field)
      .map((f) => (
        <span key={f.message} role="alert" className="field-error">
          {f.message}
        </span>
      ))

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-label={record ? '기록 수정' : '기록 추가'}>
        <h2>{record ? '기록 수정' : `${month}월 기록 추가`}</h2>
        {error && <p role="alert">{error}</p>}
        <form onSubmit={(ev) => void save(ev)}>
          <label>
            이름 (필수)
            <input value={name} onChange={(e) => setName(e.target.value)} />
            {fieldError('name')}
          </label>
          <label>
            결산 (필수, 원)
            <input
              inputMode="numeric"
              value={settlement}
              onChange={(e) => setSettlement(e.target.value)}
            />
            {fieldError('settlement')}
          </label>
          <label>
            예산 (원)
            <input
              inputMode="numeric"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            {fieldError('budget')}
          </label>
          <label>
            피드백 (30자 이내)
            <input value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            {fieldError('feedback')}
          </label>
          <div className="modal-actions">
            <button type="submit" disabled={busy}>
              저장
            </button>
            <button type="button" onClick={onClose} disabled={busy}>
              닫기
            </button>
            {record && (
              <button type="button" onClick={() => setConfirming(true)} disabled={busy}>
                삭제
              </button>
            )}
          </div>
        </form>
        {record && confirming && (
          <ConfirmDelete
            name={record.name}
            busy={busy}
            onConfirm={() => void remove()}
            onCancel={() => setConfirming(false)}
          />
        )}
      </div>
    </div>
  )
}
