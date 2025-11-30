// backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const DATA_PATH = path.join(__dirname, "data.json");
const app = express();
app.use(cors());
app.use(bodyParser.json());

/* ---------- Data file helpers ---------- */
function ensureDataFile() {
  if (!fs.existsSync(DATA_PATH)) {
    const seed = {
      users: [
        { id: "u-admin", name: "Admin", email: "admin@demo", password: "admin", role: "admin" },
        { id: "u-student", name: "Demo Student", email: "student@demo", password: "student", role: "student" }
      ],
      jobs: [
        { id: "j1", title: "Library Assistant", dept: "University Library", stipend: 15, hours: 10, status: "active", posted_at: "2024-01-15" },
        { id: "j2", title: "Research Assistant", dept: "Biology Department", stipend: 18, hours: 15, status: "active", posted_at: "2024-01-10" },
        { id: "j3", title: "Lab Technician", dept: "Chemistry Department", stipend: 16, hours: 12, status: "closed", posted_at: "2024-01-05" }
      ],
      applications: [
        { id: "a1", jobId: "j1", jobTitle: "Library Assistant", studentId: "u-student", studentName: "Demo Student", applied_at: "2024-01-15", status: "pending" }
      ],
      timesheets: [
        { id: "t1", jobId: "j2", studentId: "u-student", job_title: "Research Assistant", date: "2024-01-20", hours: 4, status: "approved", feedback: "Good job" }
      ]
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
  }
}
ensureDataFile();

function readData() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  return JSON.parse(raw);
}
function writeData(obj) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(obj, null, 2));
}

/* ---------- Auth (demo) ---------- */
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, role = "student" } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: "name,email,password required" });

  const data = readData();
  if (data.users.find(u => u.email === email))
    return res.status(409).json({ error: "email exists" });

  const user = { id: uuidv4(), name, email, password, role };
  data.users.push(user);
  writeData(data);

  res.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const data = readData();
  const user = data.users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: "invalid credentials" });

  res.json({
    ok: true,
    role: user.role,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

/* ---------- Jobs ---------- */
app.get("/api/jobs", (req, res) => {
  const data = readData();
  res.json(data.jobs);
});

app.post("/api/jobs", (req, res) => {
  const { title, dept, stipend, hours, status = "active" } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  const data = readData();
  const job = { id: uuidv4(), title, dept, stipend: Number(stipend) || 0, hours: hours || 0, status, posted_at: new Date().toISOString().slice(0,10) };
  data.jobs.unshift(job);
  writeData(data);
  res.json(job);
});

app.put("/api/jobs/:id", (req, res) => {
  const id = req.params.id;
  const data = readData();
  const idx = data.jobs.findIndex(j => j.id === id);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  data.jobs[idx] = { ...data.jobs[idx], ...req.body };
  writeData(data);
  res.json(data.jobs[idx]);
});

app.delete("/api/jobs/:id", (req, res) => {
  const id = req.params.id;
  const data = readData();
  data.jobs = data.jobs.filter(j => j.id !== id);
  writeData(data);
  res.json({ ok: true });
});

/* ---------- Applications ---------- */
app.get("/api/applications", (req, res) => {
  const data = readData();
  res.json(data.applications);
});

app.post("/api/applications", (req, res) => {
  const { jobId, studentId, studentName } = req.body;
  if (!jobId || !studentId) return res.status(400).json({ error: "jobId and studentId required" });
  const data = readData();
  const job = data.jobs.find(j => j.id === jobId);
  const application = {
    id: uuidv4(),
    jobId,
    jobTitle: job?.title || "(unknown)",
    studentId,
    studentName: studentName || "Student",
    applied_at: new Date().toISOString().slice(0,10),
    status: "pending"
  };
  data.applications.unshift(application);
  writeData(data);
  res.json(application);
});

app.put("/api/applications/:id", (req, res) => {
  const id = req.params.id;
  const data = readData();
  const idx = data.applications.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  data.applications[idx] = { ...data.applications[idx], ...req.body };
  writeData(data);
  res.json(data.applications[idx]);
});

/* ---------- Timesheets ---------- */
app.get("/api/timesheets", (req, res) => {
  const data = readData();
  res.json(data.timesheets);
});

app.post("/api/timesheets", (req, res) => {
  const { jobId, studentId, job_title, date, hours, description } = req.body;
  if (!studentId || !job_title || !date || !hours) return res.status(400).json({ error: "missing fields" });
  const data = readData();
  const entry = { id: uuidv4(), jobId: jobId || null, studentId, job_title, date, hours: Number(hours), description: description || "", status: "pending", feedback: "" };
  data.timesheets.unshift(entry);
  writeData(data);
  res.json(entry);
});

/* ---------- misc ---------- */
app.get("/api/ping", (req, res) => res.json({ ok: true, now: new Date().toISOString() }));

/* ---------- Server start with EADDRINUSE handling ---------- */
const BASE_PORT = Number(process.env.PORT) || 5000;
const MAX_TRIES = 10; // will attempt BASE_PORT .. BASE_PORT + MAX_TRIES - 1

let server = null;

function startServer(port, triesLeft) {
  if (triesLeft <= 0) {
    console.error(`Unable to bind to a port after multiple attempts. Exiting.`);
    process.exit(1);
  }

  server = app.listen(port, () => {
    console.log(`SkillTrack backend listening on port ${port}`);
  });

  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      console.warn(`Port ${port} in use — trying port ${port + 1} (${triesLeft - 1} tries left)...`);
      // small delay before retry to avoid race conditions
      setTimeout(() => {
        startServer(port + 1, triesLeft - 1);
      }, 300);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
}

startServer(BASE_PORT, MAX_TRIES);

/* ---------- Graceful shutdown ---------- */
function shutdown() {
  console.log("Shutting down server...");
  if (server && server.close) {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
    // force exit if not closed in 3s
    setTimeout(() => {
      console.warn("Forcing shutdown.");
      process.exit(1);
    }, 3000).unref();
  } else {
    process.exit(0);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// helpful for debugging unhandled rejections
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // optionally exit: process.exit(1);
});
