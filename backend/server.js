const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// === MONGODB CONNECTION ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// === SCHEMAS ===

// Student Schema
const studentSchema = new mongoose.Schema({
  registerNumber: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: String,
});
const Student = mongoose.model("Student", studentSchema);

// Warden Schema
const wardenSchema = new mongoose.Schema({
  registerNumber: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  contactNumber: String,
});

const Warden = mongoose.model("Warden", wardenSchema);

// Request Schema
const requestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  name: String,
  hostelName: String,
  roomNo: String,
  healthIssue: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  wardenAccepted: {
    type: Boolean,
    default: false,
  },
  wardenRejected: {
    type: Boolean,
    default: false,
  },
});
const Request = mongoose.model("Request", requestSchema);

// === AUTH MIDDLEWARES ===

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Access denied: unauthorized role" });
    }
    next();
  };
};

// === AUTH ROUTES ===

// Student Signup
app.post("/api/warden/signup", async (req, res) => {
  const { registerNumber, name, email, password, contactNumber } = req.body;
  try {
    const existing = await Warden.findOne({ email: email.trim() });
    if (existing) return res.status(400).json({ message: "Warden already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const warden = new Warden({
      registerNumber,
      name,
      email: email.trim(),
      password: hashed,
      contactNumber,
    });
    await warden.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});
// Student Signup
app.post("/api/student/signup", async (req, res) => {
  const { registerNumber, email, password } = req.body;

  try {
    const existing = await Student.findOne({ email: email.trim() });
    if (existing) return res.status(400).json({ message: "Student already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const student = new Student({ registerNumber, email: email.trim(), password: hashed });

    await student.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});


// Student Login
app.post("/api/student/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email: email.trim() });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: student._id, role: "student" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Warden Signup
app.post("/api/warden/signup", async (req, res) => {
  const { registerNumber, email, password } = req.body;
  try {
    const existing = await Warden.findOne({ email: email.trim() });
    if (existing) return res.status(400).json({ message: "Warden already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const warden = new Warden({ registerNumber, email: email.trim(), password: hashed });
    await warden.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// Warden Login
app.post("/api/warden/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const warden = await Warden.findOne({ email: email.trim() });
    if (!warden) return res.status(404).json({ message: "Warden not found" });

    const isMatch = await bcrypt.compare(password, warden.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: warden._id, role: "warden" }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// === REQUEST ROUTES ===

// Student submits request
app.post("/api/request", authenticateToken, authorizeRole("student"), async (req, res) => {
  const { name, hostelName, roomNo, healthIssue } = req.body;
  try {
    const request = new Request({
      studentId: req.user.id,
      name,
      hostelName,
      roomNo,
      healthIssue,
    });
    await request.save();
    res.status(201).json({ message: "Request submitted", request });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit request", error: err.message });
  }
});

// All requests - for mess incharge (optional auth)
app.get("/api/request", async (req, res) => {
  try {
    const requests = await Request.find().populate("studentId", "registerNumber email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests", error: err.message });
  }
});

// Warden: view pending requests
app.get("/api/request/pending", authenticateToken, authorizeRole("warden"), async (req, res) => {
  try {
    const pending = await Request.find({ wardenAccepted: false, wardenRejected: false })
      .populate("studentId", "registerNumber email");
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending requests", error: err.message });
  }
});

// Warden: accept request
app.patch("/api/request/accept-by-warden/:id", authenticateToken, authorizeRole("warden"), async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { wardenAccepted: true, wardenRejected: false },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request accepted", request });
  } catch (err) {
    res.status(500).json({ message: "Failed to accept request", error: err.message });
  }
});

// Warden: reject request
app.patch("/api/request/reject-by-warden/:id", authenticateToken, authorizeRole("warden"), async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { wardenRejected: true, wardenAccepted: false },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request rejected", request });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject request", error: err.message });
  }
});

// Student: today's requests
app.get("/api/request/today", authenticateToken, authorizeRole("student"), async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    const todayRequests = await Request.find({
      studentId: req.user.id,
      createdAt: { $gte: start, $lte: end },
    });

    res.json(todayRequests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch today's requests", error: err.message });
  }
});

// Student: previous requests
app.get("/api/request/previous", authenticateToken, authorizeRole("student"), async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);

    const prevRequests = await Request.find({
      studentId: req.user.id,
      createdAt: { $lt: start },
    });

    res.json(prevRequests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch previous requests", error: err.message });
  }
});

// === STUDENT PROFILE ROUTES ===

// Get student profile
app.get("/api/student/profile", authenticateToken, authorizeRole("student"), async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

// Update student profile
// Update student profile including password
app.put("/api/student/profile", authenticateToken, authorizeRole("student"), async (req, res) => {
  const { name, phoneNumber, currentPassword, newPassword } = req.body;

  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // If newPassword is present, validate current password
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, student.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });


      student.password = await bcrypt.hash(newPassword, 10);
    }

    // Update name and phone if provided
    if (name) student.name = name;
    if (phoneNumber) student.phoneNumber = phoneNumber;

    await student.save();
    const updatedStudent = student.toObject();
    delete updatedStudent.password; // Don't send back password

    res.json({ message: "Profile updated", student: updatedStudent });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});
app.get("/api/warden/profile", authenticateToken, authorizeRole("warden"), async (req, res) => {
  try {
    const warden = await Warden.findById(req.user.id).select("-password");
    if (!warden) return res.status(404).json({ message: "Warden not found" });
    res.json(warden);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});
app.put("/api/warden/profile", authenticateToken, authorizeRole("warden"), async (req, res) => {
  const { name, contactNumber, currentPassword, newPassword } = req.body;

  try {
    const warden = await Warden.findById(req.user.id);
    if (!warden) return res.status(404).json({ message: "Warden not found" });

    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, warden.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

      warden.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) warden.name = name;
    if (contactNumber) warden.contactNumber = contactNumber;

    await warden.save();
    const updated = warden.toObject();
    delete updated.password;

    res.json({ message: "Profile updated", warden: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});


// === START SERVER ===
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
