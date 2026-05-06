import io

from backend.auth.security import create_access_token


def auth_headers(email: str = "tester@example.com") -> dict[str, str]:
    token = create_access_token(email)
    return {"Authorization": f"Bearer {token}"}


def test_root_health(client) -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_recommend_products(client) -> None:
    response = client.post(
        "/recommend-products",
        headers=auth_headers(),
        json={
            "user_id": 1,
            "occasion": "party",
            "style_preference": "soft glam",
            "skin_tone": "Medium",
            "undertone": "Warm",
            "face_shape": "Oval",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert "products" in body
    assert len(body["products"]) > 0


def test_upload_image_requires_auth(client) -> None:
    response = client.post(
        "/upload-image",
        files={"file": ("face.jpg", io.BytesIO(b"fake-image-data"), "image/jpeg")},
    )
    assert response.status_code == 401
