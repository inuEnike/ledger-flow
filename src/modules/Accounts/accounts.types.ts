import type { accountDTO, updateAccountDTO } from "./accounts.schema";

export const ACCOUNT_STATUS = {
    ACTIVE: "active",
    FROZEN: "frozen",
    CLOSED: "closed"
} as const


export type STATUS =
    typeof ACCOUNT_STATUS[keyof typeof ACCOUNT_STATUS];

export const ACCOUNT_TYPE = {
    SAVINGS: "savings",
    CURRENT: "current",
} as const
export type AccountType = typeof ACCOUNT_TYPE[keyof typeof ACCOUNT_TYPE]


export const CURRENCY = {
    NAIRA: "NGN",
    CEDIS: "GHS",
    WEST_AFRICAN_CFA_FRANC: "XOF",
    CENTRAL_AFRICAN_CFA_FRANC: "XAF",
} as const

export type CurrencyCode =
    typeof CURRENCY[keyof typeof CURRENCY];
export interface IAccount {
    id: string
    account_type: AccountType
    user_id: string
    account_number: string
    status: STATUS
    currency: CurrencyCode
    created_at: string
    updated_at: string
}
export type CreateAccountData = Pick<
    IAccount,
    "account_type" | "user_id" | "account_number" | "currency"
>;
export interface IAccountRepository {
    getAllAccounts: () => Promise<IAccount[]>
    getAccountDetailsByUserId: (userId: string) => Promise<IAccount[]>
    createAnAccount: (data: CreateAccountData) => Promise<IAccount[]>
    getUserAccounts: (userId: string) => Promise<IAccount[]>
    getAccountByAccountId: (accountId: string, userId: string) => Promise<IAccount[]>
    updateAccountByAccountId: (data: updateAccountDTO, account_id: string, user_id: string) => Promise<IAccount[]>
}

export interface IAccountService {
    getAllAccounts: () => Promise<IAccount[]>
    createAnAccount: (data: CreateAccountData) => Promise<IAccount[]>
    getUserAccounts: (userId: string) => Promise<IAccount[]>
    getAccountByAccountId: (accountId: string, userId: string) => Promise<IAccount[]>
    updateAccountByAccountId: (data: updateAccountDTO, account_id: string, user_id: string) => Promise<IAccount[]>
}