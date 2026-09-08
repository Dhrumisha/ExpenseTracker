import express from 'express';

import authRoutes from './authRoutes';
import transactionRoutes from './transactionRoutes';
import accountRoutes from './accountRoutes';
import userRoutes from './userRoutes';
import { getHealth, getHealthDb } from '../controller/HealthController';

const router = express.Router();

router.get('/health', getHealth);
router.get('/health/db', getHealthDb);

router.use('/auth', authRoutes);
router.use('/transaction', transactionRoutes);
router.use('/account', accountRoutes);
router.use('/user', userRoutes);

export default router;