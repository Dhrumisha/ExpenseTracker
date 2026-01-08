import { Request, Response } from "express";
import pool from "../config/db";
import {
    comparePassword,
    generateToken,
    generateRefreshToken,
    hashPassword,
    passwordFormat,
} from "../config";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,          // 🔥 MUST be true in production
    sameSite: "none" as const, // 🔥 REQUIRED for cross-site cookies
    path: "/",
};

export const SignUpUser = async (req: Request, res: Response) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!firstname || !lastname || !email || !password) {
            res.status(400).json({
                status: "Failed",
                message: "please provide all the required fields"
            });
            return;
        }

        const userExists = await pool.query({
            text: "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)",
            values: [email],
        });

        if (userExists.rows[0].exists) {
            res.status(400).json({
                status: "Failed",
                message: "User already exists, please login",
            });
            return;
        }

        if (!passwordFormat(password)) {
            res.status(400).json({
                status: "Failed",
                message:
                    "Password must be at least 8 characters long and contain uppercase, lowercase, number & special character",
            });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const user = await pool.query({
            text: `
        INSERT INTO users (firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, firstname, lastname, email
      `,
            values: [firstname, lastname, email, hashedPassword],
        });

        const refreshToken = await generateRefreshToken(user.rows[0].id);

        res.cookie("refreshToken", refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            status: "Success",
            message: "User created successfully",
            data: user.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Signup failed",
        });
    }
};

export const SignInUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                status: "Failed",
                message: "please provide all the required fields",
            });
            return;
        }

        const result = await pool.query({
            text: "SELECT * FROM users WHERE email = $1",
            values: [email],
        });

        const user = result.rows[0];
        if (!user) {
            res.status(400).json({
                status: "Failed",
                message: "User does not exist",
            });
            return;
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                status: "Failed",
                message: "Invalid password",
            });
            return;
        }

        const accessToken = await generateToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        // 🔥 ACCESS TOKEN COOKIE
        res.cookie("accessToken", accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // 🔥 REFRESH TOKEN COOKIE
        res.cookie("refreshToken", refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: "Success",
            message: "User logged in successfully",
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: "Failed",
                message: "Login failed",
            });
        }
    };
};

export const LogoutUser = async (_req: Request, res: Response) => {
    try {
        res.clearCookie("accessToken", COOKIE_OPTIONS);
        res.clearCookie("refreshToken", COOKIE_OPTIONS);

        res.status(200).json({
            status: "Success",
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Logout failed",
        });
    }
}

