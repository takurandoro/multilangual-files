const { Router } = require('express');
const {
  loginUser,
  getNewAccessToken,
} = require('../controllers/userController');
const router = Router();

router.route('/').post(loginUser);
router.route('/token').post(getNewAccessToken);
module.exports = router;
