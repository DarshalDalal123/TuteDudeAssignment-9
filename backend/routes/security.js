const express = require('express');
const router = express.Router();
const { getAllSecurities } = require('../controllers/securityController');
const requireAuth = require('../middleware/requireAuth');

router.get('/getAllSecurities', requireAuth, getAllSecurities);

module.exports = router;