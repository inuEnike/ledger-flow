import type { NextFunction, Request, Response } from "express"
import type { authSigninDTO, authSignupDTO } from "./auth.schema"
export const USER_STATUS = {
    active: "active",
    suspended: "suspended"
} as const

export const USER_ROLE = {
    admin: "admin",
    user: "user"
} as const
export type userRole = typeof USER_ROLE[keyof typeof USER_ROLE]
export interface IUser {
    id: string,
    email: string,
    password_hash: string
    first_name: string
    last_name: string
    role: userRole
    status: typeof USER_STATUS
    email_verified_at: string | null
    created_at: string
    updated_at: string
}
export type PublicUser = Omit<IUser, "password_hash">

export interface IAuthRepository {
    findByEmail: (email: string) => Promise<IUser | null>
    createUser: (data: authSignupDTO) => Promise<IUser | null>
    updateUserStatusActive: (email: string) => Promise<IUser | null>
    updateUserStatusSuspended: (email: string) => Promise<IUser | null>
    getUserById: (id: string) => Promise<PublicUser | null>
}
export interface IAuthService {
    signup: (data: authSignupDTO) => Promise<{ message: "Signed up successful" }>
    signin: (data: authSigninDTO) => Promise<SigninReturnType>
}
export interface SigninReturnType {
    user: PublicUser;
    accessToken: string;
    refreshToken?: string;
}

export interface IRefreshSession {
    id: string
    user_id: string,
    token_hash: string,
    revoked_at?: string
    expires_at: Date | string
}
export interface ITokenRepository {
    createRefreshSession(
        data: IRefreshSession
    ): Promise<IRefreshSession | null>;

    findSessionById(
        sessionId: string
    ): Promise<IRefreshSession | null>;

    updateSessionTokenHash(
        sessionId: string,
        oldTokenHash: string,
        newTokenHash: string
    ): Promise<{ id: string } | null>;

    revokeSession(
        sessionId: string
    ): Promise<{ id: string } | null>;
}