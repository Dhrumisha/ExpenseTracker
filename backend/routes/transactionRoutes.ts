import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { addTransaction, getDashboardInfo, getTransaction, transferMoneyToAccount } from '../controller/TransactonController';

const router = express.Router();

router.get("/",authMiddleware,getTransaction);
router.get("/dashboard",authMiddleware,getDashboardInfo);
router.post("/add-transaction/:account_id",authMiddleware,addTransaction);
router.put("/transfer-money",authMiddleware,transferMoneyToAccount);

export default router;