import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function AdminDashboard() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [creating, setCreating] = useState(false);

  const [rotateId, setRotateId] = useState("");
  const [rotateError, setRotateError] = useState("");
  const [rotateSuccess, setRotateSuccess] = useState("");
  const [rotating, setRotating] = useState(false);

  const [logs, setLogs] = useState([]);
  const [chainIntact, setChainIntact] = useState(null);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState("");

  async function loadLogs() {
    setLogsLoading(true);
    setLogsError("");
    try {
      const { data } = await api.get("/admin/audit-logs");
      setLogs(data.logs);
      setChainIntact(data.chainIntact);
    } catch (err) {
      setLogsError(err.response?.data?.error || "Failed to load audit logs");
    } finally {
      setLogsLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setCreating(true);
    try {
      const { data } = await api.post("/admin/reviewers", form);
      setCreateSuccess(`Reviewer "${data.username}" created (id: ${data.id}).`);
      setForm({ username: "", password: "", email: "" });
      loadLogs();
    } catch (err) {
      setCreateError(err.response?.data?.error || "Failed to create reviewer");
    } finally {
      setCreating(false);
    }
  }

  async function handleRotate(e) {
    e.preventDefault();
    setRotateError("");
    setRotateSuccess("");
    setRotating(true);
    try {
      await api.post(`/admin/reviewers/${rotateId.trim()}/rotate-keys`);
      setRotateSuccess("Keys rotated successfully.");
      loadLogs();
    } catch (err) {
      setRotateError(err.response?.data?.error || "Failed to rotate keys");
    } finally {
      setRotating(false);
    }
  }

  return (
    <div className="page-wide">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="admin-grid">
        <div className="card">
          <h2 className="card-title">Create Reviewer</h2>
          <form onSubmit={handleCreate} className="form">
            <label>
              Username
              <input value={form.username} onChange={update("username")} required />
            </label>
            <label>
              Password
              <input type="password" value={form.password} onChange={update("password")} required minLength={8} />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={update("email")} required />
            </label>
            {createError && <p className="form-error">{createError}</p>}
            {createSuccess && <p className="form-success">{createSuccess}</p>}
            <button className="btn btn-primary" disabled={creating}>
              {creating ? "Creating…" : "Create Reviewer"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">Rotate Reviewer Keys</h2>
          <p className="card-subtitle">Old keys stay retired-but-stored, so past reports remain decryptable.</p>
          <form onSubmit={handleRotate} className="form">
            <label>
              Reviewer User ID
              <input
                value={rotateId}
                onChange={(e) => setRotateId(e.target.value)}
                required
                placeholder="Mongo _id, from the create response above"
              />
            </label>
            {rotateError && <p className="form-error">{rotateError}</p>}
            {rotateSuccess && <p className="form-success">{rotateSuccess}</p>}
            <button className="btn btn-secondary" disabled={rotating}>
              {rotating ? "Rotating…" : "Rotate Keys"}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header-row">
          <h2 className="card-title">Audit Log</h2>
          {chainIntact !== null && (
            <span className={`status-badge ${chainIntact ? "status-success" : "status-danger"}`}>
              {chainIntact ? "Chain Intact" : "Chain Broken"}
            </span>
          )}
        </div>
        {logsLoading && <p>Loading…</p>}
        {logsError && <p className="form-error">{logsError}</p>}
        {!logsLoading && logs.length > 0 && (
          <table className="audit-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Performed By</th>
                <th>Target</th>
                <th>Timestamp</th>
                <th>MAC</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id} className={l.macValid ? "" : "row-invalid"}>
                  <td>{l.action}</td>
                  <td>{l.performedBy || "—"}</td>
                  <td>{l.targetId || "—"}</td>
                  <td>{new Date(l.timestamp).toLocaleString()}</td>
                  <td>{l.macValid ? "✓" : "✗ tampered"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!logsLoading && logs.length === 0 && <p className="empty-state">No audit entries yet.</p>}
      </div>
    </div>
  );
}