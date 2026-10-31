import express from "express"
import { AccountDetailsController } from "./accountDetails.controllers"
import { AccountDetailsService } from "./accountDetails.services"
import { AccountDetailsRepository } from "./accountDetails.repository"
import { sql } from "../../../database/db"
import { adminMiddleware } from "../../../middleware/auth.middleware"

const router = express()
const repository = new AccountDetailsRepository(sql)
const service = new AccountDetailsService(repository)
const controller = new AccountDetailsController(service)
router.get('/', adminMiddleware, controller.getAllAccountDetails)