import { Request, Response } from "express"
import pool from "../config/db";

export const getAllAccount = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body.user;

        const accounts = await pool.query({
            text: `SELECT * FROM accounts WHERE user_id = $1`,
            values: [userId]
        });

        if (!accounts.rows[0]) {
            res.status(400).json({
                status: "Failed",
                message: "Account not found for this user"
            });
            return;
        }

        res.status(200).json({
            status: "Success",
            message: "All accounts retrieved successfully",
            data: accounts.rows
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                status: "Failed",
                message: error.message
            });
            return;
        }
    }
}

export const getAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const account = await pool.query({
            text: `SELECT * FROM accounts WHERE id = $1`,
            values: [id]
        });
        if (!account.rows[0]) {
            res.status(400).json({
                status: "Failed",
                message: "Account not found"
            }); 
            return;
        }

        res.status(200).json({
            status: "Success",
            message: "Account retrieved successfully",
            data: account.rows[0]
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                status: "Failed",
                message:"can not get account with this id"
            });
        }
    }
}

export const createAccount = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body.user;
        const { name, amount, acc_number } = req.body;

        const accountExistQuery = await pool.query({
            text: `SELECT * FROM accounts WHERE acc_name = $1 AND user_id = $2`,
            values: [name, userId]
        });

        const accountExist = accountExistQuery.rows[0];

        if (accountExist) {
            res.status(400).json({
                status: "Failed",
                message: "Account already exist"
            })
            return;
        }

        const createAccountResult = await pool.query({
            text: `INSERT INTO accounts (user_id,acc_name,acc_balance,acc_number) VALUES ($1,$2,$3,$4) RETURNING *`,
            values: [userId, name, amount, acc_number]
        });

        const newAccount = createAccountResult.rows[0];

        const userAccount = Array.isArray(name) ? name : [name];

        const updateUserAccount = await pool.query({
            text: `UPDATE users SET account = array_cat(account,$1) WHERE id = $2 RETURNING *`,
            values: [userAccount, userId]
        });

            const description = newAccount.acc_name + "(Initial deposit)";

        const transactionInitialQuery = {
            text: `INSERT INTO transactions (user_id,description,status,source,amount,type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            values: [userId, description, "complted", newAccount.acc_name, amount, "income"]
        };
        await pool.query(transactionInitialQuery);

        res.status(200).json({
            status: "Success",
            message: "Account created successfully",
            data: newAccount
        })
        return;

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                status: "Failed",
                message: error.message
            });
            return;
        }
    }
}

export const addMoneyToAccount = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.params;
        const { amount } = req.body;

        const newAmount = parseInt(amount);
        
        const accountQuery = await pool.query({
            text: `SELECT * FROM accounts WHERE id = $1 AND user_id = $2`,
            values: [id, userId] 
        })
        
        const account = accountQuery.rows[0];

        if (!account) {
            res.status(400).json({
                status: "Failed",
                message: "Account not found"
            });
            return;
        }

        const addMoneyQuery = await pool.query({
            text: `UPDATE accounts SET acc_balance = (CAST(acc_balance AS INTEGER) + $1), updatedAt = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            values: [newAmount, id]
        });

        const accountInformation = addMoneyQuery.rows[0];

        const description = accountInformation.acc_name + "(Deposit)";

        const transactionQuery = {
            text: `INSERT INTO transactions (user_id,description,status,source,amount,type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            values: [userId, description, "complted", accountInformation.acc_name, amount, "income"]
        }
        await pool.query(transactionQuery);

        res.status(200).json({
            status: "Success",
            message: "Money added successfully",
            data: accountInformation
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                status: "Failed",
                message: error.message
            });
            return;
        }
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body.user;

        // Get account information before deletion
        const accountQuery = await pool.query({
            text: `SELECT * FROM accounts WHERE id = $1 AND user_id = $2`,
            values: [id, userId]
        });
        const account = accountQuery.rows[0];

        if (!account) {
            res.status(404).json({
                status: "Failed",
                message: "Account not found"
            });
            return;
        }

        // Delete related transactions
        await pool.query({
            text: `DELETE FROM transactions WHERE source = $1 AND user_id = $2`,
            values: [account.acc_name, userId]
        });

        // Update user's account array
        await pool.query({
            text: `UPDATE users SET account = array_remove(account, $1) WHERE id = $2`,
            values: [account.acc_name, userId]
        });

        // Delete the account
        const deleteAccountQuery = await pool.query({
            text: `DELETE FROM accounts WHERE id = $1 RETURNING *`,
            values: [id]
        });
        const deletedAccount = deleteAccountQuery.rows[0];

        res.status(200).json({
            status: "Success",
            message: "Account and related data deleted successfully",
            data: deletedAccount
        });

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                status: "Failed",
                message: "Cannot delete account: " + error.message
            });
            return;
        }
    }
}
export const deleteAllAccount = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body.user;

        // Delete all related transactions 
        await pool.query({
            text: `DELETE FROM transactions WHERE user_id = $1`,
            values: [userId] 
        })

        // Delete all accounts
        await pool.query({
            text: `DELETE FROM accounts WHERE user_id = $1`,
            values: [userId]
        });

        // Update user's account array to an empty array
        await pool.query({
            text: `UPDATE users SET account = '{}' WHERE id = $1`,
            values: [userId]
        });

        res.status(200).json({
            status: "Success",
            message: "All accounts and related data deleted successfully"
        });
        
    } 
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                status: "Failed",
                message: "Cannot delete account: " + error.message
            });
            return;
        } 
    }
}