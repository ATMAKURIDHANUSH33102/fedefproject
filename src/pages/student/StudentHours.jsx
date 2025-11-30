// StudentHours.jsx
import React, { useEffect, useState } from "react";

const seedTimes = [
  { id: 1, job_title: "Research Assistant", date: "2024-01-20", hours: 4, status: "approved", feedback: "Excellent work on the data analysis!" },
  { id: 2, job_title: "Research Assistant", date: "2024-01-18", hours: 6, status: "pending", feedback: "" },
  { id: 3, job_title: "Research Assistant", date: "2024-01-15", hours: 3, status: "rejected", feedback: "Please provide more details about the tasks performed." },
];

function readTimes() {
  try {
    const raw = localStorage.getItem("timesheets");
    if (!raw) return seedTimes;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedTimes;
  } catch { return seedTimes; }
}

export default function StudentHours() {
  const [times, setTimes] = useState(readTimes());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "timesheets") setTimes(readTimes());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const totalApproved = times.filter(t => t.status === "approved").reduce((s,t)=>s+(Number(t.hours)||0),0);
  const totalPending = times.filter(t => t.status === "pending").reduce((s,t)=>s+(Number(t.hours)||0),0);
  const estimated = totalApproved * 18 + totalPending * 12; // demo rates

  const filtered = times.filter(t => (filter === "all" ? true : t.status === filter) && (!query || (t.job_title + t.date + (t.feedback||"")).toLowerCase().includes(query.toLowerCase())));

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: "#1e3550" }}>Work Hours</h1>
          <p style={{ color: "#7c8aad", marginTop: 6 }}>Log and track your work hours</p>
        </div>
        <button className="btn" onClick={() => alert("Log hours (demo)")}>＋ Log Hours</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{totalApproved}h</div>
          <div style={{ color: "#6f88a8" }}>Approved Hours</div>
        </div>
        <div className="card" style={{ padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{totalPending}h</div>
          <div style={{ color: "#6f88a8" }}>Pending Approval</div>
        </div>
        <div className="card" style={{ padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>${estimated}</div>
          <div style={{ color: "#6f88a8" }}>Estimated Earnings</div>
        </div>
      </div>

      <div className="dashboard-section">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ width: "65%" }}>
            <input placeholder="Search by job or note..." value={query} onChange={e => setQuery(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #eef3fb" }} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #eef3fb" }}>
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <table className="table">
          <thead><tr><th>Job</th><th>Date</th><th>Hours</th><th>Description</th><th>Status</th><th>Feedback</th></tr></thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700 }}>{t.job_title}</td>
                <td>{t.date}</td>
                <td>{t.hours}h</td>
                <td style={{ maxWidth: 320 }}>{t.description ?? "-"}</td>
                <td><span className={`tag ${t.status}`}>{t.status}</span></td>
                <td>{t.feedback || "-"}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: 20 }}>No records.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
