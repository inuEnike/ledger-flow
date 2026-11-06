import express from "express"
import { TransactionController } from "./transactions.controllers"
import { TrasactionService } from "./transactions.service"
import { TransactionRepository } from "./transactions.repository"
import { sql } from "../../../database/db"
import { AccountRepository } from "../../Accounts/account/accounts.repository"
const router = express()

const transactionRepository = new TransactionRepository(sql)
const accountRepository = new AccountRepository(sql)
const transactionService = new TrasactionService(transactionRepository, accountRepository)
const transactionController = new TransactionController(transactionService)
router.post("/", transactionController.transferFunds).get("/:tnxId/transaction/:userId", transactionController.getTrasactionsByid)

export default router