// src/pages/Auth/Signup.jsx
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

    const payload = { fullname, email, password, role };

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(()=>({}));

      if (res.ok) {
        // On success backend might return created user + role
        const returnedRole = data.role || role;
        sessionStorage.setItem("role", returnedRole);
        if (data.token) sessionStorage.setItem("token", data.token);
        setSuccessMsg("Account created. Redirecting...");
        setTimeout(()=> {
          if (returnedRole === "admin") navigate("/admin");
          else navigate("/student");
        }, 700);
      } else if (res.status === 409) {
        setError(data.message || "Account already exists (409).");
      } else {
        setError(data.message || `Signup failed (status ${res.status}).`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#f6f7fb"}}>
      <form onSubmit={handleSignup} style={{
        background:"#fff", borderRadius:12, boxShadow:"0 1px 18px #dde2ed",
        padding:"2.5rem 2.7rem", display:"flex",flexDirection:"column",gap:"1em",minWidth:350
      }}>
        <h2 style={{color:"#032862",marginBottom:10}}>Join SkillTrack</h2>

        <input name="fullname" placeholder="Full Name" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} />
        <input name="email" type="email" placeholder="Email" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} />
        <select name="role" value={role} onChange={(e)=>setRole(e.target.value)} required style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}}>
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="admin">Administrator</option>
        </select>

        <input name="password" type="password" placeholder="Password" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} />

        {error && <div style={{color:"red"}}>{error}</div>}
        {successMsg && <div style={{color:"green"}}>{successMsg}</div>}

        <button type="submit" disabled={loading} style={{
          background:"#032862",color:"#fff", border:"none", padding:"0.9em 0",
          borderRadius:5, fontWeight:"bold", cursor: loading ? "not-allowed" : "pointer"
        }}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p>
          Already have an account?{" "}
          <span style={{color:"#1941e3",cursor:"pointer"}} onClick={()=>navigate("/")}>Sign in</span>
        </p>
      </form>
    </div>
  );
}
