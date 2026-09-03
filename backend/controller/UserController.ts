import { Request, Response } from 'express';
import pool from '../config/db';
import { comparePassword, hashPassword, passwordResetToken } from '../config';
import sendEmail from '../config/nodemailersmtp';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/authMiddleware';

// Fields that must never be sent back to the client.
const SENSITIVE_USER_FIELDS = ["password", "password_reset_token", "password_reset_expires"] as const;

const sanitizeUser = <T extends Record<string, unknown>>(user: T): Omit<T, typeof SENSITIVE_USER_FIELDS[number]> => {
    const safeUser = { ...user };
    for (const field of SENSITIVE_USER_FIELDS) {
        delete safeUser[field];
    }
    return safeUser;
};

export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const userExist = await pool.query({
            text: "SELECT * FROM users WHERE id = $1", values: [userId],
        });

        const user = userExist.rows[0];

        if (!user) {
            res.status(404).json({
                status: "Failed",
                message: "User not found"
            })
            return;
        }
        res.status(200).json({
            status: "Success",
            user: sanitizeUser(user)
        })
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: "Failed",
                message: error.message
            });
            return;
        }
    }

}

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { firstname, lastname, email, country, currency, contact } = req.body;
        const userExist = await pool.query({
            text: "SELECT * FROM users WHERE id = $1", values: [userId],
        });

        const user = userExist.rows[0];

        if (!user) {
            res.status(404).json({
                status: "Failed",
                message: "User not found"
            })
        }
        const updatedUser = await pool.query({
            text: "UPDATE users SET firstname = $1, lastname = $2, email = $3, currency = $4, contact = $5, country=$6 WHERE id = $7 RETURNING *", values: [firstname, lastname, email, currency, contact, country, userId],
        });


        res.status(200).json({
            status: "Success",
            message: "User updated successfully",
            user: sanitizeUser(updatedUser.rows[0])
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: "Failed",
                message: error.message
            });
            return;
        }
    }
}

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const userExist = await pool.query({
            text: "SELECT * FROM users WHERE id = $1", values: [userId],
        });
        const user = userExist.rows[0];

        if (!user) {
            res.status(404).json({
                status: "Failed",
                message: "User not found"
            })
        }

        await pool.query({
            text: "DELETE FROM users WHERE id = $1", values: [userId],
        });

        res.status(200).json({
            status: "Success",
            message: "User deleted successfully"
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: "Failed",
                message: error.message
            });
            return;
        }
    }
}

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        let { currentPassword, newPassword, confirmPassword } = req.body;

        const userExist = await pool.query({
            text: "SELECT * FROM users WHERE id = $1", values: [userId],
        });
        const user = userExist.rows[0];

        if (!user) {
            res.status(404).json({
                status: "Failed",
                message: "User not found"
            })
        }
        if (newPassword !== confirmPassword) {
            res.status(400).json({
                status: "Failed",
                message: "Passwords do not match"
            })
        }
        const isMatch = await comparePassword(currentPassword, user.password);

        if (!isMatch) {
            res.status(401).json({
                status: "Failed",
                message: "current password is incorrect"
            })
        }

        const hashedPassword = await hashPassword(newPassword);
        const updatedUser = await pool.query({
            text: "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
            values: [hashedPassword, userId],
        });

        updatedUser.rows[0].password = undefined;

        res.status(200).json({
            status: "Success",
            message: "Password updated successfully",
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: "Failed",
                message: error.message
            });
            return;
        }
    }
}

export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const userExist = await pool.query({
            text: "SELECT * FROM users WHERE email = $1",
            values: [email],
        });

        const user = userExist.rows[0];

        if (!user) {
            res.status(404).json({
                status: "Failed",
                message: "User not found with this email"
            });
            return;
        }

        const resetToken = await passwordResetToken();
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        await pool.query({
            text: "UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3",
            values: [hashedToken, resetTokenExpires, email],
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        console.log(resetUrl);

        const message = `Forgot your password? Submit a PUT request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message,
        });

        res.status(200).json({
            status: "Success",
            message: "Token sent to email!"
        });
    }
    catch (error) {
        if (error instanceof Error) {
            await pool.query({
                text: "UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE email = $1",
                values: [req.body.email],
            });

            res.status(500).json({
                status: "Failed",
                message: "There was an error sending the email. Try again later!"
            });
        }
    }
}


export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password, passwordConfirm } = req.body;

        if (password !== passwordConfirm) {
            res.status(400).json({
                status: "Failed",
                message: "Passwords do not match"
            });
            return;
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        console.log(hashedToken, "scazxfr");


        const userResult = await pool.query({
            text: "SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()",
            values: [hashedToken],
        });

        if (userResult.rows.length === 0) {
            res.status(400).json({
                status: "Failed",
                message: "Token is invalid or has expired"
            });
            return;
        }

        const user = userResult.rows[0];
        const hashedPassword = await hashPassword(password);

        await pool.query({
            text: "UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2",
            values: [hashedPassword, user.id],
        });

        res.status(200).json({
            status: "Success",
            message: "Password reset successfully",

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

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
         const userId = req.userId;
        const userExist = await pool.query({
            text: "SELECT * FROM users WHERE id = $1", values: [userId],
        });

        const user = userExist.rows[0];

        if (user) {
        //     res.status(404).json({
        //         status: "Failed",
        //         message: "Unauthorized user"
        //     })
        //     return;
        // }
        res.json({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        });}
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                status: "Failed",
                message: error.message
            });
            return;
        }
    }
};
