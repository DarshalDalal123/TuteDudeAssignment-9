import Visitor from "../models/Visitor.js";
import Appointment from "../models/Appointment.js";
import Pass from "../models/Pass.js";
import { sendVisitorPass } from "../services/passEmailService.js";
import { sendEmail } from "../utils/sendEmail.js";

export const employeeDashboardStats = async (req, res) => {
  try {
    // Only employee can access this endpoint
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get employee ID from authenticated user
    const employeeID = req.user._id;

    // Get name and email from query parameters for filtering
    const todayApprovedAppointments = await Appointment.countDocuments({
      employeeId: employeeID,
      status: "scheduled",
      visitDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999)
      }
    });

    // Get counts of various appointment statuses for the employee
    const pendingApprovals = await Appointment.countDocuments({
      employeeId: employeeID,
      status: "pending"
    });

    const approvedAppointments = await Appointment.countDocuments({
      employeeId: employeeID,
      status: "scheduled"
    });

    const cancelledAppointments = await Appointment.countDocuments({
      employeeId: employeeID,
      status: "cancelled"
    });

    const completedAppointments = await Appointment.countDocuments({
      employeeId: employeeID,
      status: "completed"
    });

    return res.status(200).json({
      success: true,
      stats: {
        todayApprovedAppointments,
        pendingApprovals,
        approvedAppointments,
        cancelledAppointments,
        completedAppointments
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

export const getAllVisitorsByEmployeeID = async (req, res) => {
  try {
    // Get name and email from query parameters for filtering
    const { name, email } = req.query;

    // Only employee can access this endpoint
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get employee ID from authenticated user
    const employeeID = req.user._id;

    // Build filter object based on query parameters
    const filter = {};
    if (name) {
      filter["visitorId.name"] = { $regex: name, $options: "i" };
    }
    if (email) {
      filter["visitorId.email"] = { $regex: email, $options: "i" };
    }


    // Fetch appointments based on filter but return all appointments for the employee if no filter is applied
    const appointments = await Appointment.find({
      ...filter,
      employeeId: employeeID,
      status: { $in: ["pending", "cancelled"] }
    }).populate("visitorId", "name email phone photo");

    return res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

export const getUpcomingVisitorsByEmployeeID = async (req, res) => {
  try {
    // Get name and email from query parameters for filtering
    const { name, email } = req.query;
    // Only employee can access this endpoint
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get employee ID from authenticated user
    const employeeID = req.user._id;

    // Build filter object based on query parameters
    const filter = {};
    if (name) {
      filter["visitorId.name"] = { $regex: name, $options: "i" };
    }
    if (email) {
      filter["visitorId.email"] = { $regex: email, $options: "i" };
    }

    // Fetch appointments based on filter but return all upcoming appointments for the employee if no filter is applied
    const upcomingAppointments = await Appointment.find({
      ...filter,
      employeeId: employeeID,
      status: "scheduled",
      visitDate: { $gte: new Date().setHours(0, 0, 0, 0) }
    }).populate("visitorId", "name email phone photo");

    return res.status(200).json({
      success: true,
      upcomingAppointments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

export const visitorRequestChangeStatus = async (req, res) => {
  try {
    // Only employee can access this endpoint
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get appointment ID from request parameters and new status from request body
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Fetch the appointment to get visitor details for email notification
    const appointment = await Appointment.findById(appointmentId)
      .populate("visitorId", "name email phone photo")
      .populate("employeeId", "name email");

    // If appointment not found, return 404 error
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Validate the new status value
    const validStatuses = ["pending", "scheduled", "cancelled"];

    // Only allow changing status to pending, scheduled, or cancelled
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    // Update the appointment status and return the updated appointment details
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    )
      .populate("visitorId", "name email phone photo")
      .populate("employeeId", "name email");

    // If the appointment is cancelled or rescheduled, update the pass status and send email notification to the visitor
    if (
      updatedAppointment.status === "cancelled" ||
      updatedAppointment.status === "pending"
    ) {
      // Cancel any active passes associated with this appointment
      await Pass.updateMany(
        { appointmentId: appointment._id, status: "active" },
        { status: "cancelled" }
      );

      // Send email notification to the visitor about the status change
      await sendEmail(
        appointment.visitorId.email,
        "Appointment Status Updated",
        `<p>Your appointment scheduled for ${appointment.visitDate.toDateString()} at ${appointment.visitTime} has been updated to ${updatedAppointment.status}.</p>`
      );
    }

    if (updatedAppointment.status === "scheduled") {
      // If the appointment is approved, generate a pass for the visitor and send email notification with pass details
      let pass = await Pass.findOne({
        appointmentId: appointment._id,
        status: "active"
      });

      // If no active pass exists for this appointment, create a new pass
      if (!pass) {
        pass = await Pass.create({
          appointmentId: appointment._id,
          qrCodeData: `PASS-${appointment._id}-${Date.now()}`,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 4 * 60 * 60 * 1000)
        });
      }

      // Send email notification to the visitor with pass details
      await sendVisitorPass(
        updatedAppointment.visitorId,
        updatedAppointment,
        pass.qrCodeData
      );
    }

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment: updatedAppointment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};