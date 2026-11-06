import { NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION } from "../../../middleware/error.middleware";
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
}