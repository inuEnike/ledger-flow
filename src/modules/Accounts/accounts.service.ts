import type { IAccount, IAccountRepository, IAccountService } from "./accounts.types";

export class AccountService implements IAccountService {
    private readonly accountRepository: IAccountRepository

    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository
    }
    getAllAccounts = async (): Promise<IAccount[]> => {
        try {
            const accounts = await this.accountRepository.getAllAccounts()
            return accounts
        } catch (error) {
            throw new Error(error as string)
        }
    }
}