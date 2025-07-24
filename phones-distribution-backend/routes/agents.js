const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🟢 GET all agents with service names
router.get('/', (req, res) => {
  const query = `
    SELECT 
      a.agent_ID,
      a.nom ,
      a.prenom ,
      a.service , a.department,
      a.statut,
      s.name as service_name ,
      d.name as department_name,
      a.matricule,
      a.telephone
    FROM agents a
    LEFT JOIN services s ON a.service = s.service_ID
    LEFT JOIN departments d ON a.department = d.department_ID where a.statut=1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching agents with services:', err);
      return res.status(500).json({ error: 'Failed to retrieve agents' });
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  let { nom, service, prenom, matricule, department, telephone } = req.body;

  if (!nom || !prenom || !matricule || !department || !telephone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!service) {
    service = null; // Allow service to be optional
  }

  const query = 'INSERT INTO agents (nom, service, prenom, matricule, department, telephone) VALUES (?,?,?,?,?, ?)';
  db.query(query, [nom, service, prenom, matricule, department, telephone], (err, result) => {
    if (err) {
      console.error('Error adding agent:', err);
      return res.status(500).json({ error: 'Failed to add agent' });
    }

    res.status(201).json({ agent_ID: result.insertId, nom, service, prenom, matricule, department, telephone });
  });
});


// ✏️ Update an existing agent with service validation
router.put('/updateAgent', (req, res) => {
  let { agent_ID, nom, service, prenom, matricule, department, telephone } = req.body;
  if (!agent_ID || !nom || !prenom || !matricule || !department || !telephone) {
    return res.status(400).json({ error: 'All fields are required for update' });
  }
 if (!service) {
    service = null; // Allow service to be optional
  }
    const query = 'UPDATE agents SET nom = ?, service = ?, prenom =?, matricule=?, department=?, telephone=? WHERE agent_ID = ?';
    db.query(query, [nom, service, prenom, matricule, department, telephone, agent_ID], (err, result) => {
      if (err) {
        console.error('Update failed:', err);
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Agent not found' });
      }

      res.json({ message: 'Agent updated successfully' });
    });
  });


// 🗑️ Delete an agent
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE agents set statut=0 WHERE agent_ID = ?', [id], (err, result) => {
    if (err) {
      console.error(`❌ Error deleting agent ${id}:`, err);
      return res.status(500).json({ error: 'Failed to delete agent' });
    }

    res.json({ message: 'Agent deleted successfully' });
  });
});

module.exports = router;
