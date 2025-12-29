import type { Request, Response } from "express";
import Captain from "../models/captain.model.ts";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt'
import { Env } from "../utils/Env.ts";
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { fullName, email, password, vehicle } = req.body;
        if (!fullName.firstName) {
            throw new Error("First Name is required")
        }

        if (!email || !password) {
            throw new Error("Email and password should be required")
        }

        const existingCaptain = await Captain.findOne({ email })
        if (existingCaptain) {
            throw new Error("Captain already exists")
        }

        if (!vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType) {
            throw new Error("Vehicle information should be required")
        }

        const salt = await bcrypt.genSalt(16)
        const hashedPassword = await bcrypt.hash(password, salt)
        const captain = await Captain.create({
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName
            },
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType,
            }
        })

        if (!captain) {
            throw new Error("Error while creating a captain")
        }

        const CAccessToken = jwt.sign(
            { captainId: captain._id },
            Env.jwtSecret as string,
            { expiresIn: "7d" }
        );

        res.cookie("CAccessToken", CAccessToken, {
            httpOnly: true,
            secure: Env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "Captain created successfully",
            success: true,
            captain
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error,
            error: "Error in captain register controller",
            success: false
        })
    }
}

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
            throw new Error("Invalid Email and password")
        }
        const captain = await Captain.findOne({email}).select("+password")

        if(!captain || !captain.password){
            throw new Error("Captain not found")
        }

        const isMatched = await bcrypt.compare(password, captain.password)
        if(!isMatched){
            throw new Error("Invalid Password")
        }
        const CAccessToken = jwt.sign(
            { captainId: captain._id },
            Env.jwtSecret as string,
            { expiresIn: "7d" }
        );

        res.cookie("CAccessToken", CAccessToken, {
            httpOnly: true,
            secure: Env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "Captain created successfully",
            success: true,
            captain
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error,
            error: "Error in captain login controller",
            success: false
        })
    }
}


export const getCapStatus = async( req: Request, res: Response) =>{
    try {
        
        return res.status(200).json({
            captain: (req as any).captain,
            success: true
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Error at get captain profile controller",
            message: error,
            success: false
        })
    }
}

export const logout = async(req: Request, res: Response) =>{
    try {
        const captain = (req as any).captain
        res.clearCookie('CAccessToken')
        return res.status(200).json({
            captain,
            success: true,
            message: "Captain logout successfully"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Error at logout controller",
            message: error,
            success: false
        })
    }
}