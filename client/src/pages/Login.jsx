import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

function routeForRole(role) {
  if (role === "admin") return "/admin";
  if (role === "reviewer") return "/reviewer";
  return "/";
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingToken, setPendingToken] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      if (data.requires2FA) {
        setPendingToken(data.pendingToken);
      } else {
        setUser(data);
        navigate(routeForRole(data.role));
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCodeSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-2fa", { pendingToken, code });
      setUser(data);
      navigate(routeForRole(data.role));
    } catch (err) {
      setError(err.response?.data?.error || "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-narrow">
      <div className="card">
        <h1 className="card-title">Log In</h1>
        {!pendingToken ? (
          <>
            <p className="card-subtitle">For reviewers and admins. Reporters don't need an account.</p>
            <form onSubmit={handleCredentialsSubmit} className="form">
              <label>
                Username
                <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Logging in…" : "Log In"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="card-subtitle">Enter the 6-digit code from your authenticator app.</p>
            <form onSubmit={handleCodeSubmit} className="form">
              <label>
                Authentication Code
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  required
                  autoFocus
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Verifying…" : "Verify"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}