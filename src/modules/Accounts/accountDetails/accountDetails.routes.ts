import express from "express"
import { AccountDetailsController } from "./accountDetails.controllers"
import { AccountDetailsService } from "./accountDetails.services"
import { AccountDetailsRepository } from "./accountDetails.repository"
import { sql } from "../../../database/db"
import { adminMiddleware } from "../../../middleware/auth.middleware"
import { AccountRepository } from "../account/accounts.repository"

const router = express()
const repository = new AccountDetailsRepository(sql)
const accountRepository = new AccountRepository(sql)
const service = new AccountDetailsService(repository, accountRepository)
const controller = new AccountDetailsController(service)
router.get('/', adminMiddleware, controller.getAllAccountDetails).get('/:accountId/details/:accountDetailId', controller.getSingleAccountDetailById)


export default router 