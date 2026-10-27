import type { NextFunction, Request, Response } from "express";
import type { IAccountService } from "./accounts.types";
import { ApiResponse } from "../../util/apiResponse";

export class AccountController {
    private readonly accountService: IAccountService
    constructor(accountService: IAccountService) {
        this.accountService = accountService
    }

    getAllAccounts = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const accounts = await this.accountService.getAllAccounts()

            ApiResponse({
                res,
                message: `${accounts.length} account(s)found`,
                status: 200,
                data: accounts
            })
        } catch (error) {
            next(error)
        }

    }
}