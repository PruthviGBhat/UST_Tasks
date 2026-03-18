import React, { useState, useEffect } from "react";
import { pharmacyAPI } from "../api";

function Pharmacy() {
  const [medications, setMedications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "", genericName: "", manufacturer: "", category: "",
    dosageForm: "tablet", strength: "", price: 0, stockQuantity: 0,
    reorderLevel: 10, expiryDate: "", requiresPrescription: true
  });

  const fetchMedications = async () => {
    try {
      const res = await pharmacyAPI.getMedications();
      setMedications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchMedications(); }, []);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pharmacyAPI.createMedication(form);
      setShowModal(false);
      setForm({ name: "", genericName: "", manufacturer: "", category: "", dosageForm: "tablet", strength: "", price: 0, stockQuantity: 0, reorderLevel: 10, expiryDate: "", requiresPrescription: true });
      fetchMedications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pharmacyAPI.deleteMedication(id);
      fetchMedications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2>Pharmacy - Medications</h2>
          <button className="btn btn-success" onClick={() => setShowModal(true)}>Add Medication</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Generic</th>
              <th>Form</th>
              <th>Strength</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rx Required</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.genericName}</td>
                <td>{m.dosageForm}</td>
                <td>{m.strength}</td>
                <td>${m.price}</td>
                <td style={{ color: m.stockQuantity <= m.reorderLevel ? "red" : "inherit" }}>{m.stockQuantity}</td>
                <td>{m.requiresPrescription ? "Yes" : "No"}</td>
                <td>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(m.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Medication</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Generic Name</label>
                <input name="genericName" value={form.genericName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Manufacturer</label>
                <input name="manufacturer" value={form.manufacturer} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input name="category" value={form.category} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Dosage Form</label>
                <select name="dosageForm" value={form.dosageForm} onChange={handleChange}>
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="syrup">Syrup</option>
                  <option value="injection">Injection</option>
                  <option value="cream">Cream</option>
                  <option value="drops">Drops</option>
                  <option value="inhaler">Inhaler</option>
                </select>
              </div>
              <div className="form-group">
                <label>Strength</label>
                <input name="strength" value={form.strength} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
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

export default Pharmacy;