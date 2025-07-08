import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateRequestPage: React.FC = () => {
  const [name, setName] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [healthIssue, setHealthIssue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in. Please login first.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/request",
        {
          name,
          hostelName,
          roomNo,
          healthIssue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      setName("");
      setHostelName("");
      setRoomNo("");
      setHealthIssue("");
      navigate("/studentdashboard");
    } catch (error: any) {
      console.error("Error submitting request:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      style={{
        maxWidth: 5000,
        margin: "80px auto",
        padding: 60,
        border: "3px solid #ccc",
        borderRadius: 8,
      }}
    >  <div
        className="logo"
        onClick={() => navigate("/studentdashboard")}
        style={{ cursor: "pointer" }}
      >
        dashboard
      </div>
      <h2 style={{ textAlign: "center", marginBottom: 30, fontSize: "40px" }}>Create Request</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",    // Full width to container
            maxWidth: 1400,    // Slightly wider than before
            marginBottom: 18,
            padding: 10,
            fontSize: 16,
          }}
        />
        <input
          type="text"
          placeholder="Hostel Name"
          value={hostelName}
          onChange={(e) => setHostelName(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            maxWidth: 650,
            marginBottom: 16,
            padding: 10,
            fontSize: 16,
          }}
        />
        <input
          type="text"
          placeholder="Room Number"
          value={roomNo}
          onChange={(e) => setRoomNo(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            maxWidth: 650,
            marginBottom: 14,
            padding: 10,
            fontSize: 16,
          }}
        />
        <textarea
          placeholder="Health Issue"
          value={healthIssue}
          onChange={(e) => setHealthIssue(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            maxWidth: 650,
            marginBottom: 12,
            padding: 10,
            fontSize: 16,
            height: 100,
            resize: "vertical",
          }}
        />
        <button
          type="submit"
          style={{
            display: "block",
            width: "100%",
            maxWidth: 650,
            padding: "10px 0",
            fontSize: 18,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default CreateRequestPage;
