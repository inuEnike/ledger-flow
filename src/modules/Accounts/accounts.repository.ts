import { PostgresError, type Sql } from "postgres";
import type { IAccount, IAccountRepository, pickedAccountDetails } from "./accounts.types";
import type { accountDTO } from "./accounts.schema";

export class AccountRepository implements IAccountRepository {
    private readonly sql: Sql
    constructor(sql: Sql) {
        this.sql = sql
    }
    getAllAccounts = async (): Promise<IAccount[]> => {
        try {
            const accounts = await this.sql<IAccount[]>`
            SELECT * 
                FROM accounts.account 
                    ORDER BY created_at ASC;
            `
            return accounts
        } catch (error) {
            if (error instanceof PostgresError) {
                throw new Error(error.message)
            }
            throw new Error
        }
    }

    getAccountDetailsByUserId = async (userId: string): Promise<IAccount[]> => {
        try {
            const account = await this.sql<IAccount[]>`
                SELECT a.* 
                    FROM 
                        accounts.account as a
                            INNER JOIN auth.users as u
                                ON 
                                    a.user_id = u.id

                    WHERE a.user_id=${userId} 
            `;
            return account
        } catch (error) {
            if (error instanceof PostgresError) {
                throw new Error(error.message)
            }
            throw Error
        }
    }

    createAnAccount = async (data: pickedAccountDetails): Promise<IAccount[]> => {
        try {
            const query = await this.sql<IAccount[]>`
            INSERT INTO 
                accounts.account
                    (account_type, user_id, account_number, currency)
                        VALUES
                            (
                                ${data.account_type!},
                                ${data.user_id!},
                                ${data.account_number!},
                                ${data.currency!},
                            )
            RETURNING *

        `

            return query
        } catch (error) {
            if (error instanceof PostgresError) {
                throw new Error(error.message)
            }
            throw Error
        }

    }
}