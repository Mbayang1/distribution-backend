const express = require('express');
const router = express.Router();
const db = require('../config/db'); // assuming it's a mysql2 connection

router.get('/stats', async (req, res) => {
  try {
    const [agentRows] = await db.promise().query('SELECT COUNT(*) AS count FROM agents');
    const [materialRows] = await db.promise().query('SELECT COUNT(*) AS count FROM materials');
    const [serviceRows] = await db.promise().query('SELECT COUNT(*) AS count FROM services');
    const [distributionRows] = await db.promise().query('SELECT COUNT(*) AS count FROM distributions');

    res.json({
      total_agents: agentRows[0].count,
      available_materials: materialRows[0].count,
      total_services: serviceRows[0].count,
      total_distributions: distributionRows[0].count,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
