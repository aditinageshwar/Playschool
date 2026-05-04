const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const controller = require("../controllers/applicationController");

router.post("/send", controller.sendApplication);
router.get("/all", auth, role("teacher"), controller.getAllApplications);
router.patch("/status/:id", controller.updateStatus);

module.exports = router;
