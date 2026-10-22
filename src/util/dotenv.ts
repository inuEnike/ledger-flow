
import { config } from "dotenv";

config();

interface IENV {
    PORT: string | undefined;
    DATABASE_URL: string | undefined;
    NODE_ENV:  string | undefined
}

const serializeENV = (key: string): string | undefined => {
    const value = process.env[key];

    if (!value) {
        console.error(`Environment variable ${key} is required.`);
        process.exitCode = 1;
    }

    return value;
};

export const ENV = {
    PORT: serializeENV("PORT"),
    DATABASE_URL: serializeENV("DATABASE_URL"),
    NODE_ENV: serializeENV("NODE_ENV")
} satisfies IENV;
