import { Types } from "mongoose";
import z from "zod";

const forkProjectSchema = z.object({
    projectId: z
        .string({
            required_error: "Please provide project ID.",
            invalid_type_error: "Project ID must be a string.",
        })
        .refine((id) => Types.ObjectId.isValid(id), {
            message: "Please provide valid project ID.",
        }),
});

export { forkProjectSchema };
