import { BAD_REQUEST_EXCEPTION, CONFLICT_EXCEPTION, NOT_FOUND_EXCEPTION, VALIDATION_EXCEPTION } from "../../../middleware/error.middleware";
import type { IAccountRepository } from "../account/accounts.types";
import { createAccountDetailsSchema, type CreateAccountDetailsDTO } from "./accountDetails.schema";
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

        if (user_role === "user" && account.status === "closed") {
            throw new NOT_FOUND_EXCEPTION("Account not found")
        }

        const accountDetail = await this.accountDetailRepository.getSingleAccountDetailById(id, account_id)
        if (!accountDetail) {
            throw new NOT_FOUND_EXCEPTION("Account not found");
        }

        return accountDetail
    }
    createAccountDetail = async (data: CreateAccountDetailsDTO, user_id: string, user_role: userRole): Promise<IAccountDetails[]> => {
        const result = createAccountDetailsSchema.safeParse(data)

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");

            throw new BAD_REQUEST_EXCEPTION(message);
        }
        const account = await this.accountRepository.getAccountByAccountId(data.account_id, user_id, user_role)
        if (account) {
            throw new CONFLICT_EXCEPTION("Account details already exists")
        }
        const detail = await this.accountDetailRepository.createAccountDetail(result.data)
        if (!detail) {
            throw new BAD_REQUEST_EXCEPTION("An error occurred while creating account detail")
        }
        return detail
    }
}