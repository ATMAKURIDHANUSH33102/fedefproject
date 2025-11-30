// StudentProfile.jsx
import React, { useState, useEffect } from "react";

function readUser() {
  try {
    const u = JSON.parse(localStorage.getItem("student_profile") || "{}");
    return Object.keys(u).length ? u : {
      name: "John Doe",
      program: "Computer Science",
      level: "Junior",
      email: "john.doe@university.edu",
      phone: "+1 (555) 123-4567",
      id: "STU-2024-001",
      gpa: "3.8",
      bio: "Passionate computer science student with a focus on machine learning and data analysis. Looking for research opportunities in AI.",
      skills: ["Python","JavaScript","Machine Learning","Data Analysis","React"],
      resume: { name: "resume_john_doe.pdf", uploaded: "2024-01-15" }
    };
  } catch { return {}; }
}

export default function StudentProfile() {
  const [user, setUser] = useState(readUser());

  useEffect(() => {
    // listen to external changes
    function onStorage(e) {
      if (e.key === "student_profile") setUser(readUser());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleEdit() {
    alert("Edit profile (demo) — implement modal or form to update profile.");
  }

  return (
    <div className="dashboard-section" style={{ paddingTop: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: "#1e3550" }}>My Profile</h1>
          <p style={{ color: "#7c8aad", marginTop: 6 }}>Manage your personal information and settings</p>
        </div>
        <button className="btn" onClick={handleEdit}>✎ Edit Profile</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        {/* Left card */}
        <div className="dashboard-section" style={{ padding: 20 }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{
              width: 92, height: 92, borderRadius: "50%", margin: "0 auto",
              background: "#e6eefb", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, color: "#1148a6"
            }}>
              {user.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
            </div>
            <h3 style={{ margin: "10px 0 2px" }}>{user.name}</h3>
            <div style={{ color: "#7c8aad" }}>{user.program}</div>
            <div style={{ marginTop: 8 }}><span className="tag active" style={{padding:"6px 10px"}}>{user.level}</span></div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f2f6fb", margin: "14px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <span style={{fontSize:18}}>✉️</span>
              <div style={{color:"#17314f"}}>{user.email}</div>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <span style={{fontSize:18}}>📞</span>
              <div style={{color:"#17314f"}}>{user.phone}</div>
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <span style={{fontSize:18}}>🎓</span>
              <div style={{color:"#17314f"}}>ID: {user.id}</div>
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="dashboard-section" style={{ padding: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, color: "#1e3550" }}>Personal Information</h3>
          <p style={{ color: "#7c8aad", marginTop: 6 }}>Your academic and contact details</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
            <div>
              <div style={{ color: "#6f88a8", fontSize: 13 }}>Full Name</div>
              <div style={{ fontWeight: 700 }}>{user.name}</div>
            </div>
            <div>
              <div style={{ color: "#6f88a8", fontSize: 13 }}>Email</div>
              <div style={{ fontWeight: 700 }}>{user.email}</div>
            </div>

            <div>
              <div style={{ color: "#6f88a8", fontSize: 13 }}>Phone</div>
              <div style={{ fontWeight: 700 }}>{user.phone}</div>
            </div>
            <div>
              <div style={{ color: "#6f88a8", fontSize: 13 }}>GPA</div>
              <div style={{ fontWeight: 700 }}>{user.gpa}</div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f2f6fb", margin: "18px 0" }} />

          <div style={{ color: "#6f88a8", marginBottom: 8 }}>Bio</div>
          <div style={{ color: "#41536b" }}>{user.bio}</div>
        </div>
      </div>

      {/* Skills, Resume, Work summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 18 }}>
        <div className="dashboard-section">
          <h3 style={{ marginTop: 0 }}>🏷️ Skills</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {user.skills.map(s => <span key={s} style={{ background: "#f3f6f9", padding: "6px 10px", borderRadius: 999, color: "#17314f", fontWeight:600 }}>{s}</span>)}
          </div>
        </div>

        <div className="dashboard-section">
          <h3 style={{ marginTop: 0 }}>📄 Resume & Documents</h3>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #f2f6fb", padding: 14, borderRadius: 10, background:"#fff" }}>
            <div>
              <div style={{ fontWeight:700 }}>{user.resume.name}</div>
              <div style={{ color: "#7c8aad", fontSize: 13 }}>Uploaded on {user.resume.uploaded}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn small" onClick={() => alert("Open resume (demo)")}>View</button>
              <button className="btn outline" onClick={() => alert("Replace resume (demo)")}>Replace</button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>📊 Work Summary</h3>
        <p style={{ color: "#7c8aad", marginTop: 6 }}>Your work-study performance overview</p>

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <div style={{ background: "#f7fbfe", borderRadius: 10, padding: 20, flex: 1, textAlign:"center" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>45</div>
            <div style={{ color: "#6f88a8" }}>Total Hours</div>
          </div>
          <div style={{ background: "#f7fbfe", borderRadius: 10, padding: 20, flex: 1, textAlign:"center" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>2</div>
            <div style={{ color: "#6f88a8" }}>Active Positions</div>
          </div>
          <div style={{ background: "#f7fbfe", borderRadius: 10, padding: 20, flex: 1, textAlign:"center" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>$810</div>
            <div style={{ color: "#6f88a8" }}>Total Earnings</div>
          </div>
          <div style={{ background: "#f7fbfe", borderRadius: 10, padding: 20, flex: 1, textAlign:"center" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>4.8</div>
            <div style={{ color: "#6f88a8" }}>Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
