const { Router } = require('express');
const { validJWTNeeded } = require('../middleware/jsonwebtoken');
const { getAllUsers, createUser } = require('../controllers/userController');
const { validateRegistration } = require('../middleware/validators');

const router = Router();

router
  .route('/')
  .get(validJWTNeeded, getAllUsers)
  .post(validateRegistration, createUser);

module.exports = router;
