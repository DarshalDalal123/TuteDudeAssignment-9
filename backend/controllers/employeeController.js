const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');

exports.employeeDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const employeeID = req.user._id;
    const todayApprovedAppointments = await Appointment.countDocuments({ employeeId: employeeID, status: 'scheduled', visitDate: { $gte: new Date().setHours(0, 0, 0, 0), $lte: new Date().setHours(23, 59, 59, 999) } });
    const pendingApprovals = await Appointment.countDocuments({ employeeId: employeeID, status: 'pending' } );
    const approvedAppointments = await Appointment.countDocuments({ employeeId: employeeID, status: 'scheduled' } );
    const cancelledAppointments = await Appointment.countDocuments({ employeeId: employeeID, status: 'cancelled' } );
    const completedAppointments = await Appointment.countDocuments({ employeeId: employeeID, status: 'completed' } );
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
}

exports.getAllVisitorsByEmployeeID = async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const employeeID = req.user._id;
    const appointments = await Appointment.find({ employeeId: employeeID })
      .populate('visitorId', 'name email phone photo');

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
}

exports.getUpcomingVisitorsByEmployeeID = async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const employeeID = req.user._id;
    const upcomingAppointments = await Appointment.find({ employeeId: employeeID, status: 'scheduled', visitDate: { $gte: new Date() } })
      .populate('visitorId', 'name email phone photo');

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
}

exports.visitorRequestChangeStatus = async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const { appointmentId } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }
    const validStatuses = ['pending', 'scheduled', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }
    const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });
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
}