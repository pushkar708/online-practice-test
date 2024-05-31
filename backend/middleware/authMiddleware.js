const db = require('../config/db.json');

const isAdmin = (req, res, next) => {
  const user = db.users.find(u => u.id === req.body.userId);
  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = { isAdmin };
