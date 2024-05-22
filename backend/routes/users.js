const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
var bcrypt = require('bcryptjs');

// @route POST api/users/signup
// @desc Register user
router.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user exists
  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const newUser = new User({ email, password });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }
    
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, email: user.email };
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({ token: 'dummy-token' });
          
        });
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
    });
  });
});

module.exports = router;
