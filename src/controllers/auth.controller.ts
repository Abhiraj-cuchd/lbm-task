import { Request, Response } from "express";
import { User } from "../models/user.model";


export const authenticateUser = async (req:Request, res:Response) => {
    const isValidEmail = (email:string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    // Helper function to validate PIN format
    const isValidPin = (pin:number) => {
        return /^\d{4}$/.test(pin.toString());
    };
    try {
        const { email, pin } = req.body;

        // Input validation
        if (!email || !pin) {
            return res.status(400).json({
                success: false,
                message: "Email and PIN are required"
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Validate PIN format
        if (!isValidPin(pin)) {
            return res.status(400).json({
                success: false,
                message: "PIN must be exactly 4 digits"
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Register new user
            user = new User({
                email,
                pin: pin.toString(),
                balance: 0,
                transactions: []
            });
            
            await user.save();

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    email: user.email,
                    balance: user.balance,
                    createdAt: user.createdAt
                }
            });
        }

        // Existing user - verify PIN
        if (user.pin !== pin.toString()) {
            return res.status(401).json({
                success: false,
                message: "Invalid PIN"
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Successful login
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                email: user.email,
                balance: user.balance,
                lastLogin: user.lastLogin
            }
        });

    } catch (error:any) {
        console.error('Authentication error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}