import { type Sql } from "postgres";
import type { CreateAccountData, IAccount, IAccountRepository, STATUS } from "./accounts.types";
import type { updateAccountDTO } from "./accounts.schema";


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

    getUserAccounts = async (userId: string, user_role: string): Promise<IAccount[]> => {
        if (user_role === "admin") {
            const accounts = await this.sql<IAccount[]>`
            SELECT a.id, a.user_id, a.account_number, a.status, a.currency, a.account_type, a.created_at, a.updated_at, u.email, u.id as user_id, u.first_name, u.last_name, u.status as user_status
                FROM 
                    accounts.account as a
                        INNER JOIN auth.users as u
                            ON a.user_id = u.id
                                WHERE u.id = ${userId}
        `
            return accounts
        } else {

            const accounts = await this.sql<IAccount[]>`
            SELECT a.id, a.user_id, a.account_number, a.status, a.currency, a.account_type, a.created_at, a.updated_at, u.email, u.id as user_id, u.first_name, u.last_name, u.status as user_status
                FROM 
                accounts.account as a
                    INNER JOIN auth.users as u
                        ON a.user_id = u.id
                            WHERE u.id = ${userId} 
                                AND a.deleted_at IS NULL
                                    AND a.status <> 'closed'
            `
            return accounts
        }
    };

    updateAccountByAccountId = async (data: updateAccountDTO, account_id: string, user_id: string): Promise<IAccount[]> => {
        const account = await this.sql<IAccount[]>`
            UPDATE accounts.account
                SET 
                    currency = COALESCE(${data.currency ?? null}, currency),
                    account_type = COALESCE(${data.account_type ?? null}, account_type),
                    updated_at = NOW()

            WHERE id = ${account_id} AND user_id=${user_id}
            RETURNING *
        `
        return account
    }

    getAccountByAccountId = async (accountId: string, userId: string, user_role: string): Promise<IAccount | undefined> => {
        if (user_role === "admin") {
            const [account] = await this.sql<IAccount[]>`
            SELECT a.id, a.user_id, a.account_number, a.status, a.currency, a.account_type, a.created_at, a.updated_at, u.email, u.id as user_id, u.first_name, u.last_name, u.status as user_status
                FROM 
                    accounts.account as a
                        INNER JOIN auth.users as u
                            ON a.user_id = u.id
                                WHERE u.id = ${userId} AND a.id = ${accountId} 
            `;
            return account
        } else {
            const [account] = await this.sql<IAccount[]>`
            SELECT a.id, a.user_id, a.account_number, a.status, a.currency, a.account_type, a.created_at, a.updated_at, u.email, u.id as user_id, u.first_name, u.last_name, u.status as user_status
                FROM 
                    accounts.account as a
                        INNER JOIN auth.users as u
                            ON a.user_id = u.id
                                WHERE u.id = ${userId} AND a.id = ${accountId} 
            `;
            return account
        }
    }

    updateAccountStatus = async (status: STATUS, account_id: string): Promise<IAccount | undefined> => {
        const [account] = await this.sql<IAccount[]>`
                UPDATE accounts.account
                    SET
                        status= COALESCE( ${status}, status)
                    WHERE
                        id=${account_id}
                RETURNING *
            `
        return account

    }

    deleteAccountById = async (accountId: string, userId: string): Promise<IAccount[]> => {
        const account = await this.sql<IAccount[]>`
            UPDATE accounts.account
                SET 
                    status='closed',
                    deleted_at = NOW()
                        WHERE id=${accountId} 
                            AND user_id=${userId}
                            AND deleted_at IS NULL
            RETURNING *
        `
        return account
    }
}