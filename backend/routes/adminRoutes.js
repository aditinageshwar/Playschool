const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const studentAdminController = require("../controllers/studentAdminController");

// ==================== STUDENT ADMIN ROUTES ====================
router.get("/student-admin/dashboard-stats", auth, role("student-admin"), studentAdminController.getDashboardStats);

// ===== ADMISSIONS MANAGEMENT =====
router.get("/student-admin/admissions/pending", auth, role("student-admin"), studentAdminController.getPendingAdmissions);
router.get("/student-admin/admissions", auth, role("student-admin"), studentAdminController.getAllAdmissions);
router.post("/student-admin/admissions/:admissionId/approve", auth, role("student-admin"), studentAdminController.approveAdmission);
router.post("/student-admin/admissions/:admissionId/reject", auth, role("student-admin"), studentAdminController.rejectAdmission);

// ===== STUDENT PROFILES =====
router.get("/student-admin/students", auth, role(["student-admin", "super-admin"]), studentAdminController.getAllStudents);
router.get("/student-admin/students/:studentId", auth, role("student-admin"), studentAdminController.getStudentProfile);
router.post('/student-admin/create-student', auth, role('student-admin'), studentAdminController.createStudent);
router.put("/student-admin/students/:studentId", auth, role("student-admin"), studentAdminController.updateStudentProfile);
router.delete("/student-admin/students/:studentId", auth, role("student-admin"), studentAdminController.deleteStudent);

// ===== CLASS ALLOCATION =====
router.get("/student-admin/classes",auth, role("student-admin"), studentAdminController.getAllClassNames);
router.get("/student-admin/classes/:className/students", studentAdminController.getStudentsByClass);
router.get("/student-admin/allocation/unallocated",auth, role("student-admin"), studentAdminController.getUnallocatedStudents);
router.post("/student-admin/allocation/:studentId", auth, role("student-admin"), studentAdminController.allocateToClass);

// ===== PROMOTIONS =====
router.get("/student-admin/promotions/history", auth, role("student-admin"), studentAdminController.getPromotionHistory);
router.post("/student-admin/promotions/bulk", auth, role("student-admin"), studentAdminController.promoteStudents);
router.post("/student-admin/promotions/:studentId", auth, role("student-admin"), studentAdminController.promoteSingleStudent);

module.exports = router;