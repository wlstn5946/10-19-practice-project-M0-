import type { BudgetRecord } from '../api'

type Props = {
  records: BudgetRecord[]
  onEdit: (record: BudgetRecord) => void
}

// 결산이 예산보다 크면 과지출(O). 같거나 낮거나 예산이 없으면 빈칸.
const isOverspent = (record: BudgetRecord) =>
  record.budget !== null && record.settlement > record.budget

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`

export default function RecordList({ records, onEdit }: Props) {
  return (
    <table className="record-list">
      <thead>
        <tr>
          <th>지출 목록</th>
          <th>결산</th>
          <th>예산</th>
          <th>과지출</th>
          <th>피드백</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr key={r.id}>
            <td>{r.name}</td>
            <td>{won(r.settlement)}</td>
            <td>{r.budget === null ? '' : won(r.budget)}</td>
            <td>{isOverspent(r) ? 'O' : ''}</td>
            <td>{r.feedback ?? ''}</td>
            <td>
              <button type="button" onClick={() => onEdit(r)}>
                상태 변경
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
