import { useState } from "react";
import api from "../api/axios.js";

export default function TrackReport() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/reports/track/${encodeURIComponent(trackingId.trim())}`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "No report found for that tracking ID");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-narrow">
      <div className="card">
        <h1 className="card-title">Track Your Report</h1>
        <p className="card-subtitle">Enter the tracking ID you were given at submission.</p>
        <form onSubmit={handleSubmit} className="form form-inline">
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Tracking ID"
            required
          />
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Checking…" : "Check Status"}
          </button>
        </form>
        {error && <p className="form-error">{error}</p>}
        {result && (
          <div className="status-result">
            <span className={`status-badge status-${result.status.toLowerCase()}`}>{result.status}</span>
            <p className="status-meta">Submitted {new Date(result.submittedAt).toLocaleString()}</p>
            <p className="status-meta">Last updated {new Date(result.lastUpdatedAt).toLocaleString()}</p>
            {result.history?.length > 0 && (
              <ul className="status-history">
                {result.history.map((h, i) => (
                  <li key={i}>
                    {h.status} — {new Date(h.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}