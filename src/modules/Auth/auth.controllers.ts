import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "./auth.services.ts";
import { type authSignupDTO, type authSigninDTO, AuthSignupSchema, AuthSigninSchema } from "./auth.schema.ts";
import z from "zod";
import { BAD_REQUEST_EXCEPTION, NOT_FOUND_EXCEPTION } from "../../middleware/error.middleware.ts";
import { ApiResponse } from "../../util/apiResponse.ts";
import type { SigninReturnType } from "./auth.types.ts";


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


    signin = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const data = req.body

            const result = AuthSigninSchema.parse(data)

            const user = await this.authService.signin(result)

            if (!user) {
                throw new BAD_REQUEST_EXCEPTION("An error occurred")
            }
            const signinReturnData: Omit<SigninReturnType, "refreshToken"> = {
                accessToken: user.accessToken,
                user: user.user

            }

            res.cookie("refresh_token", user.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,
                httpOnly: true,
                sameSite: "lax",
                path: "/api/v1/auth",
            })
            ApiResponse({
                res,
                status: 200,
                message: "Logged in successfully",
                data: signinReturnData
            })
        }
        catch (error) {
            next(error)
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        const token = req?.cookies?.refresh_token
        
        if (!token) {
            throw new NOT_FOUND_EXCEPTION("Refresh token not found, it is reqired!")
        }
        const { accessToken, refreshToken } = await this.authService.refresh(token)
        

        res.cookie("refresh_token", refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax",
            path: "/api/v1/auth",
        })

        return ApiResponse({
            res,
            status: 200,
            message: "Token refreshed successfully",
            data: {
                accessToken,
            },
        });
    }
}