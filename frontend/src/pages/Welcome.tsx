import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container" >
      <div className="logo">SickMeals</div>
      <div className="login-container">
        <div className="login-box" onClick={() => navigate("/student-login")}>
          Student Login
        </div>
        <div className="login-box" onClick={() => navigate("/warden-login")}>
          Warden Login
        </div>
        <div className="login-box" onClick={() => navigate("/admin-login")}>
          Admin Login
        </div>
        <div className="login-box" onClick={() => navigate("/mess-login")}>
          Mess In-Charge Login
        </div>
      </div>
    </div>
  );
};

export default Welcome;
