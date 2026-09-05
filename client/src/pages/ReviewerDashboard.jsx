import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const STATUSES = ["Open", "Investigating", "Resolved"];

export default function ReviewerDashboard() {
  const { user, setUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState("");

  const [otpauthUrl, setOtpauthUrl] = useState(null);
  const [code, setCode] = useState("");
  const [twoFAError, setTwoFAError] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);

  async function loadReports() {
    setLoadingReports(true);
    setError("");
    try {
      const { data } = await api.get("/reports/assigned");
      setReports(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load reports");
    } finally {
      setLoadingReports(false);
    }
  }

  useEffect(() => {
    if (user?.is2FAEnabled) loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.is2FAEnabled]);

  async function startSetup() {
    setTwoFAError("");
    try {
      const { data } = await api.post("/auth/setup-2fa");
      setOtpauthUrl(data.otpauthUrl);
    } catch (err) {
      setTwoFAError(err.response?.data?.error || "Failed to start 2FA setup");
    }
  }

  async function confirmSetup(e) {
    e.preventDefault();
    setTwoFAError("");
    setTwoFALoading(true);
    try {
      await api.post("/auth/confirm-2fa", { code });
      setUser((u) => ({ ...u, is2FAEnabled: true }));
      setOtpauthUrl(null);
      setCode("");
    } catch (err) {
      setTwoFAError(err.response?.data?.error || "Invalid code");
    } finally {
      setTwoFALoading(false);
    }
  }

  async function updateStatus(reportId, status) {
    try {
      await api.patch(`/reports/${reportId}/status`, { status });
      setReports((rs) => rs.map((r) => (r.id === reportId ? { ...r, status } : r)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  }

  if (!user?.is2FAEnabled) {
    return (
      <div className="page-narrow">
        <div className="card">
          <h1 className="card-title">Set Up Two-Factor Authentication</h1>
          <p className="card-subtitle">Reviewer accounts require 2FA before you can view reports.</p>
          {!otpauthUrl ? (
            <button className="btn btn-primary" onClick={startSetup}>
              Start 2FA Setup
            </button>
          ) : (
            <>
              <img
                className="qr-code"
                alt="Scan this QR code with your authenticator app"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  otpauthUrl
                )}`}
              />
              <p className="form-hint">Scan with an authenticator app, then enter the 6-digit code.</p>
              <form onSubmit={confirmSetup} className="form form-inline">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="123456"
                  required
                  autoFocus
                />
                <button className="btn btn-primary" disabled={twoFALoading}>
                  {twoFALoading ? "Verifying…" : "Confirm"}
                </button>
              </form>
            </>
          )}
          {twoFAError && <p className="form-error">{twoFAError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wide">
      <h1 className="page-title">Assigned Reports</h1>
      {loadingReports && <p>Loading…</p>}
      {error && <p className="form-error">{error}</p>}
      {!loadingReports && reports.length === 0 && (
        <p className="empty-state">No reports assigned to you yet.</p>
      )}
      <div className="report-list">
        {reports.map((r) => (
          <div className="card report-card" key={r.id}>
            {r.integrityError ? (
              <>
                <span className="status-badge status-danger">Integrity Error</span>
                <p className="form-error">{r.integrityError}</p>
                <p className="report-meta">Tracking ID: {r.trackingId}</p>
              </>
            ) : (
              <>
                <div className="report-card-header">
                  <h2>{r.title}</h2>
                  <span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span>
                </div>
                <p className="report-meta">
                  Category: {r.category || "—"} · Tracking ID: {r.trackingId}
                </p>
                <p className="report-meta">Identity: {r.identity || "Anonymous"}</p>
                <p className="report-description">{r.description}</p>
                {r.evidence && (
                  <p className="report-evidence">
                    <strong>Evidence:</strong> {r.evidence}
                  </p>
                )}
                <label className="status-select-label">
                  Update status
                  <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}