const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    console.error('Error checking user role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { isAdmin };
