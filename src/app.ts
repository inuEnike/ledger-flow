import express, { type Express, type Request, type Response } from "express";
import { ApiResponse } from "./util/apiResponse.ts";
import { ErrorMiddleware } from "./middleware/error.middleware.ts";
import AuthRouter from "./modules/Auth/auth.routes.ts"
import AccountRouter from "./modules/Accounts/account/accounts.routes.ts"
import AccountTierRouter from "./modules/Accounts/accountTier/accountTier.routes.ts"
import AccountDetailsRouter from "./modules/Accounts/accountDetails/accountDetails.routes.ts"
import cookieParser from "cookie-parser"
import { adminMiddleware, AuthMiddleware } from "./middleware/auth.middleware.ts";

export const app: Express = express()

app.use(express.json())
app.use(cookieParser())
const prefix = "/api/v1"

// Open routess
app.get(`${prefix}/health-check`, (_req: Request, res: Response): void => {
    ApiResponse({
        res,
        status: 200,
        message: "API beeping and healthy"
    })
})
app.use(`${prefix}/auth`, AuthRouter)

//protected routes
app.use(AuthMiddleware)

app.use(`${prefix}/accounts`, AccountRouter)
app.use(`${prefix}/account-details`, AccountDetailsRouter)

app.use(adminMiddleware)
app.use(`${prefix}/account-tier`, AccountTierRouter)






app.use(ErrorMiddleware);