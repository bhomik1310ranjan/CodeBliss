import { model, Schema, Types } from "mongoose";

import { BadRequestError } from "../utils/HttpError";

export interface IProject {
    name: string;
    code: {
        html?: string;
        css?: string;
        javascript?: string;
    };
    user: Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: [true, "Please provide project name."],
            minLength: [3, "Project name must be atleast 3 characters long."],
            maxLength: [32, "Project name cannot exceed 32 characters."],
            trim: true,
        },
        code: {
            html: {
                type: String,
            },
            css: {
                type: String,
            },
            javascript: {
                type: String,
            },
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "A project must belong to a user."],
        },
    },
    { timestamps: true }
);

projectSchema.pre("validate", function (next) {
    const code = this.code || {};
    if (
        (!code.html || code.html.trim() === "") &&
        (!code.css || code.css.trim() === "") &&
        (!code.javascript || code.javascript.trim() === "")
    ) {
        return next(
            new BadRequestError(
                `Please include code for either HTML, CSS or JavaScript in your project.`
            )
        );
    }
    next();
});

export const Project = model<IProject>("Project", projectSchema);
