import React, { useState, useEffect } from "react";
import { doctorAPI } from "../api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", specialization: "", licenseNumber: "",
    phone: "", email: "", department: "", yearsOfExperience: 0, consultationFee: 0
  });

  const fetchDoctors = async () => {
    try {
      const res = await doctorAPI.getAll();
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doctorAPI.create(form);
      setShowModal(false);
      setForm({ firstName: "", lastName: "", specialization: "", licenseNumber: "", phone: "", email: "", department: "", yearsOfExperience: 0, consultationFee: 0 });
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await doctorAPI.delete(id);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2>Doctors</h2>
          <button className="btn btn-success" onClick={() => setShowModal(true)}>Add Doctor</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Department</th>
              <th>License</th>
              <th>Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id}>
                <td>{d.firstName} {d.lastName}</td>
                <td>{d.specialization}</td>
                <td>{d.department}</td>
                <td>{d.licenseNumber}</td>
                <td>${d.consultationFee}</td>
                <td>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Doctor</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input name="specialization" value={form.specialization} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>License Number</label>
                <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input name="department" value={form.department} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Years of Experience</label>
                <input name="yearsOfExperience" type="number" value={form.yearsOfExperience} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Consultation Fee</label>
                <input name="consultationFee" type="number" step="0.01" value={form.consultationFee} onChange={handleChange} />
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;