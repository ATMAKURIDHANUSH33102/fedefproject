// src/pages/student/StudentUniversities.jsx
import { useState } from "react";
import "../StudentDashboard/StudentDashboard.css"; // reuse dashboard styles
import "./StudentUniversities.css";
import { useNavigate } from "react-router-dom";

const MOCK_UNIS = [
  {
    code: "DE",
    name: "Technical University of Munich",
    city: "Munich, Germany",
    rank: "#50",
    type: "Exchange",
    deadline: "3/15/2024",
    courses: 3,
    duration: "1 Semester",
    desc: "One of Europe's leading technical universities, renowned for engineering and natural sciences.",
  },
  {
    code: "CA",
    name: "University of Toronto",
    city: "Toronto, Canada",
    rank: "#21",
    type: "Dual Degree",
    deadline: "4/1/2024",
    courses: 3,
    duration: "2 Years",
    desc: "Canada's top university with world-class research facilities and diverse academic programs.",
  },
  {
    code: "SG",
    name: "National University of Singapore",
    city: "Singapore, Singapore",
    rank: "#11",
    type: "Research",
    deadline: "2/28/2024",
    courses: 3,
    duration: "1 Year",
    desc: "Asia's leading global university known for its innovative research and entrepreneurship programs.",
  },
  {
    code: "CH",
    name: "ETH Zurich",
    city: "Zurich, Switzerland",
    rank: "#7",
    type: "Exchange",
    deadline: "3/30/2024",
    courses: 3,
    duration: "1 Semester",
    desc: "World-renowned for science and technology, consistently ranked among the top universities globally.",
  },
];

export default function StudentUniversities() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const filtered = MOCK_UNIS.filter((u) => {
    const lowerQ = q.trim().toLowerCase();
    if (lowerQ && !(u.name.toLowerCase().includes(lowerQ) || u.city.toLowerCase().includes(lowerQ))) return false;
    if (countryFilter !== "All Countries" && !u.city.toLowerCase().includes(countryFilter.toLowerCase())) return false;
    if (typeFilter !== "All Types" && u.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="dashboard-layout">
      {/* sidebar is shared from StudentDashboard.css + component */}
      <div className="sidebar">
        <div className="sidebar-title">STUDENT PORTAL</div>
        <ul>
          <li onClick={() => navigate("/student")}><span>🏠</span> Dashboard</li>
          <li onClick={() => navigate("/student/jobs")}><span>📋</span> Job Listings</li>
          <li onClick={() => navigate("/student/applications")}><span>📑</span> My Applications</li>
          <li onClick={() => navigate("/student/hours")}><span>⏰</span> Work Hours</li>
          <li className="active" onClick={() => navigate("/student/universities")}><span>🎓</span> University Programs</li>
          <li onClick={() => navigate("/student/profile")}><span>👤</span> Profile</li>
        </ul>
      </div>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">University Programs</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ color: "#6b7280", fontWeight: 600 }}>Role: <span style={{ background: "#eef2ff", padding: "6px 10px", borderRadius: 12, marginLeft: 8 }}>Student</span></div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 18, marginBottom: 18, flexWrap: "wrap" }}>
          <div className="stats-card-box">
            <div className="stats-number">6</div>
            <div className="stats-label">Partner Universities</div>
          </div>
          <div className="stats-card-box">
            <div className="stats-number">6</div>
            <div className="stats-label">Countries</div>
          </div>
          <div className="stats-card-box">
            <div className="stats-number">18</div>
            <div className="stats-label">Available Courses</div>
          </div>
          <div className="stats-card-box">
            <div className="stats-number">199</div>
            <div className="stats-label">Students Enrolled</div>
          </div>
        </div>

        <div className="dashboard-section" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <input
              placeholder="Search universities, countries, or courses..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ flex: 1, padding: "12px 15px", borderRadius: 14, border: "1px solid #eceff6" }}
            />
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10 }}>
              <option>All Countries</option>
              <option>Germany</option>
              <option>Canada</option>
              <option>Singapore</option>
              <option>Switzerland</option>
              <option>Australia</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10 }}>
              <option>All Types</option>
              <option>Exchange</option>
              <option>Dual Degree</option>
              <option>Research</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
            <div>
              {filtered.map((u) => (
                <div key={u.code + u.name} className="uni-card">
                  <div className="uni-left">
                    <div className="uni-code">{u.code}</div>
                  </div>
                  <div className="uni-main">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <h3 style={{ margin: "0 0 6px 0" }}>{u.name}</h3>
                        <div style={{ color: "#6b7280", fontSize: 14 }}>{u.city} • Rank {u.rank}</div>
                      </div>
                      <div>
                        <div className="uni-type">{u.type}</div>
                      </div>
                    </div>

                    <p style={{ color: "#6b7280", marginTop: 10 }}>{u.desc}</p>

                    <div style={{ display: "flex", gap: 12, color: "#6b7280", fontSize: 13, marginTop: 10 }}>
                      <div>📅 Deadline: {u.deadline}</div>
                      <div>📚 {u.courses} Courses</div>
                      <div>⏳ {u.duration}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="uni-details-panel">
              <div style={{ textAlign: "center", color: "#9aa6be", paddingTop: 60 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Select a university to view details</div>
                <div style={{ maxWidth: 220, margin: "0 auto" }}>Click any listing to see more details and apply for programs (future work).</div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
