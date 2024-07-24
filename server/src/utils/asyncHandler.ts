import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

type RequestHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        return Promise.resolve(requestHandler(req, res, next)).catch((err) =>
            next(err)
        );
    };
};

export { asyncHandler };
