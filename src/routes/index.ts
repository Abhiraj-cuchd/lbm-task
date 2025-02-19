import express from 'express';
import authRouter from './auth.route'
import transactRouter from './transaction.route'

const router = express.Router();

// Single router.use with all routes
router.use("/auth", authRouter);
router.use("/transact", transactRouter);


export default router;