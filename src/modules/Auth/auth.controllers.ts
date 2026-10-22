import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "./auth.services.ts";
import { type authSignupDTO, type authSigninDTO, AuthSignupSchema } from "./auth.schema.ts";
import z from "zod";
import { BAD_REQUEST_EXCEPTION } from "../../middleware/error.middleware.ts";
import { ApiResponse } from "../../util/apiResponse.ts";


export class AuthController {
    private readonly authService: AuthService
    constructor(authService: AuthService) {
        this.authService = authService
    }
    signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body

            const result = AuthSignupSchema.parse(data)

            const user = await this.authService.signup(result)

            if (!user) {
                throw new BAD_REQUEST_EXCEPTION("An error occurred")
            }
            ApiResponse<typeof user>({
                res,
                message: "Authentication Success",
                status: 201,
                data: user
            })
        } catch (error) {

            next(error);

        }
    }
}
