import React, { useState, useEffect } from "react";
import { doctorAPI, patientAPI, appointmentAPI, pharmacyAPI, labAPI } from "../api";

function Dashboard() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, medications: 0, labTests: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [doctors, patients, appointments, medications, labTests] = await Promise.allSettled([
          doctorAPI.getAll(),
          patientAPI.getAll(),
          appointmentAPI.getAll(),
          pharmacyAPI.getMedications(),
          labAPI.getTests(),
        ]);
        setStats({
          doctors: doctors.status === "fulfilled" ? doctors.value.data.length : 0,
          patients: patients.status === "fulfilled" ? patients.value.data.length : 0,
          appointments: appointments.status === "fulfilled" ? appointments.value.data.length : 0,
          medications: medications.status === "fulfilled" ? medications.value.data.length : 0,
          labTests: labTests.status === "fulfilled" ? labTests.value.data.length : 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.doctors}</h3>
          <p>Doctors</p>
        </div>
        <div className="stat-card">
          <h3>{stats.patients}</h3>
          <p>Patients</p>
        </div>
        <div className="stat-card">
          <h3>{stats.appointments}</h3>
          <p>Appointments</p>
        </div>
        <div className="stat-card">
          <h3>{stats.medications}</h3>
          <p>Medications</p>
        </div>
        <div className="stat-card">
          <h3>{stats.labTests}</h3>
          <p>Lab Tests</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;