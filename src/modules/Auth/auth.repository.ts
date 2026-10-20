import type { Sql } from "postgres";
import { USER_STATUS, type IAuthRepository, type IUser, type PublicUser } from "./auth.types";
import type { authSignupDTO } from "./auth.schema";


export class AuthRepository implements IAuthRepository {
    private readonly sql: Sql
    constructor(sql: Sql) {
        this.sql = sql
    }

    findByEmail = async (email: string): Promise<Omit<IUser, "password_hash"> | null> => {
        const [user] = await this.sql<PublicUser[]>`
            SELECT id, email, first_name, last_name, status 
                FROM auth.users 
                    WHERE email=${email}
                        LIMIT 1
        `
        return user ?? null
    }

    createUser = async (data: authSignupDTO): Promise<IUser | null> => {
        const [user] = await this.sql<IUser[]>`
            INSERT INTO auth.users
                (email, password_hash, first_name, last_name)
                    VALUES
                        (
                            ${data.email},
                            ${data.password},
                            ${data.first_name},
                            ${data.last_name}
                        )
            RETURNING *
        `
        return user ?? null
    }
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
