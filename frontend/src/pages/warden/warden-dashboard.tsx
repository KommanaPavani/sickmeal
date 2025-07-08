import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define interface for request object
interface Request {
  _id: string;
  name: string;
  hostelName: string;
  roomNo: string;
  healthIssue: string;
  createdAt: string;
  wardenAccepted?: boolean;
  wardenRejected?: boolean;
}

const WardenDashboard: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("wardenToken");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.body.style.display = "block";
    document.body.style.justifyContent = "initial";
    document.body.style.alignItems = "initial";
    document.body.style.height = "auto";

    return () => {
      document.body.style.display = "";
      document.body.style.justifyContent = "";
      document.body.style.alignItems = "";
      document.body.style.height = "";
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get<Request[]>("http://localhost:5000/api/request/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const filteredRequests = requests.filter((req) =>
    req.hostelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/request/accept-by-warden/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRequests();
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/request/reject-by-warden/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRequests();
    } catch (err) {
      console.error("Failed to reject request:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/warden-login");
  };

  return (
    <>
      {/* Fixed top-right dropdown */}
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
                navigate("/warden-profile");
              }}
              style={menuItemStyle}
            >
              Profile
            </div>
            
            <div onClick={handleLogout} style={menuItemStyle}>
              Logout
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #FFD699 30%, #FFFFFF 70%)",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "left",
        }}
      >
        {/* 🔍 Search Bar */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by hostel name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        {/* 🧾 Filtered Requests */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <p><strong>Name:</strong> {req.name}</p>
              <p><strong>Hostel Name:</strong> {req.hostelName}</p>
              <p><strong>Room No:</strong> {req.roomNo}</p>
              <p><strong>Health Issue:</strong> {req.healthIssue}</p>
              <p style={{ color: "#888" }}>
                <strong>Date & Time:</strong> {new Date(req.createdAt).toLocaleString()}
              </p>
              <div style={{ marginTop: "12px" }}>
                <button
                  onClick={() => handleAccept(req._id)}
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    marginRight: "10px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(req._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
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

export default WardenDashboard;
