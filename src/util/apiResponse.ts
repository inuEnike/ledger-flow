import type { Request, Response } from "express";

interface IApiResponse<T> {
    req?: Request,
    res: Response,
    status: number,
    message: string
    data?: T
}

export const ApiResponse = <T>({ req, res, status, message, data }: IApiResponse<T>) => {

    const response = res.status(status).json({
        req,
        success: true,
        status,
        message,
        data
    })
    return response
}