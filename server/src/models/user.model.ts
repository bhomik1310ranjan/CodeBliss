import { model, Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

import { InternalServerError } from "../utils/HttpError";

interface IUser {
    name: string;
    username: string;
    email: string;
    password: string;
}

interface IUserMethods {
    verifyPassword(password: string): Promise<boolean>;
    generateAccessToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        name: {
            type: String,
            required: [true, "Please provide your name."],
            minLength: [3, "Your name must be atleast 3 characters long."],
            maxLength: [32, "Your name cannot exceed 32 characters."],
            trim: true,
        },
        username: {
            type: String,
            lowercase: true,
            required: [true, "Please provide your username."],
            minLength: [3, "Username must be atleast 3 characters long."],
            maxLength: [32, "Username cannot exceed 32 characters."],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, "Please provide your email."],
            unique: true,
            trim: true,
            validate: [
                validator.isEmail,
                "Please provide a valid email address.",
            ],
        },
        password: {
            type: String,
            required: [true, "Please provide your password."],
            validate: [
                validator.isStrongPassword,
                "Password must be atleast 8 characters long. It must include at least one uppercase letter, one lowercase letter, one digit and one special character.",
            ],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        if (
            error instanceof Error ||
            (error && typeof error === "object" && "message" in error)
        ) {
            console.error(
                `Error occurred while hashing the password : ${error.message}`
            );
        } else {
            console.error(
                `Error occurred while hashing the password : Unknown error`
            );
        }
        next(
            new InternalServerError(
                `We have encountered an issue. Please try again soon.`
            )
        );
    }
});

userSchema.methods.verifyPassword = async function (
    password: string
): Promise<boolean> {
    try {
        const passwordMatch = await bcrypt.compare(password, this.password);
        return passwordMatch;
    } catch (error) {
        if (
            error instanceof Error ||
            (error && typeof error === "object" && "message" in error)
        ) {
            console.error(`Failed to compare passwords : ${error.message}`);
        } else {
            console.error(`Failed to compare passwords : Unknown error`);
        }
        throw new InternalServerError(
            `We have encountered an issue. Please try again soon.`
        );
    }
};

userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            username: this.username,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

export const User = model<IUser, UserModel>("User", userSchema);
