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
        CREATE TABLE IF NOT EXISTS accounts.account_details (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            account_id UUID NOT NULL 
                    REFERENCES accounts.account(id)
                    ON DELETE RESTRICT,
            account_tier_id UUID NOT NULL
                    UNIQUE REFERENCES accounts.account_tiers(id)
                    ON DELETE RESTRICT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )    
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS accounts.account_details
    `)
};
