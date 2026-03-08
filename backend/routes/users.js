const express = require("express");
const router = express.Router();
const { login, signup, getUserProfile, getAllEmployees } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

router.post("/signup", requireAuth, signup);

router.post("/login", login);

router.get("/allemployees", requireAuth, getAllEmployees);

router.get("/getuser", requireAuth, getUserProfile);

module.exports = router;