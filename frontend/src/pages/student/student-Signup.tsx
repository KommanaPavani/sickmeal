import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentSignup = () => {
  const [registerNumber, setRegisterNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

 const emailRegex = /^22b01a\d{4}@svecw\.edu\.in$/;
  if (!emailRegex.test(email)) {
    alert("Email must be a valid SVECW address (e.g., 22b01a0593@svecw.edu.in)");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/student/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registerNumber, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful");
      navigate("/student-login");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Signup failed");
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
        <span onClick={() => navigate("/student-login")}>Login</span>
      </p>
    </div>
  );
};

export default StudentSignup;
