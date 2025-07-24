const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔍 Get all distributions
router.get('/', (req, res) => {
  const query = `
    SELECT 
      dist.id,
      dist.agent,
      dist.material,
      dist.department,
      dist.service,
      a.prenom, 
      a.nom, 
      a.telephone,
      m.name AS material_name, 
      m.description, 
      dist.quantity,
      dept.name AS department_name,
      s.name AS service_name,
      DATE_FORMAT(dist.assigned_date, '%Y-%m-%d') AS assigned_date,
      dist.notes,
      t.name AS type_name,
      dist.date_return,
      dist.commentaire
    FROM distributions dist
    LEFT JOIN agents a ON dist.agent = a.agent_ID
    LEFT JOIN materials m ON dist.material = m.material_ID
    LEFT JOIN type_of_materials t ON t.type_ID = m.type
    LEFT JOIN departments dept ON dist.department = dept.department_ID
    LEFT JOIN services s ON dist.service = s.service_ID
    WHERE dist.statut = 1;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching distributions:', err);
      return res.status(500).json({ error: 'Failed to retrieve distributions' });
    }
    res.json(results);
  });
});

// ➕ Add a new distribution
router.post('/', (req, res) => {
  let { agent, material, department, service, assigned_date, notes, quantity } = req.body;

  if (!agent) agent = null;
  if (!department) department = null;
  if (!service) service = null;

  const query = `
    INSERT INTO distributions (agent, material, department, service, assigned_date, notes, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [agent, material, department, service, assigned_date, notes, quantity], (err, result) => {
    if (err) {
      console.error('Error adding distribution:', err);
      return res.status(500).json({ error: 'Failed to add distribution' });
    }
    res.status(201).json({ id: result.insertId, agent, material, department, service, assigned_date, notes });
  });
});



// ✏️ Update distribution
router.put('/updateDistribution', (req, res) => {
  let { id, agent, material, department, service, assigned_date, notes, quantity,commentaire,date_return } = req.body;

  if (!agent || agent === 'null') agent = null;
  if (!department || department === 'null') department = null;
  if (!service || service === 'null') service = null;

  const query = `
    UPDATE distributions
    SET agent = ?, material = ?, department = ?, service = ?, assigned_date = ?, notes = ?, quantity = ?, date_return =?,commentaire= ? WHERE id = ?
  `;
  db.query(query, [agent, material, department, service, assigned_date, notes, quantity,date_return,commentaire, id], (err, result) => {
    if (err) {
      console.error('Update failed:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Distribution not found' });
    }
    res.json({ message: 'Distribution updated successfully' });
  });
});

// 🗑️ Soft delete
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE distributions SET statut = 0 WHERE id = ?', [id], (err) => {
    if (err) {
      console.error(`Error deleting distribution ${id}:`, err);
      return res.status(500).json({ error: 'Failed to delete distribution' });
    }
    res.json({ message: 'Distribution deleted successfully' });
  });
});

module.exports = router;
