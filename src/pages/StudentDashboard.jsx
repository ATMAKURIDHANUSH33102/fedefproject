// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
// import StudentDashboard from "./pages/StudentDashboard.jsx";

/**
 * StudentDashboard (final)
 *
 * - Internal view switching via Sidebar (no route changes)
 * - Imports StudentProfile, StudentApplications, StudentHours from ./student/*
 * - Provides Jobs view in-file and demo applyToJob() that writes to localStorage
 *
 * Make sure you have:
 *  - src/pages/student/StudentProfile.jsx
 *  - src/pages/student/StudentApplications.jsx
 *  - src/pages/student/StudentHours.jsx
 * (I provided those previously). If not present, Jobs view will still work.
 */

// try to import student sub-pages; if they don't exist the imports will fail at build.
// If you prefer to keep them optional, comment out these imports and rely on in-file views.
import StudentProfile from "./student/StudentProfile";
import StudentApplications from "./student/StudentApplications";
import StudentHours from "./student/StudentHours";

/* Sidebar component that controls the active view */
function Sidebar({ active, setActive }) {
  return (
    <div className="sidebar">
      <div className="sidebar-title">STUDENT PORTAL</div>
      <ul>
        <li className={active === "dashboard" ? "active-link" : ""} onClick={() => setActive("dashboard")}><span>🏠</span> Dashboard</li>
        <li className={active === "jobs" ? "active-link" : ""} onClick={() => setActive("jobs")}><span>📋</span> Job Listings</li>
        <li className={active === "applications" ? "active-link" : ""} onClick={() => setActive("applications")}><span>📑</span> My Applications</li>
        <li className={active === "hours" ? "active-link" : ""} onClick={() => setActive("hours")}><span>⏰</span> Work Hours</li>
        <li className={active === "profile" ? "active-link" : ""} onClick={() => setActive("profile")}><span>👤</span> Profile</li>
      </ul>
    </div>
  );
}

/* Demo helpers: read persisted data or return default seeds */
function readPersisted() {
  const read = (k, seed = []) => {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) return seed;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : seed;
    } catch {
      return seed;
    }
  };

  const jobSeed = [
    { id: 101, title: "Library Assistant", dept: "University Library", stipend: 15, hours: 10, status: "active" },
    { id: 102, title: "Research Assistant", dept: "Biology Department", stipend: 18, hours: 15, status: "active" },
    { id: 103, title: "Lab Technician", dept: "Chemistry Department", stipend: 16, hours: 12, status: "closed" },
  ];

  const appSeed = [
    { id: 1, job_title: "Library Assistant", dept: "Library Services", stipend: "$15/hr", applied_at: "2024-01-15", status: "pending", user_id: 999 },
    { id: 2, job_title: "Research Assistant", dept: "Computer Science", stipend: "$18/hr", applied_at: "2024-01-10", status: "approved", user_id: 999 },
  ];

  const timesSeed = [
    { id: 1, job_title: "Research Assistant", date: "2024-01-20", hours: 4, status: "approved", feedback: "Great work" },
    { id: 2, job_title: "Research Assistant", date: "2024-01-18", hours: 6, status: "pending", feedback: "" },
  ];

  return {
    jobs: read("jobs", jobSeed),
    applications: read("applications", appSeed),
    timesheets: read("timesheets", timesSeed),
  };
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({ submitted: 0, positions: 0, hoursWorked: 0, earnings: 0 });
  const [jobs, setJobs] = useState(() => readPersisted().jobs);

  // load stats based on persisted data
  useEffect(() => {
    const load = () => {
      const { jobs, applications, timesheets } = readPersisted();
      setJobs(jobs);
      const submitted = applications.length;
      const positions = jobs.filter((j) => j.status === "active").length;
      const hoursWorked = timesheets.reduce((s, t) => s + (Number(t.hours) || 0), 0);
      const hourly = 15;
      setStats({ submitted, positions, hoursWorked, earnings: hoursWorked * hourly });
    };

    load();
    // update when localStorage changes from other tabs/components
    const onStorage = (e) => {
      if (!e || ["jobs", "applications", "timesheets"].includes(e.key)) load();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", load);
    };
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("role");
    navigate("/");
  }

  /* Demo action: apply to a job, store application in localStorage */
  function applyToJob(job) {
    const existing = readPersisted().applications;
    const newApp = {
      id: Date.now(),
      job_title: job.title,
      dept: job.dept || job.dept,
      stipend: `$${job.stipend}/hr`,
      applied_at: new Date().toISOString().slice(0, 10),
      status: "pending",
      user_id: 999,
      student_name: "Demo Student",
    };
    const updated = [newApp, ...existing];
    localStorage.setItem("applications", JSON.stringify(updated));
    // trigger storage listeners (window 'storage' doesn't fire in same tab) — dispatch a custom event
    window.dispatchEvent(new Event("storage"));
    // update local stats immediately
    setStats((s) => ({ ...s, submitted: s.submitted + 1 }));
    alert("Applied (demo). Check My Applications. Admin will also see this application.");
  }

  /* Views */

  function DashboardView() {
    return (
      <>
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="role-pill">Role: <strong>Student</strong></div>
            <button className="btn outline" onClick={() => setActiveView("jobs")}>Find Jobs</button>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="card-row">
          <div className="card">
            <div className="card-title">Applications Submitted</div>
            <div className="card-value">{stats.submitted}</div>
            <div className="card-sub">+25% this month</div>
          </div>
          <div className="card">
            <div className="card-title">Active Positions</div>
            <div className="card-value">{stats.positions}</div>
            <div className="card-sub">Current opportunities</div>
          </div>
          <div className="card">
            <div className="card-title">Hours Worked</div>
            <div className="card-value">{stats.hoursWorked}</div>
            <div className="card-sub">+15% from last month</div>
          </div>
          <div className="card">
            <div className="card-title">Total Earnings</div>
            <div className="card-value">${stats.earnings}</div>
            <div className="card-sub">Estimated</div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-title">Current Positions <span className="tag active" style={{ fontWeight: 500 }}>{stats.positions} active</span></div>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Hours</th>
                <th>Rating</th>
                <th>Next Shift</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Library Assistant</td>
                <td><span className="tag active">Active</span></td>
                <td>25/40</td>
                <td>4.8</td>
                <td>Tomorrow 2:00 PM</td>
              </tr>
              <tr>
                <td>Tutor</td>
                <td><span className="tag active">Active</span></td>
                <td>20/30</td>
                <td>4.9</td>
                <td>This week</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="dashboard-section">
          <div className="section-title">Recent Applications</div>
          <table className="table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Date</th>
                <th>Stipend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Library Assistant</td>
                <td>2024-01-15</td>
                <td>$15/hr</td>
                <td><span className="tag approved">Approved</span></td>
              </tr>
              <tr>
                <td>Research Assistant</td>
                <td>2024-01-18</td>
                <td>$18/hr</td>
                <td><span className="tag pending">Pending</span></td>
              </tr>
              <tr>
                <td>Tutor</td>
                <td>2024-01-20</td>
                <td>$16/hr</td>
                <td><span className="tag approved">Approved</span></td>
              </tr>
              <tr>
                <td>Lab Assistant</td>
                <td>2024-01-12</td>
                <td>$17/hr</td>
                <td><span className="tag rejected">Rejected</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function JobsView() {
    const filtered = jobs.filter((j) => {
      const q = query.trim().toLowerCase();
      return (!q || (j.title + j.dept).toLowerCase().includes(q)) && (filter === "all" || j.status === filter);
    });

    return (
      <>
        <div className="dashboard-header">
          <h1 className="dashboard-title">Job Listings</h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="role-pill">Role: <strong>Student</strong></div>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="controls-row" style={{ marginBottom: 16 }}>
          <div className="search-box" style={{ width: "65%" }}>
            <input placeholder="Search jobs by title or department..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="btn small outline" onClick={() => setQuery("")}>Clear</button>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="dashboard-section">
          <div className="section-title">Available Positions</div>
          <div className="jobs-list">
            {filtered.length === 0 && <div style={{ padding: 20 }}>No jobs found.</div>}
            {filtered.map((job) => (
              <div key={job.id} className="job-item">
                <div>
                  <div className="job-title">{job.title}</div>
                  <div className="job-sub">{job.dept}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>${job.stipend}/hr</div>
                  <div style={{ color: "#6f88a8" }}>{job.hours}h/week</div>
                  <button className="btn small" onClick={() => applyToJob(job)}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* Render the selected view:
     If you added separate StudentProfile/StudentApplications/StudentHours files, those components are used.
     Otherwise the built-in Jobs + Dashboard cover core flows.
  */
  return (
    <div className="dashboard-layout">
      <Sidebar active={activeView} setActive={setActiveView} />
      <main className="dashboard-main">
        {activeView === "dashboard" && <DashboardView />}
        {activeView === "jobs" && <JobsView />}

        {activeView === "applications" && (
          // prefer the detailed component if present, otherwise render a small placeholder
          typeof StudentApplications === "function" ? <StudentApplications /> : (
            <div className="dashboard-section">
              <h2>My Applications</h2>
              <p>Install the StudentApplications component to see the full view.</p>
            </div>
          )
        )}

        {activeView === "hours" && (
          typeof StudentHours === "function" ? <StudentHours /> : (
            <div className="dashboard-section">
              <h2>Work Hours</h2>
              <p>Install the StudentHours component to see the full view.</p>
            </div>
          )
        )}

        {activeView === "profile" && (
          typeof StudentProfile === "function" ? <StudentProfile /> : (
            <div className="dashboard-section">
              <h2>Profile</h2>
              <p>Install the StudentProfile component to see the full view.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
