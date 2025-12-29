import { Router } from "express";
import { body } from 'express-validator'
import { register, login, getUserProfile, logout} from "../controller/user.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = Router()

router.post("/register", [
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullName.firstName').isLength({ min: 3 }).withMessage("First name must be atleast 3 characters long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6 characters long")
],
    register)


router.post("/login", [
    body('email').isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("Incorrect Password")
],
    login)

router.get("/profile", authMiddleware, getUserProfile)
router.get('/logout', authMiddleware, logout)
export default router;