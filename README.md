# 가계부

내 컴퓨터에서 실행하는 개인용 가계부 웹 앱. 화면은 React · Vite, API는 FastAPI, 저장소는 SQLite 이다. 배포 없이 쓴다.

기록 한 건에 이름, 결산, 예산, 피드백을 남기고, 월별 페이지(1 ~ 12월)에서 결산·예산 총합을, 첫 페이지의 "총 정산"에서 기록된 모든 월의 합계를 본다.

## 준비물

- Node.js 와 npm
- uv (Python 3.12 를 uv 가 관리한다.)

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

브라우저에서 http://localhost:5173 을 연다. 화면의 `/api` 요청은 Vite 가 API 로 넘긴다. API 를 끄면 화면은 연결 실패를 알린다.

## 데이터

- 기록은 `backend/budget.db` (SQLite 파일)에 저장된다. 처음 API 를 실행할 때 파일과 테이블이 만들어진다. 앱을 껐다 켜도 남는다.
- 다른 위치를 쓰려면 환경 변수 `BUDGET_DB` 에 파일 경로를 지정한다.
- 이 파일을 지우면 기록이 모두 사라진다. 백업·내보내기 기능은 없다.

## 확인

```powershell
cd backend ; uv run pytest
cd frontend ; npm run build ; npm run lint
```

API 문서: API 를 실행한 뒤 http://127.0.0.1:8000/docs
