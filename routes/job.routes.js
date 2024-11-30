const express = require('express');
const { getJobStatus } = require('../controllers/jobController');

const router = express.Router();

router.get('/:jobId', getJobStatus);

module.exports = router;
