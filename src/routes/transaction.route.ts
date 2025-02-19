import { Router, Request, Response, NextFunction } from "express";
import { depositBalance, withdrawMoney } from "../controllers/deposit.controller";

const router = Router();

router.post('/deposit', (req:Request, res:Response, next:NextFunction) => {
    depositBalance(req, res)
});

router.post('/withdraw', (req:Request, res:Response, next:NextFunction) => {
    withdrawMoney(req, res)
});

export default router;