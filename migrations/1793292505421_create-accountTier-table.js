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
        CREATE TABLE IF NOT EXISTS accounts.account_tiers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(30) NOT NULL UNIQUE,
            balance_limit NUMERIC(20, 2) NOT NULL,
            daily_transfer_limit NUMERIC(20, 2) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            CHECK (balance_limit >= 0),
            CHECK (daily_transfer_limit >= 0)
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
        DROP TABLE IF EXISTS accounts.account_tiers;
    `)
};
