import { Request, Response } from "express";
import pool from "../config/db";

export const getTransaction = async (req: Request, res: Response) => {
    try {
       const today = new Date();
       const _seventhDay = new Date(today.setDate(today.getDate() - 7));
       const sevenDayAgo = _seventhDay.toISOString().split('T')[0];

       const {dateFrom,dateTo,s} = req.query as {dateFrom?: string, dateTo?: string, s?: string};


       const startDate = new Date(dateFrom || sevenDayAgo);
       const endDate = new Date(dateTo || today);
       const  {userId} = req.body.user;

       const transaction =await pool.query({
        text: `SELECT * FROM transactions WHERE user_id = $1 AND createdat BETWEEN $2 AND $3 AND ORDER BY id DESC AND (description ILIKE '%' || $4 || '%' OR status ILIKE '%' || $4 || '%' OR source ILIKE '%' || $4 || '%')`,
        values: [userId,startDate, endDate, s]
       });

       res.status(200).send({
        message: "Transaction fetched successfully",
        data: transaction.rows
       })

    } catch (error) {
       if(error instanceof Error){
        res.status(400).send({
            message: "failed",
            error: "Failed to fetch transactions"
           });
           return;
       }
    }
}

export const getDashboardInfo = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
}

export const addTransaction = async (req: Request, res: Response) => {
    try {
        const {account_id} = req.params;
        const {amount,description,source} = req.body;
        const {userId} = req.body.user;

        if(!amount || !description || !source){
             res.status(400).send({
                status:"Failed",
                message: "Please fill all required fields"
            });
            return;
        }

        if(amount <=0){
             res.status(400).send({
                status:"Failed",
                message: "Amount must be greater than 0"
            }); 
            return;
        }

        const result = await pool.query({
            text: `SELECT * FROM accounts WHERE id = $1`,
            values: [account_id]
        });

        const accountInfo = result.rows[0];

        if(!accountInfo){
             res.status(404).send({
                status:"Failed",
                message: "Invalid account information"
            });
            return;
        }

        if(accountInfo.acc_balance <=0 || accountInfo.acc_balance < Number(amount)){
             res.status(400).send({
                status:"Failed",
                message: "Transaction Failed!! Insufficient account balance"
            });
            return;
        }

        await pool.query("BEGIN");
        
        await pool.query({
            text: `UPDATE accounts SET acc_balance = acc_balance - $1 WHERE id = $2 RETURNING *`,
            values: [amount,account_id]
        });

        await pool.query({
            text: `INSERT INTO transactions (user_id,description,type,status,amount,source) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            values: [userId,description,"expense","completed",amount,source]
        });

        await pool.query("COMMIT");

        res.status(201).send({
            status: "Success",
            message: "Transaction successful"
        })
    } 
    catch (error) {
        if(error instanceof Error){
            await pool.query("ROLLBACK");
            
             res.status(400).send({
                status: "Failed",
                message: "Transaction Failed!!"
            });
            return;
        }
    }
}

export const transferMoneyToAccount = async (req: any, res: any) => {
    try {

        const {userId} = req.body.user;
        const {from_acc,to_acc,amount} = req.body;

        if(!from_acc || !to_acc || !amount){
             res.status(400).send({
                status: "Failed",
                message: "Please fill all required fields"
            }); 
            return;
        }

        if(amount <=0){
             res.status(400).send({
                status: "Failed",
                message: "Amount must be greater than 0"
            });
            return;
        }
    } catch (error) {
        if(error instanceof Error){
            await pool.query("ROLLBACK");

             res.status(400).send({
                status: "Failed",
                message: "Transaction Failed!!"
            });
            return;
        }
    } 
}