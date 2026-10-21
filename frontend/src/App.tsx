import { useState } from 'react'
import HomePage from './pages/HomePage'
import MonthPage from './pages/MonthPage'

type Page = { name: 'home' } | { name: 'month'; month: number }

function App() {
  const [page, setPage] = useState<Page>({ name: 'home' })

  return (
    <main>
      {page.name === 'home' && (
        <HomePage onSelectMonth={(month) => setPage({ name: 'month', month })} />
      )}
      {page.name === 'month' && (
        <MonthPage month={page.month} onBack={() => setPage({ name: 'home' })} />
      )}
    </main>
  )
}

export default App
