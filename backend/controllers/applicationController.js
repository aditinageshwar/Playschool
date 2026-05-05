const Application = require("../models/Application");
const Student = require("../models/Student");
const User = require("../models/User");
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");

exports.sendApplication = async (req, res) => {
  try {
    const { type, subject, description, startDate, endDate, email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const studentProfile = await Student.findOne({ user: user._id });
    if (!studentProfile) return res.status(404).json({ message: "Student profile not found" });

    const newApplication = new Application({
      student: studentProfile._id,
      type,
      subject,
      description,
      startDate: startDate || null,
      endDate: endDate || null,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const userId = req.user.id; 
    const teacherProfile = await Teacher.findOne({ user: userId });
    if (!teacherProfile) {
      return res.status(404).json({ message: "Teacher profile not found." });
    }

    const assignedClasses = await Class.find({ 
      classTeacher: teacherProfile._id,
      status: "active" 
    });
    if (!assignedClasses || assignedClasses.length === 0) {
      return res.status(403).json({ message: "Access Denied: No class assigned to you." });
    }
    const classPairs = assignedClasses.map(c => ({
      className: c.className,
      section: c.section
    }));
    
    const applications = await Application.find()
      .populate({
        path: 'student',
        match: { $or: classPairs },
        populate: { path: 'user', select: 'name' }
      })
      .sort({ appliedDate: -1 });
    
    const filteredApplications = applications.filter(app => app.student !== null);
    res.status(200).json(filteredApplications);
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, teacherRemarks } = req.body;
    const updated = await Application.findByIdAndUpdate(id,
      { status, teacherRemarks },
      { new: true }
    );

    res.status(200).json({ message: `Application ${status}`, data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};