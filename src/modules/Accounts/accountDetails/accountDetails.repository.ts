import type { Sql } from "postgres";
import type { IAccountDetails, IAccountDetailsRepository } from "./accountDetails.types";

export class AccountDetailsRepository implements IAccountDetailsRepository {
    private readonly sql: Sql
    constructor(sql: Sql) {
        this.sql = sql
    }
    getAllAccountDetails = async (): Promise<IAccountDetails[]> => {
        const query = await this.sql<IAccountDetails[]>`
            SELECT * 
                FROM
                    accounts.account_details
        `
        return query
    }
}