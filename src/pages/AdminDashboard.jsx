import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminSidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="sidebar-title">ADMINISTRATION</div>
      <ul>
        <li onClick={()=>navigate("/admin")}><span>🏠</span> Dashboard</li>
        <li><span>📋</span> Job Postings</li>
        <li><span>📑</span> Applications</li>
        <li><span>⏰</span> Work Hours</li>
      </ul>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  function handleLogout() {
    sessionStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
        <div style={{marginBottom:"18px",color:"#7c8aad",fontWeight:500}}>
          Overview of work-study program activities and management
        </div>
        <div className="card-row">
          <div className="card">
            <div className="card-title">Active Jobs</div>
            <div className="card-value">24</div>
            <div style={{color: "#24b87e", fontSize: "0.93em"}}>+12% from last month</div>
          </div>
          <div className="card">
            <div className="card-title">Total Applications</div>
            <div className="card-value">156</div>
            <div style={{color: "#2177d3", fontSize: "0.93em"}}>+8% from last week</div>
          </div>
          <div className="card">
            <div className="card-title">Active Students</div>
            <div className="card-value">89</div>
            <div style={{color: "#3cd27e", fontSize: "0.93em"}}>+15% from last month</div>
          </div>
          <div className="card">
            <div className="card-title">Hours Tracked</div>
            <div className="card-value">2,847</div>
            <div style={{color: "#2283e3", fontSize: "0.93em"}}>+22% from last month</div>
          </div>
        </div>
        <div style={{display:"flex",gap:"2.2rem"}}>
          <div style={{flex:1}}>
            <div className="dashboard-section">
              <div className="section-title">
                Pending Applications <span style={{fontSize:"0.9em",color:"#5a6dbc",background:"#f2f6fe",padding:"2px 11px",borderRadius:8,marginLeft:13}}>23 pending</span>
              </div>
              <div style={{marginTop:"10px"}}>
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
                <div style={{display:"flex",justifyContent:"center",marginTop:10}}>
                  <button className="secondary-btn">View All Applications</button>
                </div>
              </div>
            </div>
          </div>
          <div style={{flex:1}}>
            <div className="dashboard-section">
              <div className="section-title" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span>Active Job Postings</span>
                <button className="primary-btn">+ New Job</button>
              </div>
              <div style={{marginTop:"8px"}}>
                <div className="pending-row">
                  <div>
                    <b>Library Assistant</b>
                    <div className="small-label">12 applications</div>
                  </div>
                  <div>
                    <span style={{marginRight:"11px",color:"#2f5fe4",fontWeight:500}}>$15/hr</span>
                    <span className="tag active">Active</span>
                  </div>
                </div>
                <div className="pending-row">
                  <div>
                    <b>Research Assistant</b>
                    <div className="small-label">8 applications</div>
                  </div>
                  <div>
                    <span style={{marginRight:"11px",color:"#2f5fe4",fontWeight:500}}>$18/hr</span>
                    <span className="tag active">Active</span>
                  </div>
                </div>
                <div className="pending-row">
                  <div>
                    <b>Lab Technician</b>
                    <div className="small-label">15 applications</div>
                  </div>
                  <div>
                    <span style={{marginRight:"11px",color:"#2f5fe4",fontWeight:500}}>$16/hr</span>
                    <span className="tag closed">Closed</span>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"center",marginTop:10}}>
                  <button className="secondary-btn">Manage All Jobs</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
