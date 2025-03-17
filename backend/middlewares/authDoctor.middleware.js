// import jwt from "jsonwebtoken";

// // Doctor authentication middleware
// const authDoctor = async (req, res, next) => {
//   try {
//     const { dToken } = req.headers;
//     if (!dToken) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Access denied, token missing" });
//     }
//     const tokenDecode = jwt.verify(dToken, process.env.JWT_SECRET);
//     req.body.docId = tokenDecode.id;
//     next();
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export default authDoctor;

import jwt from "jsonwebtoken";

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    // Check for token in different header formats
    const token =
      req.headers.dtoken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Access denied, token missing" });
    }

    try {
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
      req.docId = tokenDecode.id; // Put this directly on req object
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        details: jwtError.message,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authDoctor;
