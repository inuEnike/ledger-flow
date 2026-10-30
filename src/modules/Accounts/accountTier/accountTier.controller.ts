import type { NextFunction, Request, Response } from "express";
import type { IAccountTierService } from "./accountTier.types";
import { ApiResponse } from "../../../util/apiResponse";

export class AccountTierController {
    private readonly accountTierService: IAccountTierService
    constructor(accountTierService: IAccountTierService) {
        this.accountTierService = accountTierService
    }

    getAllTiers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tiers = await this.accountTierService.getAllTiers()
            ApiResponse({
                res,
                message: `${tiers.length} account tier(s) found`,
                status: 200,
                data: tiers
            })
        } catch (error) {
            next(error)
        }
    }

    createTier = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const tier = await this.accountTierService.createTier(data)
            ApiResponse({
                res,
                message: `account tier(s) created successfully`,
                status: 201,
                data: tier
            })
        } catch (error) {
            next(error)
        }
    }

}