export interface IAccountDetails {
    id: string
    account_id: string
    account_tier_id: string
    created_at: string
    updated_at: string
}
export interface IAccountDetailsRepository {
    getAllAccountDetails: () => Promise<IAccountDetails[]>
}

export interface IAccountDetailsService {
    getAllAccountDetails: () => Promise<IAccountDetails[]>
}