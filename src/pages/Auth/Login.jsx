// src/pages/Auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000"; // <-- change this if your backend uses another port/host

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // "student" | "admin"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!role) {
      setError("Please select Student or Admin.");
      return;
    }

    const payload = { email: email.trim(), password, role };

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Fetch completed. status:", res.status);

      // Try parse JSON safely
      let data = null;
      try { data = await res.json(); } catch (err) { /* ignore JSON parse error */ }

      if (res.ok) {
        // Expecting backend to return { token, role, user } or similar
        const returnedRole = data?.role || role;
        const token = data?.token || null;

        // Save session info
        if (token) sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", returnedRole);
        sessionStorage.setItem("userEmail", email.trim());

        // navigate based on role
        if (returnedRole === "admin") navigate("/admin");
        else navigate("/student");
      } else {
        // map common status codes to messages
        if (res.status === 401) setError("Invalid credentials — please try again.");
        else if (res.status === 403) setError("Access denied.");
        else if (res.status === 404) setError("Login endpoint not found on server (404). Check backend URL.");
        else if (res.status === 409) setError(data?.message || "Conflict — check request.");
        else setError(data?.message || `Login failed (status ${res.status}).`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error — could not reach server. Is backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f6f8fb"
    }}>
      <form onSubmit={handleLogin} style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 28px rgba(12,30,80,0.08)",
        padding: "2.2rem 2.6rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: 420,
        maxWidth: "92%"
      }}>
        <h2 style={{ color: "#032862", marginBottom: 6 }}>Sign In to SkillTrack</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          placeholder="Email"
          autoFocus
          style={{ padding: "0.75em", borderRadius: 6, border: "1px solid #e0e6f0" }}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          type="password"
          placeholder="Password"
          style={{ padding: "0.75em", borderRadius: 6, border: "1px solid #e0e6f0" }}
        />

        <div style={{ display: "flex", gap: 18, alignItems: "center", paddingLeft: 4 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="radio" name="role" value="student"
              checked={role === "student"}
              onChange={() => setRole("student")} />
            <span>Student</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="radio" name="role" value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")} />
            <span>Admin</span>
          </label>
        </div>

        {error && <div style={{ color: "crimson", fontSize: "0.95rem" }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#0b2f66",
            color: "#fff",
            border: "none",
            padding: "0.92em 0",
            borderRadius: 8,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer"
          }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={{ marginTop: 6 }}>
          Don't have an account?{" "}
          <span style={{ color: "#1b63e8", cursor: "pointer" }} onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
