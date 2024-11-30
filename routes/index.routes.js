const { Router } = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const fileRoutes = require('./file.routes');
const jobRoutes = require('./job.routes');
const { validJWTNeeded } = require('../middleware/jsonwebtoken');

const router = Router();

router.get('/welcome', (req, res) => {
  res.json({ message: 'Welcome to the Files Manager App' }).status(200);
});

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/files', validJWTNeeded, fileRoutes);
router.use('/jobs', jobRoutes);

module.exports = router;
