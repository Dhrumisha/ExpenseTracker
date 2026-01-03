import express from 'express';
import { LogoutUser, SignInUser, SignUpUser }  from '../controller/AuthController';
import { validateRequest } from '../middleware/validationMiddleware';
import { signUpSchema, signInSchema } from '../validation/userValidation';

const router = express.Router();

router.post("/sign-up", validateRequest(signUpSchema), SignUpUser);
router.post("/sign-in", validateRequest(signInSchema), SignInUser);
router.post("/logout", LogoutUser);

export default router;