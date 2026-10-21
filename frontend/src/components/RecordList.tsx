import type { BudgetRecord } from '../api'

type Props = {
  records: BudgetRecord[]
  onEdit: (record: BudgetRecord) => void
}

// 결산이 예산보다 높으면 위, 낮으면 아래. 같거나 예산이 없으면 표시하지 않는다.
function arrow(record: BudgetRecord): { symbol: string; label: string } | null {
  if (record.budget === null) return null
  if (record.settlement > record.budget) return { symbol: '▲', label: '예산보다 높음' }
  if (record.settlement < record.budget) return { symbol: '▼', label: '예산보다 낮음' }
  return null
}

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`

export default function RecordList({ records, onEdit }: Props) {
  return (
    <table className="record-list">
      <thead>
        <tr>
          <th>이름</th>
          <th>결산</th>
          <th>예산</th>
          <th>차액</th>
          <th>피드백</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => {
          const a = arrow(r)
          return (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{won(r.settlement)}</td>
              <td>{r.budget === null ? '' : won(r.budget)}</td>
              <td>{a && <span aria-label={a.label}>{a.symbol}</span>}</td>
              <td>{r.feedback ?? ''}</td>
              <td>
                <button type="button" onClick={() => onEdit(r)}>
                  상태 변경
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
