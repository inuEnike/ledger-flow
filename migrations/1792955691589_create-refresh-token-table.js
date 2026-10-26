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
        CREATE TABLE IF NOT EXISTS auth.refresh_sessions (

            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            user_id UUID NOT NULL
                REFERENCES auth.users(id)
                ON DELETE CASCADE,
 
            token_hash TEXT NOT NULL UNIQUE,

            expires_at TIMESTAMPTZ NOT NULL,

            revoked_at TIMESTAMPTZ,

            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX refresh_sessions_user_id_idx
        ON auth.refresh_sessions(user_id);

    CREATE INDEX refresh_sessions_expires_at_idx
        ON auth.refresh_sessions(expires_at);
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS auth.refresh_sessions CASCADE    
    `)
};
