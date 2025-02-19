import { Request, Response } from "express";
import { User } from "../models/user.model";
import { ATM } from "../models/atm.model";
import { calculateNotesToDispense } from "../utils/denomValid";




export const depositBalance = async (req:Request, res:Response) => {
    const { denominations, userId } = req.body;
    try {
        
    let totalDeposit = 0;

    for (const denom in denominations) {
        const denominationValue = Number(denom);  
        const count = denominations[denom];    
        totalDeposit += denominationValue * count;
      } 

    const user:any = await User.findOne({ _id: userId });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
  
        let availableBalance = user.balance;
        availableBalance += totalDeposit;
        let allTransactions:any = user.transactions;
        let currentTransaction = {
            type: 'deposit',
            amount: totalDeposit,
            timestamp: new Date()
        }
        allTransactions.push(currentTransaction)
        const updatedUser = { ...user, balance:availableBalance, transactions: allTransactions };
        Object.assign(user, updatedUser);
        await user.save();

        let atm = await ATM.findOne();
        if (!atm) {
            
            atm = new ATM({
                denominations: {
                    "50": 0,
                    "100": 0,
                    "200": 0,
                    "500": 0,
                    "2000": 0
                },
                balance: 0
            });
        }


        
        let updatedBalance = atm.balance;
        for (const denom in denominations) {
            const count = denominations[denom];
            atm.denominations[denom] += count;
            updatedBalance += Number(denom) * count;
        }
        
        
        atm.balance = updatedBalance;
        atm.lastUpdated = new Date();
        await atm.save();

        return res.status(200).json({
            success: true,
            message: "Amount Deposited"
        });

    

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
}

export const withdrawMoney = async (req: Request, res: Response) => {
    const { amount, userId } = req.body;
    
    try {
        
        if (!amount || amount <= 0 || !Number.isInteger(amount)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid withdrawal amount"
            });
        }
        
        
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        
        if (user.balance < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance"
            });
        }
        
        
        const atm = await ATM.findOne();
        if (!atm) {
            return res.status(404).json({
                success: false,
                message: "ATM not available"
            });
        }
        
        
        if (atm.balance < amount) {
            return res.status(400).json({
                success: false,
                message: "ATM has insufficient funds"
            });
        }
        
        
        const dispensedNotes = calculateNotesToDispense(atm.denominations, amount);
        
        if (!dispensedNotes) {
            return res.status(400).json({
                success: false,
                message: "Cannot dispense the requested amount with available denominations"
            });
        }
        
       
        for (const denom in dispensedNotes) {
            atm.denominations[denom] -= dispensedNotes[denom];
        }
        
        // Save ATM (balance will be auto-calculated by pre-save hook)
        await atm.save();
        
       
        user.balance -= amount;
        await user.save();
        
        
        return res.status(200).json({
            success: true,
            message: "Withdrawal successful",
            dispensedNotes,
            remainingBalance: user.balance
        });
        
    } catch (error) {
        console.error("Withdrawal error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};