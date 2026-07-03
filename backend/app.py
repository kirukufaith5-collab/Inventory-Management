from flask import Flask, jsonify, request
from inventory import inventory
from api import fetch_product

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "The Inventory Management API is up and running!"}

@app.route("/inventory", methods=["GET"])
def get_inventory():
    return jsonify(inventory)

@app.route("/inventory/<int:item_id>", methods=["GET"])
def get_inventory_item(item_id):
    for item in inventory:
        if item["id"] == item_id:
            return jsonify(item), 200
    return jsonify({"error": "Product not found"}), 404

@app.route("/search/<barcode>", methods=["GET"])
def search_product(barcode):
    result = fetch_product(barcode)
    if not result:
        return jsonify({"error": "Product has not been found"}), 404
    return jsonify(result), 200

@app.route("/inventory", methods=["POST"])
def add_inventory_item():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data has been provided"}), 400
    new_item = {
        "id": len(inventory) + 1,
        "barcode": data.get("barcode"),
        "product_name": data.get("product_name"),
        "brand": data.get("brand"),
        "price": data.get("price"),
        "stock": data.get("stock")
    }
    inventory.append(new_item)
    return jsonify(new_item), 201

@app.route("/inventory/import/<barcode>", methods=["POST"])
def import_product(barcode):
    product = fetch_product(barcode)
    if not product:
        return jsonify({"error": "Product has not been found"}), 404
    new_item = {
        "id": len(inventory) + 1,
        "barcode": product["barcode"],
        "product_name": product["product_name"],
        "brand": product["brand"],
        "price": 0.0,
        "stock": 0
    }
    inventory.append(new_item)
    return jsonify(new_item), 201

@app.route("/inventory/<int:item_id>", methods=["PATCH"])
def update_item(item_id):
    data = request.get_json()

    for item in inventory:
        if item["id"] == item_id:
            if "product_name" in data:
                item["product_name"] = data["product_name"]
            if "brand" in data:
                item["brand"] = data["brand"]
            if "price" in data:
                item["price"] = data["price"]
            if "stock" in data:
                item["stock"] = data["stock"]
            if "barcode" in data:
                item["barcode"] = data["barcode"]
            return jsonify(item), 200
    return jsonify({"error": "Product not found"}), 404

@app.route("/inventory/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    for item in inventory:
        if item["id"] == item_id:
            inventory.remove(item)
            return jsonify({"message": "Product has been deleted successfully"}), 200

    return jsonify({"error": "Product not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)