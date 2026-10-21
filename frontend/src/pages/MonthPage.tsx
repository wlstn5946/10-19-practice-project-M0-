import { useEffect, useState } from 'react'
import { ApiError, listRecords, type BudgetRecord } from '../api'
import RecordList from '../components/RecordList'
import RecordModal from '../components/RecordModal'
import SummaryBar from '../components/SummaryBar'

type Props = {
  month: number
  onBack: () => void
}

export default function MonthPage({ month, onBack }: Props) {
  const [records, setRecords] = useState<BudgetRecord[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  // 추가 창: 'new' 는 새 기록, 기록이면 수정
  const [modal, setModal] = useState<'new' | BudgetRecord | null>(null)

  // 다시 불러오기는 reloadKey 를 올려서 한다. (#4 의 저장·삭제 뒤 갱신도 같은 방식)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    listRecords(month)
      .then((data) => {
        if (!cancelled) setRecords(data)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : '불러오지 못했습니다.')
      })
    return () => {
      cancelled = true
    }
  }, [month, reloadKey])

  // 저장·삭제 뒤 목록과 합계를 새로 불러온다. 목록은 새 결과가 올 때까지 그대로 둔다.
  const refresh = () => setReloadKey((k) => k + 1)

  const reload = () => {
    setError(null)
    setRecords(null)
    setReloadKey((k) => k + 1)
  }

  return (
    <section>
      <button type="button" onClick={onBack}>
        이전
      </button>
      <h1>{month}월</h1>
      <button type="button" onClick={() => setModal('new')}>
        기록 추가
      </button>
      {error && (
        <p role="alert">
          {error} <button type="button" onClick={reload}>다시 불러오기</button>
        </p>
      )}
      {!error && records === null && <p>불러오는 중...</p>}
      {records !== null && records.length === 0 && <p>기록없음</p>}
      {records !== null && records.length > 0 && (
        <RecordList records={records} onEdit={setModal} />
      )}
      <SummaryBar month={month} reloadKey={reloadKey} />
      {modal !== null && (
        <RecordModal
          month={month}
          record={modal === 'new' ? undefined : modal}
          onClose={() => setModal(null)}
          onChanged={refresh}
        />
      )}
    </section>
  )
}
