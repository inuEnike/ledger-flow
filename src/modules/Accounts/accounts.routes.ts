import express from 'express'
import { sql } from '../../database/db'
import { AccountController } from './accounts.controllers'
import { AccountService } from './accounts.service'
import { AccountRepository } from './accounts.repository'


const route = express()

const repository = new AccountRepository(sql)
const service = new AccountService(repository)
const controller = new AccountController(service)


route.get("/",
    //  adminMiddleware, 
    controller.getAllAccounts).post("/", controller.createAnAccount).get("/:userId", controller.getUserAccounts).patch("/:accountId", controller.updateAccountByAccountId).get("/account/:accountId", controller.getAccountByAccountId)


export default route
