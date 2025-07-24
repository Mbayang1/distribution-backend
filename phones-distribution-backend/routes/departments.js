const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🟢 GET all departments
router.get('/', (req, res) => {
  db.query('SELECT * FROM departments where statut=1', (err, results) => {
    if (err) {
      console.error('Error fetching departments:', err);
      return res.status(500).json({ error: 'Failed to retrieve departments' });
    }
    res.json(results);
  });
});

// ➕ Add a new department
router.post('/', (req, res) => {
  const { name,description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Department name is required' });
  }

  const query = 'INSERT INTO departments (name,description) VALUES (?,?)';
  db.query(query, [name,description], (err, result) => {
    if (err) {
      console.error('Error adding department:', err);
      return res.status(500).json({ error: 'Failed to add department' });
    }

    res.status(201).json({ department_ID: result.insertId, name });
  });
});

// ✏️ Update an existing department
router.put('/updateDepartement', (req, res) => {
  const { department_ID, name,description} = req.body;

  const query = 'UPDATE departments SET name = ? ,description=? WHERE department_ID = ?';
  db.query(query, [ name,description,department_ID], (err, result) => {
    if (err) {
      console.error('Update failed:', err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department updated successfully' });
  });
});


// 🗑️ Delete a department
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('update departments set statut=0 WHERE department_ID = ?', [id], (err, result) => {
    if (err) {
      console.error(`❌ Error deleting department ${id}:`, err);
      return res.status(500).json({ error: 'Failed to delete department' });
    }

    res.json({ message: 'Department deleted successfully' });
  });
});

module.exports = router;
