import { useNavigate } from "react-router-dom";
import "../pages/StudentDashboard.css";

function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="sidebar-title">STUDENT PORTAL</div>
      <ul>
        <li onClick={()=>navigate("/student")}><span>🏠</span> Dashboard</li>
        <li><span>📋</span> Job Listings</li>
        <li><span>📑</span> My Applications</li>
        <li><span>⏰</span> Work Hours</li>
        <li><span>👤</span> Profile</li>
      </ul>
    </div>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  function handleLogout() {
    sessionStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="dashboard-layout">
      <Sidebar/>
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>

        {/* Stats Row */}
        <div className="card-row">
          <div className="card">
            <div className="card-title">Applications Submitted</div>
            <div className="card-value">5</div>
            <div style={{color: "#28bd88", fontSize: "0.93em"}}>+25% this month</div>
          </div>
          <div className="card">
            <div className="card-title">Active Positions</div>
            <div className="card-value">2</div>
            <div style={{color: "#1583e9", fontSize: "0.93em"}}>+0% no change</div>
          </div>
          <div className="card">
            <div className="card-title">Hours Worked</div>
            <div className="card-value">45</div>
            <div style={{color: "#4ac166", fontSize: "0.93em"}}>+15% from last month</div>
          </div>
          <div className="card">
            <div className="card-title">Total Earnings</div>
            <div className="card-value">$675</div>
            <div style={{color: "#1583e9", fontSize: "0.93em"}}>+20% from last month</div>
          </div>
        </div>

        {/* Current Positions */}
        <div className="dashboard-section">
          <div className="section-title">Current Positions <span className="tag active" style={{fontWeight:500}}>2 active</span></div>
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

        {/* Recent Applications */}
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

        {/* Add any other dashboard panels you need here... */}
      </main>
    </div>
  );
}
