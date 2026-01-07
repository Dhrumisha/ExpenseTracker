import { Request, Response } from 'express';
import pool from '../config/db';
import { comparePassword, generateToken, generateRefreshToken, hashPassword, passwordFormat } from '../config';

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
            text: "SELECT EXISTS (SELECT * FROM users WHERE email = $1)", values: [email],

        });

        if (userExists.rows[0].exists) {
            res.status(400).json({
                status: "Failed",
                message: "User already exists, please login"
            });
            return;
        }

        const validPassword = passwordFormat(password);

        if (!validPassword) {
            res.status(400).json({
                status: "Failed",
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            });
            return;
        }

        const hashedPassword = await hashPassword(password);
        const user = await pool.query({
            text: "INSERT INTO users (firstname,lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            values: [firstname, lastname, email, hashedPassword],
        });

        user.rows[0].password = undefined;

        // Generate refresh token to indicate user has signed up
        const refreshToken = await generateRefreshToken(user.rows[0].id);

        // Set refresh token in HTTP-only cookie to track sign-up status
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // process.env.NODE_ENV === 'production'`,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            status: "Success",
            message: "User created successfully",
            data: user.rows[0]
        });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: "Failed",
                message: error
            });
        }
    }
}

export const SignInUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                status: "Failed",
                message: "please provide all the required fields"
            });
            return;
        }
        const result = await pool.query({
            text: "SELECT * FROM users WHERE email = $1", values: [email],
        });
        const user = result.rows[0];


        if (!user) {
            res.status(400).json({
                status: "Failed",
                message: "User does not exist, please sign up"
            });
            return;
        }
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            res.status(400).json({
                status: "Failed",
                message: "Invalid password"
            });
            return;
        }

        user.password = undefined;

        // Generate access token and refresh token
        const accessToken = await generateToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        // Set tokens in HTTP-only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: "lax", // ✅ NOT strict
            path: "/",       // ✅ REQUIRED
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            status: "Success",
            message: "User logged in successfully",
            token: accessToken,
            user: {
                "id": user.id,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "email": user.email
            }
        });


    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: "Failed",
                message: error.message
            });
        }
    }
}

export const LogoutUser = async (req: Request, res: Response) => {
    try {
        // 🔥 Clear access token
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/", // MUST MATCH LOGIN COOKIE
        });

        // 🔥 Clear refresh token
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

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
};
