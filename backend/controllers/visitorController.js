import Visitor from "../models/Visitor.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import validator from "validator";

export const preRegisterVisitor = async (req, res) => {
  try {
    // Extract visitor details from request body
    const {
      name,
      email,
      phone,
      employeeId,
      purpose,
      visitDate,
      visitTime
    } = req.body;

    // Extract photo from request file
    const photo = req.file?.path;

    // Validate required fields
    if (!name || !email || !phone || !employeeId || !purpose || !visitDate || !visitTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validate photo upload
    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Photo is required"
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check if an employee with the same email already exists
    const existingEmployee = await User.findOne({ email: email, role: "employee" });

    // If an employee with the same email exists, return an error
    if(existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "An employee with this email already exists. Please use a different email."
      });
    }
    
    // Create new visitor and appointment records in the database
    const visitor = await Visitor.create({
      name,
      email,
      phone,
      photo
    });

    // Create appointment record in the database
    const appointment = await Appointment.create({
      visitorId: visitor._id,
      employeeId,
      purpose,
      visitDate: new Date(`${visitDate}T00:00:00.000Z`),
      visitTime,
      status: "pending"
    });

    // Fetch employee email from database
    const employee = await User.findById(employeeId);
    const employeeMail = employee?.email;

    // If employee email not found, return error
    if (!employeeMail) {
      return res.status(404).json({
        success: false,
        message: "Employee email not found"
      });
    }

    // Send email notification to the employee about the visitor pre-registration
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
    );

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
};

export const getAllEmployees = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const employees = await User.find(
      { role: "employee" },
      { name: 1 }
    );
    
    return res.status(200).json({
      success: true,
      employees
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