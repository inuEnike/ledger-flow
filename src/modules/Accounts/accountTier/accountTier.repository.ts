import type { Sql } from "postgres";
import type { IAccountTier, IAccountTierRepository } from "./accountTier.types";
import type { createTierDTO, updateTierDTO } from "./accountTier.schema";

export class AccountTierRepository implements IAccountTierRepository {
    private readonly sql: Sql
    constructor(sql: Sql) {
        this.sql = sql
    }
    getAllTier = async (): Promise<IAccountTier[]> => {
        const tiers = await this.sql<IAccountTier[]>`
            SELECT * 
                FROM
                    accounts.account_tier
                    ORDER BY name ASC 
        `
        console.log(tiers);

        return tiers
    }

    getTierById = async (id: string): Promise<IAccountTier | undefined> => {
        const [tier] = await this.sql<IAccountTier[]>`
            SELECT * 
                FROM
                    accounts.account_tier
                        WHERE id=${id} 
        `
        return tier
    }
    createTier = async (data: createTierDTO): Promise<IAccountTier[]> => {
        const query = await this.sql<IAccountTier[]>`
            INSERT INTO
                accounts.account_tier
                    (name, balance_limit, daily_transfer_limit)
                        VALUES
                            (
                                ${data.name},
                                ${data.balance_limit},
                                ${data.daily_transfer_limit}
                            )
            RETURNING *
        `
        return query
    }
    updateTierById = async (data: updateTierDTO, id: string): Promise<IAccountTier | undefined> => {
        const [tier] = await this.sql<IAccountTier[]> `
            UPDATE 
                accounts.account_tier
                    SET
                        name = COALESCE(${data.name ?? null}, name)
                        balance_limit = COALESCE(${data.balance_limit ?? null}, name)
                        daily_transfet_limit = COALESCE(${data.daily_transfer_limit ?? null}, name)
                WHERE id=${id}
            RETURNING *
        `
        return tier
    }

    deleteTierById = async (id: string): Promise<IAccountTier | undefined> => {
        const [tier] = await this.sql<IAccountTier[]> `
                DELETE FROM
                    accounts.account_tier
                        WHERE id${id}
         `
        return tier
    }
}