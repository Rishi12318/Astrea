from backend.auth.security import create_access_token


def test_admin_analytics_returns_counts(client) -> None:
    response = client.get(
        "/admin/analytics",
        headers={"Authorization": f"Bearer {create_access_token('admin@example.com')}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "users" in body
    assert "products" in body
