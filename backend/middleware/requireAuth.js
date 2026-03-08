const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  const authentication = req.headers.authorization || req.headers.Authorization;

  if (!authentication) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const token = authentication.startsWith("Bearer ")
    ? authentication.split(" ")[1]
    : authentication;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.userId || payload._id;
    if (!userId) {
      throw new Error("JWT payload missing userId");
    }
    req.user = await User.findById(userId).select("-password");
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
}

module.exports = requireAuth;