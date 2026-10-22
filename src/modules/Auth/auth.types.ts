import type { NextFunction, Request, Response } from "express"
import type { authSigninDTO, authSignupDTO } from "./auth.schema"
export const USER_STATUS = {
    active: "active",
    suspended: "suspended"
} as const

export interface IUser {
    id: string,
    email: string,
    password_hash: string
    first_name: string
    last_name: string
    status: typeof USER_STATUS
    email_verified_at: string | null
    created_at: string
    updated_at: string
}
export type PublicUser = Omit<IUser, "password_hash">

export interface IAuthRepository {
    findByEmail: (email: string) => Promise<PublicUser | null>
    createUser: (data: authSignupDTO) => Promise<IUser | null>
    updateUserStatusActive: (email: string) => Promise<IUser | null>
    updateUserStatusSuspended: (email: string) => Promise<IUser | null>
    getUserById: (id: string) => Promise<PublicUser | null>
}
export interface IAuthService {
    signup: (data: authSignupDTO) => Promise<{ message: "Signed up successful" }>
    signin: (data: authSigninDTO) => Promise<PublicUser | null>
}

