const { configDotenv } = require('dotenv');
const jwt = require('jsonwebtoken');
const { env } = require('node:process');

configDotenv();
const validJWTNeeded = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      const secret = env.JWT_SECRET || 'secret';
      const authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        req.user = jwt.verify(authorization[1], secret);
        return next();
      }
    } catch (err) {
      return res.status(403).json({ message: 'Unauthorized' }, err);
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { validJWTNeeded };
