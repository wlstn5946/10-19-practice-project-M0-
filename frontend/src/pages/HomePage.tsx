type Props = {
  onSelectMonth: (month: number) => void
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function HomePage({ onSelectMonth }: Props) {
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
    </section>
  )
}
