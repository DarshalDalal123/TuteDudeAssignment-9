const mongoose = require("mongoose");

function connectDB() {
  const dbURI = process.env.MONGO_URI;

  try {
    mongoose.connect(dbURI, {
      dbName: "visitor-management-system",
    });

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "MongoDB Connection Failed"));
    db.once("open", function() {
      console.log(`DB Connected (database: ${db.db.databaseName})`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports = connectDB;