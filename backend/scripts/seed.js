require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");
const Pass = require("../models/Pass");
const CheckLogs = require("../models/CheckLogs");

async function connect() {
  const dbURI = process.env.MONGO_URI;

  if (!dbURI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  await mongoose.connect(dbURI, {
    dbName: "visitor-management-system",
  });
}

function createDateOffset(daysOffset, hour = 10, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  return date;
}

async function clearCollections() {
  await CheckLogs.deleteMany({});
  await Pass.deleteMany({});
  await Appointment.deleteMany({});
  await Visitor.deleteMany({});
  await User.deleteMany({});
}

async function createUsers() {
  const passwordMap = {
    admin: "Admin@123",
    employee1: "Employee@123",
    security1: "Security@123",
  };

  const hash = async (plain) => bcrypt.hash(plain, 10);

  const users = await User.insertMany([
    {
      name: "Super Admin",
      email: "darshaldalal@gmail.com",
      password: await hash(passwordMap.admin),
      role: "admin",
      department: "Administration",
      phone: "9000000001",
    },
    {
      name: "Ethan Employee",
      email: "darshaldalal456@gmail.com",
      password: await hash(passwordMap.employee1),
      role: "employee",
      department: "Engineering",
      phone: "9000000002",
    },
    {
      name: "Sam Security",
      email: "darshaldalal66@gmail.com",
      password: await hash(passwordMap.security1),
      role: "security",
      department: "Security",
      phone: "9000000004",
    }
  ]);

  const admin = users.find((u) => u.role === "admin");
  const employees = users.filter((u) => u.role === "employee");
  const securities = users.filter((u) => u.role === "security");

  return {
    admin,
    employees,
    securities,
    credentials: {
      admin: { email: admin.email, password: passwordMap.admin },
      employee1: { email: employees[0].email, password: passwordMap.employee1 },
      security1: { email: securities[0].email, password: passwordMap.security1 }
    },
  };
}

async function createVisitorsAndAppointments(employees) {
  const visitors = await Visitor.insertMany([
    {
      name: "Alex Johnson",
      email: "darshal.dalal.ordex@gmail.com",
      phone: "9888800001",
      photo: "https://picsum.photos/seed/visitor1/400/400",
    }
  ]);

  const appointments = await Appointment.insertMany([
    {
      visitorId: visitors[0]._id,
      employeeId: employees[0]._id,
      purpose: "Project status discussion",
      visitDate: createDateOffset(1),
      visitTime: "10:30 AM",
      status: "pending",
    }
  ]);

  return { visitors, appointments };
}

async function createPassesAndLogs(appointments, securities) {
  const now = new Date();

  if (!appointments.length) {
    return {
      activeQrCodes: [],
      inactiveQrCodes: [],
    };
  }

  if (!securities.length) {
    throw new Error("At least one security user is required to create check logs");
  }

  const activePassForUpcoming = await Pass.create({
    appointmentId: appointments[0]._id,
    qrCodeData: `QR-DEMO-${appointments[0]._id}-A`,
    status: "active",
    validFrom: new Date(now.getTime() - 30 * 60 * 1000),
    validTo: new Date(now.getTime() + 4 * 60 * 60 * 1000),
  });

  await CheckLogs.insertMany([
    {
      passId: activePassForUpcoming._id,
      securityId: securities[0]._id,
      checkInTime: new Date(now.getTime() - 20 * 60 * 1000),
      checkOutTime: null,
    },
  ]);

  return {
    activeQrCodes: [activePassForUpcoming.qrCodeData],
    inactiveQrCodes: [],
  };
}

async function seed() {
  try {
    await connect();
    await clearCollections();

    const { employees, securities, credentials } = await createUsers();
    const { appointments } = await createVisitorsAndAppointments(employees);
    const { activeQrCodes, inactiveQrCodes } = await createPassesAndLogs(appointments, securities);

    const counts = {
      users: await User.countDocuments(),
      visitors: await Visitor.countDocuments(),
      appointments: await Appointment.countDocuments(),
      passes: await Pass.countDocuments(),
      checkLogs: await CheckLogs.countDocuments(),
    };

    console.log("\nSeed completed successfully.");
    console.log("Inserted document counts:", counts);
    console.log("\nDemo login credentials:");
    Object.entries(credentials).forEach(([roleKey, value]) => {
      console.log(`- ${roleKey}: ${value.email} / ${value.password}`);
    });

    console.log("\nQR codes for security scan testing:");
    activeQrCodes.forEach((qr, index) => {
      console.log(`- Active QR ${index + 1}: ${qr}`);
    });
    inactiveQrCodes.forEach((qr, index) => {
      console.log(`- Inactive QR ${index + 1}: ${qr}`);
    });
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();
