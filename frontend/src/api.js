const API_BASE = "http://127.0.0.1:5000";

export async function fetchInventory(search) {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${API_BASE}/inventory${params}`);
  if (!res.ok) throw new Error(`Failed to load inventory (${res.status})`);
  return res.json();
}

export async function createItem(payload) {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function updateItem(id, payload) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete failed (${res.status})`);
  return res.json();
}

export async function lookupProduct(mode, query) {
  const param = mode === "barcode" ? "barcode" : "name";
  const res = await fetch(`${API_BASE}/inventory/lookup?${param}=${encodeURIComponent(query)}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || `Lookup failed (${res.status})`);
  return Array.isArray(body) ? body : [body];
}

