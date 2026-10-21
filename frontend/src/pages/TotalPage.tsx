import SummaryBar from '../components/SummaryBar'

type Props = {
  onBack: () => void
}

export default function TotalPage({ onBack }: Props) {
  return (
    <section>
      <button type="button" onClick={onBack}>
        이전
      </button>
      <h1>총 정산</h1>
      <p>기록된 모든 월의 합계입니다.</p>
      <SummaryBar month={null} reloadKey={0} />
    </section>
  )
}
