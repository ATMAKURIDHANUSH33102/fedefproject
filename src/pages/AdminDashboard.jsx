// src/pages/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./AdminDashboard.css";

import AdminJobs from "./admin/AdminJobs";
import AdminApplications from "./admin/AdminApplications";
import AdminHours from "./admin/AdminHours";

function AdminSidebar({ active, setActive }) {
  return (
    <div className="sidebar">
      <div className="sidebar-title">ADMINISTRATION</div>
      <ul>
        <li className={active === "dashboard" ? "active-link" : ""} onClick={() => setActive("dashboard")}>
          🏠 Dashboard
        </li>
        <li className={active === "jobs" ? "active-link" : ""} onClick={() => setActive("jobs")}>
          📋 Job Postings
        </li>
        <li className={active === "applications" ? "active-link" : ""} onClick={() => setActive("applications")}>
          📑 Applications
        </li>
        <li className={active === "workhours" ? "active-link" : ""} onClick={() => setActive("workhours")}>
          ⏰ Work Hours
        </li>
      </ul>
    </div>
  );
}

/* Helper: read persisted data safely */
function readPersisted() {
  const read = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  return {
    jobs: read("jobs"),
    applications: read("applications"),
    timesheets: read("timesheets"),
  };
}

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    activeStudents: 0,
    hoursTracked: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = () => {
      const { jobs, applications, timesheets } = readPersisted();
      const activeJobs = jobs.filter((j) => j.status === "active").length;
      const totalApplications = applications.length;
      const activeStudents = Array.from(new Set(applications.map((a) => a.user_id))).filter(Boolean).length || 89;
      const hoursTracked = timesheets.reduce((s, t) => s + (Number(t.hours) || 0), 0);
      setStats({ activeJobs, totalApplications, activeStudents, hoursTracked });
    };

    loadStats();

    const onStorage = (e) => {
      if (!e || ["jobs", "applications", "timesheets"].includes(e.key)) loadStats();
    };
    const onFocus = () => loadStats();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [activeView]);

  function handleLogout() {
    sessionStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="dashboard-layout">
      <AdminSidebar active={activeView} setActive={setActiveView} />

      <main className="dashboard-main">
        {activeView === "dashboard" && (
          <>
            <div className="dashboard-header">
              <h1 className="dashboard-title">Admin Dashboard</h1>
              <button className="logout" onClick={handleLogout}>Logout</button>
            </div>

            <p style={{ marginBottom: "1.5rem", color: "#7c8aad" }}>
              Overview of work-study program activities and management
            </p>

            <div className="card-row">
              <div className="card">
                <div className="card-title">Active Jobs</div>
                <div className="card-value">{stats.activeJobs}</div>
                <div style={{ color: "#24b87e", fontSize: "0.93em" }}>+12% from last month</div>
              </div>

              <div className="card">
                <div className="card-title">Total Applications</div>
                <div className="card-value">{stats.totalApplications}</div>
                <div style={{ color: "#2177d3", fontSize: "0.93em" }}>+8% from last week</div>
              </div>

              <div className="card">
                <div className="card-title">Active Students</div>
                <div className="card-value">{stats.activeStudents}</div>
                <div style={{ color: "#3cd27e", fontSize: "0.93em" }}>+15% from last month</div>
              </div>

              <div className="card">
                <div className="card-title">Hours Tracked</div>
                <div className="card-value">{stats.hoursTracked}</div>
                <div style={{ color: "#2283e3", fontSize: "0.93em" }}>+22% from last month</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
              <div className="dashboard-section">
                <div className="section-title">Pending Applications <span style={{ fontSize: "0.9rem", color: "#5a6dbc", background: "#f2f6fe", padding: "2px 10px", borderRadius: 8, marginLeft: 12 }}>23 pending</span></div>

                <div className="pending-row">
                  <div>
                    <b>Sarah Johnson</b>
                    <div className="small-label">Library Assistant</div>
                  </div>
                  <span className="tag pending">pending</span>
                </div>

                <div className="pending-row">
                  <div>
                    <b>Mike Chen</b>
                    <div className="small-label">Research Assistant</div>
                  </div>
                  <span className="tag pending">pending</span>
                </div>

                <div className="pending-row">
                  <div>
                    <b>Emma Davis</b>
                    <div className="small-label">Lab Technician</div>
                  </div>
                  <span className="tag approved">approved</span>
                </div>

                <div className="pending-row">
                  <div>
                    <b>John Smith</b>
                    <div className="small-label">Tutor</div>
                  </div>
                  <span className="tag pending">pending</span>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                  <button className="secondary-btn">View All Applications</button>
                </div>
              </div>

              <div className="dashboard-section">
                <div className="section-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Active Job Postings</span>
                  <button className="primary-btn" onClick={() => setActiveView("jobs")}>+ New Job</button>
                </div>

                <div style={{ marginTop: 8 }}>
                  <div className="pending-row">
                    <div>
                      <b>Library Assistant</b>
                      <div className="small-label">12 applications</div>
                    </div>
                    <div>
                      <span style={{ marginRight: 11, color: "#2f5fe4", fontWeight: 500 }}>$15/hr</span>
                      <span className="tag active">Active</span>
                    </div>
                  </div>

                  <div className="pending-row">
                    <div>
                      <b>Research Assistant</b>
                      <div className="small-label">8 applications</div>
                    </div>
                    <div>
                      <span style={{ marginRight: 11, color: "#2f5fe4", fontWeight: 500 }}>$18/hr</span>
                      <span className="tag active">Active</span>
                    </div>
                  </div>

                  <div className="pending-row">
                    <div>
                      <b>Lab Technician</b>
                      <div className="small-label">15 applications</div>
                    </div>
                    <div>
                      <span style={{ marginRight: 11, color: "#2f5fe4", fontWeight: 500 }}>$16/hr</span>
                      <span className="tag closed">Closed</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                    <button className="secondary-btn" onClick={() => setActiveView("jobs")}>Manage All Jobs</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === "jobs" && <AdminJobs />}

        {activeView === "applications" && <AdminApplications />}

        {activeView === "workhours" && <AdminHours />}
      </main>
    </div>
  );
}
