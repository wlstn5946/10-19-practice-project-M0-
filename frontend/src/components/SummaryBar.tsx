import { useEffect, useState } from 'react'
import { ApiError, monthlySummary, totalSummary, type Summary } from '../api'

type Props = {
  // 월이면 그 달의 합계, null 이면 기록된 모든 월의 총 정산
  month: number | null
  // 값이 바뀌면 다시 불러온다.
  reloadKey: number
}

type Result = { key: string; summary?: Summary; error?: string }

const won = (n: number | null) => (n === null ? '없음' : `${n.toLocaleString('ko-KR')}원`)

export default function SummaryBar({ month, reloadKey }: Props) {
  const key = `${month}:${reloadKey}`
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false
    const done = (r: Omit<Result, 'key'>) => {
      if (!cancelled) setResult({ key, ...r })
    }
    ;(month === null ? totalSummary() : monthlySummary(month))
      .then((summary) => done({ summary }))
      .catch((e: unknown) =>
        done({ error: e instanceof ApiError ? e.message : '합계를 계산하지 못했습니다.' }),
      )
    return () => {
      cancelled = true
    }
  }, [key, month])

  // 이전 달·이전 조회의 숫자는 보여주지 않는다.
  const current = result?.key === key ? result : null

  return (
    <footer className="summary-bar">
      {current === null && <span>합계 계산 중...</span>}
      {current?.error && <span role="alert">{current.error}</span>}
      {current?.summary && (
        <>
          <span>결산 총합: {won(current.summary.settlement_total)}</span>
          <span>예산 총합: {won(current.summary.budget_total)}</span>
        </>
      )}
    </footer>
  )
}
