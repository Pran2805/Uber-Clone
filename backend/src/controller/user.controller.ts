import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Env } from "../utils/Env.ts";

export const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { fullName, email, password } = req.body;

        if (!fullName.firstName || !email || !password) {
            throw new Error("All fields are required")
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            throw new Error("User already exists")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName
            },
            email,
            password: hashedPassword,
        });

        if (!user) {
            throw new Error("Failed to create an User")
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: Env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error while registering user",
        });
    }
};


export const login = async(req: Request, res: Response) =>{
    try {

         const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const {email, password} = req.body;
        if(!email || !password){
            throw new Error("Invalid email or password")
        }

        const user = await User.findOne({email}).select("+password")
        if(!user){
            throw new Error("User not found")
        }

        const isMatched = await bcrypt.compare(password, user.password)
        if(!isMatched){
            throw new Error("Password not matched")
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: Env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            message: "User login successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error,
            error: "Error at login controller",
            success: false
        })
    }
}