import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response,next:NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            status: "Failed",
            message: "Authentication required. Please provide a valid token."
        });
        return;
    }

    if (!authHeader.startsWith("Bearer")) {
        res.status(401).json({
            status: "Failed",
            message: "Invalid token format. Token must be Bearer token."
        });
        return;
    }

   const token = authHeader.split(" ")[1];

   if(!token) {
    res.status(401).json({
        status: "Failed",
        message: "Authentication token is missing. Please provide a valid token."
    });
    return;
   }
    
   try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET as string) ;

    if(!userToken) {
        res.status(401).json({
            status: "Failed",
            message: "Your session has expired or the token is invalid. Please login again."
        });
        return;
    }

    req.body.user = {
        userId: (userToken as jwt.JwtPayload).userId,
    };

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