const express = require('express');
const router = express.Router();
const { securityDashboard, getAllVisitorsInside, getAllSecurities, updateCheckInOutTime, visitCheckLog } = require('../controllers/securityController');
const requireAuth = require('../middleware/requireAuth');

router.get('/dashboard', requireAuth, securityDashboard);
router.get('/getAllVisitorsInside', requireAuth, getAllVisitorsInside);
router.get('/getAllSecurities', requireAuth, getAllSecurities);
router.get('/visitCheckLog', requireAuth, visitCheckLog);
router.post('/updateCheckInOutTime/:qrCode', requireAuth, updateCheckInOutTime);

module.exports = router;