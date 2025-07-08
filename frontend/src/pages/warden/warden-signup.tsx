import { useState } from "react";
import { useNavigate } from "react-router-dom";

const WardenSignup = () => {
  const [registerNumber, setRegisterNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  const emailRegex = /^22b01w0\d{3}@svecw\.edu\.in$/;
  if (!emailRegex.test(email)) {
    alert("Email must be in format 22b01w0XXX@svecw.edu.in (e.g., 22b01w0401@svecw.edu.in)");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/warden/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registerNumber, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      navigate("/warden-login");
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (error) {
    alert("Server error. Please try again later.");
    console.error(error);
  }
};


  return (
    <div className="form-container">
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        SickMeals
      </div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Register Number"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/warden-login")} style={{ cursor: "pointer", color: "blue" }}>
          Login
        </span>
      </p>
    </div>
  );
};

export default WardenSignup;
