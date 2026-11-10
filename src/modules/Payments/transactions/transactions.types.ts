import type { CurrencyCode, STATUS } from "../../Accounts/account/accounts.types"
import type { userRole } from "../../Auth/auth.types"

export const Transaction_type = {
    TRANSFER: "transfer",
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdrawal"
} as const
export type TransactionType = typeof Transaction_type[keyof typeof Transaction_type]

export const Transaction_status = {
    PENDING: "pending",
    PROCESSING: "processing",
    SUCCESSFUL: "successful",
    FAILED: "failed"
} as const
export type TransactionStatus = typeof Transaction_status[keyof typeof Transaction_status]

export interface ITransactions {
    id: string
    reference: string
    user_id: string
    transaction_type: TransactionType
    source_account_id: string
    destination_account_id: string
    amount: number
    currency: CurrencyCode
    status: TransactionStatus
    description: string
    created_at: string
    updated_at: string
}


export interface ITransactionRepository {
    getAllTransactions: () => Promise<ITransactions | undefined>
    transferFunds: (service_account_id: string, destination_account_id: string, user_id: string, amount: number, pin: string) => Promise<ITransactions | undefined>
    getTransactionById: (id: string, user_id: string) => Promise<ITransactions | undefined>
    getTrasactionsByTnxReference: (id: string, user_id: string) => Promise<ITransactions | undefined>
    getTransactionsByStatus: (status: STATUS, userId: string, account_id: string, user_role: string) => Promise<ITransactions[]>
}

export interface ITransactionServices {
    getTrasactionsByid: (id: string, account_id: string, user_id: string, user_role: userRole) => Promise<ITransactions | undefined>
    transferFunds: (service_account_id: string, destination_account_id: string, user_id: string, amount: number, user_role: userRole, pin: string) => Promise<ITransactions | undefined>
}