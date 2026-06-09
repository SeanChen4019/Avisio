import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    resp = await client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"


@pytest.mark.asyncio
async def test_register_missing_fields(client: AsyncClient):
    resp = await client.post("/api/auth/register", json={})
    assert resp.status_code == 422  # validation error


@pytest.mark.asyncio
async def test_register_weak_password(client: AsyncClient):
    resp = await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "short",
    })
    assert resp.status_code == 422
    assert "at least 8" in str(resp.json())


@pytest.mark.asyncio
async def test_register_no_digit_password(client: AsyncClient):
    resp = await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "abcdefgh",
    })
    assert resp.status_code == 422
    assert "digit" in str(resp.json())


@pytest.mark.asyncio
async def test_full_auth_flow(client: AsyncClient):
    """Register → Login → Me → Logout"""
    email = "flowtest@example.com"
    password = "pass1234"

    # Register
    resp = await client.post("/api/auth/register", json={
        "email": email,
        "password": password,
        "name": "Flow Test",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "token" in data
    assert data["user"]["email"] == email
    assert data["user"]["name"] == "Flow Test"
    token = data["token"]

    # Login
    resp = await client.post("/api/auth/login", json={
        "email": email,
        "password": password,
    })
    assert resp.status_code == 200
    token = resp.json()["token"]

    # Me
    resp = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == email

    # Logout
    resp = await client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    resp = await client.post("/api/auth/login", json={
        "email": "nonexist@example.com",
        "password": "wrongpass1",
    })
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_me_without_token(client: AsyncClient):
    resp = await client.get("/api/auth/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_register_duplicate(client: AsyncClient):
    email = "dup@example.com"
    password = "pass1234"
    await client.post("/api/auth/register", json={"email": email, "password": password})
    resp = await client.post("/api/auth/register", json={"email": email, "password": password})
    assert resp.status_code == 400
    assert "already registered" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_admin_access_denied(client: AsyncClient, auth_headers):
    """Non-admin user should be denied admin access."""
    resp = await client.get("/api/admin/users", headers=auth_headers)
    assert resp.status_code == 403
