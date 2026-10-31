import { ApiResponse } from "../../../util/apiResponse";
import type { IAccountDetailsService, userRole } from "./accountDetails.types";
import type { NextFunction, Request, Response } from "express";

export class AccountDetailsController {
    private readonly accountDetailsService: IAccountDetailsService
    constructor(accountDetailsService: IAccountDetailsService) {
        this.accountDetailsService = accountDetailsService
    }
    getAllAccountDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountDetails = await this.accountDetailsService.getAllAccountDetails()

            ApiResponse({
                res,
                message: `${accountDetails.length} account(s)found`,
                status: 200,
                data: accountDetails
            })
        } catch (error) {
            next(error)
        }
    }
    getSingleAccountDetailById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { accountDetailId } = req.params
            const { accountId } = req.params
            const role = req.user?.role
            const userId = req.user?.id

            const accountDetail = await this.accountDetailsService.getSingleAccountDetailById(accountDetailId as string, userId as string, accountId as string, role as userRole)

            ApiResponse({
                res,
                message: `account with the ID of ${accountDetail?.account_id} found`,
                status: 200,
                data: accountDetail
            })
        } catch (error) {
            next(error)
        }
    }
}