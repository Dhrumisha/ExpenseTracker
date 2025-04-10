import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware';
import { changePassword, deleteAllUsers, deleteUser, forgetPassword, getAllUsers, getUser, resetPassword, updateUser } from '../controller/UserController';
import { validateRequest } from '../middleware/validationMiddleware';
import { changePasswordSchema, resetPasswordSchema, forgetPasswordSchema, updateUserSchema } from '../validation/userValidation';

const router = express.Router();

router.get('/lists', getAllUsers);
router.get('/', authMiddleware, getUser);
router.put("/change-password", authMiddleware, validateRequest(changePasswordSchema), changePassword);
router.put("/reset-password/:token", authMiddleware, validateRequest(resetPasswordSchema), resetPassword);
router.put("/forget-password", authMiddleware, validateRequest(forgetPasswordSchema), forgetPassword);
router.put("/", authMiddleware, validateRequest(updateUserSchema), updateUser);
router.delete("/", authMiddleware, deleteUser);
router.delete("/list", deleteAllUsers);

export default router;
    