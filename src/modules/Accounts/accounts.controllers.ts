import type { NextFunction, Request, Response } from "express";
import type { IAccountService } from "./accounts.types";
import { ApiResponse } from "../../util/apiResponse";
import { AccountSchema } from "./accounts.schema";
import { generateAccountNumber } from "../../util/generateAccountNumber";
import { NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from "../../middleware/error.middleware";

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
    createAnAccount = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body

        console.log(data);

        const userId = req.user
        console.log(userId);

        const result = AccountSchema.parse(data)

        console.log({ result });


        const accountNumber = generateAccountNumber()
        console.log(accountNumber);

        const account = await this.accountService.createAnAccount({
            ...result,
            user_id: userId,
            account_number: accountNumber
        })
        console.log({ account });

        ApiResponse({
            res,
            message: "Account created successfully",
            status: 201,
            data: account
        })
    }

    getUserAccounts = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params
        if (!userId) {
            throw new NOT_FOUND_EXCEPTION("Account ID is required")
        }
        const loggedinUserId = req.user
        if (userId !== loggedinUserId) {
            throw new UNAUTHORIZED_EXCEPTION("Unauthorized; You are not allowed here!!")
        }
        const accounts = await this.accountService.getUserAccounts(userId as string)

        ApiResponse({
            res,
            message: "User account(s) found ",
            status: 200,
            data: accounts
        })
    }
}