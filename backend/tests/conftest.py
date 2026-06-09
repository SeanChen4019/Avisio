import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

# Use in-memory SQLite for tests
import os
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["JWT_SECRET"] = "test-secret"
os.environ["RATE_LIMIT_PER_MIN"] = "1000"  # disable rate limiting for tests

from app.main import app
from app.database import init_db, engine


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    await init_db()
    yield
    # no cleanup needed for in-memory


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient):
    """Register and login, return headers with token."""
    email = f"test_{id(object())}@example.com"
    await client.post("/api/auth/register", json={
        "email": email,
        "password": "pass1234",
        "name": "Test User",
    })
    resp = await client.post("/api/auth/login", json={
        "email": email,
        "password": "pass1234",
    })
    data = resp.json()
    return {"Authorization": f"Bearer {data['token']}"}
