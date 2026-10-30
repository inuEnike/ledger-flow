import { BAD_REQUEST_EXCEPTION, CONFLICT_EXCEPTION, VALIDATION_EXCEPTION } from "../../../middleware/error.middleware";
import { createTierSchema, updateTierSchema, type createTierDTO, type updateTierDTO } from "./accountTier.schema";
import type { IAccountTier, IAccountTierRepository, IAccountTierService } from "./accountTier.types";

export class AccountTierService implements IAccountTierService {
    private readonly accountTierRepository: IAccountTierRepository

    constructor(accountTierRepository: IAccountTierRepository) {
        this.accountTierRepository = accountTierRepository
    }
    getAllTiers = async (): Promise<IAccountTier[]> => {
        const tiers = await this.accountTierRepository.getAllTiers()
        return tiers
    }
    getTierById = async (id: string): Promise<IAccountTier | undefined> => {
        const tier = await this.accountTierRepository.getTierById(id)
        return tier
    };

    createTier = async (data: createTierDTO): Promise<IAccountTier[]> => {
        const result = createTierSchema.safeParse(data)
        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");

            throw new BAD_REQUEST_EXCEPTION(message);

        }
        const findAccountTierByName = await this.accountTierRepository.getTierByName(result.data.name)

        if (
            findAccountTierByName &&
            result.data.name.toLowerCase() ===
            findAccountTierByName.name.toLowerCase()
        ) {
            throw new CONFLICT_EXCEPTION("Tier name already exists");
        }
        const account = await this.accountTierRepository.createTier(result.data)

        return account
    }
    updateTierById = async (data: updateTierDTO, id: string): Promise<IAccountTier | undefined> => {
        if (!id) {
            throw new VALIDATION_EXCEPTION()
        }
        const result = updateTierSchema.safeParse(data)

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");

            throw new BAD_REQUEST_EXCEPTION(message);

        }
        const findAccountTierByName = await this.accountTierRepository.getTierByName(result?.data?.name!)

        if (
            findAccountTierByName &&
            result.data.name!.toLowerCase() ===
            findAccountTierByName.name.toLowerCase()
        ) {
            throw new CONFLICT_EXCEPTION("Tier name already exists");
        }
        const tier = await this.accountTierRepository.updateTierById(result.data, id)
        return tier
    }
}