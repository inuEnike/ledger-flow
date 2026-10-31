import type { CreateAccountDetailsDTO } from "./accountDetails.schema"

export interface IAccountDetails {
    id: string
    account_id: string
    account_tier_id: string
    created_at: string
    updated_at: string
}
export type userRole = "user" | "admin"
export interface IAccountDetailsRepository {
    getAllAccountDetails: () => Promise<IAccountDetails[]>
    getSingleAccountDetailById: (id: string, account_id: string) => Promise<IAccountDetails | undefined>
    createAccountDetail: (data: CreateAccountDetailsDTO) => Promise<IAccountDetails[]>
}

export interface IAccountDetailsService {
    getAllAccountDetails: () => Promise<IAccountDetails[]>
    getSingleAccountDetailById: (id: string, user_id: string, account_id: string, user_role: userRole
    ) => Promise<IAccountDetails | undefined>
    createAccountDetail: (data: CreateAccountDetailsDTO, user_id: string, user_role: userRole) => Promise<IAccountDetails[]>
}