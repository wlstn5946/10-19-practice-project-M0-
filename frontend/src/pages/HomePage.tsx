type Props = {
  onSelectMonth: (month: number) => void
  onOpenTotal: () => void
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function HomePage({ onSelectMonth, onOpenTotal }: Props) {
  return (
    <section>
      <h1>가계부</h1>
      <div className="month-grid">
        {MONTHS.map((m) => (
          <button key={m} type="button" onClick={() => onSelectMonth(m)}>
            {m}월
          </button>
        ))}
      </div>
      <p>
        <button type="button" onClick={onOpenTotal}>
          총 정산
        </button>
      </p>
    </section>
  )
}
