import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_project(client: AsyncClient, auth_headers):
    resp = await client.post("/api/projects", json={
        "title": "My Test Project",
        "drawio_xml": "<mxGraphModel><root></root></mxGraphModel>",
    }, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "My Test Project"
    assert data["id"] > 0


@pytest.mark.asyncio
async def test_list_projects(client: AsyncClient, auth_headers):
    # Create 3 projects
    for i in range(3):
        await client.post("/api/projects", json={
            "title": f"Project {i}",
        }, headers=auth_headers)

    resp = await client.get("/api/projects?page=1&page_size=10", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 3
    assert len(data["items"]) >= 3


@pytest.mark.asyncio
async def test_list_projects_pagination(client: AsyncClient, auth_headers):
    # Create 5 projects
    for i in range(5):
        await client.post("/api/projects", json={"title": f"P{i}"}, headers=auth_headers)

    resp = await client.get("/api/projects?page=1&page_size=2", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 2
    assert data["page_size"] == 2


@pytest.mark.asyncio
async def test_get_project(client: AsyncClient, auth_headers):
    create = await client.post("/api/projects", json={
        "title": "Get Test",
    }, headers=auth_headers)
    pid = create.json()["id"]

    resp = await client.get(f"/api/projects/{pid}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["title"] == "Get Test"


@pytest.mark.asyncio
async def test_update_project(client: AsyncClient, auth_headers):
    create = await client.post("/api/projects", json={"title": "Old"}, headers=auth_headers)
    pid = create.json()["id"]

    resp = await client.put(f"/api/projects/{pid}", json={
        "title": "Updated Title",
    }, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated Title"


@pytest.mark.asyncio
async def test_soft_delete_project(client: AsyncClient, auth_headers):
    create = await client.post("/api/projects", json={"title": "Delete Me"}, headers=auth_headers)
    pid = create.json()["id"]

    resp = await client.delete(f"/api/projects/{pid}", headers=auth_headers)
    assert resp.status_code == 200

    # Should not be found in list
    list_resp = await client.get("/api/projects", headers=auth_headers)
    ids = [p["id"] for p in list_resp.json()["items"]]
    assert pid not in ids

    # Direct get should 404
    get_resp = await client.get(f"/api/projects/{pid}", headers=auth_headers)
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_project_not_found(client: AsyncClient, auth_headers):
    resp = await client.get("/api/projects/99999", headers=auth_headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_projects_require_auth(client: AsyncClient):
    resp = await client.post("/api/projects", json={"title": "No Auth"})
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_project_isolation(client: AsyncClient):
    """Projects created by one user should not be visible to another."""
    # User A
    await client.post("/api/auth/register", json={
        "email": "usera@example.com", "password": "pass1234",
    })
    login_a = await client.post("/api/auth/login", json={
        "email": "usera@example.com", "password": "pass1234",
    })
    headers_a = {"Authorization": f"Bearer {login_a.json()['token']}"}
    await client.post("/api/projects", json={"title": "User A Project"}, headers=headers_a)

    # User B
    await client.post("/api/auth/register", json={
        "email": "userb@example.com", "password": "pass1234",
    })
    login_b = await client.post("/api/auth/login", json={
        "email": "userb@example.com", "password": "pass1234",
    })
    headers_b = {"Authorization": f"Bearer {login_b.json()['token']}"}

    # User B cannot see User A's projects
    resp = await client.get("/api/projects", headers=headers_b)
    item_ids = [p["id"] for p in resp.json()["items"]]
    # User A's project should not appear in User B's list
    resp_a = await client.get("/api/projects", headers=headers_a)
    user_a_ids = [p["id"] for p in resp_a.json()["items"]]
    for aid in user_a_ids:
        assert aid not in item_ids
