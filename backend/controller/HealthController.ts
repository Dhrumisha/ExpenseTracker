import { Request, Response } from "express";
import pool from "../config/db";

const startedAt = Date.now();

// Liveness check: is the process up and answering requests at all.
// Deliberately does not touch the database, so it stays fast and useful
// even when the DB is the thing that's broken.
export const getHealth = (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
        timestamp: new Date().toISOString(),
    });
};

// Readiness check: can we actually reach the database right now.
export const getHealthDb = async (_req: Request, res: Response) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            status: "error",
            database: "unreachable",
            message: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }
};
