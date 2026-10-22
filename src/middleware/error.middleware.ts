
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ENV } from "../util/dotenv.ts";

class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;

        Error.captureStackTrace?.(this, this.constructor);
    }
}

// Centralized error middleware
export const ErrorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            method: req.method,
            ...(ENV.NODE_ENV === "development" && {
                stack: err.stack,
            }),
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            method: req.method,
            ...(ENV.NODE_ENV === "development" && {
                stack: err.stack,
            }),
            errors: err.issues,
        });
    }

    console.error(err);

    return res.status(500).json({
        message: "Internal server error",
        method: req.method,
        ...(ENV.NODE_ENV === "development" && {
            stack: err instanceof Error ? err.stack : undefined,
        }),
    });
};

// Custom exceptions
export class NOT_FOUND_EXCEPTION extends AppError {
    constructor(message = "RESOURCE NOT FOUND") {
        super(message, 404);
    }
}

export class VALIDATION_EXCEPTION extends AppError {
    constructor(message = "VALIDATION FAILED, please check all the inputs") {
        super(message, 400);
    }
}

export class CONFLICT_EXCEPTION extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}

export class BAD_REQUEST_EXCEPTION extends AppError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

export class FORBIDDEN_EXCEPTION extends AppError {
    constructor(message = "You are not allowed here") {
        super(message, 403);
    }
}

export class UNAUTHORIZED_EXCEPTION extends AppError {
    constructor(message = "Invalid Credentials") {
        super(message, 401);
    }
}
