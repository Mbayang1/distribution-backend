const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const router = express.Router();
const secretKey = 'yourSecretKey';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'materials_tracking'
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).send('User not found');

    const user = results[0];
    const isValid = bcrypt.compareSync(password, user.password_hash);

    if (!isValid) return res.status(401).send('Invalid password');

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  });
});

module.exports = router;

