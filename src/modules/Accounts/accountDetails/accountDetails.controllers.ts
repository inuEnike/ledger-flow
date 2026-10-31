import { ApiResponse } from "../../../util/apiResponse";
import type { IAccountDetailsService } from "./accountDetails.types";
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
}