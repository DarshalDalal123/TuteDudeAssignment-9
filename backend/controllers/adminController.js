import Visitor from "../models/Visitor.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Only admin can access this endpoint
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get counts of various entities for dashboard stats
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
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }

    // Fetch visitors based on filter but return all visitors if no filter is applied
    const visitors = await Visitor.find(filter);

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