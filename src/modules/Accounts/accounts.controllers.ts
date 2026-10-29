import type { NextFunction, Request, Response } from "express";
import type { IAccountService } from "./accounts.types";
import { ApiResponse } from "../../util/apiResponse";
import { AccountSchema, updateAccountSchema } from "./accounts.schema";
import { generateAccountNumber } from "../../util/generateAccountNumber";
import { BAD_REQUEST_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from "../../middleware/error.middleware";

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
        try {

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

        } catch (error) {
            next(error)
        }
    }

    getUserAccounts = async (req: Request, res: Response, next: NextFunction) => {
        try {

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
        catch (error) {
            next(error)
        }
    }

    updateAccountByAccountId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = req.user

            const { accountId } = req.params

            if (!accountId) {
                throw new BAD_REQUEST_EXCEPTION("Account ID is required")
            }
            const data = req.body
            const result = updateAccountSchema.safeParse(data);

            if (!result.success) {
                const message = result.error.issues
                    .map((issue) => issue.message)
                    .join(", ");

                throw new BAD_REQUEST_EXCEPTION(message);
            }

            const validatedData = result.data;
            const account = await this.accountService.updateAccountByAccountId(validatedData, accountId as string, user_id)
            ApiResponse({
                res,
                message: "User account(s) found ",
                status: 204,
                data: account
            })
        } catch (error) {
            next(error)
        }
    }

    getAccountByAccountId = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { accountId } = req.params

            const userId = req.user

            const account = await this.accountService.getAccountByAccountId(accountId as string, userId)

            ApiResponse({
                res,
                message: "Account found ",
                status: 200,
                data: account
            })
        } catch (error) {
            next(error)
        }

    }
}