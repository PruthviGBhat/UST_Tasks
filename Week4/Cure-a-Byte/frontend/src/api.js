import axios from "axios";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const authAPI = {
  login: (data) => axios.post("/api/auth/login", data),
  register: (data) => axios.post("/api/auth/register", data),
  verify: () => axios.get("/api/auth/verify", getHeaders()),
  profile: () => axios.get("/api/auth/profile", getHeaders()),
};

export const doctorAPI = {
  getAll: () => axios.get("/api/doctors", getHeaders()),
  getById: (id) => axios.get(`/api/doctors/${id}`, getHeaders()),
  create: (data) => axios.post("/api/doctors", data, getHeaders()),
  update: (id, data) => axios.put(`/api/doctors/${id}`, data, getHeaders()),
  delete: (id) => axios.delete(`/api/doctors/${id}`, getHeaders()),
};

export const patientAPI = {
  getAll: () => axios.get("/api/patients", getHeaders()),
  getById: (id) => axios.get(`/api/patients/${id}`, getHeaders()),
  create: (data) => axios.post("/api/patients", data, getHeaders()),
  update: (id, data) => axios.put(`/api/patients/${id}`, data, getHeaders()),
  delete: (id) => axios.delete(`/api/patients/${id}`, getHeaders()),
};

export const appointmentAPI = {
  getAll: () => axios.get("/api/appointments", getHeaders()),
  getById: (id) => axios.get(`/api/appointments/${id}`, getHeaders()),
  create: (data) => axios.post("/api/appointments", data, getHeaders()),
  update: (id, data) => axios.put(`/api/appointments/${id}`, data, getHeaders()),
  updateStatus: (id, status) => axios.patch(`/api/appointments/${id}/status`, { status }, getHeaders()),
  delete: (id) => axios.delete(`/api/appointments/${id}`, getHeaders()),
};

export const pharmacyAPI = {
  getMedications: () => axios.get("/api/pharmacy/medications", getHeaders()),
  createMedication: (data) => axios.post("/api/pharmacy/medications", data, getHeaders()),
  updateMedication: (id, data) => axios.put(`/api/pharmacy/medications/${id}`, data, getHeaders()),
  deleteMedication: (id) => axios.delete(`/api/pharmacy/medications/${id}`, getHeaders()),
  getOrders: () => axios.get("/api/pharmacy/orders", getHeaders()),
  createOrder: (data) => axios.post("/api/pharmacy/orders", data, getHeaders()),
};

export const labAPI = {
  getTests: () => axios.get("/api/labs/tests", getHeaders()),
  createTest: (data) => axios.post("/api/labs/tests", data, getHeaders()),
  updateTest: (id, data) => axios.put(`/api/labs/tests/${id}`, data, getHeaders()),
  deleteTest: (id) => axios.delete(`/api/labs/tests/${id}`, getHeaders()),
  getOrders: () => axios.get("/api/labs/orders", getHeaders()),
  createOrder: (data) => axios.post("/api/labs/orders", data, getHeaders()),
  updateOrderResult: (id, data) => axios.patch(`/api/labs/orders/${id}/result`, data, getHeaders()),
};