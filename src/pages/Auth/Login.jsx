import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Demo credentials stored only on the frontend
const DEMO_USERS = {
  admin: {
    email: "admin@university.edu",
    password: "admin123",
    role: "admin",
  },
  student: {
    email: "student@university.edu",
    password: "student123",
    role: "student",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Used by the two demo buttons
  function doLogin(role) {
    const user = DEMO_USERS[role];

    sessionStorage.setItem("role", role);
    localStorage.setItem(
      "user",
      JSON.stringify({ email: user.email, role: user.role })
    );

    navigate(role === "admin" ? "/admin" : "/student");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    const match = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password
    );

    if (!match) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    sessionStorage.setItem("role", match.role);
    localStorage.setItem(
      "user",
      JSON.stringify({ email: match.email, role: match.role })
    );

    navigate(match.role === "admin" ? "/admin" : "/student");
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f6f7fb",
        padding: "1.5rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 18px rgba(0,0,0,0.06)",
          padding: "2.5rem 2.7rem",
          minWidth: 360,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2 style={{ color: "#032862", marginBottom: 10 }}>
          Sign In to SkillTrack
        </h2>

        <input
          type="email"
          placeholder="your.email@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.7em",
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "0.7em",
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />

        {error && (
          <div style={{ color: "red", fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#032862",
            color: "#fff",
            border: "none",
            padding: "0.9em 0",
            borderRadius: 5,
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "0.5rem",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 14,
          }}
        >
          <span style={{ textAlign: "center", color: "#6b7280" }}>
            Demo accounts:
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => doLogin("admin")}
              style={{
                flex: 1,
                padding: "0.5rem 0",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => doLogin("student")}
              style={{
                flex: 1,
                padding: "0.5rem 0",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Student Demo
            </button>
          </div>
        </div>

        <p style={{ marginTop: "1rem", textAlign: "center", fontSize: 14 }}>
          Don&apos;t have an account?{" "}
          <span
            style={{ color: "#1941e3", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
