import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import { comparePassword, generateToken, hashPassword, passwordFormat } from '../config';

export const SignUpUser = async (req: Request, res: Response) => {
    try {
        const { firstname, email, password } = req.body;

        if (!firstname || !email || !password) {
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
            text: "INSERT INTO users (firstname, email, password) VALUES ($1, $2, $3) RETURNING *", 
            values: [firstname, email, hashedPassword], 
        });

        user.rows[0].password = undefined;

        res.status(201).json({
            status: "Success",
            message: "User created successfully",
            data: user.rows[0]
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

export const SignInUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
     
        if (!email ||!password) {
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

        if(!user){
            res.status(400).json({
                status: "Failed",
                message: "User does not exist, please sign up" 
            })
        }
        const isMatch = await comparePassword(password,user.password);        

        if (!isMatch) {
            res.status(400).json({
                status: "Failed",
                message: "Invalid password"
            });
            return;
        }

        user.password = undefined;

        const token =await generateToken(user.id); // Implement your token generation logic here

        res.status(200).json({
            status: "Success",
            message: "User logged in successfully",
            token,
            user
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
