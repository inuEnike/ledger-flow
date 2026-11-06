import type { NextFunction, Request, Response } from "express";
import type { ITransactionServices } from "./transactions.types";
import type { userRole } from "../../Auth/auth.types";
import { ApiResponse } from "../../../util/apiResponse";
import { BAD_REQUEST_EXCEPTION, UNAUTHORIZED_EXCEPTION } from "../../../middleware/error.middleware";
import { transferFundsSchema } from "./transactions.schema";

export class TransactionController {
    private readonly transactionServices: ITransactionServices
    constructor(transactionServices: ITransactionServices) {
        this.transactionServices = transactionServices
    }
    getTrasactionsByid = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user?.id
            const userRole = req.user?.role

            const { id, accountId } = req.params
            if (
                typeof id !== "string" ||
                typeof accountId !== "string"
            ) {
                throw new BAD_REQUEST_EXCEPTION("Invalid route parameters")
            }
            if (!userId || !userRole) {
                throw new UNAUTHORIZED_EXCEPTION("Unauthorized")
            }

            const tnx = await this.transactionServices.getTrasactionsByid(
                id,
                accountId,
                userId,
                userRole as userRole
            )

            return ApiResponse({
                res,
                message: "Transaction fetched successfully",
                status: 200,
                data: tnx
            })

        } catch (error) {
            next(error)
        }
    }
    transferFunds = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const { service_account_id, destination_account_id, amount } =
                transferFundsSchema.parse(req.body)
            const id = req.user?.id
            const role = req.user?.role


            const tnx = await this.transactionServices.transferFunds(service_account_id, destination_account_id, id as string, amount, role as userRole)
            return ApiResponse({
                res,
                message: "Transaction fetched successfully",
                status: 200,
                data: tnx
            })
        } catch (error) {
            next(error)
        }
    }
}