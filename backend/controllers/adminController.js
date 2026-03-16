import Visitor from "../models/Visitor.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

export const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const totalVisitors = await Visitor.countDocuments();
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const totalSecurityGuards = await User.countDocuments({ role: "security" });
    const totalAppointments = await Appointment.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        totalVisitors,
        totalEmployees,
        totalSecurityGuards,
        totalAppointments
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

export const getAllVisitors = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const visitors = await Visitor.find();

    if (!visitors || visitors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No visitors found"
      });
    }

    return res.status(200).json({
      success: true,
      visitors
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};