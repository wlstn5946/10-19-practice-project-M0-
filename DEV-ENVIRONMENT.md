# 개발 환경

확인 날짜: 2026-10-19
각 버전은 `--version` 명령의 출력을 그대로 적었다.

## 운영체제와 셸

| 항목 | 값 |
|---|---|
| 운영체제 | Microsoft Windows 11 Pro 10.0.22631 |
| 셸 | PowerShell 7.6.7 (주 사용). Git Bash 도 쓸 수 있다. |
| 작업 폴더 | C:\mzc\vibe-coding\10_19\10_19_practice |

## 도구별 버전

| 도구 | 명령 | 출력 |
|---|---|---|
| git | `git --version` | `git version 2.56.0.windows.2` |
| node | `node --version` | `v24.22.0` |
| npm | `npm --version` | `11.19.1` |
| uv | `uv --version` | `uv 0.13.1 (62faed335 2026-10-13 x86_64-pc-windows-msvc)` |
| python | `python3.12 --version` | `Python 3.12.15` |

### Python 사용 시 주의

- 터미널의 `python` 과 `python3` 는 Microsoft Store 안내용 껍데기다. `python --version` 은 버전 대신 `Python` 만 출력하고 종료 코드 9009 로 끝난다. 진짜 Python 이 아니다.
- 진짜 Python 은 uv 가 관리하는 3.12.15 이고 `python3.12` 또는 `uv run` 으로 쓴다.
  - 실행 파일: `C:\Users\EZ\AppData\Roaming\uv\python\cpython-3.12.15-windows-x86_64-none\python.exe`
- `pip`, `py`, `pnpm`, `yarn`, `sqlite3` 명령은 없다.
- SQLite 는 Python 내장 `sqlite3` 모듈을 쓴다. uv 의 Python 3.12 에 이 모듈이 들어 있는지는 아직 확인하지 않았다.

## 새로 설치한 것

없음. 이 문서를 쓰는 시점까지 아무것도 설치하지 않았다. 위 도구는 모두 이미 설치되어 있던 것이다.

아직 없는 것 (설치 계획만 있고 설치하지 않았다)
- FastAPI 와 실행 서버 (`fastapi[standard]`)
- React · Vite 화면 프로젝트
