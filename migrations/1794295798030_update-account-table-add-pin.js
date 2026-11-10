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
       ALTER TABLE accounts.account
            ADD COLUMN pin VARCHAR(4) NOT NULL DEFAULT '0000'
                CHECK (pin ~ '^[0-9]{4}$');
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        ALTER TABLE accounts.account
            REMOVE COLUMN pin
    `)
};
