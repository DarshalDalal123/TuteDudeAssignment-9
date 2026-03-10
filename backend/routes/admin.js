const express = require("express");
const router = express.Router();
const { getDashboardStats, getAllVisitors } = require("../controllers/adminController");
const requireAuth = require("../middleware/requireAuth");

router.get("/dashboard-stats", requireAuth, getDashboardStats);
router.get("/getAllVisitors", requireAuth, getAllVisitors);

module.exports = router;