import express from "express";
import { AuthController } from "./auth.controllers.ts";
import { AuthService } from "./auth.services.ts";
import { AuthRepository } from "./auth.repository.ts";
import { sql } from "../../database/db.ts";
import { TokenRepository } from "./refresh-session.repository.ts";
const route = express()

const repository = new AuthRepository(sql)
const tokenRepository = new TokenRepository(sql)
const service = new AuthService(repository, tokenRepository)
const controller = new AuthController(service)
route.post("/signup", controller.signup).post("/signin", controller.signin).post("/refresh", controller.refresh).post("/logout", controller.logout)

export default route