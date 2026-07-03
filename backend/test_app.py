import pytest
from app import app

@pytest.fixture
def client():
    app.testing = True
    return app.test_client()

def test_get_inventory(client):
    response = client.get("/inventory")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_add_inventory(client):
    response = client.post("/inventory", json={
        "barcode": "123456789",
        "product_name": "Test Item",
        "brand": "Test Brand",
        "price": 10,
        "stock": 5
    })
    assert response.status_code == 201
    assert response.json["product_name"] == "Test Item"

def test_update_inventory(client):
    # create item
    post = client.post("/inventory", json={
        "barcode": "111111111",
        "product_name": "Update Item",
        "brand": "BrandX",
        "price": 20,
        "stock": 2
    })
    item_id = post.json["id"]

    # update
    patch = client.patch(f"/inventory/{item_id}", json={
        "price": 99,
        "stock": 50
    })
    assert patch.status_code == 200
    assert patch.json["price"] == 99

def test_delete_inventory(client):
    # create item
    post = client.post("/inventory", json={
        "barcode": "222222222",
        "product_name": "Delete Item",
        "brand": "BrandY",
        "price": 30,
        "stock": 3
    })
    item_id = post.json["id"]

    # delete
    delete = client.delete(f"/inventory/{item_id}")
    assert delete.status_code == 200