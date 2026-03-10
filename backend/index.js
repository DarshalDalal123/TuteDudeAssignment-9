const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: ["http://localhost:5173", process.env.CLIENT_URL],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req,res) => {
  res.send("Welcome to the Visitor Management System API");
})

app.use("/api/users", require("./routes/users"));
app.use("/api/visitor", require("./routes/visitor"));
app.use("/api/admin", require("./routes/admin"));


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
    error: err
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});