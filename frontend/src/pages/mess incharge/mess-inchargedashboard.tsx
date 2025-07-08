import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RequestType {
  _id: string;
  name: string;
  hostelName: string;
  roomNo: string;
  healthIssue: string;
  createdAt: string;
  wardenAccepted: boolean;
  wardenRejected: boolean;
}

const MessInchargeDashboard = () => {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isToday = (dateString: string) => {
    const requestDate = new Date(dateString);
    const today = new Date();
    return (
      requestDate.getDate() === today.getDate() &&
      requestDate.getMonth() === today.getMonth() &&
      requestDate.getFullYear() === today.getFullYear()
    );
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/request");
      const filtered = response.data.filter(
        (req: RequestType) => req.wardenAccepted && isToday(req.createdAt)
      );
      setRequests(filtered);
    } catch (err: any) {
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/mess-login");
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={styles.container}>
      {/* 🔒 Top bar */}
      <div style={styles.topBar}>
        <span style={styles.userIcon}>👤</span>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <h2 style={styles.heading}>📋 Today's Requests Approved by Warden</h2>

      {loading ? (
        <p style={styles.message}>Loading requests...</p>
      ) : error ? (
        <p style={{ ...styles.message, color: "red" }}>{error}</p>
      ) : requests.length === 0 ? (
        <p style={styles.message}>No requests approved today.</p>
      ) : (
        <ul style={styles.scrollableList}>
          {requests.map((req) => (
            <li key={req._id} style={styles.requestCard}>
              <p><strong>Name:</strong> {req.name}</p>
              <p><strong>Hostel Name:</strong> {req.hostelName}</p>
              <p><strong>Room No:</strong> {req.roomNo}</p>
              <p><strong>Issue:</strong> {req.healthIssue}</p>
              <p><strong>Requested At:</strong> {new Date(req.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 🎨 Inline Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 24,
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    fontFamily: "Segoe UI, sans-serif",
    color: "#333",
    position: "relative",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  userIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  logoutButton: {
    padding: "6px 12px",
    fontSize: 14,
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  heading: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    color: "#2c3e50",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  scrollableList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    maxHeight: "400px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: 8,
  },
  requestCard: {
    backgroundColor: "#f9f9f9",
    borderLeft: "5px solid #3498db",
    padding: "16px 20px",
    borderRadius: 8,
    marginBottom: 12,
    marginLeft: 12,
    marginRight: 12,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
};

export default MessInchargeDashboard;
