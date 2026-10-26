import type { Sql } from "postgres"
import type { IRefreshSession, ITokenRepository } from "./auth.types"

export class TokenRepository implements ITokenRepository {
    private readonly sql: Sql
    constructor(sql: Sql) {
        this.sql = sql
    }
    createRefreshSession = async (data: IRefreshSession): Promise<IRefreshSession | null> => {
        const [session] = await this.sql<IRefreshSession[]>`
            INSERT INTO auth.refresh_sessions 
                (
                    id,
                    user_id,
                    token_hash,
                    expires_at
                )
                VALUES 
                    (
                        ${data.id},
                        ${data.user_id},
                        ${data.token_hash},
                        ${data.expires_at}
                    )
            RETURNING *;
        `;
        return session ?? null
    }

    // Find a session by ID
    findSessionById = async (sessionId: string): Promise<IRefreshSession | null> => {
        const [session] = await this.sql<IRefreshSession[]>`
            SELECT * 
                FROM auth.refresh_sessions
                    WHERE id=${sessionId}
        `
        return session ?? null
    }
    // Update a session's token hash
    updateSessionTokenHash = async (
        sessionId: string,
        oldTokenHash: string,
        newTokenHash: string
    ): Promise<{ id: string } | null> => {
        const [session] = await this.sql <{ id: string }[]>`
            UPDATE auth.refresh_sessions
                SET token_hash = ${newTokenHash}
                    WHERE id = ${sessionId}
                        AND token_hash = ${oldTokenHash}
                            AND revoked_at IS NULL
                            AND expires_at > NOW()
            RETURNING id
  `

        return session ?? null
    }
    // Revoke a session
    revokeSession = async (sessionId: string): Promise<{ id: string } | null> => {
        const [session] = await this.sql<{ id: string }[]>`
            UPDATE auth.refresh_sessions
                SET revoked_at = NOW()
                    WHERE id = ${sessionId}
                        AND revoked_at IS NULL
            RETURNING id
        `

        return session ?? null
    }
}
