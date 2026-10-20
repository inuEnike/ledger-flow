import type { authSignupDTO } from "./auth.schema"
export enum USER_STATUS {
    active = "active",
    suspended = "suspended"
}

export interface IUser {
    id: string,
    email: string,
    password_hash: string
    first_name: string
    last_name: string
    status: string
    email_verified_at: USER_STATUS
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
export interface IAuthController {
    signup: (data: authSignupDTO) => Promise<{ data: "Signed up successful" }>
}
