import { BAD_REQUEST_EXCEPTION, CONFLICT_EXCEPTION, NOT_FOUND_EXCEPTION } from "../../middleware/error.middleware";
import type { updateAccountDTO } from "./accounts.schema";
import type { CreateAccountData, IAccount, IAccountRepository, IAccountService } from "./accounts.types";

export class AccountService implements IAccountService {
    private readonly accountRepository: IAccountRepository

    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository
    }
    getAllAccounts = async (): Promise<IAccount[]> => {
        const accounts = await this.accountRepository.getAllAccounts()
        return accounts
    }

    createAnAccount = async (data: CreateAccountData): Promise<IAccount[]> => {
        if (!data.account_type || !data.currency) {
            throw new BAD_REQUEST_EXCEPTION("All fields are necessary")
        }

        if (data.account_number.length > 10 || data.account_number.length < 10) {
            throw new BAD_REQUEST_EXCEPTION("Account number cant be greater than 10")
        }

        const userAccounts = await this.accountRepository.getAccountDetailsByUserId(data.user_id)

        // map the users account and check if user has the account type already
        userAccounts.map((account) => {
            if (account.account_type === data.account_type) {
                throw new CONFLICT_EXCEPTION(`You already have a ${data.account_type} account `)
            }
        })

        return await this.accountRepository.createAnAccount(data)

    }

    getUserAccounts = async (userId: string): Promise<IAccount[]> => {
        if (!userId) {
            throw new BAD_REQUEST_EXCEPTION("User ID is required")
        }
        const accounts = await this.accountRepository.getUserAccounts(userId)
        return accounts
    }

    updateAccountByAccountId = async (data: updateAccountDTO, account_id: string, user_id: string): Promise<IAccount[]> => {


        const account = await this.accountRepository.updateAccountByAccountId(data, account_id, user_id)

        return account

    }
}