import  requests
API_URL = "https://world.openfoodfacts.org/api/v0/product/"

def fetch_product(barcode):
    try:
        url =f"{API_URL}/{barcode}.json"
        response = requests.get(url)
        if response.status_code!=200 
           return None
        data = response.json()
        if data.get ("status") != 1:
            return None
        product = data.get("product", {})
        return {
            "product_name": product.get("product_name", ""),
            "barcode": product.get("code", ""),
            "brand": product.get("brands", ""),
            "ingredients": product.get("ingredients_text", "")
        }
    except requests. exceptions.RequestException :
        return None