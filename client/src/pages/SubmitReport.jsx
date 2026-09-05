import { useState } from "react";
import api from "../api/axios.js";

const CATEGORIES = ["Harassment", "Fraud", "Safety Violation", "Discrimination", "Other"];

export default function SubmitReport() {
  const [form, setForm] = useState({ title: "", description: "", category: CATEGORIES[0], evidence: "" });
  const [includeIdentity, setIncludeIdentity] = useState(false);
  const [identity, setIdentity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState(null);
  const [copied, setCopied] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form };
      if (includeIdentity && identity.trim()) payload.identity = identity.trim();
      const { data } = await api.post("/reports", payload);
      setTrackingId(data.trackingId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  }

  async function copyId() {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — the ID is already selectable on screen
    }
  }

  if (trackingId) {
    return (
      <div className="page-narrow">
        <div className="card card-success">
          <h1 className="card-title">Report Submitted</h1>
          <p>
            Your report has been encrypted and routed to the review committee. Save this tracking
            ID somewhere safe — it's the only way to check your report's status later, and it
            cannot be recovered if lost.
          </p>
          <div className="tracking-id-box">{trackingId}</div>
          <button className="btn btn-secondary" onClick={copyId}>
            {copied ? "Copied!" : "Copy Tracking ID"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-narrow">
      <div className="card">
        <h1 className="card-title">Submit a Report</h1>
        <p className="card-subtitle">
          Everything below is encrypted before it's stored. Including your identity is optional —
          if you do, it's encrypted separately from the rest of your report.
        </p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Title
            <input value={form.title} onChange={update("title")} required />
          </label>
          <label>
            Category
            <select value={form.category} onChange={update("category")}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Description
            <textarea rows={6} value={form.description} onChange={update("description")} required />
          </label>
          <label>
            Evidence (optional)
            <textarea rows={4} value={form.evidence} onChange={update("evidence")} />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeIdentity}
              onChange={(e) => setIncludeIdentity(e.target.checked)}
            />
            Include my identity (only the assigned reviewer can decrypt it)
          </label>
          {includeIdentity && (
            <label>
              Your Identity
              <input
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="Name, employee ID, etc."
              />
            </label>
          )}
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting…" : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}