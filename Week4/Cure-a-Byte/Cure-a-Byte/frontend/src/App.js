import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Doctors from "./components/Doctors";
import Patients from "./components/Patients";
import Appointments from "./components/Appointments";
import Pharmacy from "./components/Pharmacy";
import Labs from "./components/Labs";

function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    if (authPage === "login") {
      return <Login onLogin={handleLogin} switchToRegister={() => setAuthPage("register")} />;
    }
    return <Register onLogin={handleLogin} switchToLogin={() => setAuthPage("login")} />;
  }

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h2>Healthcare Platform</h2>
          <div className="navbar-links">
            <Link to="/">Dashboard</Link>
            <Link to="/doctors">Doctors</Link>
            <Link to="/patients">Patients</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/pharmacy">Pharmacy</Link>
            <Link to="/labs">Labs</Link>
            <span style={{ fontSize: 14 }}>{user.username} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;