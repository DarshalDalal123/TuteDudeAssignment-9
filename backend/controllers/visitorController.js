const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

exports.preRegisterVisitor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      employeeId,
      purpose,
      visitDate,
      visitTime
    } = req.body;

    // uploaded image url
    const photo = req.file?.path;

    if (!name || !email || !phone || !employeeId || !purpose || !visitDate || !visitTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!photo) {
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
      visitDate: new Date(`${visitDate}T00:00:00.000Z`),
      visitTime,
      status: "pending"
    });

    const employee = await User.findById(employeeId);
    const employeeMail = employee?.email;

    if (!employeeMail) {
      return res.status(404).json({
        success: false,
        message: "Employee email not found"
      });
    }

    await sendEmail(
      employeeMail,
      "Visitor Pre-Registration",
      `<h1>Visitor Pre-Registration</h1>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Purpose: ${purpose}</p>
      <p>Visit Date: ${visitDate}</p>
      <p>Visit Time: ${visitTime}</p>
      <p>Photo: ${photo}</p>`
    )

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