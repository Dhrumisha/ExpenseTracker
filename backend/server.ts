import pool from "./config/db";
import { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import routes from "./routes";

const cors = require('cors');
const express = require('express');

const app = express();
app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// FRONTEND_URL supports a comma-separated list so previews/localhost can be
// allowed alongside production without editing code for every deploy.
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(cors({
    origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow non-browser requests (no Origin header, e.g. health checks/curl)
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} is not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use('/api/v1', routes);

// Lightweight deploy-only check (no DB call) to verify the app is running (useful for load balancers/uptime probes)
app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
});

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: "404 Not found",
        message: "Route not found"
    })
})

pool.connect()
    .then(() => console.log("Connected to PostgreSQL database........"))
    .catch(err => console.error("Connection error", err.stack));

// Vercel (and other serverless hosts) import this module and call the
// exported handler directly — they never run app.listen(). Only bind a real
// port when running the server ourselves (local dev via `npm start`).
if (!process.env.VERCEL) {
    const port = process.env.PORT ? Number(process.env.PORT) : 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
