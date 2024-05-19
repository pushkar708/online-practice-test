const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model

// @route POST api/users/signup
// @desc Register user
router.post('/signup', (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const newUser = new User({ email, password });

  newUser.save()
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
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
