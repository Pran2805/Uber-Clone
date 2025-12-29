import { Router } from "express";
import {body} from 'express-validator'
import { login, register, getCapStatus, logout } from "../controller/captain.controller.ts";
import { authCapMiddleware } from "../middleware/auth.middleware.ts";

const router = Router()


router.post("/register", [
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullName.firstName').isLength({ min: 3 }).withMessage("First name must be atleast 3 characters long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6 characters long"),
    body("vehicle.color").isLength({min: 3}).withMessage("Vehicle color should be provided"),
    body("vehicle.capacity").isInt({min: 1}).withMessage("Vehicle capacity should be provided"),
    body("vehicle.vehicleType").isIn(["car", "motorcycle", "auto"]).withMessage("Vehicle type should be provided"),
    body("vehicle.plate").isLength({min: 3}).withMessage("Vehicle plate number should be provided"),
],
    register)


router.post("/login", [
    body('email').isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("Incorrect Password")
],
    login)

router.get("/profile", authCapMiddleware, getCapStatus)
router.get('/logout', authCapMiddleware, logout)
export default router;