import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Error as MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";

import HttpError from "../utils/HttpError";

const errorHandler = (
    error: HttpError | ZodError | MongoServerError | MongooseError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorResponse: {
        success: boolean;
        status: number;
        message: string;
        errors?: { field: string; error: string }[];
    } = {
        success: false,
        status: 500,
        message: `We have encountered an issue. Please try again soon.`,
    };

    if (error instanceof HttpError) {
        errorResponse.status = error.statusCode;
        errorResponse.message = error.message;
    } else if (error instanceof ZodError) {
        errorResponse.status = 400;
        errorResponse.message = `Please correct the highlighted fields and try again.`;
        errorResponse.errors = error.errors.map((err) => ({
            field: err.path[0] as string,
            error: err.message,
        }));
    } else if (error instanceof MongoServerError && error.code === 11000) {
        errorResponse.status = 400;
        const [field, value] = Object.entries(error.keyValue)[0];
        errorResponse.message = `The value ${value} for the field ${field} already exists.`;
    } else if (error instanceof MongooseError.ValidationError) {
        errorResponse.status = 400;
        errorResponse.message = `Please correct the highlighted fields and try again.`;
        errorResponse.errors = Object.keys(error.errors).map((key) => ({
            field: key,
            error: error.errors[key].message,
        }));
    }

    return res.status(errorResponse.status).json(errorResponse);
};

export { errorHandler };
