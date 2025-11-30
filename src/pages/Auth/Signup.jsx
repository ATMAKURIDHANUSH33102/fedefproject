import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const form = e.target;
    const fullname = form.fullname.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    if (!fullname || !email || !password || !confirm) {
      setError("Please fill all fields.");
      return;
    }
    if (!role) {
      setError("Please select a role.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // simulate backend using localStorage
    await new Promise((r) => setTimeout(r, 500));

    const raw = localStorage.getItem("users");
    const users = raw ? JSON.parse(raw) : [];

    const exists = users.find((u) => u.email === email);
    if (exists) {
      setError("Account already exists with this email.");
      setLoading(false);
      return;
    }

    const newUser = {
      id: Date.now(),
      name: fullname,
      email,
      role,
      // in real app do NOT store plain password
      password,
    };

    const updated = [newUser, ...users];
    localStorage.setItem("users", JSON.stringify(updated));

    // auto-login
    sessionStorage.setItem("role", role);
    localStorage.setItem(
      "user",
      JSON.stringify({ ...newUser, password: undefined })
    );

    setSuccessMsg("Account created. Redirecting...");
    setLoading(false);

    setTimeout(() => {
      navigate(role === "admin" ? "/admin" : "/student");
    }, 700);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f6f7fb",
        padding: "1.5rem",
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 18px rgba(0,0,0,0.06)",
          padding: "2.5rem 2.7rem",
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          minWidth: 360,
        }}
      >
        <h2 style={{ color: "#032862", marginBottom: 10 }}>Join SkillTrack</h2>

        <input
          name="fullname"
          placeholder="Full Name"
          style={{
            padding: "0.7em",
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          style={{
            padding: "0.7em",
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />

        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{
            padding: "0.7em",
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="admin">Administrator</option>
        </select>

        <input
          name="password"
          type="password"
          placeholder="Password"
          style={{
            padding: "0.7em",
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          style={{
            padding: "0.7em",
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />

        {error && (
          <div style={{ color: "red", fontSize: 14 }}>{error}</div>
        )}
        {successMsg && (
          <div style={{ color: "green", fontSize: 14 }}>{successMsg}</div>
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
            marginTop: "0.3rem",
          }}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p style={{ marginTop: "0.8rem", fontSize: 14 }}>
          Already have an account?{" "}
          <span
            style={{ color: "#1941e3", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}
