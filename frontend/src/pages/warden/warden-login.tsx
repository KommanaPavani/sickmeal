import { useState } from "react";
import { useNavigate } from "react-router-dom";

const WLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/warden/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        localStorage.setItem("wardenToken", data.token); // save token (optional)
        navigate("/warden-dashboard"); // navigate to warden dashboard or home page
      } else {
        alert(data.message || "Login failed");
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
      <h2>Login</h2>
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
      </form>
      <p>
        Don't have an account?{" "}
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/wsignup")}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default WLogin;
