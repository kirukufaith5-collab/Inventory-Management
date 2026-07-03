import requests

PRODUCT_URL = "https://world.openfoodfacts.org/api/v0/product"
SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl"


def fetch_product(query, search_by="barcode"):
    
    if search_by == "barcode":
        return _fetch_by_barcode(query)
    elif search_by == "name":
        return _fetch_by_name(query)
    else:
        raise ValueError(f"Unsupported search_by value: {search_by!r}")


def _fetch_by_barcode(barcode):
    try:
        url = f"{PRODUCT_URL}/{barcode}.json"
        response = requests.get(url, timeout=5)
        if response.status_code != 200:
            return None

        data = response.json()
        if data.get("status") != 1:
            return None

        product = data.get("product", {})
        return {
            "barcode": barcode,
            "product_name": product.get("product_name"),
            "brand": product.get("brands"),
            "ingredients": product.get("ingredients_text"),
        }

    except requests.exceptions.RequestException:
        return None


def _fetch_by_name(name):
    try:
        response = requests.get(
            SEARCH_URL,
            params={"search_terms": name, "json": 1, "page_size": 5},
            timeout=5,
        )
        if response.status_code != 200:
            return None

        data = response.json()
        products = data.get("products", [])

        return [
            {
                "barcode": product.get("code"),
                "product_name": product.get("product_name"),
                "brand": product.get("brands"),
                "ingredients": product.get("ingredients_text"),
            }
            for product in products
        ]

    except requests.exceptions.RequestException:
        return None