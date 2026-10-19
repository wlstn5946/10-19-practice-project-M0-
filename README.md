# task-flow

화면(React · Vite)과 API(FastAPI)의 기본 구조(M0). 기능, 데이터베이스, 로그인은 아직 없다.

## 실행 (터미널 두 개)

API (http://127.0.0.1:8000):

```powershell
cd backend
uv run fastapi dev
```

화면 (http://localhost:5173):

```powershell
cd frontend
npm install
npm run dev
```

브라우저에서 화면을 열면 "API 상태: ok" 가 보인다. 화면의 `/api` 요청은 Vite 가 API 로 넘긴다.
