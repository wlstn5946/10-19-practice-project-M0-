import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState('확인 중...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { status: string }) => setHealth(data.status))
      .catch(() => setHealth('API 연결 실패'))
  }, [])

  return (
    <main>
      <h1>task-flow</h1>
      <p>API 상태: {health}</p>
    </main>
  )
}

export default App
