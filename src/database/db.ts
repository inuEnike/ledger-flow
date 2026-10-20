import postgres from "postgres";
import { ENV } from "../util/dotenv.ts";

if (!ENV.DATABASE_URL) {
    throw new Error("DATABASE URI is required");
}

export const sql = postgres(ENV.DATABASE_URL)
export const checkConnection = async () => {
    try {
        await sql`SELECT 1`;
        console.log("PostgreSQL connected successfully");
    } catch (error) {
        console.error("PostgreSQL connection failed:", error instanceof Error ? error.message : String("undefined"));
    }
} 