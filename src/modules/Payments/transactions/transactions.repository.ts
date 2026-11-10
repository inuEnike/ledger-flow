import type { Sql } from "postgres";
import type { ITransactionRepository, ITransactions } from "./transactions.types";
import { BAD_REQUEST_EXCEPTION, NOT_FOUND_EXCEPTION, UNAUTHORIZED_EXCEPTION, VALIDATION_EXCEPTION } from "../../../middleware/error.middleware";
import type { STATUS } from "../../Accounts/account/accounts.types";

export class TransactionRepository implements ITransactionRepository {
    private readonly sql: Sql
    constructor(sql: Sql) {
        this.sql = sql
    }
    getAllTransactions = async (): Promise<ITransactions | undefined> => {
        const [transactions] = await this.sql<ITransactions[]>`
            SELECT *
                FROM payments.transactions
        `
        return transactions
    };

    transferFunds = async (
        service_account_id: string,
        destination_account_id: string,
        user_id: string,
        amount: number,
        pin: string
    ): Promise<ITransactions | undefined> => {

        // 1. Basic validation
        if (service_account_id === destination_account_id) {
            throw new BAD_REQUEST_EXCEPTION(
                "Cannot transfer to the same account"
            );
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new BAD_REQUEST_EXCEPTION("Invalid transfer amount");
        }

        // 2. Begin database transaction
        const transaction = await this.sql.begin(async (sql) => {

            // 3. Lock both accounts in a consistent order
            const accounts = await sql`
            SELECT *
            FROM accounts.account
            WHERE id IN (
                ${service_account_id},
                ${destination_account_id}
            )
            AND deleted_at IS NULL
            ORDER BY id
            FOR UPDATE
        `;

            // 4. Identify sender and receiver
            const sender = accounts.find(
                account => account.id === service_account_id
            );
            const receiver = accounts.find(
                account => account.id === destination_account_id
            );

            if (!sender) {
                throw new NOT_FOUND_EXCEPTION("Sender account not found");
            }

            if (!receiver) {
                throw new NOT_FOUND_EXCEPTION("Recipient account not found");
            }
            if (sender.pin !== pin) {
                throw new VALIDATION_EXCEPTION("Incorrect Pin")
            }

            // 5. Verify sender ownership
            if (sender.user_id !== user_id) {
                throw new UNAUTHORIZED_EXCEPTION(
                    "You cannot initialize a transaction"
                );
            }

            // 6. Validate sender status
            if (sender.status !== "active") {
                throw new BAD_REQUEST_EXCEPTION(
                    "Your account cannot make a transaction"
                );
            }

            // 7. Validate recipient status
            if (receiver.status !== "active") {
                throw new BAD_REQUEST_EXCEPTION(
                    "Recipient account cannot receive transactions"
                );
            }

            // 8. Validate currency
            if (sender.currency !== receiver.currency) {
                throw new BAD_REQUEST_EXCEPTION(
                    "Account currencies do not match"
                );
            }

            // 9. Check sender balance
            if (Number(sender.balance) < amount) {
                throw new BAD_REQUEST_EXCEPTION(
                    "Insufficient account balance"
                );
            }

            // 10. Debit sender
            await sql`
            UPDATE accounts.account
            SET
                balance = balance - ${amount},
                updated_at = NOW()
            WHERE id = ${service_account_id}
        `;

            // 11. Credit recipient
            await sql`
            UPDATE accounts.account
            SET
                balance = balance + ${amount},
                updated_at = NOW()
            WHERE id = ${destination_account_id}
        `;

            // 12. Create transaction record
            const [transaction] = await sql<ITransactions[]>`
            INSERT INTO payments.transactions (
                reference,
                user_id,
                transaction_type,
                source_account_id,
                destination_account_id,
                amount,
                currency,
                status,
                description
            )
            VALUES (
                ${crypto.randomUUID()},
                ${user_id},
                'transfer',
                ${service_account_id},
                ${destination_account_id},
                ${amount},
                ${sender.currency},
                'successful',
                'Account transfer'
            )
            RETURNING *
        `;

            return transaction;
        });

        return transaction ?? undefined;
    };
    getTransactionById = async (id: string, user_id: string): Promise<ITransactions | undefined> => {
        const [query] = await this.sql<ITransactions[]>`
                SELECT *
                     FROM payments.transactions
                        WHERE id = ${id} 
                            AND
                                user_id = ${user_id}
            `
        return query
    }

    getTrasactionsByTnxReference = async (reference: string, user_id: string): Promise<ITransactions | undefined> => {
        const [query] = await this.sql<ITransactions[]>`
                SELECT *
                     FROM accounts.account
                        WHERE reference = ${reference} 
                                AND
                                user_id = ${user_id}
            `
        return query
    }
    getTransactionsByStatus = async (status: STATUS, userId: string, account_id: string, user_role: string): Promise<ITransactions[]> => {
        if (user_role === "admin") {
            const tnx = await this.sql<ITransactions[]>`
                SELECT * 
                    FROM payments.transactions
                        WHERE status=${status} 
                            AND (
                                source_account_id = ${account_id}
                                OR destination_account_id = ${account_id}
                            )
                        AND user_id = ${userId}
            `
            return tnx
        }
        const tnx = await this.sql<ITransactions[]>`
                SELECT * 
                    FROM payments.transactions
                        WHERE status=${status} 
                            AND user_id=${userId}
                    `
        return tnx
    }
}



// Phase 1 – Core retrieval
// 1. getAllTransactions
// 2. getTransactionById
// 3. getTransactionByReference
// 4. getTransactionsByUserId
// 5. getTransactionsByAccountId
// Phase 2 – Filtering
// 6. getTransactionsByStatus
// 7. getTransactionsByType
// 8. getTransactionsByDateRange

// Phase 3 – Transaction operations
// 9. createTransaction
// 10. updateTransactionStatus