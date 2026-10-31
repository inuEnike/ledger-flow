import type { Sql } from "postgres";
import type { IAccountDetails, IAccountDetailsRepository, userRole } from "./accountDetails.types";
import type { CreateAccountDetailsDTO } from "./accountDetails.schema";

export class AccountDetailsRepository implements IAccountDetailsRepository {
    private readonly sql: Sql
    constructor(sql: Sql) {
        this.sql = sql
    }
    getAllAccountDetails = async (): Promise<IAccountDetails[]> => {
        const query = await this.sql<IAccountDetails[]>`
              SELECT
                d.id AS account_detail_id,
                d.account_id,
                d.account_tier_id,
                d.created_at AS details_created_at,
                d.updated_at AS details_updated_at,

                t.name AS tier_name,
                t.balance_limit,
                t.daily_transfer_limit,

                a.id AS account_id,
                a.user_id,
                a.account_number,
                a.status AS account_status,
                a.currency,
                a.account_type,
                a.deleted_at AS account_deleted_at

            FROM accounts.account_details AS d

            INNER JOIN accounts.account_tiers AS t
                ON t.id = d.account_tier_id

            INNER JOIN accounts.account AS a
                ON a.id = d.account_id

        `
        return query
    }
    getSingleAccountDetailById = async (id: string, account_id: string): Promise<IAccountDetails | undefined> => {

        const [query] = await this.sql<IAccountDetails[]>`
           SELECT
                d.id AS account_detail_id,
                d.account_id,
                d.account_tier_id,
                d.created_at AS details_created_at,
                d.updated_at AS details_updated_at,

                t.name AS tier_name,
                t.balance_limit,
                t.daily_transfer_limit,

                a.id AS account_id,
                a.user_id,
                a.account_number,
                a.status AS account_status,
                a.currency,
                a.account_type,
                a.deleted_at AS account_deleted_at

            FROM accounts.account_details AS d

            INNER JOIN accounts.account_tiers AS t
                ON t.id = d.account_tier_id

            INNER JOIN accounts.account AS a
                ON a.id = d.account_id

            WHERE d.id = ${id}
                AND d.account_id = ${account_id};
        `
        return query
    }
    createAccountDetail = async (data: CreateAccountDetailsDTO): Promise<IAccountDetails[]> => {
        const query = await this.sql<IAccountDetails[]>`
            INSERT 
                INTO accounts.account_details
                    (account_id, account_tier_id)
                        VALUES (
                            ${data.account_id},
                            ${data.account_tier_id}
                        )
            RETURNING *
        `
        return query
    }

}