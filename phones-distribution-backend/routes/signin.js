app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);

  if (user && passwordMatches(password, user.password)) {
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});
