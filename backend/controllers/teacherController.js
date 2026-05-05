const Class = require("../models/Class");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Assignment = require("../models/Assignment");
const Attendance = require("../models/Attendance");
const Application = require("../models/Application");
const Student = require("../models/Student");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const teacher = await Teacher.findOne({ user: userId });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  
    //first stats
    const classCount = await Class.countDocuments({ classTeacher: teacher._id });

    //second stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const countAssignments = await Assignment.countDocuments({teacher: teacher._id, dueDate: { $gte: today }});
    
    //third stats
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let attendancePercentage = "0%";
    let presentRecords = 0;
    let pendingCount = 0;

    const assignedClasses = await Class.find({ 
      classTeacher: teacher._id,
      status: "active" 
    });
    
    if (assignedClasses.length > 0) {
      const classPairs = assignedClasses.map(c => ({
        className: c.className,
        section: c.section
      }));

      const studentsInClass = await Student.find({
        $or: classPairs
      }).select('_id');
      const studentIds = studentsInClass.map(s => s._id);

      if (studentIds.length > 0) {
        const attendanceRecords = await Attendance.find({
          student: { $in: studentIds },
          date: { $gte: start, $lte: end }
        });

        presentRecords = attendanceRecords.filter(r => r.status === "Present").length;
        const totalRecords = attendanceRecords.length;

        if (totalRecords > 0) {
          const percentage = (presentRecords / totalRecords) * 100;
          attendancePercentage = `${Math.round(percentage)}%`;
        } 

        //fourth stats
        const applications = await Application.find({ status: "Pending" })
          .populate({
            path: 'student',
            match: { $or: classPairs }, 
            select: '_id'
          });
        pendingCount = applications.filter(app => app.student !== null).length;
      }
    }

    res.status(200).json({
        classesToday: classCount,
        activeAssignment: countAssignments,
        presentRecords: presentRecords,
        averageAttendance: attendancePercentage,   
        pendingApplication: pendingCount  
    });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}; 

exports.getMyClasses = async (req, res) => {
  try {
    const {email} = req.params; 
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const teacher = await Teacher.findOne({ user: user._id });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher profile not found" });
    }

    const myClasses = await Class.find({ classTeacher: teacher._id, status: "active" })
      .populate("subjects", "name code")          
      .sort({ startTime: 1 });   
      
    if (!myClasses || myClasses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active class for you!"
      });
    }  

    res.status(200).json({
      success: true,
      data: myClasses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};