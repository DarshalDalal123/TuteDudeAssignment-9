import User from "../models/User.js";
import Pass from "../models/Pass.js";
import CheckLogs from "../models/CheckLogs.js";
import Appointment from "../models/Appointment.js";

export const securityDashboard = async (req, res) => {
  try {
    if (req.user.role !== "security") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const totalCheckInsToday = await CheckLogs.countDocuments({
      checkInTime: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999)
      }
    });

    const currentyCheckedInVisitors = await CheckLogs.countDocuments({
      checkInTime: { $ne: null },
      checkOutTime: null
    });

    const totalCheckOutsToday = await CheckLogs.countDocuments({
      checkOutTime: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999)
      }
    });

    const activePasses = await Pass.countDocuments({ status: "active" });

    return res.status(200).json({
      success: true,
      stats: {
        totalCheckInsToday,
        currentyCheckedInVisitors,
        totalCheckOutsToday,
        activePasses
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

export const getAllVisitorsInside = async (req, res) => {
  try {
    if (req.user.role !== "security") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const visitorsInside = await CheckLogs.find({
      checkInTime: { $ne: null },
      checkOutTime: null
    }).populate({
      path: "passId",
      populate: {
        path: "appointmentId",
        populate: {
          path: "visitorId",
          select: "name email phone"
        }
      }
    });

    return res.status(200).json({
      success: true,
      visitorsInside
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

export const getAllSecurities = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const securities = await User.find({ role: "security" }).select("-password");

    if (!securities || securities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No security personnel found"
      });
    }

    return res.status(200).json({
      success: true,
      securities
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

export const updateCheckInOutTime = async (req, res) => {
  try {
    const { qrCode } = req.params;

    if (req.user.role !== "security") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const pass = await Pass.findOne({ qrCodeData: qrCode }).populate("appointmentId");

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Pass not found"
      });
    }

    if (pass.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Pass is not active"
      });
    }

    const now = new Date();

    if (pass.validTo && now > pass.validTo) {
      pass.status = "expired";
      await pass.save();

      return res.status(400).json({
        success: false,
        message: "Pass has expired"
      });
    }

    const checkLog = await CheckLogs.findOne({ passId: pass._id });

    if (!checkLog) {
      const newCheckLog = new CheckLogs({
        passId: pass._id,
        securityId: req.user._id,
        checkInTime: now
      });

      await newCheckLog.save();

      return res.status(200).json({
        success: true,
        action: "check-in",
        message: "Visitor checked in successfully"
      });
    }

    if (!checkLog.checkInTime) {
      checkLog.checkInTime = now;
      checkLog.securityId = req.user._id;
      await checkLog.save();

      return res.status(200).json({
        success: true,
        action: "check-in",
        message: "Visitor checked in successfully"
      });
    }

    if (checkLog.checkOutTime) {
      return res.status(409).json({
        success: false,
        message: "Visitor already checked out"
      });
    }

    checkLog.checkOutTime = now;
    checkLog.securityId = req.user._id;
    await checkLog.save();

    pass.status = "expired";
    await pass.save();

    if (pass.appointmentId?._id) {
      await Appointment.findByIdAndUpdate(pass.appointmentId._id, {
        status: "completed"
      });
    }

    return res.status(200).json({
      success: true,
      action: "check-out",
      message: "Visitor checked out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

export const visitCheckLog = async (req, res) => {
  try {
    if (req.user.role !== "security") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const checkLogs = await CheckLogs.find().populate({
      path: "passId",
      populate: {
        path: "appointmentId",
        populate: {
          path: "visitorId",
          select: "name email"
        }
      }
    });

    return res.status(200).json({
      success: true,
      checkLogs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};