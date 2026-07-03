import React from "react";

export default function InventoryTable({
  items,
  loading,
  search,
  setSearch,
  onEdit,
  onDelete,
}) {
  return (
    <section className="card">
      <div className="row">
        <h2>Inventory ({items.length})</h2>
        <input
          className="input search-input"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : items.length === 0 ? (
        <p className="muted">No items yet. Add one using the form above.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Barcode</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.barcode || "—"}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>
                  <button className="btn-link" onClick={() => onEdit(item)}>
                    Edit
                  </button>
                  <button className="btn-link danger" onClick={() => onDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
