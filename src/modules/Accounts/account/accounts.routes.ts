import express from 'express'
import { sql } from '../../../database/db'
import { AccountController } from './accounts.controllers'
import { AccountService } from './accounts.service'
import { AccountRepository } from './accounts.repository'
import { adminMiddleware } from '../../../middleware/auth.middleware'


const route = express()

const repository = new AccountRepository(sql)
const service = new AccountService(repository)
const controller = new AccountController(service)


route.get("/", adminMiddleware, controller.getAllAccounts)
    .post("/", controller.createAnAccount)
    .get("/:userId", controller.getUserAccounts)
    .patch("/:accountId", controller.updateAccountByAccountId)
    .get("/account/:accountId", controller.getAccountByAccountId)
    .patch("/close-account/:accountId", controller.deleteAccountById)
    .patch('/account-status/:accountId', controller.updateAccountStatus)


export default route
