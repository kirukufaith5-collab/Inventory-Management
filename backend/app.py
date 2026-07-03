from flask import Flask, jsonify, request
from inventory import inventory
from flask_cors import CORS
from api import fetch_product
import itertools# import itertools for generating unique IDs for new inventory items

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

next_id = itertools.count(start=(max((item["id"] for item in inventory), default=0) + 1))


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


@app.route("/inventory", methods=["POST"])
def add_inventory_item():
    data = request.get_json()
    if not data or not data.get("product_name"):
        return jsonify({"error": "product_name is required"}), 400

    new_item = {
        "id": next(next_id),
        "barcode": data.get("barcode"),
        "product_name": data.get("product_name"),
        "brand": data.get("brand"),
        "price": data.get("price", 0.0),
        "stock": data.get("stock", 0),
    }
    inventory.append(new_item)
    return jsonify(new_item), 201


@app.route("/inventory/<int:item_id>", methods=["PATCH"])
def update_item(item_id):
    data = request.get_json()

    for item in inventory:
        if item["id"] == item_id:
            item.update(data)
            return jsonify(item), 200
    return jsonify({"error": "Product not found"}), 404


@app.route("/inventory/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    for item in inventory:
        if item["id"] == item_id:
            inventory.remove(item)
            return jsonify({"message": "Product has been deleted successfully"}), 200
    return jsonify({"error": "Product not found"}), 404


@app.route("/search", methods=["GET"])
def search_product():
    barcode = request.args.get("barcode")
    name = request.args.get("name")

    if barcode:
        result = fetch_product(barcode, search_by="barcode")
    elif name:
        result = fetch_product(name, search_by="name")
    else:
        return jsonify({"error": "Provide a 'barcode' or 'name' query parameter"}), 400

    if not result:
        return jsonify({"error": "Product has not been found"}), 404
    return jsonify(result), 200


@app.route("/inventory/import/<barcode>", methods=["POST"])
def import_product(barcode):
    product = fetch_product(barcode, search_by="barcode")
    if not product:
        return jsonify({"error": "Product has not been found"}), 404

    new_item = {
        "id": next(next_id),
        "barcode": product["barcode"],
        "product_name": product["product_name"],
        "brand": product.get("brand"),
        "price": 0.0,
        "stock": 0,
    }
    inventory.append(new_item)
    return jsonify(new_item), 201


if __name__ == "__main__":
    app.run(debug=True)