import React, { useState, useEffect } from "react";
import { labAPI } from "../api";

function Labs() {
  const [tests, setTests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "blood", description: "", price: 0,
    turnaroundTime: "", requiresFasting: false
  });

  const fetchData = async () => {
    try {
      const [testsRes, ordersRes] = await Promise.allSettled([
        labAPI.getTests(),
        labAPI.getOrders(),
      ]);
      if (testsRes.status === "fulfilled") setTests(testsRes.value.data);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await labAPI.createTest(form);
      setShowModal(false);
      setForm({ name: "", category: "blood", description: "", price: 0, turnaroundTime: "", requiresFasting: false });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await labAPI.deleteTest(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2>Lab Tests</h2>
          <button className="btn btn-success" onClick={() => setShowModal(true)}>Add Test</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Turnaround</th>
              <th>Fasting</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.category}</td>
                <td>${t.price}</td>
                <td>{t.turnaroundTime}</td>
                <td>{t.requiresFasting ? "Yes" : "No"}</td>
                <td>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 16 }}>Lab Orders</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Result</th>
                <th>Abnormal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id.substring(0, 8)}</td>
                  <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                  <td>{o.priority}</td>
                  <td>{o.result || "-"}</td>
                  <td>{o.abnormalFlag ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Lab Test</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Test Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="blood">Blood</option>
                  <option value="urine">Urine</option>
                  <option value="imaging">Imaging</option>
                  <option value="pathology">Pathology</option>
                  <option value="microbiology">Microbiology</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Turnaround Time</label>
                <input name="turnaroundTime" value={form.turnaroundTime} onChange={handleChange} placeholder="e.g., 24 hours" />
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

export default Labs;