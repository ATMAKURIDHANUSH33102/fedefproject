// src/pages/admin/AdminHours.jsx
import React, { useEffect, useState } from "react";
import "./AdminJobs.css";

const seedTimesheets = [
  { id: 1, student_name: "Alice Johnson", job_title: "Library Assistant", date: "2024-01-20", hours: 4, status: "submitted", user_id: 101 },
  { id: 2, student_name: "Bob Smith", job_title: "Research Assistant", date: "2024-01-19", hours: 6, status: "approved", user_id: 102 },
  { id: 3, student_name: "Carol Williams", job_title: "Lab Monitor", date: "2024-01-18", hours: 3, status: "rejected", user_id: 103 },
];

export default function AdminHours() {
  const persisted = (() => {
    try {
      const raw = localStorage.getItem("timesheets");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch { return null; }
  })();

  const [timesheets, setTimesheetsInternal] = useState(persisted && persisted.length ? persisted : seedTimesheets);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  function persist(arr) {
    setTimesheetsInternal(arr);
    try {
      localStorage.setItem("timesheets", JSON.stringify(arr));
      window.dispatchEvent(new Event("storage"));
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "timesheets") {
        try {
          const parsed = JSON.parse(e.newValue || "[]");
          if (Array.isArray(parsed)) setTimesheetsInternal(parsed);
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function changeStatus(id, newStatus) {
    const updated = timesheets.map(t => t.id === id ? { ...t, status: newStatus } : t);
    persist(updated);
  }

  const filtered = timesheets.filter(t => {
    const q = query.trim().toLowerCase();
    const matchesQ = !q || (t.student_name + t.job_title).toLowerCase().includes(q);
    const matchesFilter = filter === "all" ? true : t.status === filter;
    return matchesQ && matchesFilter;
  });

  const totalHours = timesheets.reduce((s, t) => s + (Number(t.hours) || 0), 0);
  const pendingCount = timesheets.filter(t => t.status === "submitted").length;
  const approvedCount = timesheets.filter(t => t.status === "approved").length;

  return (
    <div className="admin-jobs-root">
      <header className="aj-header">
        <div>
          <h1>Work Hours Management</h1>
          <p className="sub">Review and approve student work hour submissions</p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="stats-small">
            <div className="card-value" style={{ fontSize: 22 }}>{totalHours}</div>
            <div className="card-title">Total Hours</div>
          </div>
          <div className="stats-small">
            <div className="card-value" style={{ fontSize: 22 }}>{pendingCount}</div>
            <div className="card-title">Pending Review</div>
          </div>
          <div className="stats-small">
            <div className="card-value" style={{ fontSize: 22 }}>{approvedCount}</div>
            <div className="card-title">Approved</div>
          </div>
        </div>
      </header>

      <section className="jobs-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div className="search-box" style={{ margin: 0 }}>
              <input placeholder="Search by student or job..." value={query} onChange={e => setQuery(e.target.value)} />
              <button className="btn small outline" onClick={() => setQuery("")}>Clear</button>
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="jobs-table-wrap">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Job Title</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="job-title">{t.student_name}</div>
                    <div className="job-sub">{t.user_id ? `id: ${t.user_id}` : ""}</div>
                  </td>
                  <td>{t.job_title}</td>
                  <td>{t.date}</td>
                  <td>{t.hours}h</td>
                  <td><span className={`badge ${t.status}`}>{t.status}</span></td>
                  <td className="actions">
                    <button className="icon-btn" onClick={() => alert(`${t.student_name}\n${t.job_title}\n${t.hours} hours`)}>👁️ View</button>
                    {t.status !== "approved" && <button className="icon-btn" onClick={() => changeStatus(t.id, "approved")}>✔️</button>}
                    {t.status !== "rejected" && <button className="icon-btn danger" onClick={() => changeStatus(t.id, "rejected")}>✖️</button>}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem 0" }}>No timesheets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
