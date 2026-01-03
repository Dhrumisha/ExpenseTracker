import pool from "./config/db";
import { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import routes from "./routes";

const cors = require('cors');
const express = require('express');

const app = express();
app.use(cookieParser());
const port = 8000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/health', async (req: Request, res: Response) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            db: 'ok'
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            db: 'error',
            message: error?.message || 'unknown error'
        });
    }
});

// Lightweight deploy-only check (no DB call) to verify the app is running (useful for load balancers/uptime probes)
app.get('/health/deploy', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'deployed',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get("*", (req: Request, res: Response) => {
    res.status(404).json({
        success: "404 Not found",
        message: "Route not found"
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

pool.connect()
    .then(() => console.log("Connected to PostgreSQL database........"))
    .catch(err => console.error("Connection error", err.stack));


