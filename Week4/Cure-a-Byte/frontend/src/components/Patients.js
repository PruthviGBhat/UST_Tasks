import React, { useState, useEffect } from "react";
import { patientAPI } from "../api";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", dateOfBirth: "", gender: "male",
    bloodGroup: "", phone: "", email: "", address: "", emergencyContact: "", insuranceId: ""
  });

  const fetchPatients = async () => {
    try {
      const res = await patientAPI.getAll();
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientAPI.create(form);
      setShowModal(false);
      setForm({ firstName: "", lastName: "", dateOfBirth: "", gender: "male", bloodGroup: "", phone: "", email: "", address: "", emergencyContact: "", insuranceId: "" });
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await patientAPI.delete(id);
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2>Patients</h2>
          <button className="btn btn-success" onClick={() => setShowModal(true)}>Add Patient</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.firstName} {p.lastName}</td>
                <td>{p.dateOfBirth}</td>
                <td>{p.gender}</td>
                <td>{p.bloodGroup}</td>
                <td>{p.phone}</td>
                <td>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Patient</h3>
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
                <label>Date of Birth</label>
                <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Insurance ID</label>
                <input name="insuranceId" value={form.insuranceId} onChange={handleChange} />
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

export default Patients;