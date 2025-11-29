import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
      return res.status(401).json("Invalid token!");
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
     console.log("Error in verifyToken",error);
     return res.status(500).json("Server error!");
  }
}