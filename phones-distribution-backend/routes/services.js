const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🟢 GET all services with department names
router.get('/', (req, res) => {
  const query = `
    SELECT 
      s.service_ID,
      s.name ,
      s.department AS department_ID,
      d.name AS department_name
    FROM services s
    LEFT JOIN departments d ON s.department = d.department_ID where s.statut=1 and d.statut=1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching services with departments:', err);
      return res.status(500).json({ error: 'Failed to retrieve services' });
    }
    res.json(results);
  });
});

// ➕ Add a new service with department validation
router.post('/', (req, res) => {
  const { name, department } = req.body;
  if (!name || !department) {
    return res.status(400).json({ error: 'Service name and department ID are required' });
  }

   

    const query = 'INSERT INTO services (name, department) VALUES (?, ?)';
    db.query(query, [name, department], (err, result) => {
      if (err) {
        console.error('Error adding service:', err);
        return res.status(500).json({ error: 'Failed to add service' });
      }

      res.status(201).json({ service_ID: result.insertId, name });
    });
  });


// ✏️ Update an existing service with department validation
router.put('/updateService', (req, res) => {
  const { service_ID, name, department } = req.body;
  if (!service_ID || !name || !department) {
    return res.status(400).json({ error: 'All fields are required for update' });
  }

    const query = 'UPDATE services SET name = ?, department = ? WHERE service_ID = ?';
    db.query(query, [name, department, service_ID], (err, result) => {
      if (err) {
        console.error('Update failed:', err);
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Service not found' });
      }

      res.json({ message: 'Service updated successfully' });
    });
  });


// 🗑️ Delete a service
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('update  services set statut=0 WHERE service_ID = ?', [id], (err, result) => {
    if (err) {
      console.error(`❌ Error deleting services ${id}:`, err);
      return res.status(500).json({ error: 'Failed to delete department' });
    }

    res.json({ message: 'services deleted successfully' });
  });
});
module.exports = router;
