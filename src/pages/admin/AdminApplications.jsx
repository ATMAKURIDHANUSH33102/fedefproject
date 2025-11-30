// src/pages/admin/AdminApplications.jsx
import React, { useEffect, useState } from "react";
import "./AdminJobs.css"; // reuse styles from AdminJobs / AdminDashboard

const seedApplications = [
  { id: 1, student_name: "Alice Johnson", email: "alice@university.edu", job_title: "Library Assistant", dept: "Library Services", applied_at: "2024-01-15", status: "pending", user_id: 101 },
  { id: 2, student_name: "Bob Smith", email: "bob@university.edu", job_title: "Research Assistant", dept: "Computer Science", applied_at: "2024-01-14", status: "approved", user_id: 102 },
  { id: 3, student_name: "Carol Williams", email: "carol@university.edu", job_title: "Lab Monitor", dept: "Engineering", applied_at: "2024-01-13", status: "rejected", user_id: 103 },
  { id: 4, student_name: "David Lee", email: "david@university.edu", job_title: "Office Assistant", dept: "Administration", applied_at: "2024-01-12", status: "pending", user_id: 104 },
];

export default function AdminApplications() {
  // load persisted or seed
  const persisted = (() => {
    try {
      const raw = localStorage.getItem("applications");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch { return null; }
  })();

  const [applications, setApplicationsInternal] = useState(persisted && persisted.length ? persisted : seedApplications);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  function persist(arr) {
    setApplicationsInternal(arr);
    try {
      localStorage.setItem("applications", JSON.stringify(arr));
      window.dispatchEvent(new Event("storage"));
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "applications") {
        try {
          const parsed = JSON.parse(e.newValue || "[]");
          if (Array.isArray(parsed)) setApplicationsInternal(parsed);
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function changeStatus(id, newStatus) {
    const updated = applications.map(a => a.id === id ? { ...a, status: newStatus } : a);
    persist(updated);
  }

  const filtered = applications.filter(a => {
    const q = query.trim().toLowerCase();
    const matchesQ = !q || (a.student_name + a.email + a.job_title + a.dept).toLowerCase().includes(q);
    const matchesFilter = filter === "all" ? true : a.status === filter;
    return matchesQ && matchesFilter;
  });

  return (
    <div className="admin-jobs-root">
      <header className="aj-header">
        <div>
          <h1>Applications</h1>
          <p className="sub">Review and manage student job applications</p>
        </div>

        <div className="aj-controls">
          <div className="search-box">
            <input placeholder="Search by student or job..." value={query} onChange={e => setQuery(e.target.value)} />
            <button className="btn small outline" onClick={() => setQuery("")}>Clear</button>
          </div>

          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </header>

      <section className="jobs-card">
        <div className="jobs-table-wrap">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="job-title">{app.student_name}</div>
                    <div className="job-sub">{app.email}</div>
                  </td>
                  <td>{app.job_title}</td>
                  <td>{app.dept}</td>
                  <td>{app.applied_at}</td>
                  <td>
                    <span className={`badge ${app.status}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="icon-btn" title="View" onClick={() => alert(`Applicant: ${app.student_name}\nJob: ${app.job_title}\nStatus: ${app.status}`)}>👁️ View</button>

                    {app.status !== "approved" && (
                      <button className="icon-btn" onClick={() => changeStatus(app.id, "approved")} title="Approve">✔️</button>
                    )}
                    {app.status !== "rejected" && (
                      <button className="icon-btn danger" onClick={() => changeStatus(app.id, "rejected")} title="Reject">✖️</button>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem 0" }}>No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
