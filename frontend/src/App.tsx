import { useState } from 'react'
import HomePage from './pages/HomePage'
import MonthPage from './pages/MonthPage'
import TotalPage from './pages/TotalPage'

type Page = { name: 'home' } | { name: 'month'; month: number } | { name: 'total' }

function App() {
  const [page, setPage] = useState<Page>({ name: 'home' })

  return (
    <main>
      {page.name === 'home' && (
        <HomePage
          onSelectMonth={(month) => setPage({ name: 'month', month })}
          onOpenTotal={() => setPage({ name: 'total' })}
        />
      )}
      {page.name === 'month' && (
        <MonthPage month={page.month} onBack={() => setPage({ name: 'home' })} />
      )}
      {page.name === 'total' && <TotalPage onBack={() => setPage({ name: 'home' })} />}
    </main>
  )
}

export default App
