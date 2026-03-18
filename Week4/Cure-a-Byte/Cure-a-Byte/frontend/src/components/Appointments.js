import React, { useState, useEffect } from "react";
import { appointmentAPI, doctorAPI, patientAPI } from "../api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "",
    type: "consultation", reason: ""
  });

  const fetchData = async () => {
    try {
      const [apptRes, docRes, patRes] = await Promise.allSettled([
        appointmentAPI.getAll(),
        doctorAPI.getAll(),
        patientAPI.getAll(),
      ]);
      if (apptRes.status === "fulfilled") setAppointments(apptRes.value.data);
      if (docRes.status === "fulfilled") setDoctors(docRes.value.data);
      if (patRes.status === "fulfilled") setPatients(patRes.value.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentAPI.create(form);
      setShowModal(false);
      setForm({ patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "", type: "consultation", reason: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await appointmentAPI.updateStatus(id, status);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await appointmentAPI.delete(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getDoctorName = (id) => {
    const doc = doctors.find((d) => d.id === id);
    return doc ? `${doc.firstName} ${doc.lastName}` : id?.substring(0, 8);
  };

  const getPatientName = (id) => {
    const pat = patients.find((p) => p.id === id);
    return pat ? `${pat.firstName} ${pat.lastName}` : id?.substring(0, 8);
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2>Appointments</h2>
          <button className="btn btn-success" onClick={() => setShowModal(true)}>New Appointment</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{getPatientName(a.patientId)}</td>
                <td>{getDoctorName(a.doctorId)}</td>
                <td>{a.appointmentDate}</td>
                <td>{a.appointmentTime}</td>
                <td>{a.type}</td>
                <td><span className={`status-badge status-${a.status}`}>{a.status}</span></td>
                <td>
                  <div className="actions">
                    <button className="btn btn-success btn-small" onClick={() => handleStatusChange(a.id, "completed")}>Complete</button>
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(a.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>New Appointment</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient</label>
                <select name="patientId" value={form.patientId} onChange={handleChange} required>
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.firstName} {d.lastName} - {d.specialization}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input name="appointmentDate" type="date" value={form.appointmentDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input name="appointmentTime" type="time" value={form.appointmentTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="consultation">Consultation</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="emergency">Emergency</option>
                  <option value="routine_checkup">Routine Checkup</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea name="reason" value={form.reason} onChange={handleChange} />
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-primary">Book</button>
                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;