const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Expect "Authorization: Bearer <token>"
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded; // { id, username, iat, exp }
    next();
  });
};