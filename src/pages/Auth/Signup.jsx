import { useNavigate } from "react-router-dom";
export default function Signup() {
  const navigate = useNavigate();
  function handleSignup(e) {
    e.preventDefault();
    const role = e.target.role.value;
    sessionStorage.setItem("role", role);
    if (role === "admin") navigate("/admin");
    else navigate("/student");
  }
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      <form onSubmit={handleSignup} style={{
        background:"#fff", borderRadius:12, boxShadow:"0 1px 18px #dde2ed", padding:"2.5rem 2.7rem", display:"flex",flexDirection:"column",gap:"1em",minWidth:350
      }}>
        <h2 style={{color:"#032862",marginBottom:10}}>Join SkillTrack</h2>
        <input required name="fullname" placeholder="Full Name" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} />
        <input required name="email" type="email" placeholder="Email" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} />
        <select name="role" required style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}}>
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="admin">Administrator</option>
        </select>
        <input required name="password" type="password" placeholder="Password" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} />
        <input required name="confirmPassword" type="password" placeholder="Confirm Password" style={{padding:"0.7em",borderRadius:5,border:"1px solid #ccc"}} />
        <button style={{background:"#032862",color:"#fff", border:"none", padding:"0.9em 0",borderRadius:5, fontWeight:"bold",cursor:"pointer"}}>Create Account</button>
        <p>
          Already have an account?{" "}
          <span style={{color:"#1941e3",cursor:"pointer"}}
            onClick={()=>navigate("/")}>Sign in</span>
        </p>
      </form>
    </div>
  );
}
