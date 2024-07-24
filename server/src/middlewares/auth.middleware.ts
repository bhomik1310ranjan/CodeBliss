import { Request, Response, NextFunction } from "express";
import jwt, {
    JsonWebTokenError,
    JwtPayload,
    Secret,
    TokenExpiredError,
} from "jsonwebtoken";
import { Types } from "mongoose";

import { User } from "../models/user.model";

import { InternalServerError, UnauthorizedError } from "../utils/HttpError";

interface AuthenticatedRequest extends Request {
    userId?: Types.ObjectId;
}

const isAuthenticated = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw new UnauthorizedError(
                `You need to be signed in to access this resource. Please sign in or sign up.`
            );
        }

        const decodedData = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as Secret
        ) as JwtPayload;

        const user = await User.findById(decodedData._id);

        if (!user) {
            throw new UnauthorizedError(
                `Your sign in session isn't valid. Please sign in again to continue.`
            );
        }

        req.userId = user._id;

        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return next(error);
        } else if (error instanceof TokenExpiredError) {
            return next(
                new UnauthorizedError(
                    `Your sign in session has expired. Please sign in again.`
                )
            );
        } else if (error instanceof JsonWebTokenError) {
            return next(
                new UnauthorizedError(
                    `Your sign in session isn't valid. Please sign in again to continue.`
                )
            );
        } else {
            if (
                error instanceof Error ||
                (error && typeof error === "object" && "message" in error)
            ) {
                console.error(
                    `Error during JWT verification : ${error.message}`
                );
            } else {
                console.error(
                    `Unexpected error during JWT verification : Unknown error`
                );
            }
            return next(
                new InternalServerError(
                    `We have encountered an issue. Please try again soon.`
                )
            );
        }
    }
};

export { AuthenticatedRequest, isAuthenticated };
