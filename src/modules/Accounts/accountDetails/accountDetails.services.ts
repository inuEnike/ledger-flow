import { NOT_FOUND_EXCEPTION } from "../../../middleware/error.middleware";
import type { IAccountRepository } from "../account/accounts.types";
import type { IAccountDetails, IAccountDetailsRepository, IAccountDetailsService, userRole } from "./accountDetails.types";

export class AccountDetailsService implements IAccountDetailsService {
    private readonly accountDetailRepository: IAccountDetailsRepository
    private readonly accountRepository: IAccountRepository
    constructor(accountDetailRepository: IAccountDetailsRepository, accountRepository: IAccountRepository) {
        this.accountDetailRepository = accountDetailRepository
        this.accountRepository = accountRepository
    }
    getAllAccountDetails = async (): Promise<IAccountDetails[]> => {
        const accountDetails = await this.accountDetailRepository.getAllAccountDetails()
        return accountDetails
    }
    getSingleAccountDetailById = async (id: string, user_id: string, account_id: string, user_role: userRole
    ): Promise<IAccountDetails | undefined> => {
        const account = await this.accountRepository.getAccountByAccountId(account_id, user_id, user_role)
        if (!account || account.user_id !== user_id) {
            throw new NOT_FOUND_EXCEPTION("Account not found");
        }

        const accountDetail = await this.accountDetailRepository.getSingleAccountDetailById(id, user_id)
        if (!accountDetail) {
            throw new NOT_FOUND_EXCEPTION("Account not found");
        }

        return accountDetail
    }
}