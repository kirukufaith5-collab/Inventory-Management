import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm";
import LookupPanel from "./components/LookupPanel";
import InventoryTable from "./components/InventoryTable";
import ErrorBanner from "./components/ErrorBanner";
import { fetchInventory, createItem, updateItem, deleteItem, lookupProduct } from "./api";

const emptyForm = { name: "", barcode: "", quantity: "", price: "", category: "" };

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupMode, setLookupMode] = useState("barcode"); // "barcode" | "name"
  const [lookupResults, setLookupResults] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await fetchInventory(search));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      barcode: item.barcode || "",
      quantity: item.quantity,
      price: item.price,
      category: item.category || "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      barcode: form.barcode,
      quantity: Number(form.quantity),
      price: Number(form.price),
      category: form.category,
    };

    try {
      if (editingId) {
        await updateItem(editingId, payload);
      } else {
        await createItem(payload);
      }
      resetForm();
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    setError("");
    try {
      await deleteItem(id);
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLookup(e) {
    e.preventDefault();
    setLookupError("");
    setLookupResults(null);
    if (!lookupQuery.trim()) return;

    setLookupLoading(true);
    try {
      setLookupResults(await lookupProduct(lookupMode, lookupQuery));
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  }

  function applyLookupResult(product) {
    setForm((f) => ({
      ...f,
      name: product.name || f.name,
      barcode: product.barcode || f.barcode,
      category: product.category || f.category,
    }));
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Inventory Admin</h1>
        <p>Manage stock, prices, and categories</p>
      </header>

      <ErrorBanner message={error} />

      <section className="grid">
        <ItemForm
          form={form}
          setForm={setForm}
          editingId={editingId}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <LookupPanel
          lookupQuery={lookupQuery}
          setLookupQuery={setLookupQuery}
          lookupMode={lookupMode}
          setLookupMode={setLookupMode}
          lookupResults={lookupResults}
          lookupError={lookupError}
          lookupLoading={lookupLoading}
          onSubmit={handleLookup}
          onApplyResult={applyLookupResult}
        />
      </section>

      <InventoryTable
        items={items}
        loading={loading}
        search={search}
        setSearch={setSearch}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
