/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`
        CREATE TABLE payments.transactions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            reference TEXT NOT NULL UNIQUE,

            user_id UUID NOT NULL REFERENCES auth.users(id),

            transaction_type TEXT NOT NULL
                CHECK (transaction_type IN ('transfer', 'deposit', 'withdrawal')),

            source_account_id UUID REFERENCES accounts.account(id),
            destination_account_id UUID REFERENCES accounts.account(id),

            amount NUMERIC(20,2) NOT NULL CHECK (amount > 0),
            currency VARCHAR(3) NOT NULL DEFAULT 'NGN',

            status TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'processing', 'successful', 'failed')),

            description TEXT,

            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS payments.transactions
    `)
};
