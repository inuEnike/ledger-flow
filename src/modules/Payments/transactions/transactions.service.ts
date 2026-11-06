import { BAD_REQUEST_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from "../../../middleware/error.middleware";
import type { IAccountRepository } from "../../Accounts/account/accounts.types";
import type { userRole } from "../../Auth/auth.types";
import type { ITransactionRepository, ITransactions, ITransactionServices } from "./transactions.types";

export class TrasactionService implements ITransactionServices {
    private readonly transactionRepository: ITransactionRepository
    private readonly accountRepository: IAccountRepository

    constructor(transactionRepository: ITransactionRepository, accountRepository: IAccountRepository) {
        this.transactionRepository = transactionRepository
        this.accountRepository = accountRepository
    }
    getTrasactionsByid = async (id: string, account_id: string, user_id: string, user_role: userRole): Promise<ITransactions | undefined> => {
        const account = await this.accountRepository.getAccountByAccountId(account_id, user_id, user_role)
        if (!account) {
            throw new NOT_FOUND_EXCEPTION("Account not found");
        }
        const transaction = await this.transactionRepository.getTransactionById(id, user_id)
        if (!transaction) {
            throw new NOT_FOUND_EXCEPTION("Transaction not found");
        }

        if (transaction.source_account_id !== account.id &&
            transaction.destination_account_id !== account.id) {
            throw new UNAUTHORIZED_EXCEPTION("You are not allowed to access this transaction")
        }
        return transaction
    };

    transferFunds = async (service_account_id: string, destination_account_id: string, user_id: string, amount: number, user_role: userRole): Promise<ITransactions | undefined> => {
        if (!Number.isFinite(amount) || amount < 20.00) {
            throw new BAD_REQUEST_EXCEPTION("You can't transfer less than 20 naira")
        }
        const senderAccount = await this.accountRepository.getAccountByAccountId(service_account_id, user_id, user_role)
        if (senderAccount?.id !== service_account_id) {
            throw new UNAUTHORIZED_EXCEPTION("Unauthorized")
        }
        const tnx = await this.transactionRepository.transferFunds(service_account_id, destination_account_id, user_id, amount)
        if (!tnx) {
            throw new BAD_REQUEST_EXCEPTION("An error occured")
        }
        return tnx
    }
} 