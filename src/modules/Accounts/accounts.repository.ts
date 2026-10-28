import { type Sql } from "postgres";
import type { CreateAccountData, IAccount, IAccountRepository } from "./accounts.types";


export class AccountRepository implements IAccountRepository {
    private readonly sql: Sql
    constructor(sql: Sql) {
        this.sql = sql
    }
    getAllAccounts = async (): Promise<IAccount[]> => {
        const accounts = await this.sql<IAccount[]>`
            SELECT a.id, a.user_id, a.account_number, a.status, a.currency, a.account_type, a.created_at, a.updated_at, u.email, u.id as user_id, u.first_name, u.last_name, u.status as user_status
                FROM 
                    accounts.account as a
                        INNER JOIN auth.users as u
                            ON a.user_id = u.id
            `
        return accounts

    }

    getAccountDetailsByUserId = async (userId: string): Promise<IAccount[]> => {

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
    }

    createAnAccount = async (data: CreateAccountData): Promise<IAccount[]> => {
        const query = await this.sql<IAccount[]>`
            INSERT INTO 
                accounts.account
                    (account_type, user_id, account_number, currency)
                        VALUES
                            (
                                ${data.account_type},
                                ${data.user_id},
                                ${data.account_number},
                                ${data.currency}
                            )
            RETURNING *
        `
        return query
    }
}