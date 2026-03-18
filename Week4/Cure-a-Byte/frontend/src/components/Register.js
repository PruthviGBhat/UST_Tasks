import React, { useState } from "react";
import { authAPI } from "../api";

function Register({ onLogin, switchToLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "patient" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authAPI.register(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="lab_tech">Lab Technician</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      <p className="link-text">
        Have an account? <a href="#login" onClick={switchToLogin}>Login</a>
      </p>
    </div>
  );
}

export default Register;