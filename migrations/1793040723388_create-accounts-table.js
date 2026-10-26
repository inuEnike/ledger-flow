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
        CREATE TABLE IF NOT EXISTS accounts.account(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            account_name TEXT NOT NULL,
            user_id UUID NOT NULL 
                REFERENCES auth.users(id) 
                ON DELETE RESTRICT,
            account_number VARCHAR(10) NOT NULL UNIQUE
                CHECK (account_number ~ '^[0-9]{10}$'),
            status TEXT NOT NULL DEFAULT 'active'
                CHECK ( status IN ('active', 'frozen', 'closed')),
            currency VARCHAR(3) NOT NULL DEFAULT 'NGN'
                CHECK (currency IN ('NGN', 'GHS', 'XOF', 'XAF')),
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
        DROP TABLE IF EXISTS accounts.account;
    `)
};
