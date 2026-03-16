import Visitor from "../models/Visitor.js";
import Appointment from "../models/Appointment.js";
import Pass from "../models/Pass.js";
import { sendVisitorPass } from "../services/passEmailService.js";
import { sendEmail } from "../utils/sendEmail.js";

export const employeeDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const employeeID = req.user._id;

    const todayApprovedAppointments = await Appointment.countDocuments({
      employeeId: employeeID,
      status: "scheduled",
      visitDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999)
      }
    });

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
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const employeeID = req.user._id;

    const appointments = await Appointment.find({
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
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const employeeID = req.user._id;

    const upcomingAppointments = await Appointment.find({
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
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate("visitorId", "name email phone photo")
      .populate("employeeId", "name email");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    const validStatuses = ["pending", "scheduled", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    )
      .populate("visitorId", "name email phone photo")
      .populate("employeeId", "name email");

    if (
      updatedAppointment.status === "cancelled" ||
      updatedAppointment.status === "pending"
    ) {
      await Pass.updateMany(
        { appointmentId: appointment._id, status: "active" },
        { status: "cancelled" }
      );

      await sendEmail(
        appointment.visitorId.email,
        "Appointment Status Updated",
        `<p>Your appointment scheduled for ${appointment.visitDate.toDateString()} at ${appointment.visitTime} has been updated to ${updatedAppointment.status}.</p>`
      );
    }

    if (updatedAppointment.status === "scheduled") {
      let pass = await Pass.findOne({
        appointmentId: appointment._id,
        status: "active"
      });

      if (!pass) {
        pass = await Pass.create({
          appointmentId: appointment._id,
          qrCodeData: `PASS-${appointment._id}-${Date.now()}`,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 4 * 60 * 60 * 1000)
        });
      }

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