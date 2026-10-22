import express, { type Express, type Request, type Response } from "express";
import { ApiResponse } from "./util/apiResponse.ts";
import { ErrorMiddleware } from "./middleware/error.middleware.ts";
import AuthRouter from "./modules/Auth/auth.routes.ts"

export const app: Express = express()

app.use(express.json())
const prefix = "/api/v1"

app.use(`${prefix}/auth`, AuthRouter)

app.get(`${prefix}/health-check`, (_req: Request, res: Response): void => {
    ApiResponse({
        res,
        status: 200,
        message: "API beeping and healthy"
    })
})


app.use(ErrorMiddleware);