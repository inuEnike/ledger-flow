
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.sql(`
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE SCHEMA IF NOT EXISTS accounts;
    CREATE SCHEMA IF NOT EXISTS ledger;
    CREATE SCHEMA IF NOT EXISTS payments;
    CREATE SCHEMA IF NOT EXISTS audit;
  `);
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.sql(`
    DROP SCHEMA IF EXISTS audit;
    DROP SCHEMA IF EXISTS payments;
    DROP SCHEMA IF EXISTS ledger;
    DROP SCHEMA IF EXISTS accounts;
    DROP SCHEMA IF EXISTS auth;
  `);
};
