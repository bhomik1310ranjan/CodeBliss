import { Request, Response, NextFunction } from "express";

import { AuthenticatedRequest } from "../middlewares/auth.middleware";

import { User } from "../models/user.model";

import { signupSchema } from "../schemas/user/signup.schema";
import { signinSchema } from "../schemas/user/signin.schema";

import { asyncHandler } from "../utils/asyncHandler";
import {
    ConflictError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from "../utils/HttpError";

const signup = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const body = await signupSchema.parseAsync(req.body);

        const { name, username, email, password } = body;

        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existedUser) {
            throw new ConflictError(
                `This username or email address is already in use. Please try a different one.`
            );
        }

        const user = await User.create({
            name,
            username,
            email,
            password,
        });

        return res.status(201).json({
            success: true,
            status: 201,
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
            message: `Welcome aboard, ${user.name}! Your account has been successfully created.`,
        });
    }
);

const signin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const body = await signinSchema.parseAsync(req.body);

        const { identifier, password } = body;

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }],
        });

        if (!user) {
            throw new NotFoundError(
                `We couldn't find an account with that username or email address.`
            );
        }

        const passwordVerified = await user.verifyPassword(password);

        if (!passwordVerified) {
            throw new UnauthorizedError(
                `There seems to be a problem with your login credentials. Please try again.`
            );
        }

        const accessToken = user.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                sameSite: "none",
                httpOnly: true,
                secure: true,
            })
            .json({
                success: true,
                status: 200,
                user: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                },
                message: `Login successful. Welcome back, ${user?.name}!`,
            });
    }
);

const signout = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        return res
            .status(200)
            .clearCookie("accessToken", {
                sameSite: "none",
                httpOnly: true,
                secure: true,
            })
            .json({
                success: true,
                status: 200,
                message: `See you later! You've been logged out successfully.`,
            });
    }
);

const fetchUserProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = await User.findById(req.userId);

        if (!user) {
            throw new InternalServerError(
                `We have encountered an issue. Please try again soon.`
            );
        }

        return res.status(200).json({
            success: true,
            status: 200,
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
            message: `Your profile details have been fetched successfully.`,
        });
    }
);

export { signup, signin, signout, fetchUserProfile };
