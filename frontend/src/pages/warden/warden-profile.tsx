import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WardenProfile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [wardenName, setWardenName] = useState("");
  const [wardenId, setWardenId] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");


  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/warden/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("wardenToken")}`, // Use actual token key
        },
      });
      const data = await res.json();
      setWardenName(data.name);
      setWardenId(data.registerNumber);
      setEmail(data.email);
      setContactNumber(data.contactNumber);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  fetchProfile();
}, []);


  const handleSave = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/warden/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("wardenToken")}`,
      },
      body: JSON.stringify({
        name: wardenName,
        contactNumber,
        currentPassword: currentPassword.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setIsEditing(false);
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
    } else {
      alert(data.message || "Update failed");
    }
  } catch (err) {
    console.error("Update failed:", err);
  }
};


  const handleBack = () => {
    navigate("/warden-dashboard");
  };
  const handleCancel = () => {
  setIsEditing(false);
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
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>🧑‍🏫 Warden Profile</h1>

      {isEditing ? (
        <>
          <InputField label="Name" value={wardenName} setValue={setWardenName} />
          <InputField label="Warden ID" value={wardenId} setValue={setWardenId} />
          <InputField label="Email" value={email} setValue={setEmail} />
          <InputField label="Contact Number" value={contactNumber} setValue={setContactNumber} />
          <InputField
  label="Current Password"
  value={currentPassword}
  setValue={setCurrentPassword}
/>
<InputField
  label="New Password"
  value={newPassword}
  setValue={setNewPassword}
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
          <div style={infoStyle}><strong>Name:</strong> {wardenName}</div>
          <div style={infoStyle}><strong>Warden ID:</strong> {wardenId}</div>
          <div style={infoStyle}><strong>Email:</strong> {email}</div>
          <div style={infoStyle}><strong>Contact:</strong> {contactNumber}</div>

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

const InputField = ({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", marginBottom: 4 }}>
      <strong>{label}:</strong>
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 4,
        border: "1px solid #ccc",
        fontSize: 14,
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

export default WardenProfile;
