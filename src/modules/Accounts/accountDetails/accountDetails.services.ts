import type { IAccountDetails, IAccountDetailsRepository, IAccountDetailsService } from "./accountDetails.types";

export class AccountDetailsService implements IAccountDetailsService {
    private readonly accountRepository: IAccountDetailsRepository
    constructor(accountRepository: IAccountDetailsRepository) {
        this.accountRepository = accountRepository
    }
    getAllAccountDetails = async (): Promise<IAccountDetails[]> => {
        const accountDetails = await this.accountRepository.getAllAccountDetails()
        return accountDetails
    }
}