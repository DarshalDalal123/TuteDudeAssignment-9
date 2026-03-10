const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { preRegisterVisitor, getAllEmployees } = require("../controllers/visitorController");

router.post("/pre-register", upload.single("photo"), preRegisterVisitor);

router.get("/allemployees", getAllEmployees);

module.exports = router;