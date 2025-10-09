import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  function handleLogout() {
    sessionStorage.removeItem("role");
    navigate("/");
  }
  return (
    <div style={{maxWidth:1100,margin:"36px auto",padding:"1.5rem"}}>
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-section stats-card">
        <div className="stats-item"><b>Active Jobs</b><div style={{fontSize:24,marginTop:6}}>24</div></div>
        <div className="stats-item"><b>Total Applications</b><div style={{fontSize:24,marginTop:6}}>156</div></div>
        <div className="stats-item"><b>Active Students</b><div style={{fontSize:24,marginTop:6}}>89</div></div>
        <div className="stats-item"><b>Hours Tracked</b><div style={{fontSize:24,marginTop:6}}>2,847</div></div>
      </div>
      <div className="dashboard-section">
        <div className="section-title">Pending Applications</div>
        <table className="table">
          <thead><tr><th>Name</th><th>Position</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Sarah Johnson</td><td>Library Assistant</td><td><span className="tag">Pending</span></td></tr>
            <tr><td>Mike Chen</td><td>Research Assistant</td><td><span className="tag">Pending</span></td></tr>
            <tr><td>Emma Davis</td><td>Lab Technician</td><td><span className="tag active">Approved</span></td></tr>
          </tbody>
        </table>
      </div>
      <div className="dashboard-section">
        <div className="section-title">Active Job Postings</div>
        <table className="table">
          <thead><tr><th>Title</th><th>Applications</th><th>Stipend</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Library Assistant</td><td>12</td><td>$15/hr</td><td><span className="tag active">Active</span></td></tr>
            <tr><td>Research Assistant</td><td>8</td><td>$18/hr</td><td><span className="tag active">Active</span></td></tr>
            <tr><td>Lab Technician</td><td>15</td><td>$16/hr</td><td><span className="tag closed">Closed</span></td></tr>
          </tbody>
        </table>
      </div>
      <div className="dashboard-section">
        <div className="section-title">Work Hours Overview</div>
        <table className="table">
          <thead><tr><th>Student</th><th>Position</th><th>Hours Worked</th></tr></thead>
          <tbody>
            <tr><td>Amit Singh</td><td>Library Assistant</td><td>13</td></tr>
            <tr><td>Leah Brown</td><td>Lab Technician</td><td>17</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
