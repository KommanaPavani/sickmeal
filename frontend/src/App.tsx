import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import SLogin from "./pages/student/student-login";
import WLogin from "./pages/warden/warden-login";
import MLogin from "./pages/mess incharge/messincharge-login";
import ALogin from "./pages/admin/admin-login";
import StudentSignup from "./pages/student/student-Signup";
import WardenSignup from "./pages/warden/warden-signup";
import StudentDashboard from "./pages/student/studentdashboard";
import WardenDashboard   from "./pages/warden/warden-dashboard";
import MessInchargeDashboard from "./pages/mess incharge/mess-inchargedashboard";
import AdminDashboard from "./pages/admin/admindashboard";
import CreateRequestPage from "./pages/student/studentrequest";
import StudentProfile from "./pages/student/studentprofile";
import WardenProfile from "./pages/warden/warden-profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/student-login" element={<SLogin />} />
        <Route path="/warden-login" element={<WLogin />} />
        <Route path="/admin-login" element={<ALogin />} />
        <Route path="/mess-login" element={<MLogin />} />
        <Route path="/stsignup" element={<StudentSignup />} />
        <Route path="/wsignup" element={<WardenSignup />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/warden-dashboard" element={<WardenDashboard />} />
        <Route path="/mess-dashboard" element={<MessInchargeDashboard />} />
         <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/create-request" element={<CreateRequestPage/>} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/warden-profile" element={<WardenProfile />} />
         
      </Routes>
    </Router>
  );
}

export default App;
