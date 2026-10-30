import express from "express";
import { AccountTierController } from "./accountTier.controller";
import { AccountTierService } from "./accountTier.services";
import { AccountTierRepository } from "./accountTier.repository";
import { sql } from "../../../database/db";

const route = express()
const repository = new AccountTierRepository(sql)
const service = new AccountTierService(repository)
const controllers = new AccountTierController(service)
route.get("/", controllers.getAllTiers).post('/', controllers.createTier).patch('/:id', controllers.updateTierById)

export default route