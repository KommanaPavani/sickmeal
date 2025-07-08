import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Request {
  _id: string;
  studentId: string;
  name: string;
  hostelName: string;
  roomNo: string;
  healthIssue: string;
  createdAt: string;
  wardenAccepted: boolean;
  wardenRejected: boolean;
}

const StudentDashboard = () => {
  const [activeRequests, setActiveRequests] = useState<Request[]>([]);
  const [previousRequests, setPreviousRequests] = useState<Request[]>([]);
  const [showPrevious, setShowPrevious] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const studentName = localStorage.getItem("studentName") || "";
  const navigate = useNavigate();
  useEffect(() => {
  // Override global styles for this page
  document.body.style.display = "block";
  document.body.style.justifyContent = "initial";
  document.body.style.alignItems = "initial";
  document.body.style.height = "auto";

  return () => {
    // Reset back if necessary
    document.body.style.display = "";
    document.body.style.justifyContent = "";
    document.body.style.alignItems = "";
    document.body.style.height = "";
  };
}, []);


  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in again.");
        navigate("/studentlogin");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [todayRes, prevRes] = await Promise.all([
        axios.get<Request[]>("http://localhost:5000/api/request/today", { headers }),
        axios.get<Request[]>("http://localhost:5000/api/request/previous", { headers }),
      ]);

      setActiveRequests(todayRes.data);
      setPreviousRequests(prevRes.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      alert("Failed to load requests");
    }
  };

  useEffect(() => {
    if (!studentName) {
      alert("You must log in first.");
      navigate("/studentlogin");
    } else {
      fetchRequests();
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student-login");
  };

  const getStatus = (req: Request) => {
    if (req.wardenAccepted) return "Accepted";
    if (req.wardenRejected) return "Rejected";
    return "Pending";
  };

  const renderCard = (req: Request, showDate = false) => {
    const status = getStatus(req);

    const statusColor =
      status === "Accepted"
        ? "green"
        : status === "Rejected"
        ? "red"
        : "#ff9800";

    return (
      <div
        key={req._id}
        style={{
          background: "#f9f9f9",
          padding: 16,
          marginBottom: 16,
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        {showDate && (
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            <strong>Date:</strong> {new Date(req.createdAt).toLocaleDateString()}
          </p>
        )}
        <p style={{ margin: "8px 0" }}>
          <strong>Name:</strong> {req.name}
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>Hostel Name:</strong> {req.hostelName}
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>Room No:</strong> {req.roomNo}
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>Health Issue:</strong> {req.healthIssue}
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>Status:</strong>{" "}
          <span style={{ color: statusColor, fontWeight: "bold" }}>{status}</span>
        </p>
      </div>
    );
  };

  return (
    <>
      {/* Dropdown Menu */}
     
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FFD699 30%, #FFFFFF 70%)",
      paddingBottom: 40,
    }}
  >
    {/* Dropdown Menu */}
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,
        userSelect: "none",
      }}
    >
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            cursor: "pointer",
            fontSize: 24,
            background: "#007bff",
            color: "#fff",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Menu"
        >
          ☰
        </div>
        {dropdownOpen && (
          <div
            style={{
              marginTop: 8,
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              borderRadius: 6,
              overflow: "hidden",
              width: 150,
              textAlign: "left",
            }}
          >
            <div
              onClick={() => {
                setDropdownOpen(false);
                navigate("/student-profile");
              }}
              style={menuItemStyle}
            >
              Profile
            </div>
            <div
              onClick={() => {
                setDropdownOpen(false);
                navigate("/create-request");
              }}
              style={menuItemStyle}
            >
              Create Request
            </div>
            <div onClick={handleLogout} style={menuItemStyle}>
              Logout
            </div>
          </div>
        )}
      </div>
      
      {/* Main Dashboard */}
      <div
        style={{
          maxWidth: 800,
          margin: "40px auto",
          padding: 24,
          fontFamily: "Segoe UI, sans-serif",
          position: "relative",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28 }}>Welcome</h1>

        {/* Active Requests */}
        <section>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>🟢 Active Requests (Today)</h2>
          {activeRequests.length === 0 ? (
            <p style={{ color: "#777" }}>No active requests for today.</p>
              ) : (
                        <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
                maxHeight: "600px",
                overflowY: "auto",
                paddingRight: "6px",
              }}
            >
              {activeRequests.map((req) => renderCard(req))}
             </div>

          )}
        </section>

        {/* Toggle Button */}
        <button
          onClick={() => setShowPrevious(!showPrevious)}
          style={{
            marginTop: 30,
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {showPrevious ? "Hide Previous Requests" : "Show Previous Requests"}
        </button>

        {/* Previous Requests */}
        {showPrevious && (
          <section style={{ marginTop: 30 }}>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>📄 Previous Requests</h2>
            {previousRequests.length === 0 ? (
              <p style={{ color: "#777" }}>No previous requests found.</p>
            ) : (
                          <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "20px",
                  maxHeight: "600px",
                  overflowY: "auto",
                  paddingRight: "6px",
                }}
              >
                {previousRequests.map((req) => renderCard(req, true))}
              </div>

            )}
          </section>
        )}
      </div>
      </div>
    </>
  );
};

const menuItemStyle: React.CSSProperties = {
  padding: "10px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #ddd",
  backgroundColor: "#fff",
  fontSize: 16,
};

export default StudentDashboard;
