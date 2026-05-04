const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const attendanceController = require("../controllers/attendanceController");

router.get("/list", auth, role("teacher"), attendanceController.getStudentsForAttendance);
router.post("/bulkSubmit", auth, role("teacher"), attendanceController.submitBulkAttendance);
router.get("/:email", attendanceController.getAttendance);
module.exports = router;