import { Router, Request, Response, NextFunction } from "express";
import { authenticateUser } from "../controllers/auth.controller";

const router = Router();

router.post('/register', (req:Request, res:Response, next:NextFunction) => {
    authenticateUser(req, res)
});

export default router;