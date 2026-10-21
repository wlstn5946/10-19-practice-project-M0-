import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("BUDGET_DB", str(tmp_path / "test.db"))
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c


def body(**kw):
    return {"name": "점심", "settlement": 9000, "month": 1, **kw}


def test_create_minimal(client):
    r = client.post("/api/records", json=body())
    assert r.status_code == 201
    data = r.json()
    assert data["budget"] is None and data["feedback"] is None and data["id"]


@pytest.mark.parametrize("missing", ["name", "settlement"])
def test_required_missing(client, missing):
    b = body()
    del b[missing]
    r = client.post("/api/records", json=b)
    assert r.status_code == 422
    assert r.json()["detail"][0]["field"] == missing
    assert client.get("/api/records").json() == []


def test_blank_name_rejected(client):
    assert client.post("/api/records", json=body(name="  ")).status_code == 422


def test_non_integer_amount_rejected(client):
    assert client.post("/api/records", json=body(settlement=1.5)).status_code == 422
    assert client.post("/api/records", json=body(budget="abc")).status_code == 422


def test_feedback_limit(client):
    assert client.post("/api/records", json=body(feedback="가" * 30)).status_code == 201
    assert client.post("/api/records", json=body(feedback="가" * 31)).status_code == 422


def test_month_range(client):
    assert client.post("/api/records", json=body(month=13)).status_code == 422


def test_update_and_list(client):
    rid = client.post("/api/records", json=body()).json()["id"]
    r = client.put(f"/api/records/{rid}", json=body(name="저녁", budget=8000))
    assert r.status_code == 200
    items = client.get("/api/records").json()
    assert items[0]["name"] == "저녁" and items[0]["budget"] == 8000


def test_update_validation_keeps_data(client):
    rid = client.post("/api/records", json=body()).json()["id"]
    assert client.put(f"/api/records/{rid}", json=body(name="")).status_code == 422
    assert client.get("/api/records").json()[0]["name"] == "점심"


def test_delete(client):
    rid = client.post("/api/records", json=body()).json()["id"]
    assert client.delete(f"/api/records/{rid}").status_code == 204
    assert client.get("/api/records").json() == []


def test_missing_id_404(client):
    assert client.put("/api/records/999", json=body()).status_code == 404
    assert client.delete("/api/records/999").status_code == 404


def test_db_error_is_500(client, monkeypatch, tmp_path):
    monkeypatch.setenv("BUDGET_DB", str(tmp_path / "no-such-dir" / "x.db"))
    assert client.get("/api/records").status_code == 500


def test_cors_allows_only_local_frontend(client):
    h = {
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
    }
    ok = client.options("/api/records", headers={**h, "Origin": "http://localhost:5173"})
    bad = client.options("/api/records", headers={**h, "Origin": "http://evil.example"})
    assert ok.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert "access-control-allow-origin" not in bad.headers
