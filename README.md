# Inventory Management System

## Backend (Flask)
```bash
pip install flask requests pytest
python app.py            
```

Endpoints:
- `GET    /inventory`                → list all items (supports `?category=` and `?search=`)
- `GET    /inventory/<id>`           → get one item
- `POST   /inventory`                → create item (`name`, `quantity`, `price` required; `barcode`, `category` optional)
- `PATCH  /inventory/<id>`           → partial update
- `DELETE /inventory/<id>`           → remove item
- `GET    /inventory/lookup?barcode=<code>` or `?name=<text>` → fetch product details from OpenFoodFacts


## Frontend (React)
`App.jsx` is a standalone component — drop it into any Create React App / Vite project as
`src/App.jsx`. It talks to the Flask API at `http://127.0.0.1:5000` 
```bash
pip install flask-cors
```
```python
# add near the top of app.py
from flask_cors import CORS
CORS(app)
```
