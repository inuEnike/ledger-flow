import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { ENV } from "../../util/dotenv";

interface IAccessTokenPayload extends jwt.JwtPayload {
    sub: string;
    type: "access";
    role?: string;
}

interface IRefreshTokenPayload extends jwt.JwtPayload {
    sub: string;
    sid: string;
    type: "refresh";
}

export class TokenService {
    static createSessionId = (): string => {
        return randomUUID();
    };

    static generateAccessToken = (userId: string): string => {
        const payload: IAccessTokenPayload = {
            sub: userId,
            type: "access",
        };

        return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET!, {
            expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
            issuer: "ledgerflow-auth",
        });
    };

    static generateRefreshToken = (
        userId: string,
        sessionId: string,
    ): string => {
        const payload: IRefreshTokenPayload = {
            sub: userId,
            sid: sessionId,
            type: "refresh",
        };

        return jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET!, {
            expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
            issuer: "ledgerflow-auth",
        });
    };

    static verifyRefreshToken = (token: string): IRefreshTokenPayload => {
        const payload = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET!, {
            issuer: "ledgerflow-auth",
        });

        if (
            typeof payload === "string" ||
            payload.type !== "refresh" ||
            typeof payload.sub !== "string" ||
            typeof payload.sid !== "string"
        ) {
            throw new Error("Invalid refresh token payload");
        }

        return payload as IRefreshTokenPayload;
    };
}