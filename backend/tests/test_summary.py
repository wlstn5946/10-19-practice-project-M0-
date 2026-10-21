import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("BUDGET_DB", str(tmp_path / "test.db"))
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c


def add(client, month, settlement, budget=None, name="기록"):
    r = client.post(
        "/api/records",
        json={"name": name, "settlement": settlement, "budget": budget, "month": month},
    )
    assert r.status_code == 201
    return r.json()["id"]


def monthly(client, month):
    r = client.get("/api/summary/monthly", params={"month": month})
    assert r.status_code == 200
    return r.json()


def test_monthly_sums_settlement_and_budget_separately(client):
    add(client, 1, 1000, 800)
    add(client, 1, 500, 700)
    assert monthly(client, 1) == {"settlement_total": 1500, "budget_total": 1500}


def test_empty_month_is_null(client):
    add(client, 1, 1000, 800)
    assert monthly(client, 2) == {"settlement_total": None, "budget_total": None}


def test_missing_budget_excluded_from_budget_total(client):
    add(client, 1, 1000, 800)
    add(client, 1, 500)
    assert monthly(client, 1) == {"settlement_total": 1500, "budget_total": 800}


def test_total_covers_all_months(client):
    add(client, 1, 1000, 800)
    add(client, 3, 500, 200)
    r = client.get("/api/summary/total")
    assert r.json() == {"settlement_total": 1500, "budget_total": 1000}


def test_total_empty_is_null(client):
    r = client.get("/api/summary/total")
    assert r.json() == {"settlement_total": None, "budget_total": None}


def test_summary_follows_create_update_delete(client):
    rid = add(client, 1, 1000, 800)
    add(client, 2, 300, 300)
    body = {"name": "기록", "settlement": 4000, "budget": 900, "month": 1}
    client.put(f"/api/records/{rid}", json=body)
    assert monthly(client, 1) == {"settlement_total": 4000, "budget_total": 900}
    client.put(f"/api/records/{rid}", json={**body, "month": 2})
    assert monthly(client, 1) == {"settlement_total": None, "budget_total": None}
    assert monthly(client, 2) == {"settlement_total": 4300, "budget_total": 1200}
    client.delete(f"/api/records/{rid}")
    assert client.get("/api/summary/total").json() == {
        "settlement_total": 300,
        "budget_total": 300,
    }


def test_monthly_requires_valid_month(client):
    assert client.get("/api/summary/monthly").status_code == 422
    assert client.get("/api/summary/monthly", params={"month": 13}).status_code == 422


def test_list_filters_by_month(client):
    add(client, 1, 1000, name="일월")
    add(client, 2, 2000, name="이월")
    names = [r["name"] for r in client.get("/api/records", params={"month": 2}).json()]
    assert names == ["이월"]
    assert len(client.get("/api/records").json()) == 2
    assert client.get("/api/records", params={"month": 0}).status_code == 422
