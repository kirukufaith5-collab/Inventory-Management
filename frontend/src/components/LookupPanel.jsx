import React from "react";

export default function LookupPanel({ lookupQuery,
  setLookupQuery,
  lookupMode,
  setLookupMode,
  lookupResults,
  lookupError,
  lookupLoading,
  onSubmit,
  onApplyResult,})
  {
    return(
       <div className="card">
      <h2>Look up product details</h2>
      <form onSubmit={onSubmit} className="row">
        <select
          className="select"
          value={lookupMode}
          onChange={(e) => setLookupMode(e.target.value)}
        >
          <option value="barcode">Barcode</option>
          <option value="name">Name</option>
        </select>
        <input
          className="input flex"
          placeholder={lookupMode === "barcode" ? "e.g. 0044000032777" : "e.g. peanut butter"}
          value={lookupQuery}
          onChange={(e) => setLookupQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={lookupLoading}>
          {lookupLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {lookupError && <p className="error-text">{lookupError}</p>}

      {lookupResults && (
        <ul className="lookup-list">
          {lookupResults.map((p, idx) => (
            <li key={idx} className="lookup-item">
              <div>
                <strong>{p.name}</strong>
                <div className="muted">
                  {p.brand ? `${p.brand} · ` : ""}
                  {p.category || "Uncategorized"}
                </div>
              </div>
              <button className="btn-secondary" onClick={() => onApplyResult(p)}>
                Use in form
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
