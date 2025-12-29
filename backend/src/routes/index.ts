import { Router } from "express";
import userRouter from './user.router.ts'
import captainRouter from './captain.router.ts'
const router = Router()


router.use("/user", userRouter)
router.use("/captain", captainRouter)
export default router;