import React from "react";

export default function ItemForm({ form, setForm, onSubmit, onCancel, editingId }) {

    return (
        <form onSubmit={onSubmit} className="card">
            <h2>{editingId ? "Edit Item" : "Add Item"}</h2>
            <label className="field">
                Name
            
            <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required/>
        </label>
        <label className="field">
                Barcode
        
            <input
                className="input"
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            />
        </label>
        <div className="field">
                <label className="field flex">
                    Quantity
                    <input      
                    className="input"
                    type="number"
                    min ="0"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity:(e.target.value)})}required/>
                </label>
        </div>
        <label className="field">
                Price
                <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
        </label>
        <label className="field">
                Category
                <input
                    className="input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
        </label>
        <div className="row">
            <button type="submit" className="btn-primary">
                {editingId ? "Save Changes" : "Add Item"}
            </button>
            {editingId && (
                <button type="button" 
                className="btn-primary"
                onClick={onCancel}>
                    Cancel
                </button>
            )}
        </div>
        </form>
    );
}