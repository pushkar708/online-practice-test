const express = require('express');
const router = express.Router();
const db = require('../config/db.json');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

// User login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// User signup
router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const existingUser = db.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = {
    id: db.users.length + 1,
    email,
    password: hashedPassword,
    role: 'user', // default role
    quizzes: []
  };
  db.users.push(newUser);
  fs.writeFileSync('./config/db.json', JSON.stringify(db));
  res.status(201).json({ message: 'User created successfully' });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  });
};

module.exports = { router, verifyToken };
