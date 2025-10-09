import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (!role) {
      setError("Please select Student or Admin.");
      return;
    }
    sessionStorage.setItem("role", role);
    if (role === "admin") navigate("/admin");
    else navigate("/student");
  }

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      <form onSubmit={handleLogin} style={{
        background:"#fff", borderRadius:12, boxShadow:"0 1px 18px #dde2ed", padding:"2.5rem 2.7rem", display:"flex",flexDirection:"column",gap:"1em",minWidth:350
      }}>
        <h2 style={{color:"#032862",marginBottom:10}}>Sign In to SkillTrack</h2>
        <input required name="email" placeholder="Email" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} autoFocus />
        <input required name="password" type="password" placeholder="Password" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} />
        <div>
          <label>
            <input type="radio" name="role" value="student" onChange={()=>setRole("student")} />
            Student
          </label>
          <label style={{marginLeft:'20px'}}>
            <input type="radio" name="role" value="admin" onChange={()=>setRole("admin")} />
            Admin
          </label>
        </div>
        {error && <div style={{color:"red"}}>{error}</div>}
        <button style={{background:"#032862",color:"#fff", border:"none", padding:"0.9em 0",borderRadius:5, fontWeight:"bold",cursor:"pointer"}}>Sign In</button>
        <p>
          Don't have an account?{" "}
          <span style={{color:"#1941e3",cursor:"pointer"}}
            onClick={()=>navigate("/signup")}>Sign up</span>
        </p>
      </form>
    </div>
  );
}
