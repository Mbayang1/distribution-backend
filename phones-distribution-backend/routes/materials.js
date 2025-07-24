const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🟢 GET all materials with type names
router.get('/', (req, res) => {
  const query = `
    SELECT 
      m.material_ID,
      m.name,
      m.statut, m.description, m.quantity, m.type, m.statut,
      t.name AS type_name
    FROM materials m
    LEFT JOIN type_of_materials t ON m.type = t.type_ID where m.statut=1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching materials with types:', err);
      return res.status(500).json({ error: 'Failed to retrieve types' });
    }
    res.json(results);
  });
});

// ➕ Add a new material with type validation
router.post('/', (req, res) => {
  const {name, description, quantity, type } = req.body;
  if (!name || !description || !quantity || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

   

    const query = 'INSERT INTO materials (name, description, quantity, type) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, quantity, type], (err, result) => {
      if (err) {
        console.error('Error adding material:', err);
        return res.status(500).json({ error: 'Failed to add material' });
      }

      res.status(201).json({ material_ID: result.insertId, name, description, quantity, type });
    });
  });


// ✏️ Update an existing material with type validation
router.put('/updateMaterial', (req, res) => {
  const { material_ID, name, description, quantity, type } = req.body;
  if ( !material_ID || !name || !description || !quantity || !type) {
    return res.status(400).json({ error: 'All fields are required for update' });
  }

    const query = 'UPDATE materials SET name = ?, description = ?, quantity=?, type=? WHERE material_ID = ?';
    db.query(query, [name, description, quantity, type, material_ID ], (err, result) => {
      if (err) {
        console.error('Update failed:', err);
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Material not found' });
      }

      res.json({ message: 'Material updated successfully' });
    });
  });


// 🗑️ Delete a material
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE materials set statut=0 WHERE material_ID = ?', [id], (err, result) => {
    if (err) {
      console.error(`❌ Error deleting material ${id}:`, err);
      return res.status(500).json({ error: 'Failed to delete material' });
    }

    res.json({ message: 'Material deleted successfully' });
  });
});

module.exports = router;
