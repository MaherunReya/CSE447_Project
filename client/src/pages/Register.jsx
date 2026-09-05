import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", email: "", contactInfo: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-narrow">
      <div className="card">
        <h1 className="card-title">Create an Account</h1>
        <p className="card-subtitle">
          Optional — you can submit a report anonymously without ever creating an account.
        </p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Username
            <input value={form.username} onChange={update("username")} required autoFocus />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={update("password")} required minLength={8} />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={update("email")} required />
          </label>
          <label>
            Contact Info (optional)
            <input value={form.contactInfo} onChange={update("contactInfo")} />
          </label>
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">Account created — redirecting to login…</p>}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </button>
        </form>
        <p className="card-footer-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}