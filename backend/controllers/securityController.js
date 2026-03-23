import User from "../models/User.js";
import Pass from "../models/Pass.js";
import CheckLogs from "../models/CheckLogs.js";
import Appointment from "../models/Appointment.js";

export const securityDashboard = async (req, res) => {
  try {
    // Only security guards can access this endpoint
    if (req.user.role !== "security") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get counts of various stats for the security dashboard
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
    // Only security guards can access this endpoint
    if (req.user.role !== "security") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get all visitors who are currently inside the premises (checked in but not checked out)
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
    // Get name and email from query parameters for filtering
    const { name, email } = req.query;
    // Only admin can access this endpoint
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Build filter object based on query parameters
    const filter = { role: "security" };
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }

    // Fetch security guards based on filter but return all security guards if no filter is applied
    const securities = await User.find(filter).select("-password");

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
    // Get QR code data from request parameters
    const { qrCode } = req.params;

    // Only security guards can access this endpoint
    if (req.user.role !== "security") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Find the pass associated with the QR code and populate appointment details
    const pass = await Pass.findOne({ qrCodeData: qrCode }).populate("appointmentId");

    // If no pass is found, return an error response
    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Pass not found"
      });
    }

    // If pass is found but not active, return an error response
    if (pass.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Pass is not active"
      });
    }

    // Check if the pass has expired based on validTo field and update status if expired
    const now = new Date();

    if (pass.validTo && now > pass.validTo) {
      pass.status = "expired";
      await pass.save();

      return res.status(400).json({
        success: false,
        message: "Pass has expired"
      });
    }

    // Check if a check log already exists for this pass
    const checkLog = await CheckLogs.findOne({ passId: pass._id });

    // If no check log exists, create a new check log with check-in time
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

    // If check log exists but check-in time is not set, set the check-in time
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

    // If check log exists and check-in time is set but check out is also set, return an error response as visitor has already checked out
    if (checkLog.checkOutTime) {
      return res.status(409).json({
        success: false,
        message: "Visitor already checked out"
      });
    }

    // Set the check-out time and update pass status to expired
    checkLog.checkOutTime = now;
    checkLog.securityId = req.user._id;
    await checkLog.save();

    // Update pass status to expired upon check-out
    pass.status = "expired";
    await pass.save();

    // Update the status of the associated appointment to "completed"
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
    // Only security guards can access this endpoint
    if (req.user.role !== "security") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Fetch all check logs and populate visitor details for each log
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