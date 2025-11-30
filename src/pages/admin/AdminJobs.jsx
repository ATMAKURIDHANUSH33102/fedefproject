// src/pages/admin/AdminJobs.jsx
import React, { useEffect, useState } from "react";
import "./AdminJobs.css";

/* Utility to produce a new id (mock) */
const nextId = (arr) => (arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1);

/* Default seed data used only if localStorage is empty */
const seedJobs = [
  { id: 1, title: "Library Assistant", dept: "University Library", stipend: 15, hours: 10, apps: 12, posted: "2024-01-15", status: "active" },
  { id: 2, title: "Research Assistant", dept: "Biology Department", stipend: 18, hours: 15, apps: 8, posted: "2024-01-10", status: "active" },
  { id: 3, title: "Lab Technician", dept: "Chemistry Department", stipend: 16, hours: 12, apps: 15, posted: "2024-01-05", status: "closed" },
];

export default function AdminJobs({ onChange } = {}) {
  // load persisted jobs or fall back to seed
  const persisted = (() => {
    try {
      const raw = localStorage.getItem("jobs");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      console.warn("Could not parse persisted jobs", e);
      return null;
    }
  })();

  const [jobsInternal, setJobsInternal] = useState(persisted && persisted.length ? persisted : seedJobs);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // job id or null
  const [form, setForm] = useState({
    title: "",
    dept: "",
    stipend: "",
    hours: "",
    posted: new Date().toISOString().slice(0, 10),
    status: "active",
  });
  const [filterStatus, setFilterStatus] = useState("all");

  // helper to persist jobs and notify other parts of app
  function setJobs(newJobs) {
    setJobsInternal(newJobs);
    try {
      localStorage.setItem("jobs", JSON.stringify(newJobs));
      // dispatch a storage-like event so other listeners in the same tab can respond
      window.dispatchEvent(new Event("storage"));
      if (typeof onChange === "function") onChange(newJobs);
    } catch (e) {
      console.error("Failed to persist jobs", e);
    }
  }

  useEffect(() => {
    // keep in sync if localStorage was modified externally (other tab)
    function onStorage(e) {
      if (e.key === "jobs") {
        try {
          const parsed = JSON.parse(e.newValue || "[]");
          if (Array.isArray(parsed)) setJobsInternal(parsed);
        } catch {
          // ignore parse
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      dept: "",
      stipend: "",
      hours: "",
      posted: new Date().toISOString().slice(0, 10),
      status: "active",
    });
    setShowForm(true);
  }

  function openEdit(job) {
    setEditing(job.id);
    setForm({
      title: job.title,
      dept: job.dept,
      stipend: job.stipend,
      hours: job.hours,
      posted: job.posted,
      status: job.status,
    });
    setShowForm(true);
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this job posting?")) return;
    setJobs(jobsInternal.filter(j => j.id !== id));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title?.trim() || !form.dept?.trim()) {
      alert("Please provide Title and Department.");
      return;
    }

    if (editing) {
      const updated = jobsInternal.map(j =>
        j.id === editing ? { ...j, ...form, stipend: Number(form.stipend || 0), hours: Number(form.hours || 0) } : j
      );
      setJobs(updated);
    } else {
      const newJob = {
        id: nextId(jobsInternal),
        ...form,
        stipend: Number(form.stipend || 0),
        hours: Number(form.hours || 0),
        apps: 0,
      };
      setJobs([newJob, ...jobsInternal]);
    }

    setShowForm(false);
  }

  const filtered = jobsInternal.filter(j => {
    const matchesQuery = (j.title + j.dept).toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : j.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="admin-jobs-root">
      <header className="aj-header">
        <div>
          <h1>Job Postings</h1>
          <p className="sub">Manage work-study job opportunities and positions</p>
        </div>

        <div className="aj-controls">
          <div className="search-box">
            <input
              placeholder="Search jobs by title or department..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn small outline" onClick={() => setQuery("")}>Clear</button>
          </div>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>

          <button className="btn primary" onClick={openCreate}>+ Create New Job</button>
        </div>
      </header>

      {showForm && (
        <form className="job-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Job Title
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </label>

            <label>
              Department
              <input value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} />
            </label>
          </div>

          <div className="form-row">
            <label>
              Stipend ($/hr)
              <input type="number" value={form.stipend} onChange={e => setForm({ ...form, stipend: e.target.value })} />
            </label>

            <label>
              Hours/Week
              <input type="number" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} />
            </label>

            <label>
              Posted Date
              <input type="date" value={form.posted} onChange={e => setForm({ ...form, posted: e.target.value })} />
            </label>
          </div>

          <div className="form-row">
            <label>
              Status
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">active</option>
                <option value="closed">closed</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit">{editing ? "Save Changes" : "Create Job"}</button>
            <button type="button" className="btn outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <section className="jobs-card">
        <h2>All Job Postings</h2>

        <div className="jobs-table-wrap">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Stipend</th>
                <th>Hours/Week</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(job => (
                <tr key={job.id}>
                  <td>
                    <div className="job-title">{job.title}</div>
                    <div className="job-sub">Posted {job.posted}</div>
                  </td>
                  <td>{job.dept}</td>
                  <td>${job.stipend}/hr</td>
                  <td>{job.hours}h</td>
                  <td><span className="icon">👥</span> {job.apps ?? 0}</td>
                  <td><span className={`badge ${job.status}`}>{job.status}</span></td>
                  <td className="actions">
                    <button className="icon-btn" title="Edit" onClick={() => openEdit(job)}>✏️</button>
                    <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(job.id)}>🗑️</button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem 0" }}>No job postings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
