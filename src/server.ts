
import { app } from "./app.ts";
import { checkConnection, sql } from "./database/db.ts";
import { ENV } from "./util/dotenv.ts";

const startServer = () => {
    const PORT = ENV.PORT;

    const server = app.listen(PORT, async (error?: Error) => {
        if (error) {
            console.error("An error occurred while starting the server:", error);
            process.exitCode = 1;
            return;
        }
        await checkConnection()

        console.log(`Server connected on port ${PORT}`);
    });

    const gracefulShutdown = async (signal: string) => {
        console.log(`\n${signal} received. Shutting down gracefully...`);

        server.close((error) => {
            if (error) {
                console.error("Error closing server:", error);
                process.exitCode = 1;
                return;
            }

            console.log("Server closed successfully.");
            process.exit(0);
        });
        await sql.end()
        console.log("Sql closed successfully")
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

startServer();
