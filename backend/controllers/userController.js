const db = require('../config/db.json');

exports.getUserData = (req, res) => {
  const { userId } = req.params;
  const user = db.users.find(u => u.id === userId);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).json({ message: 'User not found' });
  }
};
