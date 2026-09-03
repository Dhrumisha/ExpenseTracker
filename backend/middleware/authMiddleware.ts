import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Access token is normally set as an httpOnly cookie by sign-in; a
    // "Authorization: Bearer <token>" header is accepted as a fallback.
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : undefined;

    const token = req.cookies['accessToken'] || bearerToken;

    if (!token) {
        res.status(401).json({
            status: "Failed",
            message: "Authentication token is missing. Please provide a valid token."
        });
        return;
    }

    try {
        const userToken = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: number;
        };

        if (!userToken) {
            res.status(401).json({
                status: "Failed",
                message: "Your session has expired or the token is invalid. Please login again."
            });
            return;
        }

        req.userId = userToken.id;

        next();
    } catch (error) {
        if (error instanceof Error) {
            let errorMessage = "Authentication failed. Please login again.";

            if (error.name === "TokenExpiredError") {
                errorMessage = "Your session has expired. Please login again.";
            } else if (error.name === "JsonWebTokenError") {
                errorMessage = "Invalid authentication token. Please provide a valid token.";
            }

            res.status(401).json({
                status: "Failed",
                message: errorMessage
            });
            return;
        }
    }
}