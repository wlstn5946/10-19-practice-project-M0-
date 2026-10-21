- 상태: 작성 중

# 이슈: M1 MVP (PRD Must)

근거 문서: PRD.md, USER-WORKFLOW.md, SCREEN-SPEC.md, API-SPEC.md, DATA-MODEL.md
작업 브랜치: `feature/m1-mvp` (main 에서 작업하지 않는다.)
범위: 이슈 #1 ~ #4 로 PRD Must 를 구현한다. R-002(분류)는 Q-16 이 풀리지 않아 범위에서 뺐다.
각 이슈의 "제안값으로 진행" 항목은 사용자가 정한 것이 아니다. 답이 바뀌면 해당 이슈를 고친다.
이슈 번호는 GitHub 에 등록한 뒤 실제 번호에 맞춰 고친다.

구현 순서: #1 → #2 → #3 → #4

---

## #1 [백엔드] 기록 저장소와 기록 CRUD API (R-001, R-003, R-004)

### 배경
DATA-MODEL.md, API-SPEC.md 기준. 화면보다 먼저 만든다. 요구사항: R-001, R-003, R-004

### 범위
- SQLite 연결, 최초 실행 시 records 테이블 생성 (id, name, settlement, budget, feedback, month)
- POST, GET, PUT, DELETE `/api/records`
- 입력 검증: name·settlement·month(1~12) 필수, 금액 정수, feedback 30자 이내
- 오류 응답: 검증 4xx, 없는 id 404, 저장 오류 5xx (한 요청은 전부 저장되거나 전혀 저장되지 않음)
- CORS: 로컬 화면 주소만 허용, API 는 로컬 주소에서만 수신 (D-009)

### 바뀔 파일
`backend/app/main.py`, `backend/app/db.py`, `backend/app/schemas.py`, `backend/app/routers/records.py`, `backend/tests/test_records.py`

### 완료 조건
- [ ] 이름이나 결산이 비면 저장되지 않는다.
- [ ] 예산·피드백은 비워도 저장된다.
- [ ] 수정·삭제 결과가 목록 조회에 반영된다. 삭제는 행을 바로 지운다.
- [ ] 없는 id 의 수정·삭제는 404 다.

### 확인
`uv run pytest`, `uv run fastapi dev` 후 `/docs` 에서 4개 호출

### 결정 필요 (제안값으로 진행)
- 금액 허용 범위(Q-23): 정수 여부만 검증한다.
- feedback 30자 초과 처리(Q-24): 4xx 로 저장을 막는다.

작업 브랜치: `feature/m1-mvp`

---

## #2 [백엔드] 월별 합계·총 정산 API와 월 기준 (R-005, R-007, R-008)

### 배경
선행: #1. 요구사항: R-005, R-007, R-008

### 범위
- GET /api/records 의 월 조건 (`month` 열은 #1 에서 만든다.)
- GET /api/summary/monthly (월 지정), GET /api/summary/total
- 결산·예산 총합을 SQL 집계로 따로 계산, 기록이 없으면 null

### 바뀔 파일
`backend/app/db.py`, `backend/app/routers/summary.py`, `backend/app/routers/records.py`, `backend/tests/test_summary.py`

### 완료 조건
- [ ] 결산 총합과 예산 총합이 따로 나온다.
- [ ] 기록이 없는 달은 null 이다.
- [ ] 총 정산은 기록된 모든 월을 합한다.
- [ ] 기록을 추가·수정·삭제하면 합계가 바뀐다.

### 확인
`uv run pytest`, 두 달에 기록을 넣고 월별·전체 합계를 호출해 비교

### 결정 필요 (제안값으로 진행, 바뀌면 이 이슈를 고친다)
- Q-19: 기록이 속하는 달은 기록을 추가한 월별 페이지의 달이다(저장 시각과 무관). 기록 본문에 `month`(1~12)를 받아 저장한다. (사용자 답변)
- Q-20: 연도는 저장하지 않는다. 월 지정은 `month` 만 쓰고, 월별 페이지는 해와 상관없이 그 월의 기록을 모두 보여준다.
- Q-22: 예산이 빈 기록은 예산 총합에서 제외한다.
- Q-27: 총 정산 응답은 결산 총합과 예산 총합 두 값으로 시작한다.

작업 브랜치: `feature/m1-mvp`

---

## #3 [화면] 첫 페이지, 월별 페이지, 기록 목록 (R-007, R-004)

### 배경
선행: #1, #2. 요구사항: R-007, R-004

### 범위
- API 호출 모듈, 페이지 이동(첫 페이지 ↔ 월별 페이지)
- 첫 페이지의 1~12월 버튼, 월별 페이지의 이전 버튼
- 기록 목록: 이름, 결산, 예산, 차액 화살표, 피드백, 상태 변경 버튼
- 기록이 없으면 "기록없음", 불러오기 실패 시 오류 표시

### 바뀔 파일
`frontend/src/App.tsx`, `frontend/src/api.ts`, `frontend/src/pages/HomePage.tsx`, `frontend/src/pages/MonthPage.tsx`, `frontend/src/components/RecordList.tsx`

### 완료 조건
- [ ] 월 버튼으로 그 달 페이지에 가고, 이전 버튼으로 첫 페이지로 돌아온다.
- [ ] 결산이 예산보다 높으면 위 화살표, 낮으면 아래 화살표다.

### 확인
`npm run build`, `npm run lint`, 브라우저에서 첫 페이지 → 월 → 이전 이동, 빈 달 문구

### 결정 필요 (제안값으로 진행)
- Q-17: 화살표는 화면에서 계산한다.
- Q-18: 결산·예산이 같거나 예산이 비면 화살표를 표시하지 않는다.
- Q-09: 정렬은 최신 등록순이다.

작업 브랜치: `feature/m1-mvp`

---

## #4 [화면] 기록 입력·수정·삭제, 합계, 총 정산, 실행 확인 (R-001, R-003, R-005, R-006, R-008)

### 배경
선행: #1~#3. 요구사항: R-001, R-003, R-005, R-006, R-008

### 범위
- 추가 창: 새 기록과 수정이 같은 입력 항목(이름, 결산, 예산, 피드백) 사용
- 삭제 확인 단계, 확인해야 DELETE 호출
- 월별 페이지 하단의 결산·예산 총합, 기록 없으면 "없음"
- 총 정산 페이지와 첫 페이지의 진입 버튼
- 공통 오류 표시: 입력 유지, 항목 근처 오류, 연결 실패 알림
- 실행 방법 확인(R-006)

### 바뀔 파일
`frontend/src/components/RecordModal.tsx`, `ConfirmDelete.tsx`, `SummaryBar.tsx`, `frontend/src/pages/TotalPage.tsx`, `frontend/src/App.tsx`, `README.md`

### 완료 조건
- [ ] 저장·수정·삭제 뒤 목록과 합계가 새로 불러와진다.
- [ ] 삭제 확인을 취소하면 기록이 남는다.
- [ ] 검증 실패와 API 중지 상태에서 입력이 유지된다.
- [ ] 배포 없이 내 컴퓨터에서 화면·API·SQLite 를 실행해 쓸 수 있다.

### 확인
`npm run build`, `npm run lint`, `uv run pytest`, 브라우저에서 추가 → 수정 → 삭제(취소·확인) → 합계 → 총 정산 → API 종료 후 저장

### 결정 필요 (제안값으로 진행)
- Q-26: 월별 페이지에 기록 추가·수정·삭제·합계를 모두 넣는다.
- Q-27: 총 정산은 첫 페이지 버튼으로 연다.
- Q-25, Q-28: 추가 창, 삭제 확인, 오류 문구는 최소 형태로 만든다.

작업 브랜치: `feature/m1-mvp`

