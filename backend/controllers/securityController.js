const User = require('../models/User');

exports.securityDashboard = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
}

exports.getAllSecurities = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const securities = await User.find({ role: 'security' }).select('-password');
    if (!securities || securities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No security personnel found"
      });
    }
    return res.status(200).json({
      success: true,
      securities
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
}