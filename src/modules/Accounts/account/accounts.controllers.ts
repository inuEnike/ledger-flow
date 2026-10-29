import type { NextFunction, Request, Response } from "express";
import type { IAccountService } from "./accounts.types";
import { ApiResponse } from "../../../util/apiResponse";
import { AccountSchema, deleteAccountSchema, updateAccountSchema, updateAccountStatusSchema } from "./accounts.schema";
import { generateAccountNumber } from "../../../util/generateAccountNumber";
import { BAD_REQUEST_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION, VALIDATION_EXCEPTION } from "../../../middleware/error.middleware";

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



            const userId = req.user?.id
            if (!userId) {
                throw new UNAUTHORIZED_EXCEPTION("Authentication required")
            }


            const result = AccountSchema.parse(data)



            const accountNumber = generateAccountNumber()

            const account = await this.accountService.createAnAccount({
                ...result,
                user_id: userId,
                account_number: accountNumber
            })

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
            const loggedinUserId = req.user?.id
            const loggedInUserRole = req.user?.role
            if (userId !== loggedinUserId) {
                throw new UNAUTHORIZED_EXCEPTION("Unauthorized; You are not allowed here!!")
            }
            const accounts = await this.accountService.getUserAccounts(userId as string, loggedInUserRole as string)

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
            const userId = req.user?.id
            if (!userId) {
                throw new UNAUTHORIZED_EXCEPTION("Authentication required")
            }
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
            const account = await this.accountService.updateAccountByAccountId(validatedData, accountId as string, userId)
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

            const userId = req.user?.id

            const user_role = req.user?.role
            console.log({ user_role });


            if (!userId || !user_role) {
                throw new UNAUTHORIZED_EXCEPTION("Authentication required")
            }

            const account = await this.accountService.getAccountByAccountId(accountId as string, userId, user_role)

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
    updateAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { accountId } = req.params
            if (!accountId) {
                throw new UNAUTHORIZED_EXCEPTION("Authentication is required")
            }
            const { status } = req.body
            const result = updateAccountStatusSchema.safeParse({ status, accountId })
            if (!result.success) {
                throw new VALIDATION_EXCEPTION(
                    result.error.issues.map(issue => issue.message).join(", ")
                )
            }


            const account = await this.accountService.updateAccountStatus(result.data.status, result.data.accountId as string)
            ApiResponse({
                res,
                message: "Account Updated successfully",
                status: 200,
                data: account
            })

        }
        catch (error) {
            next(error)
        }
    }

    deleteAccountById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new UNAUTHORIZED_EXCEPTION("Authentication required")
            }
            const { accountId } = req.params

            const result = deleteAccountSchema.safeParse({ accountId, userId })
            if (!result.success) {
                throw new VALIDATION_EXCEPTION(
                    result.error.issues.map(issue => issue.message).join(", ")
                );
            }

            const account = await this.accountService.deleteAccountById(result.data.accountId, userId)

            ApiResponse({
                res,
                message: "Account Deleted successfully",
                status: 200,
                data: account
            })

        } catch (error) {
            next(error)
        }
    }
}