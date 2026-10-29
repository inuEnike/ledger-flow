import type { NextFunction, Request, Response } from "express";
import { FORBIDDEN_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from "./error.middleware";
import jwt, { JsonWebTokenError, type JwtPayload } from "jsonwebtoken"
import { ENV } from "../util/dotenv";
import { sql } from "../database/db";
import type { IUser } from "../modules/Auth/auth.types";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}

export const AuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    const authHeaders = req.headers.authorization
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
        throw new UNAUTHORIZED_EXCEPTION("Unauthorized; Invalid token")
    }
    const token = authHeaders.split(" ")[1]
    if (!token) {
        throw new NOT_FOUND_EXCEPTION("Access token not found")
    }
    try {
        if (!ENV.ACCESS_TOKEN_SECRET) {
            throw new Error("Secret not defined")
        }

        const payload = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET, {
            issuer: "ledgerflow-auth"
        }) as JwtPayload
        if (typeof payload === "string" || !payload || payload.type !== "access" || payload.iss !== "ledgerflow-auth") {
            throw new UNAUTHORIZED_EXCEPTION("Invalid token provided, Unauthorized!!")
        }


        const [user] = await sql`
            SELECT id, role
            FROM auth.users
            WHERE id = ${payload.sub!}
        `;

        if (!user) {
            throw new UNAUTHORIZED_EXCEPTION("User not found");
        }

        req.user = {
            id: user.id,
            role: user.role,
        };
        next()

    }
    catch (error) {
        if (error instanceof UNAUTHORIZED_EXCEPTION) {
            throw error;
        }

        if (error instanceof JsonWebTokenError) {
            throw new UNAUTHORIZED_EXCEPTION("Invalid or expired access token");
        }

        throw error;
    }
}


export const adminMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    try {


        if (!req.user) {
            throw new UNAUTHORIZED_EXCEPTION("Authentication required");
        }
        if (req.user?.role !== "admin") {
            throw new FORBIDDEN_EXCEPTION("You can't access this resource; Permission not granted")
        }

        next()
    } catch (error) {
        next(error);
    }

}