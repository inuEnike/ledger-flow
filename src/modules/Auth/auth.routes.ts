import express from "express";
import { AuthController } from "./auth.controllers.ts";
import { AuthService } from "./auth.services.ts";
import { AuthRepository } from "./auth.repository.ts";
import { sql } from "../../database/db.ts";
const route = express()

const repository = new AuthRepository(sql)
const service = new AuthService(repository)
const controller = new AuthController(service)
route.post("/signup", controller.signup)

export default route