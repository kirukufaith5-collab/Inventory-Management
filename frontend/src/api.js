const API_BASE = "http://127.0.0.1:5000";


async function parseJson(res) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      res.ok
        ? "Unexpected response from server."
        : `Server error (${res.status}). Is the API running?`
    );
  }
  return res.json();
}

export async function fetchInventory(search) {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${API_BASE}/inventory${params}`);
  const body = await parseJson(res);
  if (!res.ok) throw new Error(body.error || `Failed to load inventory (${res.status})`);
  return body;
}

export async function createItem(payload) {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await parseJson(res);
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

export async function updateItem(id, payload) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await parseJson(res);
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

export async function deleteItem(id) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, { method: "DELETE" });
  const body = await parseJson(res);
  if (!res.ok) throw new Error(body.error || `Delete failed (${res.status})`);
  return body;
}

export async function lookupProduct(mode, query) {
  const param = mode === "barcode" ? "barcode" : "name";
  const res = await fetch(`${API_BASE}/search?${param}=${encodeURIComponent(query)}`);
  const body = await parseJson(res);
  if (!res.ok) throw new Error(body.error || `Lookup failed (${res.status})`);
  return Array.isArray(body) ? body : [body];
}