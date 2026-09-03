import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { changePassword, deleteUser, forgetPassword, getMe, getUser, resetPassword, updateUser } from '../controller/UserController';
import { validateRequest } from '../middleware/validationMiddleware';
import { changePasswordSchema, resetPasswordSchema, forgetPasswordSchema, updateUserSchema } from '../validation/userValidation';

const router = express.Router();

router.get('/', authMiddleware, getUser);
router.put("/change-password", authMiddleware, validateRequest(changePasswordSchema), changePassword);
router.put("/reset-password/:token", validateRequest(resetPasswordSchema), resetPassword);
router.put("/forget-password", validateRequest(forgetPasswordSchema), forgetPassword);
router.put("/", authMiddleware, validateRequest(updateUserSchema), updateUser);
router.delete("/", authMiddleware, deleteUser);
router.get("/me", authMiddleware, getMe);

export default router;
