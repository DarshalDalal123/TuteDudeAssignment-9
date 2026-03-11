const express = require('express');
const router = express.Router();
const { employeeDashboardStats, getAllVisitorsByEmployeeID, visitorRequestChangeStatus, getUpcomingVisitorsByEmployeeID } = require('../controllers/employeeController');
const requireAuth = require("../middleware/requireAuth");

router.get("/dashboard-stats", requireAuth, employeeDashboardStats);
router.get("/upcoming-visitors", requireAuth, getUpcomingVisitorsByEmployeeID);
router.get("/getAllVisitors", requireAuth, getAllVisitorsByEmployeeID);
router.put("/visitor-request/:appointmentId", requireAuth, visitorRequestChangeStatus);

module.exports = router;