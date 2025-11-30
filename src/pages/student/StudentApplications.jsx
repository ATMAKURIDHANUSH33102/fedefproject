// StudentApplications.jsx
import React, { useEffect, useState } from "react";

/* demo seed (only used when localStorage is empty) */
const seed = [
  { id: 1, job_title: "Library Assistant", dept: "Library Services", stipend: "$15/hr", applied_at: "2024-01-15", status: "pending" },
  { id: 2, job_title: "Research Assistant", dept: "Computer Science", stipend: "$18/hr", applied_at: "2024-01-10", status: "approved" },
  { id: 3, job_title: "Lab Monitor", dept: "Engineering", stipend: "$14/hr", applied_at: "2024-01-05", status: "rejected" },
];

function readApps() {
  try {
    const raw = localStorage.getItem("applications");
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch { return seed; }
}

export default function StudentApplications() {
  const [apps, setApps] = useState(readApps());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "applications") setApps(readApps());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = apps.filter(a => {
    const q = query.trim().toLowerCase();
    const matchesQ = !q || (a.job_title + a.dept).toLowerCase().includes(q);
    return matchesQ && (filter === "all" ? true : a.status === filter);
  });

  const totals = {
    total: apps.length,
    pending: apps.filter(a => a.status === "pending").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: "#1e3550" }}>My Applications</h1>
          <p style={{ color: "#7c8aad", marginTop: 6 }}>Track the status of your job applications</p>
        </div>
        <button className="btn" onClick={() => alert("Browse jobs (demo)")}>🔎 Browse Jobs</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{totals.total}</div>
          <div style={{ color: "#6f88a8" }}>Total Applied</div>
        </div>
        <div className="card" style={{ padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{totals.pending}</div>
          <div style={{ color: "#6f88a8" }}>Pending</div>
        </div>
        <div className="card" style={{ padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{totals.approved}</div>
          <div style={{ color: "#6f88a8" }}>Approved</div>
        </div>
        <div className="card" style={{ padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{totals.rejected}</div>
          <div style={{ color: "#6f88a8" }}>Rejected</div>
        </div>
      </div>

      <div className="dashboard-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ width: "65%" }}>
            <input className="search-box-input" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #eef3fb" }} placeholder="Search applications..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #eef3fb" }}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="jobs-table-wrap">
          <table className="jobs-table table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Stipend</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 700 }}>{a.job_title}</td>
                  <td>{a.dept}</td>
                  <td>{a.stipend}</td>
                  <td>{a.applied_at}</td>
                  <td><span className={`tag ${a.status}`}>{a.status}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn small outline" onClick={() => alert(JSON.stringify(a, null, 2))}>👁️ View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: 20 }}>No applications.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
