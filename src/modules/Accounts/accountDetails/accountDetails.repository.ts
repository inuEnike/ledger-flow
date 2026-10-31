import type { Sql } from "postgres";
import type { IAccountDetails, IAccountDetailsRepository, userRole } from "./accountDetails.types";

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
    getSingleAccountDetailById = async (id: string, account_id: string): Promise<IAccountDetails | undefined> => {

        const [query] = await this.sql<IAccountDetails[]>`
            SELECT * 
                FROM 
                    accounts.account_details
                        WHERE id=${id} 
                            AND account_id=${account_id}

        `
        return query
    }
    
}