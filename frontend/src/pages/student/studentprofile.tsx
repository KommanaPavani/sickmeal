import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setStudentName(data.name || "");
        setStudentId(data.registerNumber || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phoneNumber || "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    const payload: any = {
      name: studentName,
      phoneNumber,
    };

    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const res = await axios.put(
      "http://localhost:5000/api/student/profile",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data?.message === "Profile updated") {
      setMessage("✅ Profile updated successfully!");
      setIsEditing(false);
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setMessage("❌ Unexpected response");
    }
  } catch (err: any) {
    console.error("Failed to update profile:", err);
    const errorMessage = err.response?.data?.message || "Update failed";
    setMessage(`❌ ${errorMessage}`);
  }
};


  const handleCancel = () => {
    setIsEditing(false);
    setCurrentPassword("");
    setNewPassword("");
    window.location.reload();
  };

  const handleBack = () => {
    navigate("/studentdashboard");
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 10,
        fontFamily: "Segoe UI, sans-serif",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        background: "#fefefe",
      }}
    >
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>👤 Student Profile</h1>

      {message && (
        <div style={{ marginBottom: 12, color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </div>
      )}

      {isEditing ? (
        <>
          <InputField label="Name" value={studentName} setValue={setStudentName} />
          <InputField label="Student ID" value={studentId} setValue={setStudentId} disabled />
          <InputField label="Email" value={email} setValue={setEmail} disabled />
          <InputField label="Phone Number" value={phoneNumber} setValue={setPhoneNumber} />

          <hr style={{ margin: "20px 0" }} />
          <h3>🔐 Change Password</h3>
          <InputField
            label="Current Password"
            value={currentPassword}
            setValue={setCurrentPassword}
            type="password"
          />
          <InputField
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
            type="password"
          />

          <div style={{ marginTop: 20 }}>
            <button
              onClick={handleSave}
              style={{ ...buttonStyle, backgroundColor: "#28a745" }}
            >
              💾 Save
            </button>
            <button
              onClick={handleCancel}
              style={{ ...buttonStyle, backgroundColor: "#dc3545", marginLeft: 10 }}
            >
              ❌ Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={infoStyle}><strong>Name:</strong> {studentName}</div>
          <div style={infoStyle}><strong>Student ID:</strong> {studentId}</div>
          <div style={infoStyle}><strong>Email:</strong> {email}</div>
          <div style={infoStyle}><strong>Phone Number:</strong> {phoneNumber}</div>

          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{ ...buttonStyle, backgroundColor: "#ffc107" }}
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={handleBack}
              style={{ ...buttonStyle, marginLeft: 10 }}
            >
              ← Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// 👇 Reusable Input Field Component
const InputField = ({
  label,
  value,
  setValue,
  disabled = false,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  type?: string;
}) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", marginBottom: 4 }}>
      <strong>{label}:</strong>
    </label>
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => setValue(e.target.value)}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 4,
        border: "1px solid #ccc",
        fontSize: 14,
        backgroundColor: disabled ? "#f5f5f5" : "#fff",
      }}
    />
  </div>
);

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const infoStyle: React.CSSProperties = {
  marginBottom: 12,
};

export default StudentProfile;
