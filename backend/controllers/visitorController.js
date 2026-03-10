const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

exports.preRegisterVisitor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      employeeId,
      purpose,
      visitDate
    } = req.body;

    // uploaded image url
    const photo = req.file?.path;

    if (!name || !email || !phone || !employeeId || !purpose || !visitDate) {
      console.log('Missing required fields:', { name, email, phone, employeeId, purpose, visitDate });
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!photo) {
      console.log('Photo is required');
      return res.status(400).json({
        success: false,
        message: "Photo is required"
      });
    }

    const visitor = await Visitor.create({
      name,
      email,
      phone,
      photo
    });

    const appointment = await Appointment.create({
      visitorId: visitor._id,
      employeeId,
      purpose,
      visitDate,
      status: "scheduled"
    });

    return res.status(201).json({
      success: true,
      message: "Visitor pre-registered successfully",
      visitor,
      appointment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
}

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find(
      { role: 'employee' },
      { name: 1 }
    );
    return res.status(200).json({
      success: true,
      employees: employees
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
}