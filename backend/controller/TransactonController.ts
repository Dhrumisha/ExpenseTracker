import { Request, Response } from "express";
import pool from "../config/db";
import { getMonthName } from "../config";
import { AuthRequest } from "../middleware/authMiddleware";

export const getTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const {
            df,
            dt,
            s = "",
            page = "1",
            limit = "10",
            sortBy = "createdat",
            order = "desc",
            status,
        } = req.query as any;

        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const offset = (pageNumber - 1) * pageSize;

        const startDate = df ? new Date(`${df}T00:00:00Z`) : sevenDaysAgo;
        const endDate = dt ? new Date(`${dt}T23:59:59Z`) : today;

        const userId = req.userId;

        const allowedSort = ["createdat", "amount", "type"];
        const sortColumn = allowedSort.includes(sortBy) ? sortBy : "createdat";
        const sortOrder = order === "asc" ? "ASC" : "DESC";

        const dataQuery = `
      SELECT *
      FROM transactions
      WHERE user_id = $1
        AND createdat BETWEEN $2 AND $3
        AND (
          $4 = '' OR
          description ILIKE '%' || $4 || '%' OR
          status ILIKE '%' || $4 || '%' OR
          source ILIKE '%' || $4 || '%'
        )
        AND ($5::text IS NULL OR status = $5)
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT $6 OFFSET $7
    `;

        const countQuery = `
      SELECT COUNT(*)
      FROM transactions
      WHERE user_id = $1
        AND createdat BETWEEN $2 AND $3
        AND (
          $4 = '' OR
          description ILIKE '%' || $4 || '%' OR
          status ILIKE '%' || $4 || '%' OR
          source ILIKE '%' || $4 || '%'
        )
        AND ($5::text IS NULL OR status = $5)
    `;

        const [dataResult, countResult] = await Promise.all([
            pool.query(dataQuery, [
                userId,
                startDate,
                endDate,
                s,
                status || null,
                pageSize,
                offset,
            ]),
            pool.query(countQuery, [userId, startDate, endDate, s, status || null]),
        ]);

        res.status(200).json({
            status: "Success",
            message: "Transactions fetched successfully",
            data: dataResult.rows,
            pagination: {
                page: pageNumber,
                limit: pageSize,
                total: Number(countResult.rows[0].count),
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Failed to fetch transactions",
        });
    }
};

export const getDashboardInfo = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        let totalIncome = 0;
        let totalExpense = 0;

        const transactionResults = await pool.query({
            text: `SELECT type, SUM(amount) as totalamount FROM transactions WHERE user_id = $1 GROUP BY type`,
            values: [userId]
        });

        const transactions = transactionResults.rows;

        transactions.forEach((transaction: any) => {
            transaction.totalamount = Number(transaction.totalamount);
            if (transaction.type === "expense") {
                totalExpense += transaction.totalamount;
            } else {
                totalIncome += transaction.totalamount;
            }
        });
        const availableBalance = totalIncome - totalExpense;


        // Aggregate transactions to sum by type and group by month

        const year = new Date().getFullYear();
        const startDate = new Date(year, 0, 1); // January 1st
        const endDate = new Date(year, 11, 31);// December 31st

        const result = await pool.query({
            text: `SELECT EXTRACT(MONTH FROM createdat) as month, type, SUM(amount) as totalAmount FROM transactions WHERE user_id = $1 AND createdat BETWEEN $2 AND $3 GROUP BY month, type`,
            values: [userId, startDate, endDate]
        });

        // i want to result of rows so when start first check this

        const data = new Array(12).fill(0).map((_, index) => {
            const monthData = result.rows.filter((row: any) => Number(row.month) === index + 1);
            const income = monthData.find((row: any) => row.type === "income")?.totalamount || 0;
            const expense = monthData.find((row: any) => row.type === "expense")?.totalamount || 0;
            
            return {
                label: getMonthName(index),
                income,
                expense
            }
        });

        const lastTransactionResult = await pool.query({
            text: `SELECT * FROM transactions WHERE user_id = $1 ORDER BY createdat DESC LIMIT 5`,
            values: [userId]
        });

        const lastTransactions = lastTransactionResult.rows;

        const lastAccountResult = await pool.query({
            text: `SELECT * FROM accounts WHERE user_id = $1 ORDER BY createdat DESC LIMIT 4`,
            values: [userId]
        });
        const lastAccounts = lastAccountResult.rows;

        res.status(200).send({
            message: "Dashboard information fetched successfully",
            status: "Success",
            availableBalance,
            totalIncome,
            totalExpense,
            chartData: data,
            lastTransactions,

        })

    } catch (error) {

    }
}

export const addTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { account_id } = req.params;
        const { amount, description, source } = req.body;
        const userId = req.userId;

        console.log(req.body)

        if (!amount || !description || !source) {
            res.status(400).send({
                status: "Failed",
                message: "Please fill all required fields"
            });
            return;
        }

        if (amount <= 0) {
            res.status(400).send({
                status: "Failed",
                message: "Amount must be greater than 0"
            });
            return;
        }

        const result = await pool.query({
            text: `SELECT * FROM accounts WHERE id = $1`,
            values: [account_id]
        });



        const accountInfo = result.rows[0];

        if (!accountInfo) {
            res.status(404).send({
                status: "Failed",
                message: "Invalid account information"
            });
            return;
        }

        if (accountInfo.acc_balance <= 0 || accountInfo.acc_balance < Number(amount)) {
            res.status(400).send({
                status: "Failed",
                message: "Transaction Failed!! Insufficient account balance"
            });
            return;
        }

        await pool.query("BEGIN");

        await pool.query({
            text: `UPDATE accounts SET acc_balance = acc_balance - $1 WHERE id = $2 RETURNING *`,
            values: [amount, account_id]
        });

        await pool.query({
            text: `INSERT INTO transactions (user_id,description,type,status,amount,source) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            values: [userId, description, "expense", "completed", amount, source]
        });

        await pool.query("COMMIT");

        res.status(201).send({
            status: "Success",
            message: "Transaction successful"
        })
    }
    catch (error) {
        if (error instanceof Error) {
            await pool.query("ROLLBACK");

            res.status(400).send({
                status: "Failed",
                message: "Transaction Failed!!" + error.message
            });
            return;
        }
    }
}

export const transferMoneyToAccount = async (req: AuthRequest, res: any) => {
    try {

        const userId = req.userId;
        const { from_acc, to_acc, amount } = req.body;

        if (!from_acc || !to_acc || !amount) {
            res.status(400).send({
                status: "Failed",
                message: "Please fill all required fields"
            });
            return;
        }
        const newAmount = Number(amount);

        if (newAmount <= 0) {
            res.status(400).send({
                status: "Failed",
                message: "Amount must be greater than 0"
            });
            return;
        }
        const fromAccountResult = await pool.query({
            text: `SELECT * FROM accounts WHERE id = $1`,
            values: [from_acc]
        })

        const fromAccount = fromAccountResult.rows[0];
        if (!fromAccountResult.rows[0]) {
            res.status(400).send({
                status: "Failed",
                message: "Invalid account information"
            });
            return;
        }

        if (newAmount > fromAccount.acc_balance) {
            res.status(400).send({
                status: "Failed",
                message: "Insufficient account balance"
            });
            return;
        }

        const toAccountResult = await pool.query({
            text: `SELECT * FROM accounts WHERE id = $1`,
            values: [to_acc]
        })
        const toAccount = toAccountResult.rows[0];
        if (!toAccount) {
            res.status(400).send({
                status: "Failed",
                message: "Invalid account information"
            });
            return;
        }

        await pool.query("BEGIN");

        await pool.query({
            text: `UPDATE accounts SET acc_balance = acc_balance - $1, updatedAt = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            values: [newAmount, from_acc]
        });

        await pool.query({
            text: `UPDATE accounts SET acc_balance = acc_balance + $1,updatedAt = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            values: [newAmount, to_acc]
        });

        const descriptionT = `Transfer from ${fromAccount.acc_name} - ${toAccount.acc_name}`;

        await pool.query({
            text: `INSERT INTO transactions (user_id,description,type,status,amount,source) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            values: [userId, descriptionT, "expense", "completed", amount, fromAccount.acc_name]
        });

        const descriptionR = `Received from ${fromAccount.acc_name} - ${toAccount.acc_name}`;

        await pool.query({
            text: `INSERT INTO transactions (user_id,description,type,status,amount,source) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            values: [userId, descriptionR, "income", "completed", amount, toAccount.acc_name]
        });

        await pool.query("COMMIT");

        res.status(201).send({
            status: "Success",
            message: "Transaction successfully completed"
        })

    } catch (error) {
        if (error instanceof Error) {
            await pool.query("ROLLBACK");

            res.status(400).send({
                status: "Failed",
                message: "Transaction Failed!!" + error.message
            });
            return;
        }
    }
}