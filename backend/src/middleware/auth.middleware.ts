import User from "../models/user.model.ts";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Env } from "../utils/Env.ts";
import Captain from "../models/captain.model.ts";

interface JwtPayload {
  userId: string;
}
interface JwtCAPPayload {
  captainId: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.accessToken ||
      (authHeader?.startsWith("Bearer ") && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, Env.jwtSecret) as JwtPayload;

    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export const authCapMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.CAccessToken ||
      (authHeader?.startsWith("Bearer ") && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, Env.jwtSecret) as JwtCAPPayload;

    if (!decoded?.captainId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const captain = await Captain.findById(decoded.captainId).select("-password");

    if (!captain) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    (req as any).captain = captain;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
