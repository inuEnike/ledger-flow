import express, { type Express, type Request, type Response } from "express";
import { ApiResponse } from "./util/apiResponse.ts";


export const app: Express = express()
const prefix = "/api/v1"

app.get(`${prefix}/health-check`, (_req: Request, res: Response): void => {
    ApiResponse({
        res,
        status: 200,
        message: "API beeping and healthy"
    })
})