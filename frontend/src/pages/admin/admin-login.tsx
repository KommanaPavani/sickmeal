import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ALogin = () => {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const credentials = [
      { email: "svecw@gmail.com", password: "sickmeal" },
      
    ];

    const isValid = credentials.some(
      (cred) => cred.email === email && cred.password === password
    );

    if (isValid) {
      navigate("/admin-dashboard"); // Replace with your actual dashboard route
    } else {
      setError("Invalid email or password.");
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
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default ALogin;
