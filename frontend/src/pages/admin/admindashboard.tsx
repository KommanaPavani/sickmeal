import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const AdminDashboard: React.FC = () => {
   const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get<Request[]>("http://localhost:5000/api/request");
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRequests(sorted);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, []);

  const getStatusIcon = (accepted?: boolean, rejected?: boolean) => {
    if (accepted)
      return <span style={{ color: "green", fontWeight: "bold" }} title="Accepted">Accepted ✔️</span>;
    if (rejected)
      return <span style={{ color: "red", fontWeight: "bold" }} title="Rejected">Rejected ❌</span>;
    return <span title="Pending">Pending</span>;
  };

  const handleLogout = () => {
    navigate("/admin-login");
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingTop: "60px" }}>
      {/* Top-right avatar + logout button */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 20,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#f0f0f0",
          padding: "6px 12px",
          borderRadius: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          cursor: "default",
          userSelect: "none",
          zIndex: 1000,
        }}
      >
        {/* Simple avatar circle */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#2c3e50",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.2rem",
            userSelect: "none",
          }}
          title="Admin"
        >
          A
        </div>

        <button
          onClick={handleLogout}
          style={{
            border: "none",
            backgroundColor: "#e74c3c",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "20px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c0392b")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#e74c3c")}
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1rem" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "2.5rem",
            marginBottom: "1.5rem",
            color: "#222",
          }}
        >
          Sick Meal Requests
        </h1>

        {requests.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontSize: "1.1rem" }}>
            No requests available.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#2c3e50", color: "#ecf0f1" }}>
                {[
                  "Name",
                  "Hostel Name",
                  "Room No",
                  "Health Issue",
                  "Requested At",
                  "Warden Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "12px 15px",
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "1rem",
                      userSelect: "none",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => (
                <tr
                  key={req._id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#f7f9fa" : "#e9eef3",
                    cursor: "default",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#d1dce5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      idx % 2 === 0 ? "#f7f9fa" : "#e9eef3")
                  }
                >
                  <td
                    style={{ padding: "12px 15px", borderBottom: "1px solid #ccc" }}
                  >
                    {req.name}
                  </td>
                  <td
                    style={{ padding: "12px 15px", borderBottom: "1px solid #ccc" }}
                  >
                    {req.hostelName}
                  </td>
                  <td
                    style={{ padding: "12px 15px", borderBottom: "1px solid #ccc" }}
                  >
                    {req.roomNo}
                  </td>
                  <td
                    style={{ padding: "12px 15px", borderBottom: "1px solid #ccc" }}
                  >
                    {req.healthIssue}
                  </td>
                  <td
                    style={{ padding: "12px 15px", borderBottom: "1px solid #ccc" }}
                  >
                    {new Date(req.createdAt).toLocaleString()}
                  </td>
                  <td
                    style={{ padding: "12px 15px", borderBottom: "1px solid #ccc" }}
                  >
                    {getStatusIcon(req.wardenAccepted, req.wardenRejected)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
