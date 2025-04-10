import express from 'express';
import { addMoneyToAccount, createAccount, getAllAccount,getAccount,deleteAccount, deleteAllAccount } from '../controller/AccountController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get("/",authMiddleware,getAllAccount);
router.get("/:id",authMiddleware,getAccount);
router.post("/create",authMiddleware,createAccount);
router.delete("/:id",authMiddleware,deleteAccount);
router.delete("/",authMiddleware,deleteAllAccount);
router.put("/add-money/:id",authMiddleware,addMoneyToAccount);

export default router;