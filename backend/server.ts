import pool from "./config/db";
import { Request, Response } from 'express';
import routes from "./routes";

const cors = require('cors');
const express = require('express');

const app = express();
const port = 3000;

app.use(cors("*"));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

app.use('/api/v1', routes);

app.get("*", (req:Request, res:Response) => {
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


