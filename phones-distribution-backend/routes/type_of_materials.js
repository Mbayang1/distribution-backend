const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🟢 GET all types
router.get('/', (req, res) => {
  db.query('SELECT * FROM type_of_materials', (err, results) => {
    if (err) {
      console.error('Error fetching type_of_materials:', err);
      return res.status(500).json({ error: 'Failed to retrieve type_of_materials' });
    }
    res.json(results);
  });
});

// ➕ Add a new type
router.post('/', (req, res) => {
  const { name,description} = req.body;
  if (!name) {
    return res.status(400).json({ error: 'All information is required' });
  }

  const query = 'INSERT INTO type_of_materials (name,description) VALUES (?,?)';
  db.query(query, [name,description], (err, result) => {
    if (err) {
      console.error('Error adding type:', err);
      return res.status(500).json({ error: 'Failed to add type' });
    }

    res.status(201).json({ type_ID: result.insertId, description,name });
  });
});

// ✏️ Update an existing type
router.put('/updatetype', (req, res) => {
  const { type_ID,name, description} = req.body;

  const query = 'UPDATE type_of_materials SET name = ? , description=? WHERE type_ID = ?';
  db.query(query, [ name,description,type_ID], (err, result) => {
    if (err) {
      console.error('Update failed:', err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Type not found' });
    }

    res.json({ message: 'Type updated successfully' });
  });
});


// 🗑️ Delete a type
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM type_of_materials WHERE type_ID = ?', [id], (err, result) => {
    if (err) {
      console.error(`❌ Error deleting type ${id}:`, err);
      return res.status(500).json({ error: 'Failed to delete type' });
    }

    res.json({ message: 'Type deleted successfully' });
  });
});

module.exports = router;
