import type { Sql } from "postgres";
import { USER_STATUS, type IAuthRepository, type IUser, type PublicUser } from "./auth.types.ts";
import type { authSignupDTO } from "./auth.schema.ts";


export class AuthRepository implements IAuthRepository {
    private readonly sql: Sql
    constructor(sql: Sql) {
        this.sql = sql
    }

    findByEmail = async (email: string): Promise<Omit<IUser, "password_hash"> | null> => {
        try {
            const [user] = await this.sql<IUser[]>`
                SELECT *
                    FROM auth.users 
                        WHERE email=${email}
                            LIMIT 1
            `
            return user ?? null
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "An error occurred")
        }
    }

  createUser = async (data: authSignupDTO): Promise<IUser | null> => {

    try {
        const [user] = await this.sql<IUser[]>`
            INSERT INTO auth.users
                (email, password_hash, first_name, last_name)
            VALUES (
                ${data.email},
                ${data.password},
                ${data.first_name},
                ${data.last_name}
            )
            RETURNING id, email, first_name, last_name, status
        `;


        return user ?? null;
    } catch (error) {
        throw error;
    }
};
    updateUserStatusActive = async (email: string): Promise<IUser | null> => {
        const [user] = await this.sql<IUser[]>`
            UPDATE auth.users
                SET status = ${USER_STATUS.active}
                    WHERE email = ${email}
                        RETURNING *
        `
        return user ?? null
    }
    updateUserStatusSuspended = async (email: string): Promise<IUser | null> => {
        const [user] = await this.sql<IUser[]>`
            UPDATE auth.users
                SET status = ${USER_STATUS.suspended}
                    WHERE LOWER(email) = LOWER(${email})
                        RETURNING *
            `

        return user ?? null
    }
    getUserById = async (id: string): Promise<Omit<IUser, "password_hash"> | null> => {
        const [user] = await this.sql<PublicUser[]>`
            SELECT id, email, first_name, last_name, status
                FROM auth.users 
                    WHERE id=${id}
                        LIMIT 1
        `
        return user ?? null
    }
}
