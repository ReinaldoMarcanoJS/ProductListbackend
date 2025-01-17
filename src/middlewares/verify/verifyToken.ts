import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface CustomRequest extends Request {
  user?: any;
}
export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const secretKey = process.env.JWTkey || "SECRET_KEY"; // Replace with your actual secret key

  const {token} = req.body
    
  try {
    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return;
    }
    const decoded = jwt.verify(token as string, secretKey);
    req.user = decoded;
    console.log(decoded);
    
    next();
  } catch (error) {
    res.status(401).json({ message: "error" , type: "Token not valid" });
    return
  }
};
